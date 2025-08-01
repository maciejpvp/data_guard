import { Stack, RemovalPolicy } from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

export const createVaultDB = (stack: Stack) => {
  const table = new dynamodb.Table(stack, "ValutDB", {
    tableName: "ValutDB",
    partitionKey: { name: "userId", type: dynamodb.AttributeType.STRING },
    sortKey: { name: "uuid", type: dynamodb.AttributeType.STRING },
    billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    removalPolicy: RemovalPolicy.DESTROY,
  });

  return table;
};
