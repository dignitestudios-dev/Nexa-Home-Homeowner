import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { getToken, removeToken } from "./cookies";
import { showError } from "@/components/ui/error-dialog";

// Create instance
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'ngrok-skip-browser-warning': 'true',
  },
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
  (response) => {
    // If backend returns success: false, trigger error dialog
    if (response.data && response.data.success === false) {
      const message = response.data.message || "An error occurred";
      showError(message);
    }
    return response;
  },
  (error: AxiosError<any>) => {
    const status = error.response?.status;
    const responseData = error.response?.data as any;

    // Extract message from response data if available
    const message = responseData?.message || error.message || "An error occurred";

    if (status === 401) {
      console.error("Unauthorized - redirect to login");

      if (typeof window !== "undefined") {
        removeToken();
        window.location.href = "/";
      }
    } else {
      // Trigger error dialog for non-401 HTTP errors
      showError(message);
    }

    return Promise.reject(error);
  }
);