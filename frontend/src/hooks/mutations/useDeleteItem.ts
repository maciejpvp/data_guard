import { useMutation, useQueryClient } from "@tanstack/react-query";

import { VaultItemType } from "../../../../shared/types";

import { vaultApi } from "@/api/vault";
import { queryKeys } from "@/constants/queryKeys";

export const useDeleteItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await vaultApi.deleteItem(id);

      return response.data;
    },
    onSuccess: (_data, id) => {
      queryClient.setQueryData(
        queryKeys.vault.itemList,
        (oldItems: VaultItemType[]) => {
          return [...oldItems.filter((item) => item.id !== id)];
        },
      );
    },
  });
};
