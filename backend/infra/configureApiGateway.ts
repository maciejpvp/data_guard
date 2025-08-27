import * as cdk from "aws-cdk-lib";
import { Stack } from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { createLambdas } from "./createLambdas";
import { UserPool } from "aws-cdk-lib/aws-cognito";
import { ApiRoute, ApiRouteProps, RequestSchema } from "../constructs/ApiRoute";
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

  type Route =
    | {
        name: string;
        type: "GET" | "POST" | "DELETE" | "PUT" | "PATCH";
        route: string | string[];
        lambda: lambda.IFunction;
        secured: true;
        authorizer: apigateway.CognitoUserPoolsAuthorizer;
        requestSchema?: RequestSchema;
      }
    | {
        name: string;
        type: "GET" | "POST" | "DELETE" | "PUT" | "PATCH";
        route: string | string[];
        lambda: lambda.IFunction;
        secured?: false;
        authorizer?: never;
        requestSchema?: RequestSchema;
      };

  const routes: Route[] = [
    {
      name: `GetList`,
      type: "GET",
      route: "vault/getList",
      lambda: lambdas.getList.lambdaFunction,
      secured: true,
      authorizer,
    },
    {
      name: `AddItem`,
      type: "POST",
      route: "vault/addItem",
      lambda: lambdas.addItem.lambdaFunction,
      secured: true,
      authorizer,
      // requestSchema: addItemSchema,
    },
    {
      name: `DeleteItem`,
      type: "DELETE",
      route: "vault/deleteItem/{id}",
      lambda: lambdas.deleteItem.lambdaFunction,
      secured: true,
      authorizer,
    },
    {
      name: `DeleteVault`,
      type: "DELETE",
      route: "vault/delete-vault",
      lambda: lambdas.deleteVault.lambdaFunction,
      secured: true,
      authorizer,
    },
    {
      name: `DeleteAccount`,
      type: "DELETE",
      route: "vault/delete-account",
      lambda: lambdas.deleteAccount.lambdaFunction,
      secured: true,
      authorizer,
    },
    {
      name: `EditItem`,
      type: "PATCH",
      route: "vault/editItem/{id}",
      lambda: lambdas.editItem.lambdaFunction,
    },
  ];

  for (const r of routes) {
    const baseProps = {
      api,
      name: `${r.name}-${stage}`,
      route: r.route,
      lambda: r.lambda,
      type: r.type,
    };

    const props: ApiRouteProps = r.secured
      ? { ...baseProps, secured: true, authorizer: r.authorizer }
      : { ...baseProps, secured: false };

    new ApiRoute(stack, `${r.name}Route-${stage}`, props);
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
