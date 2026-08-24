import { createFileRoute } from '@tanstack/react-router'
import { getPublishedArticleBySlug } from '#/server/db/articles.server'
import {
  generateAndCacheOgImage,
  getCachedOgImage,
} from '#/server/og-image.server'

// DESIGN.md 7章: 公開時に生成してR2にキャッシュする方式。
// このルートはキャッシュがあればそれを返し、無ければ(初回アクセス等)その場で生成する保険。
export const Route = createFileRoute('/og/$slug')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const cached = await getCachedOgImage(params.slug)
        if (cached) {
          return new Response(cached.body, {
            headers: {
              'Content-Type': cached.httpMetadata?.contentType ?? 'image/png',
              'Cache-Control': 'public, max-age=31536000, immutable',
            },
          })
        }

        const article = await getPublishedArticleBySlug(params.slug)
        if (!article) {
          return new Response('Not Found', { status: 404 })
        }

        const buffer = await generateAndCacheOgImage(
          article.slug,
          article.title,
        )
        return new Response(buffer, {
          headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        })
      },
    },
  },
})
