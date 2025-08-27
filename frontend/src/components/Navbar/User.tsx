import { useNavigate } from "react-router-dom";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";

import { useCryptoStore } from "@/store/cryptoStore";
import { UserType } from "@/types";
import { logout } from "@/utils/auth";

type Props = {
  user: UserType;
};

export const User = ({ user }: Props) => {
  const navigate = useNavigate();
  const setKey = useCryptoStore((store) => store.setKey);

  const handleLockVault = () => {
    setKey(undefined);
  };

  const handleSettings = () => {
    navigate("/settings");
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
          <DropdownItem key="settings" onClick={handleSettings}>
            Settings
          </DropdownItem>
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
