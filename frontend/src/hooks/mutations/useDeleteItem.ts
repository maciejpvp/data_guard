import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { VaultItemType } from "../../../../shared/types";

import { vaultApi } from "@/api/vault";
import { queryKeys } from "@/constants/queryKeys";
import { useWebSocketStore } from "@/store/wsStore";

export const useDeleteItem = () => {
  const queryClient = useQueryClient();
  const on = useWebSocketStore((store) => store.on);
  const off = useWebSocketStore((store) => store.off);

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

  useEffect(() => {
    const handler = (id: string) => {
      handleSuccess(id);
    };

    on("deleteItem", handler);

    return () => {
      off("deleteItem", handler);
    };
  }, [on, off]);

  return { ...mutation, triggerSuccess: handleSuccess };
};
