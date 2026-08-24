import { createServerFn } from '@tanstack/react-start'
import { authMiddleware } from './auth-middleware'
import { uploadArticleImage } from './images.server'

export const uploadImage = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator((data: unknown) => {
    if (!(data instanceof FormData)) {
      throw new Error('Expected FormData')
    }
    const file = data.get('file')
    const articleId = data.get('articleId')
    if (!(file instanceof File)) {
      throw new Error('画像ファイルが見つかりません')
    }
    return {
      file,
      articleId:
        typeof articleId === 'string' && articleId.length > 0
          ? articleId
          : 'drafts',
    }
  })
  .handler(async ({ data }) => {
    return uploadArticleImage(data.file, data.articleId)
  })
