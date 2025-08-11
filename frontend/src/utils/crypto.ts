import { VaultItemType } from "../../../shared/types";

import { useCryptoStore } from "@/store/cryptoStore";
import { DynamicField } from "@/components/AddItem/Forms/DynamicForm";

const ENCRYPTION_ALGO = "AES-GCM";
const KEY_LENGTH = 256;
const IV_LENGTH = 12;

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes.buffer;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";

  bytes.forEach((b) => (binary += String.fromCharCode(b)));

  return btoa(binary);
}

export async function getKeyFromMaster(masterKey: string): Promise<CryptoKey> {
  const enc = new TextEncoder().encode(masterKey);
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc,
    { name: "PBKDF2" },
    false,
    ["deriveKey"],
  );

  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: new TextEncoder().encode("your-salt"),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: ENCRYPTION_ALGO, length: KEY_LENGTH },
    false,
    ["encrypt", "decrypt"],
  );

  return key;
}

export async function encryptData(
  plainText: string,
  key: CryptoKey = useCryptoStore.getState().key as CryptoKey,
): Promise<string> {
  if (!key) return "Invalid Key";

  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const encoded = new TextEncoder().encode(plainText);

  const cipherBuffer = await crypto.subtle.encrypt(
    {
      name: ENCRYPTION_ALGO,
      iv,
    },
    key,
    encoded,
  );

  const ivBase64 = arrayBufferToBase64(iv.buffer);
  const cipherBase64 = arrayBufferToBase64(cipherBuffer);

  return `${ivBase64}:${cipherBase64}`;
}

export async function decryptData(
  cipherText: string,
  key: CryptoKey = useCryptoStore.getState().key as CryptoKey,
): Promise<string> {
  if (!key) return "Invalid Key";

  const [ivBase64, cipherBase64] = cipherText.split(":");
  const iv = new Uint8Array(base64ToArrayBuffer(ivBase64));
  const cipherBuffer = base64ToArrayBuffer(cipherBase64);

  const decryptedBuffer = await crypto.subtle.decrypt(
    {
      name: ENCRYPTION_ALGO,
      iv,
    },
    key,
    cipherBuffer,
  );

  return new TextDecoder().decode(decryptedBuffer);
}

export const decryptList = async (list: VaultItemType[]) => {
  const decryptedList = await Promise.all(
    list.map(async (item) => {
      const decryptedItem: DynamicField[] = JSON.parse(
        await decryptData(item.secret),
      );

      return decryptedItem;
    }),
  );

  return decryptedList;
};

export const checkKey = async (key: CryptoKey, test: string) => {
  try {
    const decrypted = await decryptData(test, key);

    if (decrypted !== "Valid") throw new Error();
  } catch {
    return false;
  }

  return true;
};
