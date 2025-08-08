import { Type } from "../AddItemModal";

import { DynamicForm, FieldConfig } from "./DynamicForm";

type Props = {
  type: Type;
};

const passwordForm: FieldConfig = [
  { key: "name", label: "Name", isRequired: true },
  { key: "url", label: "URL", type: "url" },
  { key: "username", label: "Username/Email", type: "email" },
  { key: "password", label: "Password", type: "password", isRequired: true },
  { key: "note", label: "Additional Info", type: "textarea" },
];

export const IndexForm = ({ type }: Props) => {
  let formElement: React.ReactNode;

  switch (type) {
    case "password":
      formElement = (
        <DynamicForm
          fields={passwordForm}
          onSubmit={(data) => {
            console.log("Password form submitted:", data);
          }}
        />
      );
      break;

    default:
      formElement = <p>Unsupported form type: {type}</p>;
  }

  return <>{formElement}</>;
};
