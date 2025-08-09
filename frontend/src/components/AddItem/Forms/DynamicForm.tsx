import React, { useState } from "react";
import { Form } from "@heroui/form";
import { Input, Textarea } from "@heroui/input";
import { Button } from "@heroui/button";

type FieldType = "text" | "number" | "email" | "password" | "url" | "textarea";

export interface DynamicField {
  key: string;
  label: string;
  type: FieldType;
  defaultValue?: string;
  isRequired?: boolean;
  placeholder?: string;
  validation?: {
    pattern?: RegExp;
    message?: string;
  };
}

interface DynamicFormProps {
  fields: DynamicField[];
  onSubmit: (updatedFields: DynamicField[]) => void;
  submitButtonRef: React.MutableRefObject<HTMLButtonElement | null>;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  onSubmit,
  submitButtonRef,
}) => {
  const [values, setValues] = useState<Record<string, string>>(
    fields.reduce(
      (acc, field) => {
        acc[field.key] = field.defaultValue || "";

        return acc;
      },
      {} as Record<string, string>,
    ),
  );

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedFields = fields.map((field) => ({
      ...field,
      defaultValue: values[field.key],
    }));

    onSubmit(updatedFields);
  };

  return (
    <Form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
      {fields.map((field) => {
        const commonProps = {
          label: field.label,
          value: values[field.key],
          onChange: (
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
          ) => handleChange(field.key, e.target.value),
          isRequired: field.isRequired,
          placeholder: field.placeholder,
        };

        if (field.type === "textarea") {
          return <Textarea {...commonProps} key={field.key} />;
        }

        return <Input {...commonProps} key={field.key} type={field.type} />;
      })}

      <Button
        ref={submitButtonRef}
        className="hidden"
        color="primary"
        type="submit"
      >
        Submit
      </Button>
    </Form>
  );
};
