/**
 * Routes
 */
import { dashboard, tournaments } from '@/routes';

/**
 * Types
 */
import { NavItem } from '@/types';
import { IconTournament } from '@tabler/icons-react';

/**
 * Assets
 */
import { BookOpen, Folder, LayoutGrid } from 'lucide-react';

export const mainNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: dashboard(),
    icon: LayoutGrid,
  },
  {
    title: 'Tournaments',
    href: tournaments(),
    icon: IconTournament,
  },
];

export const footerNavItems: NavItem[] = [
  {
    title: 'Repository',
    href: 'https://github.com/laravel/react-starter-kit',
    icon: Folder,
  },
  {
    title: 'Documentation',
    href: 'https://laravel.com/docs/starter-kits#react',
    icon: BookOpen,
  },
];
