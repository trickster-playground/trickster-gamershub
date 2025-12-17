/**
 * Tournament category types
 */

export interface TournamentPost {
  id: number;
  tournament_category_id: TournamentCategory;
  name: string;
  icon?: string;
  slug: string;
  description?: number;
  color: string;
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
