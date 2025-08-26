import { useMutation, useQueryClient } from "@tanstack/react-query";

import { VaultItemType } from "../../../../shared/types";

import { vaultApi } from "@/api/vault";
import { queryKeys } from "@/constants/queryKeys";

export const useAddItem = () => {
  const queryClient = useQueryClient();

  const handleSuccess = (newItem: VaultItemType) => {
    queryClient.setQueryData(
      queryKeys.vault.itemList,
      (oldItems: VaultItemType[]) => {
        if (!oldItems) return [newItem];

        const exist = oldItems.some((item) => item.id === newItem.id);

        if (exist) return oldItems;

        return [...oldItems, newItem];
      },
    );
  };

  const mutation = useMutation({
    mutationFn: async (secret: string) => {
      const response = await vaultApi.addItem(secret);

      return response.data;
    },
    onSuccess: (data) => {
      const newItem = data.data.newItem;

      handleSuccess(newItem);
    },
  });

  return { ...mutation, triggerSuccess: handleSuccess };
};
