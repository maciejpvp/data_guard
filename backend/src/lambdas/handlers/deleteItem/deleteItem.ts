import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from "aws-lambda";
import { sendResponse } from "../../../../utils/sendResponse";
import { deleteItemById } from "../../services/vaultService";
import { getCognitoUser } from "../../utils/cognitoUser";
import { WebSocketPayload } from "../../../../../shared/types";
import { getConnectionIdsByUserId, wsSendMessage } from "../../utils/websocket";

const vaultDB = process.env.vaultDB!;
const connectionsDB = process.env.connectionsDB!;

export const handler: Handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const { userId } = getCognitoUser(event);
  const id = event.pathParameters?.id;

  console.log(id);

  if (!id) {
    return sendResponse(400, {
      message: "Missing id in path.",
    });
  }

  try {
    await deleteItemById({
      userId,
      itemId: id,
      tableName: vaultDB,
    });
  } catch (err) {
    console.log(err);

    return sendResponse(500, {
      message: "Item failed to delete.",
    });
  }

  const payloadObject: WebSocketPayload = {
    type: "deleteItem",
    payload: id,
  };

  const wsPayload = JSON.stringify(payloadObject);

  const connectionIds = await getConnectionIdsByUserId({
    userId,
    tableName: connectionsDB,
  });

  await wsSendMessage(connectionIds, wsPayload);

  return sendResponse(200, {
    message: "Successfully got items.",
  });
};
