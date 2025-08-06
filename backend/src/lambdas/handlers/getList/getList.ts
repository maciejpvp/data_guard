import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from "aws-lambda";
import { sendResponse } from "../../../../utils/sendResponse";
import { getItemsByUserId } from "../../services/vaultService";
import { getCognitoUser } from "../../utils/cognitoUser";

const vaultDB = process.env.vaultDB!;

export const handler: Handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const { userId } = getCognitoUser(event);

  const list = await getItemsByUserId({
    userId,
    tableName: vaultDB,
  });

  return sendResponse(200, {
    message: "Successfully got items.",
    data: {
      list,
    },
  });
};
