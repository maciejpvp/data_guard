import apiClient from "./client";

export const vaultApi = {
  getList: () => apiClient.get("/vault/getList"),
  addItem: (secret: string) =>
    apiClient.post("/vault/addItem", {
      secret,
    }),
  deleteItem: (id: string) => apiClient.delete(`/vault/deleteItem/${id}`),
};
