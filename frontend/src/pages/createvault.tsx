import { useState, useEffect, FormEvent } from "react";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";

import AuthLayout from "@/layouts/auth";
import { MasterKeyRequirements } from "@/components/CreateVault/MasterKeyRequirements";
import { useCryptoStore } from "@/store/cryptoStore";
import { vaultApi } from "@/api/vault";
import { encryptData, getKeyFromMaster } from "@/utils/crypto";

const requirements = [
  {
    label: "At least 8 characters",
    test: (value: string) => value.length >= 8,
  },
  {
    label: "Contains uppercase letter",
    test: (value: string) => /[A-Z]/.test(value),
  },
  {
    label: "Contains lowercase letter",
    test: (value: string) => /[a-z]/.test(value),
  },
  {
    label: "Contains number",
    test: (value: string) => /\d/.test(value),
  },
  {
    label: "Contains special character",
    test: (value: string) => /[!@#$%^&*(),.?":{}|<>]/.test(value),
  },
] as const;

export type Requirements = typeof requirements;

export const CreateVaultPage = () => {
  const [masterKey, setMasterKey] = useState("");
  const [confirmKey, setConfirmKey] = useState("");
  const [requirementsStatus, setRequirementsStatus] = useState(
    requirements.map(() => false),
  );
  const [match, setMatch] = useState(true);
  const [masterKeyFocused, setMasterKeyFocused] = useState(true);

  const storeMasterKey = useCryptoStore((store) => store.setKey);

  useEffect(() => {
    setRequirementsStatus(requirements.map((r) => r.test(masterKey)));
    setMatch(confirmKey === masterKey);
  }, [masterKey, confirmKey]);

  const allPassed =
    requirementsStatus.every(Boolean) && match && masterKey.length > 0;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const masterKey = formData.get("masterKey") as string;

    const key = await getKeyFromMaster(masterKey);

    const testValue = await encryptData("Valid", key);

    vaultApi.addItem(`#Vault-${testValue}`);

    storeMasterKey(masterKey);
  };

  return (
    <AuthLayout>
      <Card className="flex flex-col p-2 max-w-96">
        <CardHeader className="flex flex-col">
          <h1 className="text-lg font-semibold">Create Your Master Key</h1>
          <p className="text-sm  leading-relaxed text-pretty text-center opacity-80">
            Please choose a <strong>strong and secure password</strong> by
            following requirements below:
          </p>
        </CardHeader>
        <CardBody>
          <Form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col w-full gap-1">
              <Input
                isInvalid={
                  !masterKeyFocused && !requirementsStatus.every(Boolean)
                }
                label="Master Key"
                name="masterKey"
                placeholder="Enter master key"
                type="password"
                value={masterKey}
                onBlur={() => setMasterKeyFocused(false)}
                onChange={(e) => setMasterKey(e.target.value)}
                onFocus={() => setMasterKeyFocused(true)}
              />
              <MasterKeyRequirements
                focus={masterKeyFocused}
                requirements={requirements}
                requirementsStatus={requirementsStatus}
              />

              <Input
                isInvalid={!match}
                label="Confirm Master Key"
                placeholder="Confirm master key"
                type="password"
                value={confirmKey}
                onChange={(e) => setConfirmKey(e.target.value)}
              />
            </div>
            <Button
              className="w-full"
              color="primary"
              isDisabled={!allPassed}
              type="submit"
            >
              Create
            </Button>
          </Form>
        </CardBody>
      </Card>
    </AuthLayout>
  );
};
