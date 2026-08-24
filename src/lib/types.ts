export type ArticleStatus = 'draft' | 'published'

export interface Article {
  id: string
  title: string
  slug: string
  excerpt: string | null
  body: string
  coverImageUrl: string | null
  status: ArticleStatus
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

export type ArticleSummary = Omit<Article, 'body'>
