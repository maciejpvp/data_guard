import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { HiArrowPath } from "react-icons/hi2";

import { AddItemButton } from "../AddItem/AddItemButton";
import { Searchbar } from "../Searchbar/Searchbar";

import { VaultItem } from "./VaultItem";
import { VaultEmptyState } from "./VaultEmptyState";

import { DecryptedItem } from "@/types";
import { searchItems } from "@/utils/searchEngine";

type Props = {
  list: DecryptedItem[];
};

export const VaultList = ({ list }: Props) => {
  const [searchParams] = useSearchParams();
  const [searchBarValue, setSearchBarValue] = useState<string>("");
  const [filteredList, setFilteredList] = useState<DecryptedItem[]>([]);

  const queryClient = useQueryClient();

  const [isRotateing, setIsRotating] = useState<boolean>(false);

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

  const refresh = () => {
    if (isRotateing) return;
    setIsRotating(true);
    queryClient.invalidateQueries();

    setTimeout(() => setIsRotating(false), 600);
  };

  return (
    <main className="flex flex-col h-full">
      <div className="flex flex-col gap-4 flex-1 min-h-0">
        <div className="flex flex-row gap-3 h-10 mr-1">
          <Searchbar setValue={setSearchBarValue} value={searchBarValue} />
          <AddItemButton />
          <motion.div
            animate={isRotateing ? { rotate: 360 } : { rotate: 0 }}
            className="cursor-pointer  flex items-center"
            transition={{ duration: 0.6, ease: "easeInOut" }}
            onClick={refresh}
          >
            <HiArrowPath className="size-6 cursor-pointer hover:scale-105 transition-all duration-100 " />
          </motion.div>
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
