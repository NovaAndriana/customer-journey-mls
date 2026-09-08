'use client';

import { use, useState } from 'react';
import { notFound } from 'next/navigation';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Phone, Mail, MapPin, Bike, MessageSquarePlus } from 'lucide-react';
import { useCustomer } from '@/hooks/use-customers';
import { STAGE_CONFIG, VALID_TRANSITIONS } from '@/lib/stage-config';
import { formatCurrency, formatDate } from '@/lib/format';
import { InteractionTimeline } from '@/components/customers/interaction-timeline';
import { StageHistoryTimeline } from '@/components/customers/stage-history-timeline';
import { LogInteractionDialog } from '@/components/customers/log-interaction-dialog';
import { CloseDealDialog } from '@/components/customers/close-deal-dialog';

const SOURCE_LABEL: Record<string, string> = {
  WALK_IN: 'Walk In',
  REFERRAL: 'Referral',
  SOCIAL_MEDIA: 'Social Media',
  WEBSITE: 'Website',
  OTHER: 'Lainnya',
};

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: customer, isLoading, isError } = useCustomer(id);
  const [logOpen, setLogOpen] = useState(false);
  const [dealOpen, setDealOpen] = useState(false);

  if (isError) notFound();

  if (isLoading || !customer) {
    return (
      <DashboardShell>
        <Header title="Detail Customer" />
        <main className="flex-1 overflow-y-auto p-6 space-y-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-64 w-full" />
        </main>
      </DashboardShell>
    );
  }

  const canDeal = VALID_TRANSITIONS[customer.stage].includes('DEAL');

  return (
    <DashboardShell>
      <Header
        title={customer.name}
        description={`Stage saat ini: ${STAGE_CONFIG[customer.stage].label}`}
        actions={
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => setLogOpen(true)}>
              <MessageSquarePlus className="h-4 w-4 mr-1" />
              Log Interaksi
            </Button>
            {canDeal && (
              <Button size="sm" onClick={() => setDealOpen(true)}>
                Tutup Deal 🎉
              </Button>
            )}
          </div>
        }
      />

      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between flex-wrap gap-2">
            <div>
              <CardTitle className="text-xl">{customer.name}</CardTitle>
              <Badge variant="outline" className={`${STAGE_CONFIG[customer.stage].color} mt-2`}>
                {STAGE_CONFIG[customer.stage].label}
              </Badge>
            </div>
            {customer.deal && (
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Deal Ditutup</p>
                <p className="font-semibold text-emerald-600">{formatCurrency(customer.deal.finalPrice)}</p>
                <p className="text-xs text-muted-foreground">{formatDate(customer.deal.dealDate)}</p>
              </div>
            )}
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
              <span>{customer.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="truncate">{customer.email ?? '-'}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="truncate">{customer.address ?? '-'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Bike className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="truncate">{customer.interestedMotor?.name ?? '-'}</span>
            </div>
            <div className="text-muted-foreground">
              Sumber: <span className="text-foreground">{SOURCE_LABEL[customer.source]}</span>
            </div>
            <div className="text-muted-foreground">
              Salesperson: <span className="text-foreground">{customer.salesperson?.name}</span>
            </div>
            <div className="text-muted-foreground">
              Dibuat: <span className="text-foreground">{formatDate(customer.createdAt)}</span>
            </div>
            <div className="text-muted-foreground">
              Update terakhir: <span className="text-foreground">{formatDate(customer.updatedAt)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Tabs defaultValue="interactions">
              <TabsList>
                <TabsTrigger value="interactions">Riwayat Interaksi</TabsTrigger>
                <TabsTrigger value="stage-history">Riwayat Stage</TabsTrigger>
              </TabsList>
              <TabsContent value="interactions" className="pt-4">
                <InteractionTimeline interactions={customer.interactions ?? []} />
              </TabsContent>
              <TabsContent value="stage-history" className="pt-4">
                <StageHistoryTimeline history={customer.stageHistory ?? []} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      <LogInteractionDialog
        customerId={customer.id}
        customerName={customer.name}
        open={logOpen}
        onOpenChange={setLogOpen}
      />
      <CloseDealDialog customer={customer} open={dealOpen} onOpenChange={setDealOpen} />
    </DashboardShell>
  );
}