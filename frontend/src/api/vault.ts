import apiClient from "./client";

export const vaultApi = {
  addItem: () => {
    apiClient.get("/vault");
  },
};
