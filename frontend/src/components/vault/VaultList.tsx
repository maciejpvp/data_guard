import { VaultItemType } from "../../../../shared/types";

import { useGetList } from "@/hooks/queries/vault/useGetList";

export const VaultList = () => {
  const { data, isLoading } = useGetList();

  if (isLoading) <p>Loading...</p>;

  const list: VaultItemType[] = data?.data.list ?? [];

  return (
    <ul>
      {list.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
};
