import { AddItemButton } from "../AddItem/AddItemButton";
import { DynamicField } from "../AddItem/Forms/DynamicForm";

import { VaultItem } from "./VaultItem";

type Props = {
  list: DynamicField[][];
};

export const VaultList = ({ list }: Props) => {
  return (
    <div className="flex flex-col gap-4">
      <AddItemButton />
      <ul>
        {list.map((items, index) => (
          <VaultItem key={index} items={items} />
        ))}
      </ul>
    </div>
  );
};
