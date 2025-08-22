import apiClient from "./client";

export const vaultApi = {
  getList: () => apiClient.get("/vault/getList"),
  addItem: (secret: string) =>
    apiClient.post("/vault/addItem", {
      secret,
    }),
  deleteItem: (id: string) => apiClient.delete(`/vault/deleteItem/${id}`),
  editItem: (id: string, secret: string) =>
    apiClient.patch(`/vault/editItem/${id}`, {
      secret,
    }),
  deleteVault: () => apiClient.delete("/vault/delete-vault"),
  deleteAccount: () => apiClient.delete("/vault/delete-account"),
};
