import { createFileRoute } from '@tanstack/react-router'
import ArticleEditor from '#/components/admin/ArticleEditor'
import { getAdminArticle } from '#/server/articles.functions'

export const Route = createFileRoute('/admin/_authed/articles/$id/edit')({
  loader: ({ params }) => getAdminArticle({ data: { id: params.id } }),
  component: EditArticlePage,
})

function EditArticlePage() {
  const article = Route.useLoaderData()

  return (
    <div>
      <h1 className="demo-title mb-6">記事を編集</h1>
      <ArticleEditor key={article.id} article={article} />
    </div>
  )
}
