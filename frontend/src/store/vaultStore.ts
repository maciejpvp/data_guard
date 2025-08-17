import { create } from "zustand";

import { Type } from "@/components/AddItem/AddItemModal";

type QuantityMapType = Map<Type, number> | undefined;

type VaultState = {
  quantityMap: QuantityMapType;
  setQuantityMap: (newVal: QuantityMapType) => void;
};

export const useVaultStore = create<VaultState>((set) => ({
  quantityMap: undefined,
  setQuantityMap: (newVal) => set({ quantityMap: newVal }),
}));
