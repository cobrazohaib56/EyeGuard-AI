import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Token ${token}`,
    };
  }
  return config;
});

export interface ApiPaginationResult<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export { apiClient };

