/**
 * Routes
 */
import admin from '@/routes/admin';

/**
 * Types
 */
import { NavItem } from '@/types';

/**
 * Assets
 */
import {
  IconDashboard,
  IconDeviceDesktopAnalytics,
  IconTournament,
} from '@tabler/icons-react';
import { Network, SquareChartGantt } from 'lucide-react';

export const adminNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: admin.dashboard(),
    icon: IconDashboard,
  },
  {
    title: 'Tournaments',
    icon: IconTournament,
    children: [
      {
        title: 'Posts',
        href: admin.tournaments(),
        icon: SquareChartGantt,
      },
      {
        title: 'Categories',
        href: admin.category(),
        icon: Network,
      },
    ],
  },
];

export const rightNavItems: NavItem[] = [
  {
    title: 'Administrator Platform',
    href: admin.dashboard(),
    icon: IconDeviceDesktopAnalytics,
  },
];
