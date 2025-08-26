import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { AddItemButton } from "../AddItem/AddItemButton";
import { Searchbar } from "../Searchbar/Searchbar";
import { VaultItemType } from "../../../../shared/types";

import { VaultItem } from "./VaultItem";
import { VaultEmptyState } from "./VaultEmptyState";

import { DecryptedItem } from "@/types";
import { searchItems } from "@/utils/searchEngine";
import { useAddItem } from "@/hooks/mutations/useAddItem";
import { useWebSocketStore } from "@/store/wsStore";

type Props = {
  list: DecryptedItem[];
};

export const VaultList = ({ list }: Props) => {
  const [searchParams] = useSearchParams();
  const [searchBarValue, setSearchBarValue] = useState<string>("");
  const [filteredList, setFilteredList] = useState<DecryptedItem[]>([]);

  const on = useWebSocketStore((store) => store.on);
  const off = useWebSocketStore((store) => store.off);

  const { triggerSuccess } = useAddItem();

  const filter = searchParams.get("filter");

  useEffect(() => {
    const handler = (data: VaultItemType) => {
      triggerSuccess(data);
    };

    on("addItem", handler);

    return () => {
      off("addItem", handler);
    };
  }, [on, off]);

  useEffect(() => {
    const sidebarFilteredList = filter
      ? list.filter((item) => item.type === filter)
      : list;

    const searchObject = sidebarFilteredList.map((entry) => {
      const nameField = entry.item.find((f) => f.key === "name");
      const name = nameField?.defaultValue || "";

      const blob = entry.item
        .map((f) => f.defaultValue ?? "")
        .filter(Boolean)
        .join(" ");

      return {
        id: entry.id,
        name,
        blob,
      };
    });

    const result = searchItems(searchObject, searchBarValue);

    const founded = sidebarFilteredList.filter((item) =>
      result.some((r) => r.id === item.id),
    );

    setFilteredList(founded);
  }, [list, searchBarValue, filter]);

  return (
    <main className="flex flex-col h-full">
      <div className="flex flex-col gap-4 flex-1 min-h-0">
        <div className="flex flex-row gap-6 h-10">
          <Searchbar setValue={setSearchBarValue} value={searchBarValue} />
          <AddItemButton />
        </div>

        {filteredList.length > 0 ? (
          <ul className="flex flex-col gap-4 overflow-y-auto flex-1 max-h-[45%] [mask-image:linear-gradient(to_bottom,black_90%,transparent)] custom-scrollbar pr-1">
            {filteredList.map((item, index) => (
              <VaultItem key={index} item={item} />
            ))}
          </ul>
        ) : (
          <VaultEmptyState />
        )}
      </div>
    </main>
  );
};
