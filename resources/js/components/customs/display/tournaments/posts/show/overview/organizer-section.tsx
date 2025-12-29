import UserProfileController from '@/actions/App/Http/Controllers/Users/UserProfileController';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { Link } from '@inertiajs/react';
import { ShieldCheck } from 'lucide-react';

export default function OrganizerSection({
  name,
  username,
  avatar,
}: {
  name: string;
  username: string;
  avatar: string;
}) {
  const getInitials = useInitials();
  return (
    <div className="flex items-center justify-between">
      <Link
        href={UserProfileController.show(username)}
        className="group flex items-center gap-3 rounded-lg px-2 py-1 hover:bg-dark-4"
      >
        {/* Avatar placeholder */}
        <Avatar className="size-8 ring-1 ring-white/20 group-hover:ring-blue-500 sm:size-11">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{getInitials(name)}</AvatarFallback>
        </Avatar>

        <div className="leading-tight">
          <p className="text-sm font-medium text-white group-hover:text-blue-500">
            {name}
          </p>
          <p className="text-xs text-white/50">@{username}</p>
        </div>
      </Link>

      <ShieldCheck size={16} className="text-blue-400" />
    </div>
  );
}
