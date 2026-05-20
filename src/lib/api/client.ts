import axios from "axios";
import Cookies from "js-cookie";

const TOKEN_KEY = "sf_token";

export const getToken = () => Cookies.get(TOKEN_KEY);
export const setToken = (token: string) =>
  Cookies.set(TOKEN_KEY, token, { secure: true, sameSite: "strict" });
export const clearToken = () => Cookies.remove(TOKEN_KEY);

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1",
  headers: { "Content-Type": "application/json" },
});

client.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      clearToken();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default client;
