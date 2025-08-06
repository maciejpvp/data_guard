import axios from "axios";

import { useAuthStore } from "@/store/authStore";

declare module "axios" {
  export interface AxiosRequestConfig {
    skipAuth?: boolean;
  }
}

const apiClient = axios.create({
  baseURL: "https://2uyvouk6bk.execute-api.eu-central-1.amazonaws.com/prod",
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const idToken = useAuthStore.getState().idToken;

  if (config.skipAuth) {
    return config;
  }

  if (!idToken) {
    return Promise.reject(new axios.Cancel("Request aborted: No token"));
  }

  config.headers.Authorization = `${idToken}`;

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  },
);

export default apiClient;
