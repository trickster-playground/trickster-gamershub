import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { formatRupiah } from '@/lib/format/currency';
import { SharedData } from '@/types';
import { TournamentCategory } from '@/types/tournaments';
import { usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { Infinity } from 'lucide-react';

type TournamentPreviewProps = {
  data: {
    title: string;
    description: string;
    status: string;
    prize_pool: number | null;
    start_date: string;
    max_participants: number | null;
    location: string | '';

    category_id?: number | '';
  };
  categories: TournamentCategory[];
  thumbnailPreview?: string | null;
};

export default function PreviewTournamentPost({
  data,
  categories,
  thumbnailPreview,
}: TournamentPreviewProps) {
  const { auth } = usePage<SharedData>().props;
  const getInitials = useInitials();
  const statusColor: Record<string, string> = {
    draft: 'bg-gray-500',
    upcoming: 'bg-blue-600',
    ongoing: 'bg-green-600',
    finished: 'bg-zinc-600',
    cancelled: 'bg-red-600',
  };

  const category = categories.find(
    (cat) => cat.id === data.category_id,
  );

  return (
    <AspectRatio
      ratio={16 / 12}
      className="relative overflow-hidden rounded-3xl"
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: thumbnailPreview
            ? `url(${thumbnailPreview})`
            : "url('https://images4.alphacoders.com/136/1363796.jpeg')",
        }}
      />

      {auth.user && (
        <div className="absolute top-2 left-2 z-10 flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold text-white shadow-lg">
          <div className="flex items-center gap-1">
            <Avatar className="rounded-ful size-10 overflow-hidden border">
              <AvatarImage
                src={`/storage/${auth.user.avatar?.path}`}
                alt={auth.user.name}
              />
              <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                {getInitials(auth.user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start">
              <p>{auth.user.name}</p>
              <p className="text-[8px] text-muted-foreground">
                @{auth.user.username}
              </p>
            </div>
          </div>
        </div>
      )}

      {category && (
        <div
          className="absolute top-4 right-4 z-10 flex items-center gap-2 rounded-full px-3 py-1 text-sm font-bold text-white shadow-lg"
          style={{
            backgroundColor: category.color,
          }}
        >
          {category.name}
        </div>
      )}

      {!category && (
        <div className="absolute top-4 right-4 z-10 rounded-full bg-white/10 px-3 py-1 text-xs text-white/60">
          Category
        </div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/90 via-black/60 to-transparent" />

      {/* Accent */}
      <div className="absolute top-0 -left-20 h-full w-40 rotate-12 bg-blue-600/20 blur-2xl" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-end p-6 text-white">
        {/* Status */}
        <span
          className={`mb-3 w-fit rounded-full px-3 py-1 text-xs font-extrabold uppercase ${
            statusColor[data.status] ?? 'bg-gray-500'
          }`}
        >
          {data.status || 'Draft'}
        </span>

        {/* Title */}
        <h3 className="text-xl leading-tight font-extrabold uppercase">
          {data.title || 'Tournament Title'}
        </h3>

        {/* Meta */}
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-white/70">
          <span className="flex items-center gap-1">
            {data.max_participants === null ? (
              <>
                <Infinity className="h-4 w-4" />
                Unlimited Teams
              </>
            ) : (
              `${data.max_participants} Teams`
            )}
          </span>
          <span>•</span>
          <span className="capitalize">
            {data.location === 'online' ? 'Online' : 'Offline'}
          </span>
          <span>•</span>
          <span>
            {data.start_date
              ? format(new Date(data.start_date), 'MMMM dd, yyyy')
              : 'Start Date'}
          </span>
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between">
          <span className="flex items-center gap-1 text-lg font-extrabold text-blue-500">
            {data.prize_pool === null ? (
              <div className="flex items-center gap-1">
                <Infinity className="size-6" />
                <p>Prize Pool</p>
              </div>
            ) : (
              formatRupiah(data.prize_pool)
            )}
          </span>

          <span className="text-sm font-bold text-white/80 uppercase">
            Preview
          </span>
        </div>
      </div>

      {/* Border */}
      <div className="absolute inset-0 rounded-3xl border border-white/10" />
    </AspectRatio>
  );
}
