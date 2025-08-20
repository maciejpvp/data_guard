import { useSearchParams } from "react-router-dom";
import { Category } from "../Sidebar/SidebarItem"; // adjust import path
import { NavbarMenu, NavbarMenuItem } from "@heroui/navbar";
import { siteConfig } from "@/config/site";
import { categories } from "../Sidebar/Sidebar.tsx";

export const MobileMenu = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = searchParams.get("filter");

  const handleClick = (key?: string) => {
    const params = new URLSearchParams(searchParams);

    if (key) {
      params.set("filter", key);
    } else {
      params.delete("filter");
    }

    setSearchParams(params);
  };

  return (
    <NavbarMenu>
      <div className="mx-4 mt-2 flex flex-col gap-2 justify-between h-2/3">
        <div>
          <h1>Categories</h1>
          {categories.map(({ title, key }) => {
            const active = (!filter && !key) || (filter && key === filter);

            return (
              <NavbarMenuItem key={key ?? "all"}>
                <button
                  onClick={() => handleClick(key)}
                  className={`w-full rounded-md p-2 flex justify-between items-center ${
                    active ? "bg-default-100" : "bg-default-50"
                  }`}
                >
                  {title}
                </button>
              </NavbarMenuItem>
            );
          })}
        </div>
        <div>
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <a
                className={`text-lg ${
                  index === 2
                    ? "text-primary"
                    : index === siteConfig.navMenuItems.length - 1
                      ? "text-danger"
                      : "text-foreground"
                }`}
                href="#"
              >
                {item.label}
              </a>
            </NavbarMenuItem>
          ))}
        </div>
      </div>
    </NavbarMenu>
  );
};
