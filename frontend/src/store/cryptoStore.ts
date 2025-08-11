import { create } from "zustand";

import { checkKey, getKeyFromMaster } from "@/utils/crypto";

type CryptoState = {
  key: CryptoKey | undefined;
  setKey: (masterKey: string, testValue?: string) => Promise<boolean>;
};

export const useCryptoStore = create<CryptoState>((set) => ({
  key: undefined,
  setKey: async (masterKey, testValue = undefined) => {
    const key = await getKeyFromMaster(masterKey);

    if (!testValue) {
      set({ key });

      return true;
    }

    const test = await checkKey(key, testValue);

    // Wrong Master Key
    if (!test) return false;

    set({ key });

    return true;
  },
}));
