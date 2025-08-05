import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://2uyvouk6bk.execute-api.eu-central-1.amazonaws.com/prod",
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("idToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  },
);

export default apiClient;
