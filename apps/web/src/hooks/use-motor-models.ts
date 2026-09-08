'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, unwrap, unwrapPaginated } from '@/lib/api-client';
import type { MotorModel } from '@/types/api';

interface MotorModelPayload {
  name: string;
  price: number;
  stockQty: number;
  imageUrl?: string;
}

export function useMotorModels(params?: { page?: number; limit?: number; search?: string }) {
  return useQuery({
    queryKey: ['motor-models', params],
    queryFn: () =>
      unwrapPaginated<MotorModel>(
        apiClient.get('/motor-models', { params: { limit: 100, ...params } }),
      ),
  });
}

export function useCreateMotorModel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: MotorModelPayload) =>
      unwrap<MotorModel>(apiClient.post('/motor-models', payload)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['motor-models'] }),
  });
}

export function useUpdateMotorModel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<MotorModelPayload> }) =>
      unwrap<MotorModel>(apiClient.patch(`/motor-models/${id}`, payload)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['motor-models'] }),
  });
}

export function useDeleteMotorModel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/motor-models/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['motor-models'] }),
  });
}