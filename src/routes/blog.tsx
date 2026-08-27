import { createFileRoute } from '@tanstack/react-router'
import { listPublicArticles } from '#/server/articles.functions'
import ArticleCard from '#/components/article/ArticleCard'

export const Route = createFileRoute('/blog')({
  loader: () => listPublicArticles(),
  component: Home,
})

function Home() {
  const articles = Route.useLoaderData()

  return (
    <main className="page-wrap px-4 py-12">
      <div className="mb-8">
        <p className="island-kicker mb-2">Articles</p>
        <h1 className="display-title text-4xl font-bold text-[var(--sea-ink)] sm:text-5xl">
          最近の記事
        </h1>
      </div>

      {articles.length === 0 ? (
        <div className="island-shell rounded-2xl p-8 text-[var(--sea-ink-soft)]">
          まだ記事がありません。
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </main>
  )
}
