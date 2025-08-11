import { useEffect, useState } from "react";

import { VaultItemType } from "../../../shared/types";

import { CreateVaultPage } from "./createvault";
import { MasterkeyPage } from "./masterkey";

import { VaultList } from "@/components/vault/VaultList";
import { useGetList } from "@/hooks/queries/vault/useGetList";
import DefaultLayout from "@/layouts/default";
import { decryptList } from "@/utils/crypto";
import { DynamicField } from "@/components/AddItem/Forms/DynamicForm";
import { useCryptoStore } from "@/store/cryptoStore";

export const IndexPage = () => {
  const { data, isLoading } = useGetList();
  const [doesVaultExists, setDoesVaultExists] = useState<string | false>(false);

  const list: VaultItemType[] = data?.data.list ?? [];

  const [decryptedList, setDecryptedList] = useState<DynamicField[][]>([]);
  const key = useCryptoStore((store) => store.key);

  useEffect(() => {
    if (list.length === 0) return;
    let encryptedList = [];

    for (const item of list) {
      if (item.secret.startsWith("#Vault-")) {
        setDoesVaultExists(item.secret.split("-").at(1) ?? false);
      } else {
        encryptedList.push(item);
      }
    }

    const async = async () => {
      const decrypted = await decryptList(encryptedList);

      setDecryptedList(decrypted);
    };

    if (doesVaultExists && key) async();
  }, [list, key, doesVaultExists]);

  if (isLoading) return <p>Loading...</p>;

  if (!doesVaultExists) return <CreateVaultPage />;

  if (!key) return <MasterkeyPage testValue={doesVaultExists} />;

  return (
    <DefaultLayout>
      <VaultList list={decryptedList} />
    </DefaultLayout>
  );
};
