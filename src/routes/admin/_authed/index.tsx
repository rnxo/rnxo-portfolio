import { Link, createFileRoute, useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import {
  listAdminArticles,
  publishArticle,
  removeArticle,
  unpublishArticle,
} from '#/server/articles.functions'
import type { ArticleStatus } from '#/lib/types'

export const Route = createFileRoute('/admin/_authed/')({
  loader: () => listAdminArticles(),
  component: AdminArticleList,
})

function formatDate(iso: string | null): string {
  if (!iso) return '-'
  return new Date(iso).toLocaleString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function AdminArticleList() {
  const articles = Route.useLoaderData()
  const router = useRouter()
  const publishFn = useServerFn(publishArticle)
  const unpublishFn = useServerFn(unpublishArticle)
  const removeFn = useServerFn(removeArticle)

  async function handlePublishToggle(id: string, status: ArticleStatus) {
    if (status === 'published') {
      await unpublishFn({ data: { id } })
    } else {
      await publishFn({ data: { id } })
    }
    await router.invalidate()
  }

  async function handleDelete(id: string, title: string) {
    if (!window.confirm(`「${title}」を削除します。よろしいですか?`)) return
    await removeFn({ data: { id } })
    await router.invalidate()
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="demo-title">記事一覧</h1>
        <Link to="/admin/articles/new" className="demo-button">
          新規作成
        </Link>
      </div>

      {articles.length === 0 ? (
        <p className="demo-muted">まだ記事がありません。</p>
      ) : (
        <div className="demo-table-shell">
          <table className="demo-table">
            <thead>
              <tr>
                <th>タイトル</th>
                <th>状態</th>
                <th>公開日</th>
                <th>更新日</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id}>
                  <td>{article.title}</td>
                  <td>
                    <span className="demo-pill">
                      {article.status === 'published' ? '公開中' : '下書き'}
                    </span>
                  </td>
                  <td>{formatDate(article.publishedAt)}</td>
                  <td>{formatDate(article.updatedAt)}</td>
                  <td className="whitespace-nowrap">
                    <div className="flex justify-end gap-2">
                      <Link
                        to="/admin/articles/$id/edit"
                        params={{ id: article.id }}
                        className="demo-button demo-button-secondary"
                      >
                        編集
                      </Link>
                      <button
                        type="button"
                        className="demo-button demo-button-secondary"
                        onClick={() =>
                          handlePublishToggle(article.id, article.status)
                        }
                      >
                        {article.status === 'published'
                          ? '取り下げ'
                          : '公開する'}
                      </button>
                      <button
                        type="button"
                        className="demo-button demo-button-danger"
                        onClick={() => handleDelete(article.id, article.title)}
                      >
                        削除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
