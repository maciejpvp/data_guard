import { VaultItemType } from "../../../../shared/types";
import { AddItemButton } from "../AddItem/AddItemButton";

import { useGetList } from "@/hooks/queries/vault/useGetList";

export const VaultList = () => {
  const { data, isLoading } = useGetList();

  if (isLoading) <p>Loading...</p>;

  const list: VaultItemType[] = data?.data.list ?? [];

  return (
    <div className="flex flex-col gap-4">
      <AddItemButton />
      <ul>
        {list.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
};
