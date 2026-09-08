import { DashboardShell } from '@/components/layout/dashboard-shell';
import { Header } from '@/components/layout/header';
import { KanbanBoard } from '@/components/customers/kanban-board';
import { CustomerFormDialog } from '@/components/customers/customer-form-dialog';

export default function PipelinePage() {
  return (
    <DashboardShell>
      <Header
        title="Customer Journey Pipeline"
        description="Pantau perjalanan customer dari kontak pertama hingga deal"
        actions={<CustomerFormDialog />}
      />
      <main className="flex-1 overflow-hidden p-4 md:p-6">
        <KanbanBoard />
      </main>
    </DashboardShell>
  );
}