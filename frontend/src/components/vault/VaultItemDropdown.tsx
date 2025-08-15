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

import { DeleteConfirmModal } from "./Modals/DeleteConfirmModal";
import { InspectCardModal } from "./Modals/InspectCardModal";

import { ApiKeyType, CardType, LoginType, SSHKeyType } from "@/types";

type Props =
  | {
      type: "password";
      id: string;
      login: LoginType;
    }
  | {
      type: "card";
      id: string;
      card: CardType;
    }
  | {
      type: "sshkey";
      id: string;
      sshkey: SSHKeyType;
    }
  | {
      type: "apikey";
      id: string;
      apikey: ApiKeyType;
    };

export const VaultItemDropdown = (props: Props) => {
  const { id, type } = props;

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

  let dropdownItems;

  if (type === "password") {
    const login = props.login;

    dropdownItems = [
      {
        key: "copyusername",
        label: "Copy Username",
        onClick: () => {
          copyToClipboard(login.username);
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
          copyToClipboard(login.password);
          addToast({
            title: "Password Copied",
            description:
              "The password has been securely copied to your clipboard.",
          });
        },
        startContent: <FaRegCopy className={iconClasses} />,
      },
      ...(login?.url
        ? [
            {
              key: "visit",
              label: "Visit",
              onClick: () => openInNewTab(login?.url as string),
              startContent: (
                <FaArrowUpRightFromSquare className={iconClasses} />
              ),
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
  }
  if (type === "card") {
    dropdownItems = [
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
  }
  if (type === "sshkey") {
    const sshkey = props.sshkey;

    dropdownItems = [
      {
        key: "copypublickey",
        label: "Copy Public Key",
        onClick: () => {
          copyToClipboard(sshkey.publicKey);
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
          copyToClipboard(sshkey.privateKey);
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
          copyToClipboard(sshkey.passphrase);
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
  }

  if (type === "apikey") {
    const apikey = props.apikey;

    dropdownItems = [
      {
        key: "Copy API Key",
        label: "Copy API Key",
        onClick: () => {
          copyToClipboard(apikey.apikey);
          addToast({
            title: "API Key Copied",
            description: "The api key has been copied to your clipboard.",
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
  }

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
      {type === "card" && (
        <InspectCardModal
          card={props.card}
          isOpen={isOpenInspectCardModal}
          onOpenChange={onOpenChangeInspectCardModal}
        />
      )}
    </>
  );
};
