'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Pencil } from 'lucide-react';
import { useCreateMotorModel, useUpdateMotorModel } from '@/hooks/use-motor-models';
import { extractErrorMessage } from '@/lib/api-client';
import type { MotorModel } from '@/types/api';

const EMPTY_FORM = { name: '', price: '', stockQty: '', imageUrl: '' };

export function MotorModelFormDialog({ motorModel }: { motorModel?: MotorModel }) {
  const isEdit = !!motorModel;
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const createMotorModel = useCreateMotorModel();
  const updateMotorModel = useUpdateMotorModel();
  const isPending = createMotorModel.isPending || updateMotorModel.isPending;

  useEffect(() => {
    if (open && motorModel) {
      setForm({
        name: motorModel.name,
        price: motorModel.price.toString(),
        stockQty: motorModel.stockQty.toString(),
        imageUrl: motorModel.imageUrl ?? '',
      });
    } else if (open && !motorModel) {
      setForm(EMPTY_FORM);
    }
  }, [open, motorModel]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name || !form.price || !form.stockQty) {
      toast.error('Nama, Harga, dan Stok wajib diisi');
      return;
    }

    const payload = {
      name: form.name,
      price: Number(form.price),
      stockQty: Number(form.stockQty),
      imageUrl: form.imageUrl || undefined,
    };

    try {
      if (isEdit) {
        await updateMotorModel.mutateAsync({ id: motorModel.id, payload });
        toast.success('Motor model berhasil diperbarui');
      } else {
        await createMotorModel.mutateAsync(payload);
        toast.success('Motor model baru berhasil ditambahkan');
      }
      setOpen(false);
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger
        render={
          isEdit ? (
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Pencil className="h-4 w-4" />
            </Button>
          ) : (
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Tambah Motor
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Motor Model' : 'Tambah Motor Model'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Perbarui detail unit motor listrik' : 'Tambahkan unit motor listrik baru ke katalog'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="motorName">Nama Model *</Label>
            <Input
              id="motorName"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Contoh: Gesits G1"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="motorPrice">Harga (Rp) *</Label>
              <Input
                id="motorPrice"
                type="number"
                min={0}
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="motorStock">Stok *</Label>
              <Input
                id="motorStock"
                type="number"
                min={0}
                value={form.stockQty}
                onChange={(e) => setForm((f) => ({ ...f, stockQty: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="motorImage">URL Gambar</Label>
            <Input
              id="motorImage"
              value={form.imageUrl}
              onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
              placeholder="Opsional"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Motor'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}