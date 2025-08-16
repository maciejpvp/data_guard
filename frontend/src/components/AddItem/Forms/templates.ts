import { DynamicField } from "./DynamicForm";

// Common base fields for all templates
const baseFields: DynamicField[] = [
  { key: "name", label: "Item Name", type: "text", isRequired: true },
];

// Helper to create templates with base fields + custom fields
const createTemplate = (fields: DynamicField[]): DynamicField[] => [
  ...baseFields,
  ...fields,
];

// Templates
const password: DynamicField[] = createTemplate([
  { key: "username", label: "Username", type: "text", isRequired: true },
  { key: "password", label: "Password", type: "password", isRequired: true },
  { key: "url", label: "Website", type: "url" },
  { key: "note", label: "Note", type: "textarea" },
]);

const note: DynamicField[] = createTemplate([
  { key: "note", label: "Note", type: "textarea", isRequired: true },
]);

const sshkey: DynamicField[] = createTemplate([
  { key: "username", label: "Username", type: "text" },
  {
    key: "privateKey",
    label: "Private Key",
    type: "textarea",
    isRequired: true,
  },
  { key: "publicKey", label: "Public Key", type: "textarea" },
  { key: "passphrase", label: "Passphrase", type: "password" },
  { key: "note", label: "Note", type: "textarea" },
]);

const card: DynamicField[] = createTemplate([
  {
    key: "cardNumber",
    label: "Card Number",
    type: "password",
    isRequired: true,
  },
  {
    key: "cardholderName",
    label: "Cardholder Name",
    type: "text",
    isRequired: true,
  },
  { key: "expiryDate", label: "Expiry Date", type: "month", isRequired: true },
  { key: "cvv", label: "CVV", type: "password", isRequired: true },
  { key: "note", label: "Note", type: "textarea" },
]);

const apikey: DynamicField[] = createTemplate([
  { key: "service", label: "Service Name", type: "text" },
  { key: "apiKey", label: "API Key", type: "password", isRequired: true },
  { key: "url", label: "API URL", type: "url" },
  { key: "note", label: "Note", type: "textarea" },
]);

export const templates = {
  password,
  note,
  sshkey,
  apikey,
  card,
};
