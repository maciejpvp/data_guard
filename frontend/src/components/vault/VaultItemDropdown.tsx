import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";

import { useDisclosure } from "@heroui/use-disclosure";
import { addToast } from "@heroui/toast";
import { SlOptionsVertical } from "react-icons/sl";
import { FaRegCopy, FaRegEye } from "react-icons/fa";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { IoTrashBin } from "react-icons/io5";

import { Type } from "../AddItem/AddItemModal";

import { DeleteConfirmModal } from "./Modals/DeleteConfirmModal";
import { InspectCardModal } from "./Modals/InspectCardModal";

import { CardType, SSHKeyType } from "@/types";

type Props = {
  type: Type;
  id: string;
  username?: string;
  password?: string;
  url?: string;
  card?: CardType;
  sshkey?: SSHKeyType;
};

export const VaultItemDropdown = ({
  id,
  username,
  password,
  url,
  type,
  card,
  sshkey,
}: Props) => {
  const {
    isOpen: isOpenDeleteConfirmModal,
    onOpen: onOpenDeleteConfirmModal,
    onOpenChange: onOpenChangeDeleteConfirmModal,
  } = useDisclosure();

  const {
    isOpen: isOpenInspectCardModal,
    onOpen: onOpenInspectCardModal,
    onOpenChange: onOpenChangeInspectCardModal,
  } = useDisclosure();

  const iconClasses = "text-xl text-default-500 pointer-events-none shrink-0";
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const openInNewTab = (url: string) => {
    const link = document.createElement("a");

    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const passwordDropdown = [
    {
      key: "copyusername",
      label: "Copy Username",
      onClick: () => {
        copyToClipboard(username ?? "Failed To Copy Username");
        addToast({
          title: "Username Copied",
          description: "The username has been copied to your clipboard.",
        });
      },
      startContent: <FaRegCopy className={iconClasses} />,
    },
    {
      key: "copypassword",
      label: "Copy Password",
      onClick: () => {
        copyToClipboard(password ?? "Failed To Copy Password");
        addToast({
          title: "Password Copied",
          description:
            "The password has been securely copied to your clipboard.",
        });
      },
      startContent: <FaRegCopy className={iconClasses} />,
    },
    ...(url
      ? [
          {
            key: "visit",
            label: "Visit",
            onClick: () => openInNewTab(url),
            startContent: <FaArrowUpRightFromSquare className={iconClasses} />,
          },
        ]
      : []),
    {
      key: "delete",
      label: "Delete",
      onClick: () => onOpenDeleteConfirmModal(),
      startContent: <IoTrashBin className={iconClasses} />,
    },
  ];

  const cardDropdown = [
    {
      key: "showcard",
      label: "Inspect Card",
      onClick: () => onOpenInspectCardModal(),
      startContent: <FaRegEye className={iconClasses} />,
    },
    {
      key: "delete",
      label: "Delete",
      onClick: () => onOpenDeleteConfirmModal(),
      startContent: <IoTrashBin className={iconClasses} />,
    },
  ];

  const sshkeyDropdown = [
    {
      key: "copypublickey",
      label: "Copy Public Key",
      onClick: () => {
        copyToClipboard(sshkey?.publicKey ?? "Failed To Copy Public Key");
        addToast({
          title: "Public Key Copied",
          description: "The public key has been copied to your clipboard.",
        });
      },
      startContent: <FaRegCopy className={iconClasses} />,
    },
    {
      key: "copyprivatekey",
      label: "Copy Private Key",
      onClick: () => {
        copyToClipboard(sshkey?.privateKey ?? "Failed To Copy Private Key");
        addToast({
          title: "Private Key Copied",
          description: "The private key has been copied to your clipboard.",
        });
      },
      startContent: <FaRegCopy className={iconClasses} />,
    },
    {
      key: "copypassphrase",
      label: "Copy Passphrase",
      onClick: () => {
        copyToClipboard(sshkey?.passphrase ?? "Failed To Copy Passphrase");
        addToast({
          title: "Passphrase Copied",
          description: "The passphrase has been copied to your clipboard.",
        });
      },
      startContent: <FaRegCopy className={iconClasses} />,
    },
    {
      key: "delete",
      label: "Delete",
      onClick: () => onOpenDeleteConfirmModal(),
      startContent: <IoTrashBin className={iconClasses} />,
    },
  ];

  let dropdownItems;

  if (type === "password") dropdownItems = passwordDropdown;
  if (type === "card") dropdownItems = cardDropdown;
  if (type === "sshkey") dropdownItems = sshkeyDropdown;

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button className="border-0 bg-transparent">
            <SlOptionsVertical />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Dynamic Actions" items={dropdownItems}>
          {(item) => (
            <DropdownItem
              {...item}
              key={item.key}
              className={item.key === "delete" ? "text-danger" : ""}
              color={item.key === "delete" ? "danger" : "default"}
            >
              {item.label}
            </DropdownItem>
          )}
        </DropdownMenu>
      </Dropdown>
      <DeleteConfirmModal
        id={id}
        isOpen={isOpenDeleteConfirmModal}
        onOpenChange={onOpenChangeDeleteConfirmModal}
      />
      {card && (
        <InspectCardModal
          card={card}
          isOpen={isOpenInspectCardModal}
          onOpenChange={onOpenChangeInspectCardModal}
        />
      )}
    </>
  );
};
