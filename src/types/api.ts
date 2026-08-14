/**
 * API response shape types.
 * [Req 37]
 */

export interface ApiError {
  code: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: ApiError;
  timestamp: string;
}

export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  cursor?: string;
  hasMore: boolean;
  total: number;
}
