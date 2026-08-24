import { useRef, useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import MarkdownPreview from '#/components/admin/MarkdownPreview'
import { slugify } from '#/lib/slug'
import type { Article, ArticleStatus } from '#/lib/types'
import {
  createArticleDraft,
  publishArticle,
  unpublishArticle,
  updateArticleDraft,
} from '#/server/articles.functions'
import { uploadImage } from '#/server/uploads.functions'

interface ArticleEditorProps {
  article?: Article
  onSaved?: (article: Article) => void
}

export default function ArticleEditor({
  article,
  onSaved,
}: ArticleEditorProps) {
  const router = useRouter()
  const createDraftFn = useServerFn(createArticleDraft)
  const updateDraftFn = useServerFn(updateArticleDraft)
  const publishFn = useServerFn(publishArticle)
  const unpublishFn = useServerFn(unpublishArticle)
  const uploadFn = useServerFn(uploadImage)

  const [id, setId] = useState(article?.id)
  const [title, setTitle] = useState(article?.title ?? '')
  const [slug, setSlug] = useState(article?.slug ?? '')
  const [slugTouched, setSlugTouched] = useState(Boolean(article))
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? '')
  const [coverImageUrl, setCoverImageUrl] = useState(
    article?.coverImageUrl ?? '',
  )
  const [body, setBody] = useState(article?.body ?? '')
  const [status, setStatus] = useState<ArticleStatus>(
    article?.status ?? 'draft',
  )
  const [error, setError] = useState('')
  const [saving, setSaving] = useState<
    'draft' | 'publish' | 'unpublish' | 'cover' | 'body-image' | null
  >(null)

  const bodyTextareaRef = useRef<HTMLTextAreaElement>(null)

  function handleTitleChange(value: string) {
    setTitle(value)
    if (!slugTouched) setSlug(slugify(value))
  }

  async function persist(): Promise<Article> {
    const payload = {
      title: title.trim(),
      slug: slug.trim() || slugify(title),
      excerpt: excerpt.trim() || undefined,
      body,
      coverImageUrl: coverImageUrl.trim() || undefined,
    }

    const saved = id
      ? await updateDraftFn({ data: { ...payload, id } })
      : await createDraftFn({ data: payload })

    setId(saved.id)
    setSlug(saved.slug)
    setSlugTouched(true)
    return saved
  }

  async function handleSaveDraft() {
    setError('')
    setSaving('draft')
    try {
      const saved = await persist()
      if (!article) {
        await router.navigate({
          to: '/admin/articles/$id/edit',
          params: { id: saved.id },
        })
      }
      onSaved?.(saved)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '保存に失敗しました')
    } finally {
      setSaving(null)
    }
  }

  async function handlePublishToggle() {
    setError('')
    setSaving(status === 'published' ? 'unpublish' : 'publish')
    try {
      const saved = await persist()
      const updated =
        status === 'published'
          ? await unpublishFn({ data: { id: saved.id } })
          : await publishFn({ data: { id: saved.id } })
      setStatus(updated.status)
      if (!article) {
        await router.navigate({
          to: '/admin/articles/$id/edit',
          params: { id: updated.id },
        })
      }
      onSaved?.(updated)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '処理に失敗しました')
    } finally {
      setSaving(null)
    }
  }

  async function uploadFile(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('articleId', id ?? 'drafts')
    const result = await uploadFn({ data: formData })
    return result.url
  }

  async function handleCoverImageChange(file: File | undefined) {
    if (!file) return
    setError('')
    setSaving('cover')
    try {
      setCoverImageUrl(await uploadFile(file))
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : '画像のアップロードに失敗しました',
      )
    } finally {
      setSaving(null)
    }
  }

  async function handleBodyImageChange(file: File | undefined) {
    if (!file) return
    setError('')
    setSaving('body-image')
    try {
      const url = await uploadFile(file)
      const textarea = bodyTextareaRef.current
      const markdownImage = `![${file.name}](${url})\n`
      if (textarea) {
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const next = body.slice(0, start) + markdownImage + body.slice(end)
        setBody(next)
        requestAnimationFrame(() => {
          textarea.focus()
          textarea.selectionStart = textarea.selectionEnd =
            start + markdownImage.length
        })
      } else {
        setBody((current) => `${current}\n${markdownImage}`)
      }
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : '画像のアップロードに失敗しました',
      )
    } finally {
      setSaving(null)
    }
  }

  const isBusy = saving !== null

  return (
    <div>
      {error && (
        <div className="demo-alert demo-alert-danger mb-4 text-sm">{error}</div>
      )}

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="demo-pill">
          {status === 'published' ? '公開中' : '下書き'}
        </span>
        <div className="ml-auto flex flex-wrap gap-2">
          <button
            type="button"
            className="demo-button demo-button-secondary"
            onClick={handleSaveDraft}
            disabled={isBusy}
          >
            {saving === 'draft' ? '保存中…' : '下書き保存'}
          </button>
          <button
            type="button"
            className="demo-button"
            onClick={handlePublishToggle}
            disabled={isBusy}
          >
            {saving === 'publish' || saving === 'unpublish'
              ? '処理中…'
              : status === 'published'
                ? '公開を取り下げる'
                : '公開する'}
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label
          className="mb-1 block text-sm font-semibold text-[var(--sea-ink)]"
          htmlFor="article-title"
        >
          タイトル
        </label>
        <input
          id="article-title"
          className="demo-input"
          value={title}
          onChange={(event) => handleTitleChange(event.target.value)}
          placeholder="記事のタイトル"
        />
      </div>

      <div className="mb-4">
        <label
          className="mb-1 block text-sm font-semibold text-[var(--sea-ink)]"
          htmlFor="article-slug"
        >
          スラッグ(URL)
        </label>
        <input
          id="article-slug"
          className="demo-input"
          value={slug}
          onChange={(event) => {
            setSlugTouched(true)
            setSlug(event.target.value)
          }}
          placeholder="article-slug"
        />
        <p className="demo-muted mt-1 text-xs">
          タイトルから自動生成されます。必要なら手動で編集してください。
        </p>
      </div>

      <div className="mb-4">
        <label
          className="mb-1 block text-sm font-semibold text-[var(--sea-ink)]"
          htmlFor="article-excerpt"
        >
          要約(一覧・OGP用、任意)
        </label>
        <textarea
          id="article-excerpt"
          className="demo-textarea"
          value={excerpt}
          onChange={(event) => setExcerpt(event.target.value)}
          rows={2}
        />
      </div>

      <div className="mb-6">
        <span className="mb-1 block text-sm font-semibold text-[var(--sea-ink)]">
          アイキャッチ画像(任意)
        </span>
        {coverImageUrl && (
          <img
            src={coverImageUrl}
            alt=""
            className="mb-2 aspect-[1200/630] w-full max-w-sm rounded-xl object-cover"
          />
        )}
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          onChange={(event) => handleCoverImageChange(event.target.files?.[0])}
          disabled={isBusy}
        />
        {saving === 'cover' && (
          <p className="demo-muted mt-1 text-xs">アップロード中…</p>
        )}
      </div>

      <div className="mb-2">
        <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
          <label
            className="text-sm font-semibold text-[var(--sea-ink)]"
            htmlFor="article-body"
          >
            本文(Markdown)
          </label>
          <label className="demo-button demo-button-secondary cursor-pointer text-xs">
            本文に画像を挿入
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={(event) =>
                handleBodyImageChange(event.target.files?.[0])
              }
              disabled={isBusy}
            />
          </label>
        </div>
        {saving === 'body-image' && (
          <p className="demo-muted mb-1 text-xs">アップロード中…</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <textarea
          id="article-body"
          ref={bodyTextareaRef}
          className="demo-textarea min-h-[28rem] font-mono text-sm"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="# 見出し&#10;&#10;本文をMarkdownで書きます。"
        />
        <div className="demo-panel min-h-[28rem] overflow-auto">
          <MarkdownPreview markdown={body || '*(プレビュー)*'} />
        </div>
      </div>
    </div>
  )
}
