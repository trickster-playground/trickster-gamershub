/**
 * Node Modules
 */
import { Head } from '@inertiajs/react';

/**
 * Layouts
 */
import AdminAppLayout from '@/components/customs/layouts/admin/admin-app-layout';

/**
 *  Components
 */
import FormCategory from '@/components/customs/display/admin/tournaments/categories/form-category';
/**
 * Types
 */
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Create Tournament Category',
    href: '/administrator/category/create',
  },
];

export default function TournamentCategoryCreate() {
  return (
    <AdminAppLayout breadcrumbs={breadcrumbs}>
      <Head title="Administrator" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <FormCategory />
          </div>
        </div>
      </div>
    </AdminAppLayout>
  );
}
