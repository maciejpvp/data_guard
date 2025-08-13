import { AddItemButton } from "../AddItem/AddItemButton";

import { VaultItem } from "./VaultItem";

import { DecryptedItem } from "@/types";

type Props = {
  list: DecryptedItem[];
};

export const VaultList = ({ list }: Props) => {
  return (
    <div className="flex flex-col gap-4">
      <AddItemButton />
      <ul className="flex flex-col gap-4">
        {list.map((item, index) => (
          <VaultItem key={index} item={item} />
        ))}
      </ul>
    </div>
  );
};
