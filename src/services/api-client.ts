import axios from "axios";
import type { ApiResponse } from "@/lib/api/types";

/**
 * Pre-configured axios instance for all client-side API calls.
 * - Base URL defaults to current origin
 * - Includes credentials (cookies for auth)
 * - Interceptors for standard error handling
 */
const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

/**
 * Response interceptor — unwraps the ApiResponse envelope.
 * On error, extracts the standard error message.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response) {
      const body = error.response.data as ApiResponse;
      const message =
        body?.error?.message ?? error.response.statusText ?? "Request failed.";

      // Create a richer error object
      const apiError = new Error(message) as Error & {
        code?: string;
        status?: number;
        details?: Record<string, string[]>;
      };
      apiError.code = body?.error?.code;
      apiError.status = error.response.status;
      apiError.details = body?.error?.details;

      return Promise.reject(apiError);
    }
    return Promise.reject(error);
  },
);

export default api;
