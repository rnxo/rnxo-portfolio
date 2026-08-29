import { env } from 'cloudflare:workers'

interface AppEnv extends Env {
  ADMIN_PASSWORD_HASH: string
  SESSION_SECRET: string
}

export function getEnv(): AppEnv {
  const raw = env
  // wrangler secret put は入力方法によって末尾に改行/空白が混入することがあり、
  // ADMIN_PASSWORD_HASH の場合はそれだけで検証が常に失敗するため、読み込み時に trim する。
  return {
    ...raw,
    ADMIN_PASSWORD_HASH: raw.ADMIN_PASSWORD_HASH.trim(),
    SESSION_SECRET: raw.SESSION_SECRET.trim(),
  }
}
