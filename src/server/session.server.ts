import {
  getRequest,
  getRequestHeader,
  setResponseHeader,
} from '@tanstack/react-start/server'
import { getEnv } from './env.server'

// 単一管理者・DBセッションテーブルなしのステートレスな署名付きCookie。
// DESIGN.md 5章の方針: 有効期限だけを載せたペイロードをHMAC-SHA256で署名する。
const COOKIE_NAME = 'session'
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 14 // 14日

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64UrlDecode(value: string): Uint8Array {
  const padded = value
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(Math.ceil(value.length / 4) * 4, '=')
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)
  return bytes
}

async function getHmacKey(): Promise<CryptoKey> {
  const { SESSION_SECRET } = getEnv()
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(SESSION_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  )
}

async function signToken(payload: { exp: number }): Promise<string> {
  const key = await getHmacKey()
  const payloadBytes = new TextEncoder().encode(JSON.stringify(payload))
  const signature = await crypto.subtle.sign('HMAC', key, payloadBytes)
  return `${base64UrlEncode(payloadBytes)}.${base64UrlEncode(new Uint8Array(signature))}`
}

async function verifyToken(token: string): Promise<{ exp: number } | null> {
  const [payloadPart, signaturePart] = token.split('.')
  if (!payloadPart || !signaturePart) return null

  try {
    const key = await getHmacKey()
    const payloadBytes = base64UrlDecode(payloadPart)
    const signatureBytes = base64UrlDecode(signaturePart)
    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBytes as BufferSource,
      payloadBytes as BufferSource,
    )
    if (!valid) return null

    const payload = JSON.parse(new TextDecoder().decode(payloadBytes)) as {
      exp: number
    }
    if (
      typeof payload.exp !== 'number' ||
      payload.exp < Math.floor(Date.now() / 1000)
    )
      return null
    return payload
  } catch {
    return null
  }
}

function readCookieValue(): string | null {
  const header = getRequestHeader('cookie')
  if (!header) return null
  for (const part of header.split(/;\s*/)) {
    const eq = part.indexOf('=')
    if (eq === -1) continue
    if (part.slice(0, eq) === COOKIE_NAME) return part.slice(eq + 1)
  }
  return null
}

function buildCookieHeader(value: string, maxAgeSeconds: number): string {
  // Secureはリクエストがhttpsのときだけ付与する(ローカルhttp開発でCookieが
  // 落とされないようにするため)。本番のCloudflare Workersは常にhttpsになる。
  const isHttps = getRequest().url.startsWith('https:')
  const attrs = [
    `${COOKIE_NAME}=${value}`,
    'HttpOnly',
    'SameSite=Lax',
    'Path=/',
    `Max-Age=${maxAgeSeconds}`,
  ]
  if (isHttps) attrs.push('Secure')
  return attrs.join('; ')
}

export async function issueSessionCookie(): Promise<void> {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS
  const token = await signToken({ exp })
  setResponseHeader('Set-Cookie', buildCookieHeader(token, SESSION_TTL_SECONDS))
}

export function clearSessionCookie(): void {
  setResponseHeader('Set-Cookie', buildCookieHeader('', 0))
}

export async function hasValidSession(): Promise<boolean> {
  const token = readCookieValue()
  if (!token) return false
  return (await verifyToken(token)) !== null
}
