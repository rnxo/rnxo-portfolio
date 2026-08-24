import { Link } from '@tanstack/react-router'
import type { ArticleSummary } from '#/lib/types'

function formatDate(iso: string | null): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function ArticleCard({ article }: { article: ArticleSummary }) {
  return (
    <Link
      to="/articles/$slug"
      params={{ slug: article.slug }}
      className="feature-card rise-in flex flex-col gap-3 rounded-2xl border p-5 no-underline"
    >
      {article.coverImageUrl && (
        <img
          src={article.coverImageUrl}
          alt=""
          className="aspect-[1200/630] w-full rounded-xl object-cover"
          loading="lazy"
        />
      )}
      <p className="island-kicker">{formatDate(article.publishedAt)}</p>
      <h2 className="display-title text-xl font-bold text-[var(--sea-ink)]">
        {article.title}
      </h2>
      {article.excerpt && (
        <p className="demo-muted text-sm">{article.excerpt}</p>
      )}
    </Link>
  )
}
