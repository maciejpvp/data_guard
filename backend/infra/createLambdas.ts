import { aws_dynamodb, Stack } from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as path from "path";

type Props = {
  valutDB: aws_dynamodb.Table;
  stage: string;
};

export const createLambdas = (stack: Stack, props: Props) => {
  const { valutDB, stage } = props;

  const lambdaConfig = {
    runtime: lambda.Runtime.NODEJS_20_X,
  };

  const getList = new NodejsFunction(stack, `getList-${stage}`, {
    ...lambdaConfig,
    entry: path.join(__dirname, "../src/handlers/getList.ts"),
    handler: "handler",
  });

  valutDB.grantReadData(getList);

  return {
    getList,
  };
};
