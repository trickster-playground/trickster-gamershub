/**
 * Tournament post types
 */

export interface TournamentPost {
  id: number;
  tournament_category_id: number;
  title: string;
  slug: string;
  description?: string;

  prize_pool?: number;
  mode?: 'online' | 'lan';
  location?: string;

  registration_start?: string;
  registration_end?: string;
  start_date?: string;
  end_date?: string;

  status: 'draft' | 'upcoming' | 'ongoing' | 'finished' | 'cancelled';
  is_featured: boolean;
  is_published: boolean;

  created_at: string;
  updated_at: string;
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
