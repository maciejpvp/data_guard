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
import { VaultItemType } from "@/../shared/types";
import { getCognitoUser } from "../../utils/cognitoUser";
import { v4 as uuidv4 } from "uuid";

const vaultDB = process.env.vaultDB;

const dynamo = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(dynamo);

type BodyType = Omit<VaultItemType, "id" | "userId">;

const bodySchema = Joi.object<BodyType>({
  name: Joi.string().min(3).max(20).required(),
  url: Joi.string().uri().min(1).max(1000),
  type: Joi.string().valid("password", "creditcard", "token", "note"),
  password: Joi.string().min(1).max(1000).required(),
});

export const handler: Handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const { value: body, error } = parseBody<BodyType>({
    event,
    schema: bodySchema,
  });

  if (error || !body) {
    return sendResponse(400, {
      message: error,
    });
  }

  const { userId } = getCognitoUser(event);

  const newItem: VaultItemType = { ...body, userId, id: uuidv4() };

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

  return sendResponse(200, { body });
};
