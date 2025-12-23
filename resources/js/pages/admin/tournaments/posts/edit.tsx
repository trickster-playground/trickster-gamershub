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
import { TournamentCategory, TournamentFormData } from '@/types/tournaments';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Edit Tournament Post',
    href: '/administrator/tournaments/edit',
  },
];

interface TournamentPostEditProps {
  tournamentPostData: TournamentFormData;
  categories: TournamentCategory[];
}

export default function TournamentPostEdit({
  categories,
  tournamentPostData,
}: TournamentPostEditProps) {
  return (
    <AdminAppLayout breadcrumbs={breadcrumbs}>
      <Head title="Administrator" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <FormTournamentPost
              tournamentPostData={tournamentPostData}
              categories={categories}
            />
          </div>
        </div>
      </div>
    </AdminAppLayout>
  );
}
