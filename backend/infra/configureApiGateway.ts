import * as cdk from "aws-cdk-lib";
import { Stack } from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { createLambdas } from "./createLambdas";
import { UserPool } from "aws-cdk-lib/aws-cognito";
import { ApiRoute } from "../constructs/ApiRoute";

export const configureApiGateway = (
  stack: Stack,
  lambdas: ReturnType<typeof createLambdas>,
  userPool: UserPool,
) => {
  const api = new apigateway.RestApi(stack, "Api", {
    restApiName: `DataGuardAPI`,
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

  new ApiRoute(stack, "GetListRoute", {
    api,
    type: "GET",
    route: "get",
    lambda: lambdas.getList,
    name: "GetList",
    secured: true,
    authorizer,
  });

  new cdk.CfnOutput(stack, "ApiUrl", {
    value: api.url,
  });
};
