/**
 * Node Modules
 */
import { Head, usePage } from '@inertiajs/react';

/**
 * Layouts
 */
import AdminAppLayout from '@/components/customs/layouts/admin/admin-app-layout';

/**
 *  Components
 */
import { tournamentCategoryColumns } from '@/components/customs/display/tournaments/categories/data-column-category';
import { DataTable } from '@/components/customs/display/ui/data-table';

/**
 * Types
 */
import { type BreadcrumbItem } from '@/types';
import { TournamentCategory } from '@/types/tournaments';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Administrator Tournament Category',
    href: '/administrator/category',
  },
];

export default function TournamentCategoryIndex() {
  const { tournamentCategories } = usePage<{
    tournamentCategories: TournamentCategory[];
  }>().props;

  return (
    <AdminAppLayout breadcrumbs={breadcrumbs}>
      <Head title="Administrator | Tournaments Category" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <DataTable
              title={`Tournament Category`}
              columns={tournamentCategoryColumns}
              data={tournamentCategories}
              url={`/administrator/category/create`}
            />
          </div>
        </div>
      </div>
    </AdminAppLayout>
  );
}
