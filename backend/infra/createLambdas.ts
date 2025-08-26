import { aws_dynamodb, Stack } from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import * as cognito from "aws-cdk-lib/aws-cognito";
import { CreateLambda } from "../constructs/CreateLambda";

type Props = {
  vaultDB: aws_dynamodb.Table;
  connectionsDB: aws_dynamodb.Table;
  userPool: cognito.UserPool;
  userPoolClient: cognito.UserPoolClient;
  stage: string;
};

export const createLambdas = (stack: Stack, props: Props) => {
  const { vaultDB, stage, userPool, userPoolClient, connectionsDB } = props;

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
    grantWsAccess: true,
    resources: [
      {
        grant: (fn) => vaultDB.grantWriteData(fn),
        envName: "vaultDB",
        envValue: vaultDB.tableName,
      },
      {
        grant: (fn) => connectionsDB.grantReadData(fn),
        envName: "connectionsDB",
        envValue: connectionsDB.tableName,
      },
    ],
  });

  const deleteItem = new CreateLambda(stack, `DeleteItemLambda-${stage}`, {
    name: "deleteItem",
    stage,
    grantWsAccess: true,
    resources: [
      {
        grant: (fn) => vaultDB.grantWriteData(fn),
        envName: "vaultDB",
        envValue: vaultDB.tableName,
      },
      {
        grant: (fn) => connectionsDB.grantReadData(fn),
        envName: "connectionsDB",
        envValue: connectionsDB.tableName,
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
    grantWsAccess: true,

    resources: [
      {
        grant: (fn) => vaultDB.grantWriteData(fn),
        envName: "vaultDB",
        envValue: vaultDB.tableName,
      },
      {
        grant: (fn) => connectionsDB.grantReadData(fn),
        envName: "connectionsDB",
        envValue: connectionsDB.tableName,
      },
    ],
  });

  const connectWS = new CreateLambda(stack, `ConnectWSLambda-${stage}`, {
    name: "connectWS",
    stage,
    resources: [
      {
        grant: (fn) => connectionsDB.grantWriteData(fn),
        envName: "connectionsDB",
        envValue: connectionsDB.tableName,
      },
    ],
  });

  const disconnectWS = new CreateLambda(stack, `DisconnectWSLambda-${stage}`, {
    name: "disconnectWS",
    stage,
    resources: [
      {
        grant: (fn) => connectionsDB.grantWriteData(fn),
        envName: "connectionsDB",
        envValue: connectionsDB.tableName,
      },
    ],
  });

  const authorizer = new CreateLambda(stack, `WsAuthLambda-${stage}`, {
    name: "authorizer",
    stage,
    env: {
      USER_POOL_ID: userPool.userPoolId,
      CLIENT_ID: userPoolClient.userPoolClientId,
    },
  });

  //   const authorizerFn = new lambda.Function(stack, `WsAuthLambda-${stage}`, {
  //   runtime: lambda.Runtime.NODEJS_20_X,
  //   handler: "authorizer.handler",
  //   code: lambda.Code.fromAsset(
  //     "src/lambdas/handlers/authorizer/authorizer.ts",
  //   ),
  //   environment: {
  //     USER_POOL_ID: userPool.userPoolId,
  //     CLIENT_ID: userPoolClient.userPoolClientId,
  //   },
  // });

  return {
    getList,
    addItem,
    deleteItem,
    deleteVault,
    deleteAccount,
    editItem,
    connectWS,
    disconnectWS,
    authorizer,
  };
};
