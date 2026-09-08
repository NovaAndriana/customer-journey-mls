'use client';

import { DashboardShell } from '@/components/layout/dashboard-shell';
import { Header } from '@/components/layout/header';
import { useAnalyticsSummary, usePipeline } from '@/hooks/use-analytics';
import { SummaryCards } from '@/components/analytics/summary-cards';
import { PipelineChart } from '@/components/analytics/pipeline-chart';
import { TopSalespersonsTable } from '@/components/analytics/top-salespersons-table';

export default function AnalyticsPage() {
  const { data: summary, isLoading: summaryLoading } = useAnalyticsSummary();
  const { data: pipeline, isLoading: pipelineLoading } = usePipeline();

  return (
    <DashboardShell>
      <Header title="Analytics" description="Ringkasan performa penjualan dan pipeline customer" />
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        <SummaryCards summary={summary} isLoading={summaryLoading} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <PipelineChart data={pipeline} isLoading={pipelineLoading} />
          <TopSalespersonsTable summary={summary} isLoading={summaryLoading} />
        </div>
      </main>
    </DashboardShell>
  );
}