import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import type { StandardResponse } from '@/types/api';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor Request: Otomatis tempelkan Bearer Token dari Cookie
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor Response: Handle 401 Unauthorized (Auto Logout)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        Cookies.remove('token');
        Cookies.remove('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export interface ApiErrorPayload {
  message: string | string[];
  errors?: { field: string; constraints: string[] }[];
}

export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorPayload>;
    const payload = axiosError.response?.data;
    if (payload?.errors?.length) {
      return payload.errors.map((e) => e.constraints.join(', ')).join(' | ');
    }
    if (payload?.message) {
      return Array.isArray(payload.message) ? payload.message.join(', ') : payload.message;
    }
    return axiosError.message;
  }
  if (error instanceof Error) return error.message;
  return 'Terjadi kesalahan yang tidak diketahui';
}

export async function unwrap<T>(promise: Promise<{ data: StandardResponse<T> }>): Promise<T> {
  const response = await promise;
  return response.data.data;
}

export async function unwrapPaginated<T>(
  promise: Promise<{ data: StandardResponse<T[]> }>,
): Promise<{ items: T[]; meta: StandardResponse<T[]>['meta'] }> {
  const response = await promise;
  return { items: response.data.data, meta: response.data.meta };
}