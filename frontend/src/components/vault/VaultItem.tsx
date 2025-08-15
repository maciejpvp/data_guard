import { Card, CardBody } from "@heroui/card";

import { VaultItemDropdown } from "./VaultItemDropdown";
import { GetIcon } from "./GetIcon";

import { CardType, DecryptedItem } from "@/types";

type Props = {
  item: DecryptedItem;
};

export const VaultItem = ({ item }: Props) => {
  const getField = (key: string) => item.item.find((f) => f.key === key);

  // const note = getField("note")?.defaultValue;

  const type = item.type;
  const name = getField("name")?.defaultValue || "(No name)";

  if (type === "password") {
    const username = getField("username")?.defaultValue;
    const password = getField("password")?.defaultValue;
    const url = getField("url")?.defaultValue;

    //Password Item
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
              type={type}
              url={url}
              username={username ?? ""}
            />
          </CardBody>
        </Card>
      </li>
    );
  }

  if (type === "card") {
    const cardNumber = getField("cardNumber")?.defaultValue ?? "";
    const cardHolderName = getField("cardholderName")?.defaultValue ?? "";
    const cardExpiryDate = getField("expiryDate")?.defaultValue ?? "";
    const cardCVV = getField("cvv")?.defaultValue ?? "";

    const card: CardType = {
      cardNumber,
      cardHolderName,
      cardExpiryDate,
      cardCVV,
    };

    //Card Item
    return (
      <li>
        <Card>
          <CardBody className="ml-3 flex flex-row items-center justify-between gap-6">
            <div className="flex flex-row items-center gap-6">
              <GetIcon type={type} />
              <div>
                <h1 className="text-lg text-blue-400 font-semibold">{name}</h1>
                <p className="text-default-600">
                  Ends with {cardNumber?.slice(-4)}
                </p>
              </div>
            </div>
            <VaultItemDropdown card={card} id={item.id} type={type} />
          </CardBody>
        </Card>
      </li>
    );
  }
  if (type === "sshkey") {
    const privateKey = getField("privateKey")?.defaultValue ?? "";
    const publicKey = getField("publicKey")?.defaultValue ?? "";
    const passphrase = getField("passphrase")?.defaultValue ?? "";

    const sshKeyObject = {
      passphrase,
      privateKey,
      publicKey,
    };

    return (
      <li>
        <Card>
          <CardBody className="ml-3 flex flex-row items-center justify-between gap-6">
            <div className="flex flex-row items-center gap-6">
              <GetIcon type={type} />
              <div>
                <h1 className="text-lg text-blue-400 font-semibold">{name}</h1>
                {/* <p className="text-default-600"></p> */}
              </div>
            </div>
            <VaultItemDropdown id={item.id} sshkey={sshKeyObject} type={type} />
          </CardBody>
        </Card>
      </li>
    );
  }
};
