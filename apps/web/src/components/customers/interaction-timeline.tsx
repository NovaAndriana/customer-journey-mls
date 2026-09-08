'use client';

import { Phone, MessageCircle, Mail, Users, Presentation, CalendarClock, StickyNote } from 'lucide-react';
import { formatDateTime } from '@/lib/format';
import type { Interaction, InteractionType } from '@/types/api';

const TYPE_ICON: Record<InteractionType, React.ComponentType<{ className?: string }>> = {
  CALL: Phone,
  WHATSAPP: MessageCircle,
  EMAIL: Mail,
  MEETING: Users,
  PRESENTATION: Presentation,
  FOLLOW_UP: CalendarClock,
  NOTE: StickyNote,
};

const RESULT_COLOR: Record<string, string> = {
  POSITIVE: 'text-emerald-600',
  NEUTRAL: 'text-slate-500',
  NEGATIVE: 'text-red-600',
  NO_RESPONSE: 'text-amber-600',
};

export function InteractionTimeline({ interactions }: { interactions: Interaction[] }) {
  if (interactions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">Belum ada interaksi tercatat</p>
    );
  }

  return (
    <div className="space-y-4">
      {interactions.map((interaction) => {
        const Icon = TYPE_ICON[interaction.type];
        return (
          <div key={interaction.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 w-px bg-border mt-1" />
            </div>
            <div className="pb-4 flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <p className="text-sm font-medium">
                  {interaction.type.replace('_', ' ')}
                  {interaction.result && (
                    <span className={`ml-2 text-xs font-normal ${RESULT_COLOR[interaction.result]}`}>
                      ({interaction.result.replace('_', ' ')})
                    </span>
                  )}
                </p>
                <span className="text-xs text-muted-foreground shrink-0">
                  {formatDateTime(interaction.createdAt)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{interaction.notes}</p>
              <p className="text-xs text-muted-foreground mt-1">oleh {interaction.user?.name}</p>
              {interaction.followUpDate && (
                <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                  <CalendarClock className="h-3 w-3" />
                  Follow up dijadwalkan: {formatDateTime(interaction.followUpDate)}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}