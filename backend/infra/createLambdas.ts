import { aws_dynamodb, Stack } from "aws-cdk-lib";
import { CreateLambda } from "../constructs/CreateLambda";

type Props = {
  vaultDB: aws_dynamodb.Table;
  stage: string;
};

export const createLambdas = (stack: Stack, props: Props) => {
  const { vaultDB, stage } = props;

  const getList = new CreateLambda(stack, `GetListLambda-${stage}`, {
    name: "getList",
    stage,
    resources: [
      {
        grant: (fn) => vaultDB.grantReadData(fn),
        envName: "vaultDB",
        envValue: vaultDB.tableName,
      },
    ],
  });

  const addItem = new CreateLambda(stack, `AddItemLambda-${stage}`, {
    name: "addItem",
    stage,
    resources: [
      {
        grant: (fn) => vaultDB.grantWriteData(fn),
        envName: "vaultDB",
        envValue: vaultDB.tableName,
      },
    ],
  });

  const deleteItem = new CreateLambda(stack, `DeleteItemLambda-${stage}`, {
    name: "deleteItem",
    stage,
    resources: [
      {
        grant: (fn) => vaultDB.grantWriteData(fn),
        envName: "vaultDB",
        envValue: vaultDB.tableName,
      },
    ],
  });

  return {
    getList,
    addItem,
    deleteItem,
  };
};
