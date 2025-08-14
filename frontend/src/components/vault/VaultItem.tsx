import { Card, CardBody } from "@heroui/card";

import { VaultItemDropdown } from "./VaultItemDropdown";
import { GetIcon } from "./GetIcon";

import { DecryptedItem } from "@/types";

type Props = {
  item: DecryptedItem;
};

export const VaultItem = ({ item }: Props) => {
  console.log(item);
  const getField = (key: string) => item.item.find((f) => f.key === key);

  const name = getField("name")?.defaultValue || "(No name)";
  const username = getField("username")?.defaultValue;
  const password = getField("password")?.defaultValue;
  const url = getField("url")?.defaultValue;
  // const note = getField("note")?.defaultValue;

  return (
    <li>
      <Card>
        <CardBody className="ml-3 flex flex-row items-center justify-between gap-6">
          <div className="flex flex-row items-center gap-6">
            <GetIcon type={item.type} url={url} />
            <div>
              <h1 className="text-lg text-blue-400 font-semibold">
                {url ? (url.split("://").at(1) ?? url) : name}
              </h1>
              <p className="text-default-600">{username}</p>
            </div>
          </div>
          <VaultItemDropdown
            id={item.id}
            password={password ?? ""}
            url={url}
            username={username ?? ""}
          />
        </CardBody>
      </Card>
    </li>
  );
};
