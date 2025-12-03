import { User } from '..';

export interface Post {
  id: number;
  slug: string;
  caption: string | null;
  tags: string;
  location: string | null;
  created_at: string;
  updated_at: string;
  user: User;
  attachments: PostAttachment[];
  comments: PostComment[];
  likes_count: number;
  comments_count: number;
  has_liked: boolean;
  has_saved: boolean;
}

export interface PostAttachment {
  id: number;
  file_name: string;
  path: string;
  modified: number;
  size: number;
  type: string;
  created_at: string;
  updated_at: string;
}

export interface PostComment {
  id: number;
  user: User;
  comment: string;
  created_at: string;
}
