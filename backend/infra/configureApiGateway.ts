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
    restApiName: `DataGuardAPI-${stage}`,

    defaultCorsPreflightOptions: {
      allowOrigins: apigateway.Cors.ALL_ORIGINS,
      allowMethods: apigateway.Cors.ALL_METHODS,
      allowHeaders: ["Content-Type", "Authorization"],
    },
  });

  const authorizer = new apigateway.CognitoUserPoolsAuthorizer(
    stack,
    "MyAuthorizer",
    {
      cognitoUserPools: [userPool],
    },
  );

  new ApiRoute(stack, `GetListRoute-${stage}`, {
    api,
    type: "GET",
    route: "vault/getList",
    lambda: lambdas.getList.lambdaFunction,
    name: `GetList-${stage}`,
    secured: true,
    authorizer,
  });

  new ApiRoute(stack, `AddItemRoute-${stage}`, {
    api,
    type: "POST",
    route: "vault/addItem",
    lambda: lambdas.addItem.lambdaFunction,
    name: `AddItem-${stage}`,
    secured: true,
    authorizer,
    // requestSchema: addItemSchema,
  });

  new ApiRoute(stack, `DeleteItemRoute-${stage}`, {
    api,
    type: "DELETE",
    route: "vault/deleteItem/{id}",
    lambda: lambdas.deleteItem.lambdaFunction,
    name: `DeleteItem-${stage}`,
    secured: true,
    authorizer,
  });

  new ApiRoute(stack, `EditItemRoute-${stage}`, {
    api,
    type: "PATCH",
    route: "vault/editItem/{id}",
    lambda: lambdas.editItem.lambdaFunction,
    name: `EditItem-${stage}`,
    secured: true,
    authorizer,
  });

  new cdk.CfnOutput(stack, "ApiUrl", {
    value: api.url,
  });
};
