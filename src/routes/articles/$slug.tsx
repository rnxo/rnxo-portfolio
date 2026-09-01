import { createFileRoute } from '@tanstack/react-router'
import { getPublicArticle } from '#/server/articles.functions'
import ArticleBody from '#/components/article/ArticleBody'
import TableOfContents from '#/components/article/TableOfContents'
import { extractHeadings } from '#/lib/toc'

function formatDate(iso: string | null): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export const Route = createFileRoute('/articles/$slug')({
  loader: ({ params }) => getPublicArticle({ data: { slug: params.slug } }),
  head: ({ loaderData }) => {
    if (!loaderData) return {}
    const description = loaderData.excerpt ?? loaderData.title
    return {
      meta: [
        { title: `${loaderData.title} | skyremt` },
        { name: 'description', content: description },
        { property: 'og:title', content: loaderData.title },
        { property: 'og:description', content: description },
        { property: 'og:type', content: 'article' },
        { property: 'og:image', content: `/og/${loaderData.slug}` },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
    }
  },
  component: ArticlePage,
})

function ArticlePage() {
  const article = Route.useLoaderData()
  const headings = extractHeadings(article.body)

  return (
    <main className="page-wrap px-4 py-12 bg-color-sea-ink">
      <article>
        <header className="mb-8">
          <p className="island-kicker mb-2">
            {formatDate(article.publishedAt)}
          </p>
          <h1 className="display-title text-4xl font-bold text-[var(--sea-ink)] sm:text-5xl">
            {article.title}
          </h1>
        </header>

        {article.coverImageUrl && (
          <img
            src={article.coverImageUrl}
            alt=""
            className="mb-8 aspect-[1200/630] w-full rounded-2xl object-cover"
          />
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_260px]">
          <ArticleBody html={article.renderedHtml} />
          <aside>
            <div className="hidden lg:block lg:sticky lg:top-24">
              <TableOfContents items={headings} />
            </div>
          </aside>
        </div>
      </article>
    </main>
  )
}
