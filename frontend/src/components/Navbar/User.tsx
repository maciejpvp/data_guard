import { useAuthStore } from "@/store/authStore";
import { useCryptoStore } from "@/store/cryptoStore";
import { UserType } from "@/types";
import { logout } from "@/utils/auth";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";

type Props = {
  user: UserType;
};

export const User = ({ user }: Props) => {
  const setKey = useCryptoStore((store) => store.setKey);

  const handleLockVault = () => {
    setKey(undefined);
  };

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button
            className="text-default-600 mt-1 bg-transparent"
            startContent={
              <Avatar
                className="border-1 border-default"
                name={user?.name}
                src={user?.avatar}
              />
            }
            variant="flat"
          />
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem key="settings">Settings</DropdownItem>
          <DropdownItem key="lockvault" onClick={handleLockVault}>
            Lock Vault
          </DropdownItem>

          <DropdownItem key="logout" className="text-danger" onClick={logout}>
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  );
};
