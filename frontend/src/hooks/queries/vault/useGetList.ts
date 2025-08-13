import { useQuery } from "@tanstack/react-query";

import { vaultApi } from "@/api/vault";
import { queryKeys } from "@/constants/queryKeys";

export const useGetList = () => {
  return useQuery({
    queryKey: queryKeys.vault.itemList,
    queryFn: async () => {
      const response = await vaultApi.getList();

      return response.data.data.list;
    },
    staleTime: 5 * 60 * 1000,
  });
};
