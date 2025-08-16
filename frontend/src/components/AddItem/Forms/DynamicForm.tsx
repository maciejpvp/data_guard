import React, { useState } from "react";
import { Form } from "@heroui/form";
import { Input, Textarea } from "@heroui/input";
import { Button } from "@heroui/button";

import { Type } from "../AddItemModal";

import { DecryptedItem } from "@/types";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@/components/icons";

type FieldType =
  | "text"
  | "number"
  | "email"
  | "password"
  | "url"
  | "textarea"
  | "month";

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

type OnSubmitProps = Omit<DecryptedItem, "id" | "userId">;

interface DynamicFormProps {
  fields: DynamicField[];
  onSubmit: (updatedFields: OnSubmitProps) => void;
  submitButtonRef: React.MutableRefObject<HTMLButtonElement | null>;
  isDisabled: boolean;
  type: Type;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  onSubmit,
  submitButtonRef,
  isDisabled,
  type,
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

  const [showValue, setShowValue] = useState<Set<string>>(new Set());

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedFields: DynamicField[] = fields.map((field) => ({
      ...field,
      defaultValue: values[field.key],
    }));

    const item = {
      type,
      item: updatedFields,
    };

    onSubmit(item);
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
          return (
            <>
              <Textarea
                {...commonProps}
                key={field.key}
                readOnly={isDisabled}
              />
            </>
          );
        }

        return (
          <Input
            {...commonProps}
            key={field.key}
            endContent={
              field.type === "password" ? (
                <button
                  aria-label="toggle password visibility"
                  className="focus:outline-solid outline-transparent"
                  type="button"
                  onClick={() => {
                    setShowValue((prev) => {
                      const newSet = new Set(prev);

                      if (newSet.has(field.key)) {
                        newSet.delete(field.key);
                      } else {
                        newSet.add(field.key);
                      }

                      return newSet;
                    });
                  }}
                >
                  {showValue.has(field.key) ? (
                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              ) : null
            }
            readOnly={isDisabled}
            type={
              field.type === "password" && !showValue.has(field.key)
                ? "password"
                : "text"
            }
          />
        );
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
