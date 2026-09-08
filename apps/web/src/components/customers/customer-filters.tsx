'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { STAGE_CONFIG, PIPELINE_STAGES } from '@/lib/stage-config';
import { useUsers } from '@/hooks/use-users';
import type { CustomerFilters as Filters } from '@/hooks/use-customers';
import type { CustomerSource } from '@/types/api';

const SOURCE_OPTIONS: { value: CustomerSource; label: string }[] = [
  { value: 'WALK_IN', label: 'Walk In' },
  { value: 'REFERRAL', label: 'Referral' },
  { value: 'SOCIAL_MEDIA', label: 'Social Media' },
  { value: 'WEBSITE', label: 'Website' },
  { value: 'OTHER', label: 'Lainnya' },
];

const ALL_STAGES = [...PIPELINE_STAGES, 'REJECTED'] as const;

export function CustomerFiltersBar({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (filters: Filters) => void;
}) {
  const { data: users } = useUsers();
  const salespersons = users?.filter((u) => u.role === 'SALES') ?? [];

  const hasActiveFilters = !!(filters.stage || filters.source || filters.salespersonId || filters.search);

  function update(patch: Partial<Filters>) {
    onChange({ ...filters, ...patch, page: 1 });
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2 flex-wrap">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari nama, HP, atau email..."
          className="pl-8"
          value={filters.search ?? ''}
          onChange={(e) => update({ search: e.target.value || undefined })}
        />
      </div>

      <Select
        value={filters.stage ?? 'ALL'}
        onValueChange={(value) => update({ stage: value === 'ALL' ? undefined : (value as Filters['stage']) })}
      >
        <SelectTrigger className="w-full sm:w-[160px]">
          <SelectValue placeholder="Semua Stage" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Semua Stage</SelectItem>
          {ALL_STAGES.map((stage) => (
            <SelectItem key={stage} value={stage}>
              {STAGE_CONFIG[stage].label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.source ?? 'ALL'}
        onValueChange={(value) => update({ source: value === 'ALL' ? undefined : (value as CustomerSource) })}
      >
        <SelectTrigger className="w-full sm:w-[160px]">
          <SelectValue placeholder="Semua Sumber" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Semua Sumber</SelectItem>
          {SOURCE_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

            <Select
        value={filters.salespersonId ?? 'ALL'}
        onValueChange={(value) =>
          update({ salespersonId: value && value !== 'ALL' ? value : undefined })
        }
      >
        <SelectTrigger className="w-full sm:w-[160px]">
          <SelectValue placeholder="Semua Sales" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Semua Sales</SelectItem>
          {salespersons.map((u) => (
            <SelectItem key={u.id} value={u.id}>
              {u.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange({ page: 1, limit: filters.limit })}
          className="text-muted-foreground"
        >
          <X className="h-4 w-4 mr-1" />
          Reset
        </Button>
      )}
    </div>
  );
}