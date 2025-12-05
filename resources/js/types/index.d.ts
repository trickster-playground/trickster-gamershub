import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
  user: User;
}

export interface BreadcrumbItem {
  title: string;
  href: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface NavItem {
  title: string;
  href: NonNullable<InertiaLinkProps['href']>;
  icon?: LucideIcon | null;
  isActive?: boolean;
}

export interface SharedData {
  name: string;
  quote: { message: string; author: string };
  auth: Auth;
  sidebarOpen: boolean;
  [key: string]: unknown;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  bio?: string;

  avatar?: Avatar | null;
  background?: Background | null;

  socialLinks?: SocialLink[];

  isFollowing?: boolean;

  // follow counts
  followersCount?: number;
  followingsCount?: number;

  // lists followers & followings
  followings?: User[];
  followers?: User[];

  posts?: Post[];
  likedPosts?: Post[];
  savedPosts?: Post[];

  email_verified_at: string | null;
  two_factor_enabled?: boolean;

  created_at: string;
  updated_at: string;

  // allow extra properties safely
  [key: string]: unknown;
}

export interface Avatar {
  id: number;
  user_id: number;
  type: 'avatar';
  path?: string;
}

export interface Background {
  id: number;
  user_id: number;
  type: 'background';
  path: string;
}

export interface SocialLink {
  id?: number;
  platform: string;
  url: string;
}
