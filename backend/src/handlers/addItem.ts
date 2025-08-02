import {
  Handler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import { sendResponse } from "../../utils/sendResponse";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import Joi from "joi";

const dynamo = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(dynamo);

const bodySchema = Joi.object({
  name: Joi.string().min(3).max(22).required(),
  url: Joi.string().uri().optional(),
  password: Joi.string().max(500).required(),
  type: Joi.string()
    .valid("password", "creditcard", "token", "note")
    .required(),
});

export const handler: Handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const userId = event.requestContext.authorizer?.claims.sub;

  return sendResponse(200, { message: "Test" });
};
