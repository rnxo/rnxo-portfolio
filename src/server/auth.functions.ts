import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { authMiddleware } from './auth-middleware'
import { getEnv } from './env.server'
import { verifyPassword } from './password.server'
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
    const ok = await verifyPassword(ADMIN_PASSWORD_HASH, data.password)
    if (!ok) {
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
