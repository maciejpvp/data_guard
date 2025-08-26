import { useMutation, useQueryClient } from "@tanstack/react-query";

import { VaultItemType } from "../../../../shared/types";

import { vaultApi } from "@/api/vault";
import { queryKeys } from "@/constants/queryKeys";
import { useWebSocketStore } from "@/store/wsStore";
import { useEffect } from "react";

export const useEditItem = () => {
  const queryClient = useQueryClient();
  const on = useWebSocketStore((store) => store.on);
  const off = useWebSocketStore((store) => store.off);

  const handleSuccess = (updatedItem: VaultItemType) => {
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
  };

  const mutation = useMutation({
    mutationFn: async ({ id, secret }: { id: string; secret: string }) => {
      const response = await vaultApi.editItem(id, secret);

      return response.data;
    },
    onSuccess: (data) => {
      const updatedItem = data.data.updatedItem;

      handleSuccess(updatedItem);
    },
  });

  useEffect(() => {
    const handler = (updatedItem: VaultItemType) => {
      handleSuccess(updatedItem);
    };

    on("editItem", handler);

    return () => {
      off("editItem", handler);
    };
  }, [on, off]);

  return { ...mutation, triggerSuccess: handleSuccess };
};
