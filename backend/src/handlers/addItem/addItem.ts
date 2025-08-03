import {
  Handler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import { sendResponse } from "@/utils/sendResponse";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { parseBody } from "@/utils/parseBody";
import Joi from "joi";
import { BodyType } from "@/../shared/types";
import "joi-extract-type";

const dynamo = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(dynamo);

const bodySchema = Joi.object<BodyType>({
  name: Joi.string().min(3).max(20).required(),
  url: Joi.string().uri().max(50).required(),
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

  if (error) {
    return sendResponse(400, {
      message: error,
    });
  }

  return sendResponse(200, { body });
};
