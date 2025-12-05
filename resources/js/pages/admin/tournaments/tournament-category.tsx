/**
 * Node Modules
 */
import { Head, usePage } from '@inertiajs/react';

/**
 * Routes
 */

/**
 * Layouts
 */
import AdminAppLayout from '@/components/customs/layouts/admin/admin-app-layout';

/**
 *  Components
 */

/**
 * Types
 */
import {
  columns,
  Payment,
} from '@/components/customs/display/tournaments/data-coloumns';
import { DataTable } from '@/components/customs/display/tournaments/data-table';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Tournament Category',
    href: '/administrator/category',
  },
];

export default function TournamentCategory() {
  const { payments } = usePage<{ payments: Payment[] }>().props;

  return (
    <AdminAppLayout breadcrumbs={breadcrumbs}>
      <Head title="Administrator" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <DataTable columns={columns} data={payments} />
          </div>
        </div>
      </div>
    </AdminAppLayout>
  );
}
