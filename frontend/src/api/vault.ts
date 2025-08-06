import { VaultItemType } from "../../../shared/types";

import apiClient from "./client";

export const vaultApi = {
  getList: () => apiClient.get("/vault/getList"),
  addItem: (newItem: Omit<VaultItemType, "id" | "userId">) =>
    apiClient.post("/vault/addItem", {
      name: newItem.name,
      type: newItem.type,
      password: newItem.password,
      ...(newItem.url ? { url: newItem.url } : {}),
    }),
};
