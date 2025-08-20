import { useSearchParams } from "react-router-dom";

import { AddItemButton } from "../AddItem/AddItemButton";
import { Searchbar } from "../Searchbar/Searchbar";

import { VaultItem } from "./VaultItem";

import { DecryptedItem } from "@/types";
import { useEffect, useState } from "react";
import { searchItems } from "@/utils/searchEngine";

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
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-6 h-10">
        <Searchbar setValue={setSearchBarValue} value={searchBarValue} />
        <AddItemButton />
      </div>
      <ul className="flex flex-col gap-4">
        {filteredList.map((item, index) => (
          <VaultItem key={index} item={item} />
        ))}
      </ul>
    </div>
  );
};
