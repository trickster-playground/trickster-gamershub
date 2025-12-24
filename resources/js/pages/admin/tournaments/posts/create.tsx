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

/**
 * Types
 */
import FormTournamentPost from '@/components/customs/display/admin/tournaments/posts/form-tournament-post';
import { type BreadcrumbItem } from '@/types';
import { TournamentCategory } from '@/types/tournaments';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Create Tournament Post',
    href: '/administrator/tournaments/create',
  },
];

interface TournamentPostCreateProps {
  categories: TournamentCategory[];
}

export default function TournamentPostCreate({
  categories,
}: TournamentPostCreateProps) {
  return (
    <AdminAppLayout breadcrumbs={breadcrumbs}>
      <Head title="Administrator" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <FormTournamentPost categories={categories} />
          </div>
        </div>
      </div>
    </AdminAppLayout>
  );
}
