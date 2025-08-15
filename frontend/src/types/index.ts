import { SVGProps } from "react";

import { DynamicField } from "@/components/AddItem/Forms/DynamicForm";
import { Type } from "@/components/AddItem/AddItemModal";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type DecryptedItem = {
  id: string;
  userId: string;
  item: DynamicField[];
  type: Type;
};

export type LoginType = {
  username: string;
  password: string;
  url?: string;
};

export type CardType = {
  cardNumber: string;
  cardHolderName: string;
  cardExpiryDate: string;
  cardCVV: string;
};

export type SSHKeyType = {
  publicKey: string;
  privateKey: string;
  passphrase: string;
};
