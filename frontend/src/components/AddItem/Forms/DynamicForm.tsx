import { Form } from "@heroui/form";
import { Input, Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { ReactNode } from "react";

type FieldType = "text" | "textarea" | "password" | "email" | "url";

export type FieldConfig = {
  key: string;
  label: string;
  type?: FieldType;
  isRequired?: boolean;
  placeholder?: string;
  validate?: (value: string) => string | null;
};

type DynamicFormProps = {
  fields: FieldConfig[];
  onSubmit?: (data: Record<string, string>) => void;
  submitLabel?: string;
  extraButtons?: ReactNode;
};

export const DynamicForm = ({
  fields,
  onSubmit,
  submitLabel = "Submit",
  extraButtons,
}: DynamicFormProps) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values = Object.fromEntries(formData.entries()) as Record<
      string,
      string
    >;

    onSubmit?.(values);
  };

  return (
    <Form validationBehavior="aria" onSubmit={handleSubmit}>
      {fields.map((field) => {
        const commonProps = {
          key: field.key,
          name: field.key,
          label: field.label,
          labelPlacement: "outside-top" as const,
          placeholder: field.placeholder,
          isRequired: field.isRequired,
          validate: field.validate,
        };

        if (field.type === "textarea") {
          return <Textarea {...commonProps} key={field.key} />;
        }

        return (
          <Input type={field.type || "text"} {...commonProps} key={field.key} />
        );
      })}

      <div className="flex gap-2 mt-4">
        <Button type="submit">{submitLabel}</Button>
        {extraButtons}
      </div>
    </Form>
  );
};
