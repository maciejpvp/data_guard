import { CreditCard } from "@/components/Card/Card";
import { CardType } from "@/types";
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
  card: CardType;
  isOpen: boolean;
  onOpenChange: () => void;
};

export const InspectCardModal = ({ isOpen, onOpenChange, card }: Props) => {
  const onCloseRef = useRef<() => void | null>(null!);
  console.log(card);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => {
          onCloseRef.current = onClose;

          return (
            <>
              <ModalHeader className="text-default-800 justify-center text-xl font-semibold">
                Inspect Card
              </ModalHeader>
              <ModalBody className="flex flex-col items-center text-center gap-4">
                <CreditCard
                  cardExpiration={card.cardExpiryDate}
                  cardHolder={card.cardHolderName}
                  cardNumber={card.cardNumber}
                  cvv={card.cardCVV}
                  type="transparent"
                />
                <p className="text-xs text-default-500">
                  Hover over the blurred parts to see the full information.
                </p>
              </ModalBody>
              <ModalFooter className="justify-center">
                <Button size="sm" onPress={onClose}>
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
