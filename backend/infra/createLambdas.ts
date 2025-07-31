import { Stack } from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as path from "path";

export const createLambdas = (stack: Stack) => {
  const lambdaConfig = {
    runtime: lambda.Runtime.NODEJS_20_X,
  };

  return {
    getList: new NodejsFunction(stack, "getList", {
      ...lambdaConfig,
      entry: path.join(__dirname, "../src/handlers/get.ts"),
      handler: "handler",
    }),
  };
};
