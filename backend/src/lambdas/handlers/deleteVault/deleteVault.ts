import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from "aws-lambda";
import { sendResponse } from "../../../../utils/sendResponse";
import { deleteAllItemsByUserId } from "../../services/vaultService";
import { getCognitoUser } from "../../utils/cognitoUser";

const vaultDB = process.env.vaultDB!;

export const handler: Handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const { userId } = getCognitoUser(event);

  try {
    await deleteAllItemsByUserId({
      userId,
      tableName: vaultDB,
    });
  } catch (err) {
    console.log(err);

    return sendResponse(500, {
      message: "Failed to delete vault.",
    });
  }

  return sendResponse(200, {
    message: "Vault deleted successfully.",
  });
};
