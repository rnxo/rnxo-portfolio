import { createFileRoute } from '@tanstack/react-router'
import ArticleEditor from '#/components/admin/ArticleEditor'

export const Route = createFileRoute('/admin/_authed/articles/new')({
  component: NewArticlePage,
})

function NewArticlePage() {
  return (
    <div>
      <h1 className="demo-title mb-6">新規記事</h1>
      <ArticleEditor />
    </div>
  )
}
