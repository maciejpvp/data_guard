import { Handler } from "aws-lambda";
import { sendResponse } from "../../../../utils/sendResponse";
import { getItemsByUserId } from "../../services/vaultService";

const vaultDB = process.env.vaultDB!;

export const handler: Handler = async () => {
  const list = getItemsByUserId({
    userId: "123",
    tableName: vaultDB,
  });

  return sendResponse(200, {
    message: "Successfully got items.",
    data: {
      list,
    },
  });
};
