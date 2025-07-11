// src/types.ts
export interface DevToArticle {
  id: number;
  title: string;
  body_markdown?: string; // Article content
  published_at: string;
  user: {
    name: string;
    username: string;
  };
  tag_list: string[];
  cover_image?: string | null;
}
