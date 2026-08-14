/**
 * Standardised API response helpers.
 * Every endpoint returns the shape: { success, data, error, timestamp }
 */

export interface ApiError {
  code: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: ApiError | null;
  timestamp: string;
}

/**
 * Build a successful response envelope.
 */
export function success<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
    error: null,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Build an error response envelope.
 * @param code   Machine-readable error code (e.g. "NOT_FOUND", "UNAUTHORIZED")
 * @param message Human-readable error message safe to surface to clients
 */
export function error(code: string, message: string): ApiResponse<null> {
  return {
    success: false,
    data: null,
    error: { code, message },
    timestamp: new Date().toISOString(),
  };
}
