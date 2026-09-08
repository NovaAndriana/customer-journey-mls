'use client';

import { useState } from 'react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { Header } from '@/components/layout/header';
import { CustomerFiltersBar } from '@/components/customers/customer-filters';
import { CustomersTable } from '@/components/customers/customers-table';
import { PaginationBar } from '@/components/shared/pagination-bar';
import { CustomerFormDialog } from '@/components/customers/customer-form-dialog';
import { useCustomers, type CustomerFilters } from '@/hooks/use-customers';

export default function CustomersPage() {
  const [filters, setFilters] = useState<CustomerFilters>({ page: 1, limit: 10 });
  const { data, isLoading } = useCustomers(filters);

  return (
    <DashboardShell>
      <Header
        title="Customers"
        description="Kelola seluruh data customer dan filter berdasarkan stage"
        actions={<CustomerFormDialog />}
      />
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        <CustomerFiltersBar filters={filters} onChange={setFilters} />
        <CustomersTable customers={data?.items ?? []} isLoading={isLoading} />
        <PaginationBar meta={data?.meta} onPageChange={(page) => setFilters((f) => ({ ...f, page }))} />
      </main>
    </DashboardShell>
  );
}