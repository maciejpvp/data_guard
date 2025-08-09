import apiClient from "./client";

export const vaultApi = {
  getList: () => apiClient.get("/vault/getList"),
  addItem: (secret: string) =>
    apiClient.post("/vault/addItem", {
      secret,
    }),
};
