import { useSearchParams } from "react-router-dom";

import { Type } from "../AddItem/AddItemModal";

export type Category = {
  title: string;
  key?: Type;
};

type Props = {
  item: Category;
  active: boolean;
};

export const SidebarItem = ({ item }: Props) => {
  const { title, key } = item;

  const [searchParams, setSearchParams] = useSearchParams();

  const filter = searchParams.get("filter");

  let active = false;

  if (!filter && !key) active = true;

  if (filter && key === filter) active = true;

  const handleClick = () => {
    const params = new URLSearchParams(searchParams);

    if (key) {
      params.set("filter", key);
    } else {
      params.delete("filter");
    }

    setSearchParams(params);
  };

  return (
    <button
      className={`${active ? "bg-default-100" : "bg-default-50"} w-full rounded-md flex items-start p-2`}
      onClick={handleClick}
    >
      {title}
    </button>
  );
};
