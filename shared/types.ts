export type BodyType = {
  name: string;
  url: string;
  type: "password" | "creditcard" | "token" | "note";
  password: string;
};
