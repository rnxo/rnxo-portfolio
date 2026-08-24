import { env } from 'cloudflare:workers'

interface AppEnv extends Env {
  ADMIN_PASSWORD_HASH: string
  SESSION_SECRET: string
}

export function getEnv(): AppEnv {
  return env as unknown as AppEnv
}
