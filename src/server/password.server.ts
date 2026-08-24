// PBKDF2-SHA256(Web Crypto)によるパスワードハッシュ化。
// scripts/hash-password.mjs と同一アルゴリズム・同一フォーマットで実装している。
const ALGORITHM = 'pbkdf2-sha256'
const ITERATIONS = 210_000
const KEY_LENGTH_BITS = 256

function toHex(buffer: ArrayBuffer | Uint8Array): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

function fromHex(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < bytes.length; i += 1) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  }
  return bytes
}

async function deriveBits(
  password: string,
  salt: Uint8Array,
  iterations: number,
) {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  )
  return crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: salt as BufferSource, iterations, hash: 'SHA-256' },
    keyMaterial,
    KEY_LENGTH_BITS,
  )
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const derived = await deriveBits(password, salt, ITERATIONS)
  return `${ALGORITHM}$${ITERATIONS}$${toHex(salt)}$${toHex(derived)}`
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let mismatch = 0
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return mismatch === 0
}

export async function verifyPassword(
  storedHash: string,
  password: string,
): Promise<boolean> {
  const parts = storedHash.split('$')
  if (parts.length !== 4 || parts[0] !== ALGORITHM) return false

  const iterations = Number(parts[1])
  const salt = fromHex(parts[2])
  const expectedHex = parts[3]
  if (!Number.isFinite(iterations) || salt.length === 0 || !expectedHex)
    return false

  const derived = await deriveBits(password, salt, iterations)
  return timingSafeEqual(toHex(derived), expectedHex)
}
