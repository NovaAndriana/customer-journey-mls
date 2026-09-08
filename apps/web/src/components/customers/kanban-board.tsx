'use client';

import { useCustomers } from '@/hooks/use-customers';
import { STAGE_CONFIG, PIPELINE_STAGES } from '@/lib/stage-config';
import { KanbanCard } from './kanban-card';
import { Skeleton } from '@/components/ui/skeleton';
import type { CustomerStage } from '@/types/api';

export function KanbanBoard() {
  const { data, isLoading } = useCustomers({ limit: 100 });
  const customers = data?.items ?? [];

  const columns: CustomerStage[] = [...PIPELINE_STAGES, 'REJECTED'];

  return (
    <div className="flex gap-4 h-full overflow-x-auto pb-2">
      {columns.map((stage) => {
        const stageCustomers = customers.filter((c) => c.stage === stage);
        const config = STAGE_CONFIG[stage];

        return (
          <div key={stage} className="flex flex-col w-72 shrink-0 h-full">
            <div className={`rounded-t-md border px-3 py-2 flex items-center justify-between ${config.color}`}>
              <span className="text-sm font-semibold">{config.label}</span>
              <span className="text-xs font-medium bg-white/60 rounded-full px-2 py-0.5">
                {stageCustomers.length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto border border-t-0 rounded-b-md bg-muted/20 p-2 space-y-2 min-h-[200px]">
              {isLoading && (
                <>
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </>
              )}

              {!isLoading && stageCustomers.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-6">Tidak ada customer</p>
              )}

              {stageCustomers.map((customer) => (
                <KanbanCard key={customer.id} customer={customer} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}