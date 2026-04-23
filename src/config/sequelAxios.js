import axios from "axios";
import { env } from "./env.js";

const timeout =
  env.SEQUEL_API_TIMEOUT_MS != null
    ? Number(env.SEQUEL_API_TIMEOUT_MS)
    : 20000;

const sequelAxios = axios.create({
  baseURL: env.SEQUEL_API_BASE_URL,
  timeout: Number.isFinite(timeout) ? timeout : 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

sequelAxios.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const response = error?.response;
    const details = response?.data;
    const message =
      details?.message ||
      error?.message ||
      "Sequel247 API request failed";
    const err = new Error(message);
    err.status = response?.status;
    err.details = details;
    return error
  },
);

export default sequelAxios;

