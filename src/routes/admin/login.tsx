import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { getSession, login } from '#/server/auth.functions'

export const Route = createFileRoute('/admin/login')({
  beforeLoad: async () => {
    const session = await getSession()
    if (session.authenticated) {
      throw redirect({ to: '/admin' })
    }
  },
  component: LoginPage,
})

function LoginPage() {
  const router = useRouter()
  const loginFn = useServerFn(login)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await loginFn({ data: { password } })
      await router.navigate({ to: '/admin' })
    } catch {
      setError('パスワードが正しくありません')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="page-wrap flex min-h-[70vh] items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="demo-panel w-full max-w-sm">
        <h1 className="demo-title mb-1">管理画面ログイン</h1>
        <p className="demo-muted mb-6 text-sm">
          パスワードを入力してください。
        </p>

        {error && (
          <div className="demo-alert demo-alert-danger mb-4 text-sm">
            {error}
          </div>
        )}

        <label
          className="mb-1 block text-sm font-semibold text-[var(--sea-ink)]"
          htmlFor="password"
        >
          パスワード
        </label>
        <input
          id="password"
          type="password"
          className="demo-input mb-4"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoFocus
          required
        />

        <button
          type="submit"
          className="demo-button w-full"
          disabled={submitting}
        >
          {submitting ? 'ログイン中…' : 'ログイン'}
        </button>
      </form>
    </main>
  )
}
