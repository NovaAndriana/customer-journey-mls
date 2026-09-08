'use client';

import { useState } from 'react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { Header } from '@/components/layout/header';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useMotorModels } from '@/hooks/use-motor-models';
import { MotorModelsTable } from '@/components/motor-models/motor-models-table';
import { MotorModelFormDialog } from '@/components/motor-models/motor-model-form-dialog';

export default function MotorModelsPage() {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useMotorModels({ search: search || undefined });

  return (
    <DashboardShell>
      <Header
        title="Motor Models"
        description="Kelola katalog unit motor listrik dan stok"
        actions={<MotorModelFormDialog />}
      />
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari model motor..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <MotorModelsTable motorModels={data?.items ?? []} isLoading={isLoading} />
      </main>
    </DashboardShell>
  );
}