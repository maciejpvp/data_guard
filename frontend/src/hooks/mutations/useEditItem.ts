import { useMutation, useQueryClient } from "@tanstack/react-query";

import { VaultItemType } from "../../../../shared/types";

import { vaultApi } from "@/api/vault";
import { queryKeys } from "@/constants/queryKeys";

export const useEditItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, secret }: { id: string; secret: string }) => {
      const response = await vaultApi.editItem(id, secret);

      return response.data;
    },
    onSuccess: (data) => {
      const updatedItem = data.data.updatedItem;
      const { id } = updatedItem;

      queryClient.setQueryData(
        queryKeys.vault.itemList,
        (oldItems: VaultItemType[]) => {
          const newItems = oldItems.map((item) => {
            return item.id === id ? updatedItem : item;
          });

          return newItems;
        },
      );
    },
  });
};
