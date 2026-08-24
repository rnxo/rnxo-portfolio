import {
  Link,
  Outlet,
  createFileRoute,
  redirect,
  useRouter,
} from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { getSession, logout } from '#/server/auth.functions'

export const Route = createFileRoute('/admin/_authed')({
  beforeLoad: async () => {
    const session = await getSession()
    if (!session.authenticated) {
      throw redirect({ to: '/admin/login' })
    }
  },
  component: AdminLayout,
})

function AdminLayout() {
  const router = useRouter()
  const logoutFn = useServerFn(logout)

  async function handleLogout() {
    await logoutFn()
    await router.navigate({ to: '/admin/login' })
  }

  return (
    <div className="page-wrap px-4 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] pb-4">
        <nav className="flex items-center gap-4 text-sm font-semibold">
          <Link
            to="/admin"
            activeOptions={{ exact: true }}
            className="nav-link"
            activeProps={{ className: 'nav-link is-active' }}
          >
            記事一覧
          </Link>
          <Link
            to="/admin/articles/new"
            className="nav-link"
            activeProps={{ className: 'nav-link is-active' }}
          >
            新規作成
          </Link>
        </nav>
        <button
          type="button"
          onClick={handleLogout}
          className="demo-button demo-button-secondary"
        >
          ログアウト
        </button>
      </div>
      <Outlet />
    </div>
  )
}
