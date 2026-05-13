import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { getToken, removeToken } from "./cookies";

// Create instance
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

let fpPromise: Promise<string> | null = null;

const getFingerprint = async () => {
  if (!fpPromise) {
    fpPromise = FingerprintJS.load()
      .then((fp) => fp.get())
      .then((result) => result.visitorId);
  }
  return fpPromise;
};



apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
     const token = getToken();

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      const deviceId = await getFingerprint();
      config.headers["deviceuniqueid"] = deviceId;
      config.headers["devicemodel"] = navigator.userAgent;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ⚠️ Handle global errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    const status = error.response?.status;

    if (status === 401) {
      console.error("Unauthorized - redirect to login");

      if (typeof window !== "undefined") {
        removeToken();
        // window.location.href = "/";
      }
    }

    if (status === 500) {
      console.error("Server error");
    }
    return Promise.reject(error);
  }
);