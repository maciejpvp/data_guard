import { Button } from "@heroui/button";
import { FaPlus } from "react-icons/fa6";
import { useDisclosure } from "@heroui/use-disclosure";

import { AddItemModal } from "./AddItemModal";

export const AddItemButton = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="flex justify-end">
      <Button color="primary" onPress={onOpen}>
        <FaPlus /> Add Item
      </Button>
      <AddItemModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </div>
  );
};
