import { Stack, RemovalPolicy } from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

type Props = {
  stage: string;
};

export const createVaultDB = (stack: Stack, props: Props) => {
  const { stage } = props;

  const table = new dynamodb.Table(stack, `ValutDB-${stage}`, {
    tableName: `ValutDB-${stage}-2`,
    partitionKey: { name: "userId", type: dynamodb.AttributeType.STRING },
    sortKey: { name: "id", type: dynamodb.AttributeType.STRING },
    billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    removalPolicy: RemovalPolicy.DESTROY,
  });

  return table;
};
