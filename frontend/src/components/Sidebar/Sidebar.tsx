import { Category, SidebarItem } from "./SidebarItem";

import { useVaultStore } from "@/store/vaultStore";

export const categories: Category[] = [
  {
    title: "All Items",
  },
  {
    title: "Login",
    key: "password",
  },
  {
    title: "Card",
    key: "card",
  },
  {
    title: "Note",
    key: "note",
  },
  {
    title: "SSH Key",
    key: "sshkey",
  },
  {
    title: "API Key",
    key: "apikey",
  },
];
export const Sidebar = () => {
  const quantityMap = useVaultStore((store) => store.quantityMap);

  const all = quantityMap
    ? [...quantityMap.values()].reduce((sum, n) => sum + n, 0)
    : 0;

  return (
    <div className="bg-content1 text-content1-foreground p-3 rounded-md w-64 mt-4">
      <h1 className="font-semibold  text-lg ml-1 mb-1">Categories</h1>
      <ul className="flex flex-col gap-2">
        {categories.map((category) => (
          <li key={category.title}>
            <SidebarItem
              count={
                quantityMap
                  ? category.key
                    ? quantityMap.get(category.key)
                    : all
                  : undefined
              }
              item={category}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};
