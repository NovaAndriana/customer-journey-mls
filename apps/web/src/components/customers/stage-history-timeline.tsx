'use client';

import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { STAGE_CONFIG } from '@/lib/stage-config';
import { formatDateTime } from '@/lib/format';
import type { StageHistoryEntry } from '@/types/api';

export function StageHistoryTimeline({ history }: { history: StageHistoryEntry[] }) {
  if (history.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        Belum ada perpindahan stage tercatat
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {history.map((entry) => (
        <div key={entry.id} className="flex items-center justify-between gap-2 border-b pb-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className={STAGE_CONFIG[entry.fromStage].color}>
              {STAGE_CONFIG[entry.fromStage].label}
            </Badge>
            <ArrowRight className="h-3 w-3 text-muted-foreground" />
            <Badge variant="outline" className={STAGE_CONFIG[entry.toStage].color}>
              {STAGE_CONFIG[entry.toStage].label}
            </Badge>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">{formatDateTime(entry.changedAt)}</p>
            <p className="text-xs text-muted-foreground">oleh {entry.changedBy?.name}</p>
          </div>
        </div>
      ))}
    </div>
  );
}