import { useSearchParams } from "react-router-dom";

import { AddItemButton } from "../AddItem/AddItemButton";

import { VaultItem } from "./VaultItem";

import { DecryptedItem } from "@/types";

type Props = {
  list: DecryptedItem[];
};

export const VaultList = ({ list }: Props) => {
  const [searchParams] = useSearchParams();

  const filter = searchParams.get("filter");

  const filteredList = filter
    ? list.filter((item) => item.type === filter)
    : list;

  return (
    <div className="flex flex-col gap-4">
      <AddItemButton />
      <ul className="flex flex-col gap-4">
        {filteredList.map((item, index) => (
          <VaultItem key={index} item={item} />
        ))}
      </ul>
    </div>
  );
};
