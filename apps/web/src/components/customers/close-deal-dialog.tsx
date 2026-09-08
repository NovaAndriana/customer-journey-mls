'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCloseDeal } from '@/hooks/use-customers';
import { extractErrorMessage } from '@/lib/api-client';
import type { Customer } from '@/types/api';

export function CloseDealDialog({
  customer,
  open,
  onOpenChange,
}: {
  customer: Customer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [finalPrice, setFinalPrice] = useState(customer.interestedMotor?.price?.toString() ?? '');
  const [unitSold, setUnitSold] = useState('1');
  const [notes, setNotes] = useState('');
  const closeDeal = useCloseDeal();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!finalPrice || Number(finalPrice) < 0) {
      toast.error('Harga final wajib diisi dengan angka valid');
      return;
    }

    try {
      await closeDeal.mutateAsync({
        id: customer.id,
        finalPrice: Number(finalPrice),
        unitSold: Number(unitSold) || 1,
        salespersonId: customer.salespersonId,
        notes: notes || undefined,
      });
      toast.success(`Deal dengan ${customer.name} berhasil ditutup 🎉`);
      onOpenChange(false);
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tutup Deal</DialogTitle>
          <DialogDescription>
            {customer.name} akan pindah ke stage <strong>Deal</strong> dan stok motor akan berkurang
            otomatis.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="rounded-md border bg-muted/40 p-3 text-sm">
            <p className="font-medium">{customer.interestedMotor?.name ?? 'Belum ada motor dipilih'}</p>
            {customer.interestedMotor && (
              <p className="text-muted-foreground">Stok saat ini: {customer.interestedMotor.stockQty} unit</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="finalPrice">Harga Final (Rp) *</Label>
              <Input
                id="finalPrice"
                type="number"
                min={0}
                value={finalPrice}
                onChange={(e) => setFinalPrice(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="unitSold">Jumlah Unit</Label>
              <Input
                id="unitSold"
                type="number"
                min={1}
                value={unitSold}
                onChange={(e) => setUnitSold(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="dealNotes">Catatan</Label>
            <Textarea
              id="dealNotes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Opsional"
              rows={2}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="submit" disabled={closeDeal.isPending} className="w-full">
              {closeDeal.isPending ? 'Memproses...' : 'Tutup Deal'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}