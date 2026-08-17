/**
 * Typed Axios API client.
 *
 * Features:
 *  - Bearer token from Expo SecureStore via auth store
 *  - 30s default timeout
 *  - 429 Retry-After backoff
 *  - All responses conform to { success, data, error: { code, message }, timestamp }
 *
 * [Req 37]
 */

import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

// ---------------------------------------------------------------------------
// API response envelope type
// ---------------------------------------------------------------------------

export interface ApiSuccess<T> {
  success: true;
  data: T;
  timestamp: string;
}

export interface ApiError {
  success: false;
  data: null;
  error: {
    code: string;
    message: string;
  };
  timestamp: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ---------------------------------------------------------------------------
// Error code → user message map
// ---------------------------------------------------------------------------

const ERROR_MESSAGES: Record<string, string> = {
  NOT_FOUND: 'The requested content was not found.',
  UNAUTHORIZED: 'Please sign in to continue.',
  FORBIDDEN: 'You don\'t have permission to do that.',
  RATE_LIMITED: 'Too many requests. Please try again shortly.',
  SERVER_ERROR: 'Something went wrong on our end. Please try again.',
  NETWORK_ERROR: 'No connection. Check your internet and try again.',
};

export function getErrorMessage(code: string): string {
  return ERROR_MESSAGES[code] ?? 'An unexpected error occurred.';
}

// ---------------------------------------------------------------------------
// Token provider — injected to break circular dependency with auth store
// ---------------------------------------------------------------------------

let _tokenProvider: (() => Promise<string | null>) | null = null;

export function setTokenProvider(fn: () => Promise<string | null>): void {
  _tokenProvider = fn;
}

// ---------------------------------------------------------------------------
// Axios instance factory
// ---------------------------------------------------------------------------

const BASE_URL = process.env.EXPO_PUBLIC_MONGODB_API_URL ?? 'http://localhost:3000/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ── Request interceptor: attach Bearer token ─────────────────────────────

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (_tokenProvider) {
      const token = await _tokenProvider();
      if (token) {
        config.headers = config.headers ?? {};
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response interceptor: Retry-After on 429 ────────────────────────────

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const status = error?.response?.status;

    if (status === 429) {
      const retryAfter = Number(error.response?.headers?.['retry-after'] ?? 5);
      await sleep(retryAfter * 1000);
      // Retry the original request once
      return apiClient.request(error.config as AxiosRequestConfig);
    }

    return Promise.reject(error);
  },
);

// ---------------------------------------------------------------------------
// Typed request helpers
// ---------------------------------------------------------------------------

export async function apiGet<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const res = await apiClient.get<ApiResponse<T>>(url, { params });
  return unwrap(res.data);
}

export async function apiPost<T>(url: string, data?: unknown): Promise<T> {
  const res = await apiClient.post<ApiResponse<T>>(url, data);
  return unwrap(res.data);
}

export async function apiDelete<T>(url: string): Promise<T> {
  const res = await apiClient.delete<ApiResponse<T>>(url);
  return unwrap(res.data);
}

export const api = {
  get: apiGet,
  post: apiPost,
  delete: apiDelete,
};

function unwrap<T>(response: ApiResponse<T>): T {
  if (response.success) {
    return response.data;
  }
  throw new ApiClientError(response.error.code, response.error.message);
}

// ---------------------------------------------------------------------------
// Custom error class
// ---------------------------------------------------------------------------

export class ApiClientError extends Error {
  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
