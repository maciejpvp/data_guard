import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from "aws-lambda";
import { sendResponse } from "../../../../utils/sendResponse";
import { editItemById } from "../../services/vaultService";
import { getCognitoUser } from "../../utils/cognitoUser";
import Joi from "joi";
import { parseBody } from "@/utils/parseBody";
import { parsePathParams } from "@/utils/parsePathParams";

const vaultDB = process.env.vaultDB!;

type BodyType = {
  secret: string;
};

const bodySchema = Joi.object<BodyType>({
  secret: Joi.string().min(1).max(10000).required(),
});

type PathType = {
  id: string;
};

const idSchema = Joi.object<PathType>({
  id: Joi.string().guid({ version: "uuidv4" }).required(),
});

export const handler: Handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const { value: body, error: bodyError } = parseBody<BodyType>({
    event,
    schema: bodySchema,
  });

  if (bodyError || !body) {
    return sendResponse(400, {
      message: bodyError ?? "Something went wrong",
    });
  }

  const { value: pathParams, error: pathError } = parsePathParams<PathType>({
    event,
    schema: idSchema,
  });

  if (pathError || !pathParams) {
    return sendResponse(400, { message: pathError ?? "Something went wrong" });
  }

  const { userId } = getCognitoUser(event);
  const { id } = pathParams;
  const { secret } = body;

  try {
    const updated = await editItemById({
      userId,
      itemId: id,
      tableName: vaultDB,
      updates: {
        secret,
      },
    });
    return sendResponse(200, {
      message: "Item updated successfully.",
      data: {
        updatedItem: updated,
      },
    });
  } catch (err) {
    console.log(err);

    return sendResponse(500, {
      message: "Item failed to delete.",
    });
  }
};
