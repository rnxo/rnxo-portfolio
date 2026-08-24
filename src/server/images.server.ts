import { getEnv } from './env.server'

const ALLOWED_CONTENT_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
])
const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024 // 8MB

export interface UploadedImage {
  key: string
  url: string
}

function extensionFor(contentType: string): string {
  switch (contentType) {
    case 'image/png':
      return 'png'
    case 'image/jpeg':
      return 'jpg'
    case 'image/webp':
      return 'webp'
    case 'image/gif':
      return 'gif'
    default:
      return 'bin'
  }
}

// DESIGN.md 6章: articles/{articleId}/{uuid}.{ext} で名前空間を切る。
// 新規記事(未保存)からのアップロードは articleId として "drafts" を使う。
export async function uploadArticleImage(
  file: File,
  articleId: string,
): Promise<UploadedImage> {
  if (!ALLOWED_CONTENT_TYPES.has(file.type)) {
    throw new Error(
      '対応していない画像形式です(png / jpeg / webp / gif のみアップロードできます)',
    )
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error('画像サイズが大きすぎます(8MBまでアップロードできます)')
  }

  const { MEDIA } = getEnv()
  const key = `articles/${articleId}/${crypto.randomUUID()}.${extensionFor(file.type)}`
  await MEDIA.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type },
  })

  return { key, url: `/images/${key}` }
}

export async function getImageObject(
  key: string,
): Promise<R2ObjectBody | null> {
  const { MEDIA } = getEnv()
  return MEDIA.get(key)
}
