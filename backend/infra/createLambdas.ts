import { aws_dynamodb, Stack } from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import * as cognito from "aws-cdk-lib/aws-cognito";
import { CreateLambda } from "../constructs/CreateLambda";

type Props = {
  vaultDB: aws_dynamodb.Table;
  userPool: cognito.UserPool;
  stage: string;
};

export const createLambdas = (stack: Stack, props: Props) => {
  const { vaultDB, stage, userPool } = props;

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

  const deleteVault = new CreateLambda(stack, `DeleteVaultLambda-${stage}`, {
    name: "deleteVault",
    stage,
    resources: [
      {
        grant: (fn) => vaultDB.grantReadWriteData(fn),
        envName: "vaultDB",
        envValue: vaultDB.tableName,
      },
    ],
  });

  const deleteAccount = new CreateLambda(
    stack,
    `DeleteAccountLambda-${stage}`,
    {
      name: "deleteAccount",
      stage,
      resources: [
        {
          grant: (fn) => vaultDB.grantReadWriteData(fn),
          envName: "vaultDB",
          envValue: vaultDB.tableName,
        },
        {
          grant: (fn) =>
            fn.addToRolePolicy(
              new iam.PolicyStatement({
                actions: ["cognito-idp:AdminDeleteUser"],
                resources: [userPool.userPoolArn],
              }),
            ),
          envName: "COGNITO_USER_POOL_ID",
          envValue: userPool.userPoolId,
        },
      ],
    },
  );

  const editItem = new CreateLambda(stack, `EditItemLambda-${stage}`, {
    name: "editItem",
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
    deleteVault,
    deleteAccount,
    editItem,
  };
};
