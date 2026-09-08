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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useUsers } from '@/hooks/use-users';
import { useMotorModels } from '@/hooks/use-motor-models';
import { useCreateCustomer } from '@/hooks/use-customers';
import { extractErrorMessage } from '@/lib/api-client';
import type { CustomerSource } from '@/types/api';

const SOURCE_OPTIONS: { value: CustomerSource; label: string }[] = [
  { value: 'WALK_IN', label: 'Walk In' },
  { value: 'REFERRAL', label: 'Referral' },
  { value: 'SOCIAL_MEDIA', label: 'Social Media' },
  { value: 'WEBSITE', label: 'Website' },
  { value: 'OTHER', label: 'Lainnya' },
];

const EMPTY_FORM = {
  name: '',
  phone: '',
  email: '',
  address: '',
  source: '' as CustomerSource | '',
  interestedMotorId: '',
  salespersonId: '',
};

export function CustomerFormDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const { data: users } = useUsers();
  const { data: motorModelsData } = useMotorModels();
  const createCustomer = useCreateCustomer();

  const salespersons = users?.filter((u) => u.role === 'SALES') ?? [];
  const motorModels = motorModelsData?.items ?? [];

  function resetForm() {
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name || !form.phone || !form.source || !form.salespersonId) {
      toast.error('Nama, No. HP, Sumber, dan Salesperson wajib diisi');
      return;
    }

    try {
      await createCustomer.mutateAsync({
        name: form.name,
        phone: form.phone,
        email: form.email || undefined,
        address: form.address || undefined,
        source: form.source as CustomerSource,
        interestedMotorId: form.interestedMotorId || undefined,
        salespersonId: form.salespersonId,
      });
      toast.success('Customer baru berhasil ditambahkan');
      resetForm();
      setOpen(false);
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) resetForm();
      }}
    >
        <DialogTrigger
        render={
            <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Tambah Customer
            </Button>
        }
        />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tambah Customer Baru</DialogTitle>
          <DialogDescription>
            Customer baru akan masuk ke stage <strong>New</strong> di pipeline.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="name">Nama *</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Nama lengkap customer"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone">No. HP *</Label>
            <Input
              id="phone"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              placeholder="08xxxxxxxxxx"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="opsional"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="address">Alamat</Label>
            <Textarea
              id="address"
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              placeholder="opsional"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Sumber *</Label>
              <Select
                value={form.source}
                onValueChange={(value) => setForm((f) => ({ ...f, source: value as CustomerSource }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih sumber" />
                </SelectTrigger>
                <SelectContent>
                  {SOURCE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Salesperson *</Label>
              <Select
                    value={form.salespersonId}
                    onValueChange={(value) =>
                        setForm((f) => ({ ...f, salespersonId: value ?? '' }))
                    }
                    >
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih sales" />
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
          </div>

          <div className="space-y-1.5">
            <Label>Motor yang Diminati</Label>
            <Select
                value={form.interestedMotorId}
                onValueChange={(value) =>
                    setForm((f) => ({ ...f, interestedMotorId: value ?? '' }))
                }
                >
                <SelectTrigger>
                    <SelectValue placeholder="Opsional" />
                </SelectTrigger>
                <SelectContent>
                    {motorModels.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                        {m.name}
                    </SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-2">
            <Button type="submit" disabled={createCustomer.isPending} className="w-full">
              {createCustomer.isPending ? 'Menyimpan...' : 'Simpan Customer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}