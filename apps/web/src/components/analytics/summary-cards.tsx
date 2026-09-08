'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, TrendingUp, DollarSign, Bike } from 'lucide-react';
import { formatCurrency } from '@/lib/format';
import type { AnalyticsSummary } from '@/types/api';

export function SummaryCards({ summary, isLoading }: { summary?: AnalyticsSummary; isLoading: boolean }) {
  const cards = [
    {
      label: 'Total Customer',
      value: summary?.totalCustomers ?? 0,
      icon: Users,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      label: 'Conversion Rate',
      value: `${summary?.conversionRate ?? 0}%`,
      icon: TrendingUp,
      color: 'text-emerald-600 bg-emerald-100',
    },
    {
      label: 'Total Revenue',
      value: formatCurrency(summary?.totalRevenue ?? 0),
      icon: DollarSign,
      color: 'text-purple-600 bg-purple-100',
    },
    {
      label: 'Unit Terjual',
      value: summary?.totalUnitSold ?? 0,
      icon: Bike,
      color: 'text-amber-600 bg-amber-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.label}</CardTitle>
              <div className={`h-8 w-8 rounded-md flex items-center justify-center ${card.color}`}>
                <Icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-7 w-24" />
              ) : (
                <p className="text-2xl font-bold">{card.value}</p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}