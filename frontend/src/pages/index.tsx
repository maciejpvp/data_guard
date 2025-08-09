import { useEffect, useState } from "react";

import { VaultItemType } from "../../../shared/types";

import { CreateVaultPage } from "./createvault";

import { VaultList } from "@/components/vault/VaultList";
import { useGetList } from "@/hooks/queries/vault/useGetList";
import DefaultLayout from "@/layouts/default";
import { decryptList } from "@/utils/crypto";
import { DynamicField } from "@/components/AddItem/Forms/DynamicForm";

export const IndexPage = () => {
  const { data, isLoading } = useGetList();

  const encryptedList: VaultItemType[] = data?.data.list ?? [];

  const [decryptedList, setDecryptedList] = useState<
    DynamicField[] | undefined
  >(undefined);

  useEffect(() => {
    if (encryptedList.length === 0) return;

    const async = async () => {
      const decrypted = await decryptList("my-master123", encryptedList);

      setDecryptedList(decrypted);
    };

    async();
  }, [encryptedList]);

  if (isLoading || !decryptedList) return <p>Loading...</p>;

  return (
    <DefaultLayout>
      <VaultList list={decryptedList} />
    </DefaultLayout>
  );

  return <CreateVaultPage />;
};
