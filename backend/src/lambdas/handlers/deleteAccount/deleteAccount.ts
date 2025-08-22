import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from "aws-lambda";
import { sendResponse } from "../../../../utils/sendResponse";
import { getCognitoUser } from "../../utils/cognitoUser";
import { deleteAccount } from "../../utils/deleteAccount";

export const handler: Handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const { userId, username } = getCognitoUser(event);

  if (!username) throw new Error("Cognito Username is missing");

  try {
    await deleteAccount(userId, username);
  } catch (err) {
    console.error(err);
    return sendResponse(500, { message: "Failed to delete user account." });
  }

  return sendResponse(200, { message: "User account deleted successfully." });
};
