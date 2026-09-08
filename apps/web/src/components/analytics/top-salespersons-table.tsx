'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy } from 'lucide-react';
import type { AnalyticsSummary } from '@/types/api';

export function TopSalespersonsTable({
  summary,
  isLoading,
}: {
  summary?: AnalyticsSummary;
  isLoading: boolean;
}) {
  const topSalespersons = summary?.topSalespersons ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Trophy className="h-4 w-4 text-amber-500" />
          Top Salesperson
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-48 w-full" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">#</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead className="text-right">Deal</TableHead>
                <TableHead className="text-right">Unit Terjual</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topSalespersons.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-6 text-sm">
                    Belum ada deal tercatat
                  </TableCell>
                </TableRow>
              )}
              {topSalespersons.map((s, index) => (
                <TableRow key={s.salespersonId}>
                  <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell className="text-right">{s.totalDeals}</TableCell>
                  <TableCell className="text-right">{s.totalUnitSold}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}