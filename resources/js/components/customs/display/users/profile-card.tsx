import { sidebarLinks } from '@/lib/sidebarLinks';
import { Link } from '@inertiajs/react';
import { IconPhotoEdit } from '@tabler/icons-react';

interface ProfileCardProps {
  username: string;
  name: string;
  avatar: string;
  background: string;
}

export function ProfileCard({
  username,
  name,
  avatar,
  background,
}: ProfileCardProps) {
  return (
    <div className="w-full overflow-hidden rounded-xl bg-black text-white">
      {/* Cover */}
      <div className="relative h-36 w-full overflow-hidden rounded-t-xl">
        <img
          src={background}
          alt="Cover"
          className="aspect-video h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/80"></div>

        {/* Avatar + Name + Username */}
        <div className="absolute bottom-4 left-5 flex items-center gap-4">
          <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-white">
            <img
              className="h-full w-full object-cover"
              src={avatar}
              alt={username}
            />
          </div>
          <div>
            <h2 className="text-sm font-semibold">{name}</h2>
            <p className="text-sm text-gray-300">@{username}</p>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="p-4">
        <ul className="flex flex-col rounded-md bg-zinc-900">
          {sidebarLinks.map((link) => {
            return (
              <li
                key={link.label}
                className={`group leftsidebar-link comic-button items-center justify-center`}
              >
                <Link
                  href={`${link.routeName}`}
                  as="button"
                  className="group flex w-full cursor-pointer items-center justify-center gap-1 p-2"
                >
                  {link.label}
                  <IconPhotoEdit />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
