import axios from "axios";
import { STORAGE } from "../constants";
import { getLocalStorage } from "./storage";
const BASE_URL = "https://api.chshealthcare.in/";
//  baseURL: "http://localhost:5000/",

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getLocalStorage(STORAGE.USER_KEY);
    if (token?.accessToken) {
      config.headers.Authorization = `Bearer ${token?.accessToken}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);
