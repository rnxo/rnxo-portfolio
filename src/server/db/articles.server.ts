import { getEnv } from '../env.server'
import { slugify } from '#/lib/slug'
import type { Article, ArticleStatus, ArticleSummary } from '#/lib/types'

interface ArticleRow {
  id: string
  title: string
  slug: string
  excerpt: string | null
  body: string
  cover_image_url: string | null
  status: ArticleStatus
  published_at: string | null
  created_at: string
  updated_at: string
}

function toArticle(row: ArticleRow): Article {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    body: row.body,
    coverImageUrl: row.cover_image_url,
    status: row.status,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

const SUMMARY_COLUMNS =
  'id, title, slug, excerpt, cover_image_url, status, published_at, created_at, updated_at'

function toArticleSummary(row: Omit<ArticleRow, 'body'>): ArticleSummary {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    coverImageUrl: row.cover_image_url,
    status: row.status,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function now(): string {
  return new Date().toISOString()
}

export async function listPublishedArticles(): Promise<ArticleSummary[]> {
  const { DB } = getEnv()
  const { results } = await DB.prepare(
    `SELECT ${SUMMARY_COLUMNS} FROM articles WHERE status = 'published' ORDER BY published_at DESC`,
  ).all<Omit<ArticleRow, 'body'>>()
  return results.map(toArticleSummary)
}

export async function listAllArticlesForAdmin(): Promise<ArticleSummary[]> {
  const { DB } = getEnv()
  const { results } = await DB.prepare(
    `SELECT ${SUMMARY_COLUMNS} FROM articles ORDER BY updated_at DESC`,
  ).all<Omit<ArticleRow, 'body'>>()
  return results.map(toArticleSummary)
}

export async function getPublishedArticleBySlug(
  slug: string,
): Promise<Article | null> {
  const { DB } = getEnv()
  const row = await DB.prepare(
    `SELECT * FROM articles WHERE slug = ? AND status = 'published'`,
  )
    .bind(slug)
    .first<ArticleRow>()
  return row ? toArticle(row) : null
}

export async function getArticleForAdmin(id: string): Promise<Article | null> {
  const { DB } = getEnv()
  const row = await DB.prepare('SELECT * FROM articles WHERE id = ?')
    .bind(id)
    .first<ArticleRow>()
  return row ? toArticle(row) : null
}

async function slugExists(slug: string, excludeId?: string): Promise<boolean> {
  const { DB } = getEnv()
  const row = excludeId
    ? await DB.prepare('SELECT id FROM articles WHERE slug = ? AND id != ?')
        .bind(slug, excludeId)
        .first()
    : await DB.prepare('SELECT id FROM articles WHERE slug = ?')
        .bind(slug)
        .first()
  return row !== null
}

export async function resolveUniqueSlug(
  desiredSlug: string,
  excludeId?: string,
): Promise<string> {
  const base = slugify(desiredSlug)
  let candidate = base
  let suffix = 2
  while (await slugExists(candidate, excludeId)) {
    candidate = `${base}-${suffix}`
    suffix += 1
  }
  return candidate
}

export interface ArticleInput {
  title: string
  slug: string
  excerpt: string | null
  body: string
  coverImageUrl: string | null
}

export async function createArticle(input: ArticleInput): Promise<Article> {
  const { DB } = getEnv()
  const id = crypto.randomUUID()
  const timestamp = now()
  await DB.prepare(
    `INSERT INTO articles (id, title, slug, excerpt, body, cover_image_url, status, published_at, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, 'draft', NULL, ?, ?)`,
  )
    .bind(
      id,
      input.title,
      input.slug,
      input.excerpt,
      input.body,
      input.coverImageUrl,
      timestamp,
      timestamp,
    )
    .run()

  const created = await getArticleForAdmin(id)
  if (!created) throw new Error('Failed to create article')
  return created
}

export async function updateArticle(
  id: string,
  input: ArticleInput,
): Promise<Article> {
  const { DB } = getEnv()
  await DB.prepare(
    `UPDATE articles
     SET title = ?, slug = ?, excerpt = ?, body = ?, cover_image_url = ?, updated_at = ?
     WHERE id = ?`,
  )
    .bind(
      input.title,
      input.slug,
      input.excerpt,
      input.body,
      input.coverImageUrl,
      now(),
      id,
    )
    .run()

  const updated = await getArticleForAdmin(id)
  if (!updated) throw new Error('Article not found')
  return updated
}

export async function setArticleStatus(
  id: string,
  status: ArticleStatus,
): Promise<Article> {
  const { DB } = getEnv()
  if (status === 'published') {
    // 既に一度公開済みなら published_at は上書きしない(取り下げ→再公開で日付を保持する)
    await DB.prepare(
      `UPDATE articles
       SET status = 'published', published_at = COALESCE(published_at, ?), updated_at = ?
       WHERE id = ?`,
    )
      .bind(now(), now(), id)
      .run()
  } else {
    await DB.prepare(
      `UPDATE articles SET status = 'draft', updated_at = ? WHERE id = ?`,
    )
      .bind(now(), id)
      .run()
  }

  const updated = await getArticleForAdmin(id)
  if (!updated) throw new Error('Article not found')
  return updated
}

export async function deleteArticle(id: string): Promise<void> {
  const { DB } = getEnv()
  await DB.prepare('DELETE FROM articles WHERE id = ?').bind(id).run()
}
