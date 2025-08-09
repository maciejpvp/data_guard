import { DynamicField } from "./DynamicForm";

const password: DynamicField[] = [
  { key: "name", label: "Item Name", type: "text", isRequired: true },
  {
    key: "username",
    label: "Username",
    type: "text",
    isRequired: true,
  },
  { key: "password", label: "Password", type: "password", isRequired: true },
  { key: "url", label: "Website", type: "url" },
  {
    key: "note",
    label: "Note",
    type: "textarea",
  },
];

const note: DynamicField[] = [
  { key: "name", label: "Item Name", type: "text", isRequired: true },
  {
    key: "username",
    label: "Username",
    type: "text",
    isRequired: true,
  },
  { key: "password", label: "Password", type: "password", isRequired: true },
  { key: "url", label: "Website", type: "url" },
  {
    key: "note",
    label: "Note",
    type: "textarea",
  },
];

const sshkey: DynamicField[] = [
  { key: "name", label: "Item Name", type: "text", isRequired: true },
  {
    key: "username",
    label: "Username",
    type: "text",
    isRequired: true,
  },
  { key: "password", label: "Password", type: "password", isRequired: true },
  { key: "url", label: "Website", type: "url" },
  {
    key: "note",
    label: "Note",
    type: "textarea",
  },
];

const card: DynamicField[] = [
  { key: "name", label: "Item Name", type: "text", isRequired: true },
  {
    key: "username",
    label: "Username",
    type: "text",
    isRequired: true,
  },
  { key: "password", label: "Password", type: "password", isRequired: true },
  { key: "url", label: "Website", type: "url" },
  {
    key: "note",
    label: "Note",
    type: "textarea",
  },
];

const apikey: DynamicField[] = [
  { key: "name", label: "Item Name", type: "text", isRequired: true },
  {
    key: "username",
    label: "Username",
    type: "text",
    isRequired: true,
  },
  { key: "password", label: "Password", type: "password", isRequired: true },
  { key: "url", label: "Website", type: "url" },
  {
    key: "note",
    label: "Note",
    type: "textarea",
  },
];

export const templates = {
  password,
  note,
  sshkey,
  apikey,
  card,
};
