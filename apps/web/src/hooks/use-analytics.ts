'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient, unwrap } from '@/lib/api-client';
import type { AnalyticsSummary, CustomerStage } from '@/types/api';

export function useAnalyticsSummary() {
  return useQuery({
    queryKey: ['analytics', 'summary'],
    queryFn: () => unwrap<AnalyticsSummary>(apiClient.get('/analytics/summary')),
  });
}

export interface PipelineStageCount {
  stage: CustomerStage;
  count: number;
}

export function usePipeline() {
  return useQuery({
    queryKey: ['analytics', 'pipeline'],
    queryFn: () => unwrap<PipelineStageCount[]>(apiClient.get('/analytics/pipeline')),
  });
}