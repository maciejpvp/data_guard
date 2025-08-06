import { useMutation, useQueryClient } from "@tanstack/react-query";

import { VaultItemType } from "../../../../shared/types";

import { vaultApi } from "@/api/vault";
import { queryKeys } from "@/constants/queryKeys";

export const useAddItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newItem: Omit<VaultItemType, "id">) => {
      const response = await vaultApi.addItem(newItem);

      return response.data;
    },
    onSuccess: (newItem) => {
      queryClient.setQueryData(
        queryKeys.vault.itemList,
        (oldItems: VaultItemType[]) => {
          if (!oldItems) return [newItem];

          return [...oldItems, newItem];
        },
      );
    },
  });
};
