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

import { tournamentPostColumns } from '@/components/customs/display/admin/tournaments/posts/data-column-post';
import { DataTable } from '@/components/customs/display/ui/data-table';
/**
 * Types
 */

import { type BreadcrumbItem } from '@/types';
import { TournamentPost } from '@/types/tournaments';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Administrator Tournament Posts',
    href: '/administrator/tournaments',
  },
];

export default function TournamentPostIndex() {
  const { tournamentPosts } = usePage<{
    tournamentPosts: TournamentPost[];
  }>().props;

  return (
    <AdminAppLayout breadcrumbs={breadcrumbs}>
      <Head title="Administrator | Tournaments" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <DataTable
              title={`Tournament Posts`}
              columns={tournamentPostColumns}
              data={tournamentPosts}
              url={`/administrator/tournaments/create`}
            />
          </div>
        </div>
      </div>
    </AdminAppLayout>
  );
}
