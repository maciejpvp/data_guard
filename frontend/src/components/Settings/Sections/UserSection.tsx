import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { User } from "@heroui/user";

import { useAuthStore } from "@/store/authStore";
import { vaultApi } from "@/api/vault";

export const UserSection = () => {
  const user = useAuthStore((store) => store.user);

  return (
    <div className="p-2">
      <h1 className="text-xl">Account</h1>
      <div className="bg-content2 p-2 rounded-md">
        <User
          avatarProps={{
            src: user?.avatar,
            size: "lg",
          }}
          className=""
          description="Free Account"
          name={`${user?.name} ${user?.surname}`}
        />
      </div>
      <Card className="bg-default-100">
        <CardHeader>
          <span className="text-red-700 font-semibold text-lg">
            Danger Zone
          </span>
        </CardHeader>
        <CardBody>
          <div className="flex flex-row gap-3">
            <Button color="danger" onPress={vaultApi.deleteVault}>
              Delete Vault
            </Button>
            <Button color="danger" onPress={vaultApi.deleteAccount}>
              Delete Account
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
