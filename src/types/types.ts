export interface DevToArticle {
  id: number
  title: string
  description: string
  published_at: string
  slug: string
  path: string
  url: string
  comments_count: number
  public_reactions_count: number
  body_markdown?: string
  tag_list: string[]
  tags: string
  user: {
    name: string
    username: string
    profile_image?: string
  }
  cover_image?: string | null
}
