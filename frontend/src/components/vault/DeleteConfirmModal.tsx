import { useDeleteItem } from "@/hooks/mutations/useDeleteItem";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { useRef } from "react";

type Props = {
  id: string;
  isOpen: boolean;
  onOpenChange: () => void;
};

export const DeleteConfirmModal = ({ id, isOpen, onOpenChange }: Props) => {
  const { mutate: deleteItem, isPending } = useDeleteItem();

  const onCloseRef = useRef<() => void | null>(null!);

  const handleDelete = () => {
    deleteItem(id, {
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
              <ModalHeader className="text-default-800">
                Delete Item
              </ModalHeader>
              <ModalBody>
                <p className="text-default-600 text-sm">
                  This action <strong>cannot</strong> be undone. All data
                  associated with this item will be lost forever and cannot be
                  recovered.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="default"
                  isDisabled={isPending}
                  variant="light"
                  onPress={onClose}
                >
                  Cancel
                </Button>
                <Button
                  color="danger"
                  isDisabled={isPending}
                  isLoading={isPending}
                  onPress={handleDelete}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          );
        }}
      </ModalContent>
    </Modal>
  );
};
