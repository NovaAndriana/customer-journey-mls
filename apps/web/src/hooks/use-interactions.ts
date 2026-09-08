'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, unwrap, unwrapPaginated } from '@/lib/api-client';
import type { Interaction, InteractionResult, InteractionType } from '@/types/api';

interface CreateInteractionPayload {
  userId: string;
  type: InteractionType;
  result?: InteractionResult;
  notes: string;
  followUpDate?: string;
}

export function useCustomerInteractions(customerId: string | undefined) {
  return useQuery({
    queryKey: ['interactions', customerId],
    queryFn: () =>
      unwrapPaginated<Interaction>(
        apiClient.get(`/customers/${customerId}/interactions`, { params: { limit: 50 } }),
      ),
    enabled: !!customerId,
  });
}

export function useCreateInteraction(customerId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateInteractionPayload) =>
      unwrap<Interaction>(apiClient.post(`/customers/${customerId}/interactions`, payload)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interactions', customerId] });
      queryClient.invalidateQueries({ queryKey: ['customers', customerId] });
    },
  });
}

export function useFollowUps(salespersonId?: string) {
  return useQuery({
    queryKey: ['follow-ups', salespersonId],
    queryFn: () =>
      unwrap<Interaction[]>(apiClient.get('/interactions/follow-ups', { params: { salespersonId } })),
  });
}