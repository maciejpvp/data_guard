import { SVGProps } from "react";

import { DynamicField } from "@/components/AddItem/Forms/DynamicForm";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type DecryptedItem = {
  id: string;
  userId: string;
  item: DynamicField[];
};
