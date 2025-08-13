import { VaultItemType } from "../../../../shared/types";
import { docClient } from "../utils/dynamoClient";
import { DeleteCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

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

type DeleteItemProps = {
  userId: string;
  itemId: string;
  tableName: string;
};

export const deleteItemById = async ({
  userId,
  itemId,
  tableName,
}: DeleteItemProps): Promise<void> => {
  const command = new DeleteCommand({
    TableName: tableName,
    Key: {
      userId,
      id: itemId,
    },
  });

  await docClient.send(command);
};

export const insertItem = async () => {};
