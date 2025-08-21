import { VaultItemType } from "../../../../shared/types";
import { docClient } from "../utils/dynamoClient";
import {
  DeleteCommand,
  QueryCommand,
  PutCommand,
  UpdateCommand,
  BatchWriteCommand,
} from "@aws-sdk/lib-dynamodb";

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

type InsertItemProps = {
  item: VaultItemType;
  tableName: string;
};

export const insertItem = async ({
  item,
  tableName,
}: InsertItemProps): Promise<void> => {
  const command = new PutCommand({
    TableName: tableName,
    Item: item,
  });

  await docClient.send(command);
};

type EditItemByIdProps = {
  userId: string;
  itemId: string;
  updates: Partial<VaultItemType>;
  tableName: string;
};

export const editItemById = async ({
  userId,
  itemId,
  updates,
  tableName,
}: EditItemByIdProps): Promise<VaultItemType | null> => {
  const updateExpressions: string[] = [];
  const expressionAttributeValues: Record<string, any> = {};

  for (const [key, value] of Object.entries(updates)) {
    updateExpressions.push(`${key} = :${key}`);
    expressionAttributeValues[`:${key}`] = value;
  }

  const command = new UpdateCommand({
    TableName: tableName,
    Key: {
      userId,
      id: itemId,
    },
    UpdateExpression: `SET ${updateExpressions.join(", ")}`,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: "ALL_NEW",
  });

  const result = await docClient.send(command);

  return (result.Attributes as VaultItemType) ?? null;
};

export const deleteAllItemsByUserId = async ({
  userId,
  tableName,
}: {
  userId: string;
  tableName: string;
}): Promise<void> => {
  // Step 1: Query all items for that userId
  const queryResponse = await docClient.send(
    new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: "userId = :u",
      ExpressionAttributeValues: {
        ":u": userId,
      },
    }),
  );

  if (!queryResponse.Items || queryResponse.Items.length === 0) return;

  // Step 2: Batch delete (25 items max per request)
  const chunks = [];
  for (let i = 0; i < queryResponse.Items.length; i += 25) {
    chunks.push(queryResponse.Items.slice(i, i + 25));
  }

  for (const chunk of chunks) {
    await docClient.send(
      new BatchWriteCommand({
        RequestItems: {
          [tableName]: chunk.map((item) => ({
            DeleteRequest: {
              Key: {
                userId: item.userId,
                id: item.id, // must include the sort key!
              },
            },
          })),
        },
      }),
    );
  }
};
