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
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUsers } from '@/hooks/use-users';
import { useCreateInteraction } from '@/hooks/use-interactions';
import { extractErrorMessage } from '@/lib/api-client';
import type { InteractionResult, InteractionType } from '@/types/api';

const TYPE_OPTIONS: { value: InteractionType; label: string }[] = [
  { value: 'CALL', label: 'Telepon' },
  { value: 'WHATSAPP', label: 'WhatsApp' },
  { value: 'EMAIL', label: 'Email' },
  { value: 'MEETING', label: 'Meeting' },
  { value: 'PRESENTATION', label: 'Presentasi' },
  { value: 'FOLLOW_UP', label: 'Follow Up' },
  { value: 'NOTE', label: 'Catatan' },
];

const RESULT_OPTIONS: { value: InteractionResult; label: string }[] = [
  { value: 'POSITIVE', label: 'Positif' },
  { value: 'NEUTRAL', label: 'Netral' },
  { value: 'NEGATIVE', label: 'Negatif' },
  { value: 'NO_RESPONSE', label: 'Tidak Ada Respon' },
];

const EMPTY_FORM = {
  userId: '',
  type: '' as InteractionType | '',
  result: '' as InteractionResult | '',
  notes: '',
  followUpDate: '',
};

export function LogInteractionDialog({
  customerId,
  customerName,
  open,
  onOpenChange,
}: {
  customerId: string;
  customerName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const { data: users } = useUsers();
  const createInteraction = useCreateInteraction(customerId);

  const salespersons = users?.filter((u) => u.role === 'SALES') ?? [];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.userId || !form.type || !form.notes) {
      toast.error('Salesperson, Jenis interaksi, dan Catatan wajib diisi');
      return;
    }

    try {
      await createInteraction.mutateAsync({
        userId: form.userId,
        type: form.type as InteractionType,
        result: form.result ? (form.result as InteractionResult) : undefined,
        notes: form.notes,
        followUpDate: form.followUpDate || undefined,
      });
      toast.success('Interaksi berhasil dicatat');
      setForm(EMPTY_FORM);
      onOpenChange(false);
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Log Interaksi</DialogTitle>
          <DialogDescription>Catat aktivitas terbaru dengan {customerName}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Jenis Interaksi *</Label>
              <Select
                value={form.type}
                onValueChange={(value) => setForm((f) => ({ ...f, type: value as InteractionType }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis" />
                </SelectTrigger>
                <SelectContent>
                  {TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Hasil</Label>
              <Select
                value={form.result}
                onValueChange={(value) => setForm((f) => ({ ...f, result: value as InteractionResult }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Opsional" />
                </SelectTrigger>
                <SelectContent>
                  {RESULT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Dicatat Oleh *</Label>
            <Select
                value={form.userId}
                onValueChange={(value) => setForm((f) => ({ ...f, userId: value ?? '' }))}
                >
                <SelectTrigger>
                    <SelectValue placeholder="Pilih salesperson" />
                </SelectTrigger>
                <SelectContent>
                    {salespersons.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                        {u.name}
                    </SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">Catatan *</Label>
            <Textarea
              id="notes"
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="Ringkasan hasil interaksi..."
              rows={3}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="followUpDate">Jadwalkan Follow Up</Label>
            <Input
              id="followUpDate"
              type="date"
              value={form.followUpDate}
              onChange={(e) => setForm((f) => ({ ...f, followUpDate: e.target.value }))}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="submit" disabled={createInteraction.isPending} className="w-full">
              {createInteraction.isPending ? 'Menyimpan...' : 'Simpan Interaksi'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}