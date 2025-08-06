import { VaultItemType } from "../../../../shared/types";
import { docClient } from "../utils/dynamoClient";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

type GetItemsByUserIdProps = {
  userId: string;
  tableName: string;
};

export const getItemsByUserId = async ({
  userId,
  tableName,
}: GetItemsByUserIdProps): Promise<VaultItemType[]> => {
  const command = new QueryCommand({
    TableName: tableName,
    KeyConditionExpression: "userId = :uid",
    ExpressionAttributeValues: {
      ":uid": userId,
    },
  });

  const result = await docClient.send(command);

  return (result.Items as VaultItemType[]) || [];
};

export const insertItem = async () => {};
