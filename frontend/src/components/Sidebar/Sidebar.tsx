import { Category, SidebarItem } from "./SidebarItem";

export const Sidebar = () => {
  const categories: Category[] = [
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

  // Index of categories array
  const selected = 0;

  return (
    <div className="bg-content1 text-content1-foreground p-3 rounded-md">
      <h1 className="font-semibold  text-lg ml-1 mb-1">Categories</h1>
      <ul className="flex flex-col gap-2">
        {categories.map((category, index) => (
          <li key={category.title}>
            <SidebarItem active={index === selected} item={category} />
          </li>
        ))}
      </ul>
    </div>
  );
};
