import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as path from "path";

export class LambdasStack extends cdk.Stack {
  public readonly getHandler: lambda.Function;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambdaConfig = {
      runtime: lambda.Runtime.NODEJS_20_X,
      environment: {
        NODE_ENV: "production",
      },
    };

    this.getHandler = new NodejsFunction(this, "GetHandler", {
      ...lambdaConfig,
      entry: path.join(__dirname, "../src/handlers/get.ts"),
      handler: "handler",
    });
  }
}
