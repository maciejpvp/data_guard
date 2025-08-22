import { deleteAllItemsByUserId } from "../services/vaultService";
import {
  CognitoIdentityProviderClient,
  AdminDeleteUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const vaultDB = process.env.vaultDB!;
const userPoolId = process.env.COGNITO_USER_POOL_ID!;

const cognitoClient = new CognitoIdentityProviderClient({});

export async function deleteAccount(userId: string, username: string) {
  await deleteAllItemsByUserId({
    userId,
    tableName: vaultDB,
  });

  await cognitoClient.send(
    new AdminDeleteUserCommand({
      UserPoolId: userPoolId,
      Username: username,
    }),
  );
}
