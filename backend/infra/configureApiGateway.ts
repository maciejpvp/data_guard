import * as cdk from "aws-cdk-lib";
import { Stack } from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { createLambdas } from "./createLambdas";

export const configureApiGateway = (
  stack: Stack,
  lambdas: ReturnType<typeof createLambdas>,
) => {
  const api = new apigateway.RestApi(stack, "Api", {
    restApiName: `DataGuardAPI`,
    defaultCorsPreflightOptions: {
      allowOrigins: apigateway.Cors.ALL_ORIGINS,
      allowMethods: apigateway.Cors.ALL_METHODS,
      allowHeaders: ["Content-Type", "Authorization"],
    },
  });

  const getResource = api.root.addResource("get");
  getResource.addMethod(
    "GET",
    new apigateway.LambdaIntegration(lambdas.getList),
  );

  new cdk.CfnOutput(stack, "ApiUrl", {
    value: api.url,
  });
};
