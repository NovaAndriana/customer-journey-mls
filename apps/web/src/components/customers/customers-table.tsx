'use client';

import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { STAGE_CONFIG } from '@/lib/stage-config';
import { formatDate } from '@/lib/format';
import type { Customer } from '@/types/api';

const SOURCE_LABEL: Record<string, string> = {
  WALK_IN: 'Walk In',
  REFERRAL: 'Referral',
  SOCIAL_MEDIA: 'Social Media',
  WEBSITE: 'Website',
  OTHER: 'Lainnya',
};

export function CustomersTable({ customers, isLoading }: { customers: Customer[]; isLoading: boolean }) {
  return (
    <div className="border rounded-md overflow-x-auto bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead className="hidden md:table-cell">Kontak</TableHead>
            <TableHead className="hidden lg:table-cell">Sumber</TableHead>
            <TableHead>Stage</TableHead>
            <TableHead className="hidden lg:table-cell">Minat Motor</TableHead>
            <TableHead className="hidden md:table-cell">Salesperson</TableHead>
            <TableHead className="hidden sm:table-cell text-right">Update Terakhir</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading &&
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={7}>
                  <Skeleton className="h-8 w-full" />
                </TableCell>
              </TableRow>
            ))}

          {!isLoading && customers.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground py-8 text-sm">
                Tidak ada customer yang cocok dengan filter
              </TableCell>
            </TableRow>
          )}

          {!isLoading &&
            customers.map((customer) => (
              <TableRow key={customer.id} className="hover:bg-muted/40">
                <TableCell>
                  <Link href={`/customers/${customer.id}`} className="font-medium hover:underline">
                    {customer.name}
                  </Link>
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                  {customer.phone}
                </TableCell>
                <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                  {SOURCE_LABEL[customer.source]}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={STAGE_CONFIG[customer.stage].color}>
                    {STAGE_CONFIG[customer.stage].label}
                  </Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                  {customer.interestedMotor?.name ?? '-'}
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                  {customer.salesperson?.name}
                </TableCell>
                <TableCell className="hidden sm:table-cell text-right text-sm text-muted-foreground">
                  {formatDate(customer.updatedAt)}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}