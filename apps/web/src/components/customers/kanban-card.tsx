'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { MoreVertical, Phone, Bike, MessageSquarePlus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useChangeStage } from '@/hooks/use-customers';
import { extractErrorMessage } from '@/lib/api-client';
import { STAGE_CONFIG, VALID_TRANSITIONS } from '@/lib/stage-config';
import { formatDate } from '@/lib/format';
import { LogInteractionDialog } from './log-interaction-dialog';
import { CloseDealDialog } from './close-deal-dialog';
import type { Customer } from '@/types/api';

export function KanbanCard({ customer }: { customer: Customer }) {
  const [logOpen, setLogOpen] = useState(false);
  const [dealOpen, setDealOpen] = useState(false);
  const changeStage = useChangeStage();

  const nextStages = VALID_TRANSITIONS[customer.stage].filter((s) => s !== 'DEAL');
  const canDeal = VALID_TRANSITIONS[customer.stage].includes('DEAL');

  async function handleMove(toStage: (typeof nextStages)[number]) {
    try {
      await changeStage.mutateAsync({ id: customer.id, toStage, changedById: customer.salespersonId });
      toast.success(`${customer.name} dipindah ke ${STAGE_CONFIG[toStage].label}`);
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  }

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-3 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <Link href={`/customers/${customer.id}`} className="min-w-0 flex-1">
              <p className="font-medium text-sm truncate hover:underline">{customer.name}</p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <Phone className="h-3 w-3" />
                {customer.phone}
              </p>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger
                    render={
                        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                        <MoreVertical className="h-4 w-4" />
                        </Button>
                    }
                />
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLogOpen(true)}>
                  <MessageSquarePlus className="h-4 w-4 mr-2" />
                  Log Interaksi
                </DropdownMenuItem>
                {(nextStages.length > 0 || canDeal) && <DropdownMenuSeparator />}
                {canDeal && (
                  <DropdownMenuItem onClick={() => setDealOpen(true)} className="text-emerald-600 font-medium">
                    Tutup Deal 🎉
                  </DropdownMenuItem>
                )}
                {nextStages.map((stage) => (
                  <DropdownMenuItem key={stage} onClick={() => handleMove(stage)}>
                    Pindah ke {STAGE_CONFIG[stage].label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {customer.interestedMotor && (
            <Badge variant="outline" className="text-xs font-normal gap-1">
              <Bike className="h-3 w-3" />
              {customer.interestedMotor.name}
            </Badge>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t">
            <span>{customer.salesperson?.name}</span>
            <span>{formatDate(customer.updatedAt)}</span>
          </div>
        </CardContent>
      </Card>

      <LogInteractionDialog
        customerId={customer.id}
        customerName={customer.name}
        open={logOpen}
        onOpenChange={setLogOpen}
      />
      <CloseDealDialog customer={customer} open={dealOpen} onOpenChange={setDealOpen} />
    </>
  );
}