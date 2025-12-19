/**
 * Tournament post types
 */

export interface TournamentPost {
  id: number | null;
  title: string;
  slug: string;
  tournament_category_id: number | '';
  description: string;
  tags: string;

  prize_pool: number | null;
  max_participants: number | null;

  mode: 'online' | 'lan' | '';

  location: string;
  latitude: number | null;
  longitude: number | null;

  registration_start: string;
  registration_end: string;
  start_date: string;
  end_date: string;

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
