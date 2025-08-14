import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { useRef, useState } from "react";

import { DynamicForm } from "./Forms/DynamicForm";
import { templates } from "./Forms/templates";

import { encryptData } from "@/utils/crypto";
import { useAddItem } from "@/hooks/mutations/useAddItem";

export const types = [
  { key: "password", label: "Password" },
  { key: "card", label: "Card" },
  { key: "sshkey", label: "SSH Key" },
  { key: "apikey", label: "API Key" },
  { key: "note", label: "Note" },
] as const;

export type Type = (typeof types)[number]["key"];

type Props = {
  isOpen: boolean;
  onOpenChange: () => void;
};

export const AddItemModal = ({ isOpen, onOpenChange }: Props) => {
  const [type, setType] = useState<Type>(types[0].key);
  const onCloseRef = useRef<() => void | null>(null!);
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);
  const { mutate: submitItem, isPending } = useAddItem();

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue: Type = e.target.value as Type;

    setType(newValue);
  };

  const handleCreateButton = () => {
    if (!submitButtonRef.current) return;

    submitButtonRef.current.click();
  };

  const handleSubmit = async (form: string) => {
    const encrypted = await encryptData(form);

    submitItem(encrypted, {
      onSettled: () => {
        onCloseRef?.current?.();
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => {
          onCloseRef.current = onClose;

          return (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add Item
              </ModalHeader>
              <ModalBody className="flex flex-col justify-center items-start">
                <Select
                  defaultSelectedKeys={["password"]}
                  isDisabled={isPending}
                  label="Type"
                  placeholder="Select Type"
                  onChange={handleSelectionChange}
                >
                  {types.map((type) => (
                    <SelectItem key={type.key}>{type.label}</SelectItem>
                  ))}
                </Select>
                <DynamicForm
                  fields={templates[type] ?? templates.password}
                  isDisabled={isPending}
                  submitButtonRef={submitButtonRef}
                  type={type}
                  onSubmit={(e) => handleSubmit(JSON.stringify(e))}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  isDisabled={isPending}
                  variant="light"
                  onPress={onClose}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  isDisabled={isPending}
                  isLoading={isPending}
                  onPress={handleCreateButton}
                >
                  Create
                </Button>
              </ModalFooter>
            </>
          );
        }}
      </ModalContent>
    </Modal>
  );
};
