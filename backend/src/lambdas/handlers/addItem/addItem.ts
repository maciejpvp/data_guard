import {
  Handler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import { sendResponse } from "@/utils/sendResponse";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { parseBody } from "@/utils/parseBody";
import Joi from "joi";
import { VaultItemType, WebSocketPayload } from "@/../shared/types";
import { getCognitoUser } from "../../utils/cognitoUser";
import { v4 as uuidv4 } from "uuid";
import { getConnectionIdsByUserId, wsSendMessage } from "../../utils/websocket";

const vaultDB = process.env.vaultDB;
const connectionsDB = process.env.connectionsDB!;

const wsEndpoint = process.env.WS_ENDPOINT;

const dynamo = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(dynamo);

type BodyType = {
  secret: string;
};

const bodySchema = Joi.object<BodyType>({
  secret: Joi.string().min(1).max(10000).required(),
});

export const handler: Handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  console.log(wsEndpoint);
  const { value: body, error } = parseBody<BodyType>({
    event,
    schema: bodySchema,
  });

  if (error || !body) {
    return sendResponse(400, {
      message: error,
    });
  }

  const { secret } = body;

  const { userId } = getCognitoUser(event);

  const newItem: VaultItemType = {
    userId,
    id: uuidv4(),
    secret,
  };

  try {
    await docClient.send(
      new PutCommand({
        TableName: vaultDB,
        Item: newItem,
      }),
    );
  } catch (err) {
    return sendResponse(500, err);
  }

  const connectionIds = await getConnectionIdsByUserId({
    userId,
    tableName: connectionsDB,
  });

  console.log(connectionIds);

  const payloadObject: WebSocketPayload = {
    type: "addItem",
    payload: newItem,
  };

  const wsPayload = JSON.stringify(payloadObject);

  await wsSendMessage(connectionIds, wsPayload);

  return sendResponse(200, {
    message: "Successfully added item.",
    data: {
      newItem,
    },
  });
};
