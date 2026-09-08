'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, unwrap, unwrapPaginated } from '@/lib/api-client';
import type { Customer, CustomerSource, CustomerStage } from '@/types/api';

export interface CustomerFilters {
  page?: number;
  limit?: number;
  stage?: CustomerStage;
  source?: CustomerSource;
  salespersonId?: string;
  search?: string;
}

interface CreateCustomerPayload {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  source: CustomerSource;
  interestedMotorId?: string;
  salespersonId: string;
}

export function useCustomers(filters: CustomerFilters) {
  return useQuery({
    queryKey: ['customers', filters],
    queryFn: () => unwrapPaginated<Customer>(apiClient.get('/customers', { params: filters })),
  });
}

export function useCustomer(id: string | undefined) {
  return useQuery({
    queryKey: ['customers', id],
    queryFn: () => unwrap<Customer>(apiClient.get(`/customers/${id}`)),
    enabled: !!id,
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCustomerPayload) =>
      unwrap<Customer>(apiClient.post('/customers', payload)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}

export function useChangeStage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      toStage,
      changedById,
      notes,
    }: {
      id: string;
      toStage: CustomerStage;
      changedById: string;
      notes?: string;
    }) =>
      unwrap<Customer>(apiClient.patch(`/customers/${id}/stage`, { toStage, changedById, notes })),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customers', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}

export function useCloseDeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      finalPrice,
      unitSold,
      salespersonId,
      notes,
    }: {
      id: string;
      finalPrice: number;
      unitSold?: number;
      salespersonId: string;
      notes?: string;
    }) =>
      unwrap<{ customer: Customer }>(
        apiClient.post(`/customers/${id}/deal`, { finalPrice, unitSold, salespersonId, notes }),
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customers', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      queryClient.invalidateQueries({ queryKey: ['motor-models'] });
    },
  });
}