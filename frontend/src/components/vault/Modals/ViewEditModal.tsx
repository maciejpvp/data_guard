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

import { encryptData } from "@/utils/crypto";
import { useAddItem } from "@/hooks/mutations/useAddItem";
import { DynamicForm } from "@/components/AddItem/Forms/DynamicForm";
import { DecryptedItem } from "@/types";

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
  item: DecryptedItem;
};

export const ViewEditModal = ({ isOpen, onOpenChange, item }: Props) => {
  const [type, setType] = useState<Type>(item.type);
  const [editMode, setEditMode] = useState<boolean>(false);
  const onCloseRef = useRef<() => void | null>(null!);
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);
  const { mutate: submitItem, isPending } = useAddItem();

  const isDisabled = !editMode || isPending;

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
                View Item
              </ModalHeader>
              <ModalBody className="flex flex-col justify-center items-start">
                <Select
                  defaultSelectedKeys={[type]}
                  isDisabled={isDisabled}
                  label="Type"
                  placeholder="Select Type"
                  onChange={handleSelectionChange}
                >
                  {types.map((type) => (
                    <SelectItem key={type.key}>{type.label}</SelectItem>
                  ))}
                </Select>
                <DynamicForm
                  fields={item.item}
                  isDisabled={isDisabled}
                  submitButtonRef={submitButtonRef}
                  type={type}
                  onSubmit={(e) => handleSubmit(JSON.stringify(e))}
                />
              </ModalBody>
              <ModalFooter className="justify-between">
                <Button
                  color={editMode ? "default" : "primary"}
                  isDisabled={isPending}
                  isLoading={isPending}
                  variant="solid"
                  onPress={() => setEditMode((prev) => !prev)}
                >
                  {editMode ? "Cancel" : "Edit"}
                </Button>
                <Button
                  color="default"
                  isDisabled={isPending}
                  isLoading={isPending}
                  variant="light"
                  onPress={handleCreateButton}
                >
                  Close
                </Button>
              </ModalFooter>
            </>
          );
        }}
      </ModalContent>
    </Modal>
  );
};
