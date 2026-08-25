import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { authMiddleware } from './auth-middleware'
import { getEnv } from './env.server'
import { inspectStoredHash, verifyPassword } from './password.server'
import {
  clearSessionCookie,
  hasValidSession,
  issueSessionCookie,
} from './session.server'

export const getSession = createServerFn({ method: 'GET' }).handler(
  async () => {
    return { authenticated: await hasValidSession() }
  },
)

export const login = createServerFn({ method: 'POST' })
  .validator(z.object({ password: z.string().min(1) }))
  .handler(async ({ data }) => {
    const { ADMIN_PASSWORD_HASH } = getEnv()

    const inspection = inspectStoredHash(ADMIN_PASSWORD_HASH)
    if (!inspection.valid) {
      console.error(
        `[login] ADMIN_PASSWORD_HASH is ${inspection.reason} (length=${inspection.length})`,
      )
      throw new Error('サーバー設定エラー: 管理者に連絡してください')
    }

    const ok = await verifyPassword(ADMIN_PASSWORD_HASH, data.password)
    if (!ok) {
      console.error(
        `[login] password mismatch (inputLength=${data.password.length}, storedHash: iterations=${inspection.iterations} saltLength=${inspection.saltLength} hashLength=${inspection.hashLength})`,
      )
      throw new Error('パスワードが正しくありません')
    }
    await issueSessionCookie()
    return { ok: true }
  })

export const logout = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .handler(async () => {
    clearSessionCookie()
    return { ok: true }
  })
