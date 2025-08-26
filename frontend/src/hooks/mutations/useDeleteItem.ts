import { useMutation, useQueryClient } from "@tanstack/react-query";

import { VaultItemType } from "../../../../shared/types";

import { vaultApi } from "@/api/vault";
import { queryKeys } from "@/constants/queryKeys";

export const useDeleteItem = () => {
  const queryClient = useQueryClient();

  const handleSuccess = (id: string) => {
    queryClient.setQueryData(
      queryKeys.vault.itemList,
      (oldItems: VaultItemType[]) => {
        return [...oldItems.filter((item) => item.id !== id)];
      },
    );
  };

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await vaultApi.deleteItem(id);

      return response.data;
    },
    onSuccess: (_data, id) => handleSuccess(id),
  });

  return { ...mutation, triggerSuccess: handleSuccess };
};
