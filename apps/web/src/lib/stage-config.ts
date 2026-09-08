import type { CustomerStage } from '@/types/api';

export const STAGE_CONFIG: Record<CustomerStage, { label: string; color: string }> = {
  NEW: { label: 'New', color: 'bg-slate-100 text-slate-700 border-slate-300' },
  CONTACTED: { label: 'Contacted', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  FOLLOWED_UP: { label: 'Followed Up', color: 'bg-amber-100 text-amber-700 border-amber-300' },
  PRESENTED: { label: 'Presented', color: 'bg-purple-100 text-purple-700 border-purple-300' },
  DEAL: { label: 'Deal', color: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
  REJECTED: { label: 'Rejected', color: 'bg-red-100 text-red-700 border-red-300' },
};

export const PIPELINE_STAGES: CustomerStage[] = [
  'NEW',
  'CONTACTED',
  'FOLLOWED_UP',
  'PRESENTED',
  'DEAL',
];

// Mirror dari VALID_TRANSITIONS di backend (customers.service.ts) — dipakai untuk
// menampilkan opsi aksi yang relevan saja di UI. Validasi final tetap di backend.
export const VALID_TRANSITIONS: Record<CustomerStage, CustomerStage[]> = {
  NEW: ['CONTACTED', 'REJECTED'],
  CONTACTED: ['FOLLOWED_UP', 'PRESENTED', 'REJECTED'],
  FOLLOWED_UP: ['PRESENTED', 'CONTACTED', 'REJECTED'],
  PRESENTED: ['DEAL', 'FOLLOWED_UP', 'REJECTED'],
  DEAL: [],
  REJECTED: [],
};