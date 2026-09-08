import axios, { AxiosError } from 'axios';
import type { StandardResponse } from '@/types/api';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

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