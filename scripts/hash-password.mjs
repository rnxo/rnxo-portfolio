#!/usr/bin/env node
// 管理画面用パスワードのハッシュを生成するCLI。
// src/server/password.server.ts と同一アルゴリズム・同一フォーマット(pbkdf2-sha256)。
import { webcrypto as crypto } from 'node:crypto'

const ALGORITHM = 'pbkdf2-sha256'
const ITERATIONS = 210_000
const KEY_LENGTH_BITS = 256

function toHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  )
  const derived = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    KEY_LENGTH_BITS,
  )
  return `${ALGORITHM}$${ITERATIONS}$${toHex(salt)}$${toHex(derived)}`
}

const password = process.argv[2]
if (!password) {
  console.error('使い方: node scripts/hash-password.mjs <パスワード>')
  process.exit(1)
}

const hash = await hashPassword(password)
console.log(hash)
