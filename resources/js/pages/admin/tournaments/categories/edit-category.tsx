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
import FormCategory from '@/components/customs/display/tournaments/categories/form-category';
/**
 * Types
 */
import { type BreadcrumbItem } from '@/types';
import { TournamentCategory } from '@/types/tournaments';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Edit Tournament Category',
    href: '/administrator/category/edit',
  },
];

export default function EditTournamentCategory() {
  const { tournamentCategory } = usePage<{
    tournamentCategory: TournamentCategory;
  }>().props;

  return (
    <AdminAppLayout breadcrumbs={breadcrumbs}>
      <Head title="Administrator" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <FormCategory tournamentCategory={tournamentCategory} />
          </div>
        </div>
      </div>
    </AdminAppLayout>
  );
}
