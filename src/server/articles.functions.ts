import { createServerFn } from '@tanstack/react-start'
import { notFound } from '@tanstack/react-router'
import { z } from 'zod'
import { authMiddleware } from './auth-middleware'
import {
  createArticle,
  deleteArticle,
  getArticleForAdmin,
  getPublishedArticleBySlug,
  listAllArticlesForAdmin,
  listPublishedArticles,
  resolveUniqueSlug,
  setArticleStatus,
  updateArticle,
} from './db/articles.server'
import { deleteCachedOgImage, generateAndCacheOgImage } from './og-image.server'
import { renderMarkdownToHtml } from './markdown.server'

export const listPublicArticles = createServerFn({ method: 'GET' }).handler(
  async () => {
    return listPublishedArticles()
  },
)

export const getPublicArticle = createServerFn({ method: 'GET' })
  .validator(z.object({ slug: z.string().min(1) }))
  .handler(async ({ data }) => {
    const article = await getPublishedArticleBySlug(data.slug)
    if (!article) throw notFound()
    const renderedHtml = await renderMarkdownToHtml(article.body)
    return { ...article, renderedHtml }
  })

export const listAdminArticles = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async () => listAllArticlesForAdmin())

export const getAdminArticle = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data }) => {
    const article = await getArticleForAdmin(data.id)
    if (!article) throw notFound()
    return article
  })

const articleInputSchema = z.object({
  title: z.string().trim().min(1, 'タイトルを入力してください'),
  slug: z.string().trim().min(1, 'スラッグを入力してください'),
  excerpt: z.string().trim().max(300).optional(),
  body: z.string(),
  coverImageUrl: z.string().trim().optional(),
})

export const createArticleDraft = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(articleInputSchema)
  .handler(async ({ data }) => {
    const slug = await resolveUniqueSlug(data.slug)
    return createArticle({
      title: data.title,
      slug,
      excerpt: data.excerpt || null,
      body: data.body,
      coverImageUrl: data.coverImageUrl || null,
    })
  })

export const updateArticleDraft = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(articleInputSchema.extend({ id: z.string().min(1) }))
  .handler(async ({ data }) => {
    const slug = await resolveUniqueSlug(data.slug, data.id)
    const updated = await updateArticle(data.id, {
      title: data.title,
      slug,
      excerpt: data.excerpt || null,
      body: data.body,
      coverImageUrl: data.coverImageUrl || null,
    })

    if (updated.status === 'published') {
      // 公開中の記事はタイトル/スラッグ変更に追従してOGP画像も再生成する
      await generateAndCacheOgImage(updated.slug, updated.title)
    }

    return updated
  })

export const publishArticle = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data }) => {
    const updated = await setArticleStatus(data.id, 'published')
    await generateAndCacheOgImage(updated.slug, updated.title)
    return updated
  })

export const unpublishArticle = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data }) => {
    return setArticleStatus(data.id, 'draft')
  })

export const removeArticle = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data }) => {
    const article = await getArticleForAdmin(data.id)
    if (article?.status === 'published') {
      await deleteCachedOgImage(article.slug)
    }
    await deleteArticle(data.id)
    return { ok: true }
  })
