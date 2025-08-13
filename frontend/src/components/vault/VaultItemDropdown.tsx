import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { addToast } from "@heroui/toast";
import { SlOptionsVertical } from "react-icons/sl";
import { FaRegCopy } from "react-icons/fa";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { IoTrashBin } from "react-icons/io5";

import { useDeleteItem } from "@/hooks/mutations/useDeleteItem";

type Props = {
  id: string;
  username: string;
  password: string;
  url?: string;
};

export const VaultItemDropdown = ({ id, username, password, url }: Props) => {
  const { mutate: deleteItem } = useDeleteItem();
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
        copyToClipboard(username);
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
        copyToClipboard(password);
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
      onClick: () => {
        deleteItem(id);
      },
      startContent: <IoTrashBin className={iconClasses} />,
    },
  ];

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button className="border-0 bg-transparent">
          <SlOptionsVertical />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Dynamic Actions" items={passwordDropdown}>
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
  );
};
