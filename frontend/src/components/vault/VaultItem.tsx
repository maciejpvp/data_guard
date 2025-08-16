import { Card, CardBody } from "@heroui/card";
import { useDisclosure } from "@heroui/use-disclosure";

import { ViewEditModal } from "./Modals/ViewEditModal";
import { VaultItemDropdown } from "./VaultItemDropdown";
import { GetIcon } from "./GetIcon";

import { CardType, DecryptedItem } from "@/types";

type Props = {
  item: DecryptedItem;
};

export const VaultItem = ({ item }: Props) => {
  const {
    isOpen: isOpenViewEditModal,
    onOpen: onOpenViewEditModal,
    onOpenChange: onOpenChangeViewEditModal,
  } = useDisclosure();

  const getField = (key: string) => item.item.find((f) => f.key === key);

  const buttonStyle = "text-lg text-blue-400 font-semibold cursor-pointer";

  // const note = getField("note")?.defaultValue;

  const type = item.type;
  const name = getField("name")?.defaultValue || "(No name)";

  if (type === "password") {
    const username = getField("username")?.defaultValue ?? "";
    const password = getField("password")?.defaultValue ?? "";
    const url = getField("url")?.defaultValue ?? "";

    const loginObject = {
      username,
      password,
      url,
    };

    //Password Item
    return (
      <li>
        <Card>
          <CardBody className="ml-3 flex flex-row items-center justify-between gap-6">
            <div className="flex flex-row items-center gap-6">
              <GetIcon type={item.type} url={url} />
              <div>
                <button className={buttonStyle} onClick={onOpenViewEditModal}>
                  {url ? (url.split("://").at(1) ?? url) : name}
                </button>
                <p className="text-default-600">{username}</p>
              </div>
            </div>
            <VaultItemDropdown id={item.id} login={loginObject} type={type} />
          </CardBody>
        </Card>
        <ViewEditModal
          isOpen={isOpenViewEditModal}
          item={item}
          onOpenChange={onOpenChangeViewEditModal}
        />
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
                <button
                  className={buttonStyle}
                  onClick={onOpenChangeViewEditModal}
                >
                  {name}
                </button>
                <p className="text-default-600">
                  Ends with {cardNumber?.slice(-4)}
                </p>
              </div>
            </div>
            <VaultItemDropdown card={card} id={item.id} type={type} />
          </CardBody>
        </Card>
        <ViewEditModal
          isOpen={isOpenViewEditModal}
          item={item}
          onOpenChange={onOpenChangeViewEditModal}
        />
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
                <button
                  className={buttonStyle}
                  onClick={onOpenChangeViewEditModal}
                >
                  {name}
                </button>
                {/* <p className="text-default-600"></p> */}
              </div>
            </div>
            <VaultItemDropdown id={item.id} sshkey={sshKeyObject} type={type} />
          </CardBody>
        </Card>
        <ViewEditModal
          isOpen={isOpenViewEditModal}
          item={item}
          onOpenChange={onOpenChangeViewEditModal}
        />
      </li>
    );
  }
  if (type === "apikey") {
    const service = getField("service")?.defaultValue ?? "";
    const apikey = getField("apiKey")?.defaultValue ?? "";
    const url = getField("url")?.defaultValue ?? "";

    const apiKeyObject = {
      service,
      apikey,
      url,
    };

    return (
      <li>
        <Card>
          <CardBody className="ml-3 flex flex-row items-center justify-between gap-6">
            <div className="flex flex-row items-center gap-6">
              <GetIcon type={type} />
              <div>
                <button
                  className={buttonStyle}
                  onClick={onOpenChangeViewEditModal}
                >
                  {name}
                </button>
                <p className="text-default-600">{apiKeyObject.service}</p>
              </div>
            </div>
            <VaultItemDropdown apikey={apiKeyObject} id={item.id} type={type} />
          </CardBody>
        </Card>
        <ViewEditModal
          isOpen={isOpenViewEditModal}
          item={item}
          onOpenChange={onOpenChangeViewEditModal}
        />
      </li>
    );
  }
};
