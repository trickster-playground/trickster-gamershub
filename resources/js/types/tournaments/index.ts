/**
 * Tournament post types
 */

export interface TournamentPost {
  id?: number;
  title: string;
  slug: string;
  category_id: number | '';
  description: string;
  tags: string;

  prize_pool: number | null;
  max_participants: number | null;

  location: string;
  latitude: number | null;
  longitude: number | null;

  registration_start: string;
  registration_end: string;
  start_date: string;
  end_date: string;

  attachments?: TournamentAttachment[];

  status: 'draft' | 'upcoming' | 'ongoing' | 'finished' | 'cancelled';
  is_featured: boolean;
  is_published: boolean;
}

/**
 * Tournament category types
 */

export interface TournamentCategory {
  id: number;
  name: string;
  icon?: string;
  slug: string;
  description?: number;
  color: string;
  created_at: string;
  updated_at: string;
}

/**
 * Tournament attachment types
 */

export interface TournamentAttachment {
  id: number;
  file_name: string;
  path: string;
  size: number;
  type: 'banner' | 'thumbnail' | 'gallery';
  created_at: string;
  updated_at: string;
}

export interface TournamentPostForm
  extends Omit<TournamentPost, 'attachments'> {
  banner: File | null;
  thumbnail: File | null;
}
