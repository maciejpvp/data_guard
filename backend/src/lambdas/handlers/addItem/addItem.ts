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

  let id = uuidv4();

  if (secret.startsWith("#Vault-")) {
    id = "Vault";
  }
  const newItem: VaultItemType = {
    userId,
    id,
    secret,
  };

  try {
    await docClient.send(
      new PutCommand({
        TableName: vaultDB,
        Item: newItem,
        ConditionExpression: "attribute_not_exists(id)",
      }),
    );
  } catch (err: any) {
    if (err.name === "ConditionalCheckFailedException") {
      return sendResponse(400, "Item already exists");
    }
    return sendResponse(500, err);
  }

  const payload: WebSocketPayload = {
    type: "addItem",
    payload: newItem,
  };

  await wsSendMessage({
    userId,
    payload,
    tableName: connectionsDB,
  });

  return sendResponse(200, {
    message: "Successfully added item.",
    data: {
      newItem,
    },
  });
};
