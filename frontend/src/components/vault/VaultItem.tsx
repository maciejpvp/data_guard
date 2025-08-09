import { DynamicField } from "../AddItem/Forms/DynamicForm";

type Props = {
  items: DynamicField[];
};

export const VaultItem = ({ items }: Props) => {
  const nameField = items.find((field) => field.key === "name");

  return <li>{nameField ? nameField.defaultValue : "(No name)"}</li>;
};
