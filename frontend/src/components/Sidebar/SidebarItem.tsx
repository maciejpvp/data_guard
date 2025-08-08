export type Category = {
  title: string;
};

type Props = {
  item: Category;
  active: boolean;
};

export const SidebarItem = ({ item, active }: Props) => {
  const { title } = item;

  return (
    <p
      className={`${active ? "bg-content2 text-content2-foreground" : ""} p-2 rounded-md`}
    >
      {title}
    </p>
  );
};
