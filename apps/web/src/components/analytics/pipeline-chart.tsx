'use client';

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { STAGE_CONFIG } from '@/lib/stage-config';
import type { PipelineStageCount } from '@/hooks/use-analytics';

const STAGE_HEX: Record<string, string> = {
  NEW: '#64748b',
  CONTACTED: '#2563eb',
  FOLLOWED_UP: '#d97706',
  PRESENTED: '#9333ea',
  DEAL: '#059669',
  REJECTED: '#dc2626',
};

export function PipelineChart({ data, isLoading }: { data?: PipelineStageCount[]; isLoading: boolean }) {
  const chartData = (data ?? []).map((d) => ({
    name: STAGE_CONFIG[d.stage].label,
    stage: d.stage,
    count: d.count,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Distribusi Pipeline per Stage</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-72 w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={288}>
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-15} textAnchor="end" height={50} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
                formatter={(value) => [`${value} customer`, 'Jumlah']}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {chartData.map((entry) => (
                  <Cell key={entry.stage} fill={STAGE_HEX[entry.stage]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}