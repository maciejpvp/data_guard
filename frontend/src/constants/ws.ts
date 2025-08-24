import { useAuthStore } from "@/store/authStore";

export const websocketUrl = () => {
  const token = useAuthStore.getState().idToken;

  return `wss://lwtvfnjnkd.execute-api.eu-central-1.amazonaws.com/test/?Authorization=${token}`;
};
