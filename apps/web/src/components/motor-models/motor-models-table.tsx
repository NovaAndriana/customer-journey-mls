'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/format';
import { MotorModelFormDialog } from './motor-model-form-dialog';
import { DeleteMotorModelDialog } from './delete-motor-model-dialog';
import type { MotorModel } from '@/types/api';

export function MotorModelsTable({
  motorModels,
  isLoading,
}: {
  motorModels: MotorModel[];
  isLoading: boolean;
}) {
  return (
    <div className="border rounded-md overflow-x-auto bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama Model</TableHead>
            <TableHead>Harga</TableHead>
            <TableHead>Stok</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading &&
            Array.from({ length: 4 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={4}>
                  <Skeleton className="h-8 w-full" />
                </TableCell>
              </TableRow>
            ))}

          {!isLoading && motorModels.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground py-8 text-sm">
                Belum ada motor model
              </TableCell>
            </TableRow>
          )}

          {!isLoading &&
            motorModels.map((motor) => (
              <TableRow key={motor.id} className="hover:bg-muted/40">
                <TableCell className="font-medium">{motor.name}</TableCell>
                <TableCell>{formatCurrency(motor.price)}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      motor.stockQty === 0
                        ? 'bg-red-100 text-red-700 border-red-300'
                        : motor.stockQty < 5
                          ? 'bg-amber-100 text-amber-700 border-amber-300'
                          : 'bg-emerald-100 text-emerald-700 border-emerald-300'
                    }
                  >
                    {motor.stockQty} unit
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <MotorModelFormDialog motorModel={motor} />
                    <DeleteMotorModelDialog motorModel={motor} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}