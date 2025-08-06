import { VaultList } from "@/components/vault/VaultList";
import DefaultLayout from "@/layouts/default";

export const IndexPage = () => {
  return (
    <DefaultLayout>
      <VaultList />
    </DefaultLayout>
  );
};
