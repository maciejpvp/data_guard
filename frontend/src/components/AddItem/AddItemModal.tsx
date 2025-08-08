import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { useState } from "react";

import { IndexForm } from "./Forms/IndexForm";

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

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Add Item</ModalHeader>
            <ModalBody className="flex flex-col justify-center items-start">
              <Select
                defaultSelectedKeys={["password"]}
                label="Type"
                placeholder="Select Type"
                onChange={handleSelectionChange}
              >
                {types.map((type) => (
                  <SelectItem key={type.key}>{type.label}</SelectItem>
                ))}
              </Select>
              <IndexForm type={type} />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={onClose}>
                Create
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
