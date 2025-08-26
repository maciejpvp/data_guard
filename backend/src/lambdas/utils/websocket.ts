import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "./dynamoClient";

const apiGwClient = new ApiGatewayManagementApiClient({
  endpoint: process.env.WS_ENDPOINT,
});

export const getConnectionIdsByUserId = async ({
  userId,
  tableName,
}: {
  userId: string;
  tableName: string;
}) => {
  const command = new QueryCommand({
    TableName: tableName,
    KeyConditionExpression: "userId = :uid",
    ExpressionAttributeValues: {
      ":uid": userId,
    },
  });

  const response = await docClient.send(command);

  const items = response.Items ?? [];

  const connectionIds = items.map((item) => {
    return item.connectionId;
  });

  return connectionIds;
};

type wsSendMessageProps = {
  userId: string;
  payload: object | string;
  tableName: string;
};

export const wsSendMessage = async ({
  userId,
  payload,
  tableName,
}: wsSendMessageProps) => {
  const data = typeof payload === "string" ? payload : JSON.stringify(payload);

  const connectionIds = await getConnectionIdsByUserId({ userId, tableName });

  await Promise.all(
    connectionIds.map(async (connectionId) => {
      try {
        await apiGwClient.send(
          new PostToConnectionCommand({
            ConnectionId: connectionId,
            Data: Buffer.from(data),
          }),
        );
        console.log(`✅ Sent message to ${connectionId}`);
      } catch (err: any) {
        if (err.statusCode === 410) {
          console.log(`⚠️ Connection ${connectionId} is gone (stale).`);
          // Tutaj możesz usunąć connectionId z DynamoDB
        } else {
          console.error(`❌ Failed to send message to ${connectionId}:`, err);
        }
      }
    }),
  );
};
