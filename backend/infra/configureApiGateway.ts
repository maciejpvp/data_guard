import * as cdk from "aws-cdk-lib";
import { Stack } from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { createLambdas } from "./createLambdas";
import { UserPool } from "aws-cdk-lib/aws-cognito";
import { ApiRoute } from "../constructs/ApiRoute";
import { addItemSchema } from "../schemas/addItem.schema";

export const configureApiGateway = (
  stack: Stack,
  lambdas: ReturnType<typeof createLambdas>,
  userPool: UserPool,
  stage: string,
) => {
  const api = new apigateway.RestApi(stack, `Api-${stage}`, {
    restApiName: `DataGuardAPI-${stage}-${stack.stackName}`,
    deploy: false,
    defaultCorsPreflightOptions: {
      allowOrigins: apigateway.Cors.ALL_ORIGINS,
      allowMethods: apigateway.Cors.ALL_METHODS,
      allowHeaders: ["Content-Type", "Authorization"],
    },
  });

  const authorizer = new apigateway.CognitoUserPoolsAuthorizer(
    stack,
    `Authorizer-${stage}`,
    {
      cognitoUserPools: [userPool],
    },
  );

  const routes = [
    {
      type: "GET",
      route: "vault/getList",
      lambda: lambdas.getList.lambdaFunction,
      name: "GetList",
    },
    {
      type: "POST",
      route: "vault/addItem",
      lambda: lambdas.addItem.lambdaFunction,
      name: "AddItem",
    },
    {
      type: "DELETE",
      route: "vault/deleteItem/{id}",
      lambda: lambdas.deleteItem.lambdaFunction,
      name: "DeleteItem",
    },
    {
      type: "DELETE",
      route: "vault/delete-vault",
      lambda: lambdas.deleteVault.lambdaFunction,
      name: "DeleteVault",
    },
    {
      type: "DELETE",
      route: "vault/delete-account",
      lambda: lambdas.deleteAccount.lambdaFunction,
      name: "DeleteAccount",
    },
    {
      type: "PATCH",
      route: "vault/editItem/{id}",
      lambda: lambdas.editItem.lambdaFunction,
      name: "EditItem",
    },
  ];

  for (const r of routes) {
    new ApiRoute(stack, `${r.name}-${stage}`, {
      api,
      type: r.type,
      route: r.route,
      lambda: r.lambda,
      name: `${r.name}-${stage}`,
      secured: true,
      authorizer,
      // requestSchema: r.name === "AddItem" ? addItemSchema : undefined,
    });
  }

  const deployment = new apigateway.Deployment(
    stack,
    `ApiDeployment-${stage}`,
    { api },
  );

  const stageObject = new apigateway.Stage(stack, `ApiStage-${stage}`, {
    deployment,
    stageName: stage,
  });

  api.deploymentStage = stageObject;

  new cdk.CfnOutput(stack, `ApiUrl-${stage}`, {
    value: `${api.url}${stage}/`,
  });
};
