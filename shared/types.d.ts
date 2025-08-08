export type VaultItemType = {
    id: string;
    userId: string;
    name: string;
    url?: string;
    type: "password" | "creditcard" | "token" | "note";
    encryptedData: string;
};
