import { useSearchParams } from "react-router-dom";

import { AddItemButton } from "../AddItem/AddItemButton";
import { Searchbar } from "../Searchbar/Searchbar";

import { VaultItem } from "./VaultItem";

import { DecryptedItem } from "@/types";
import { useEffect, useState } from "react";
import { searchItems } from "@/utils/searchEngine";
import { VaultEmptyState } from "./VaultEmptyState";

type Props = {
  list: DecryptedItem[];
};

export const VaultList = ({ list }: Props) => {
  const [searchParams] = useSearchParams();
  const [searchBarValue, setSearchBarValue] = useState<string>("");
  const [filteredList, setFilteredList] = useState<DecryptedItem[]>([]);

  const filter = searchParams.get("filter");

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
