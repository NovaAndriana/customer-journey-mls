'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient, unwrap } from '@/lib/api-client';
import type { User } from '@/types/api';

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => unwrap<User[]>(apiClient.get('/users')),
  });
}