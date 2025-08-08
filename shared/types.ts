export type VaultItemType = {
  id: string;
  userId: string;
  name: string;
  url?: string;
  type: "password" | "card" | "SSH Key" | "API Key" | "note";
  secret: string;
  favourite: boolean;
};
