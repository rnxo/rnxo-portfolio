import { createFileRoute } from '@tanstack/react-router'
import { getImageObject } from '#/server/images.server'

// R2バケットを直接パブリック化せず、Workers経由でオブジェクトを配信する(DESIGN.md 6章)。
export const Route = createFileRoute('/images/$')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const key = params._splat
        if (!key) {
          return new Response('Not Found', { status: 404 })
        }

        const object = await getImageObject(key)
        if (!object) {
          return new Response('Not Found', { status: 404 })
        }

        return new Response(object.body, {
          headers: {
            'Content-Type':
              object.httpMetadata?.contentType ?? 'application/octet-stream',
            'Cache-Control': 'public, max-age=31536000, immutable',
            ETag: object.httpEtag,
          },
        })
      },
    },
  },
})
