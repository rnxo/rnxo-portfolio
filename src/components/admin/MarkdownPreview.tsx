import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

// 管理画面のライブプレビュー用。シンタックスハイライトは行わず(公開ページ側でのみ適用)、
// react-markdownの同期レンダリングだけで入力のたびに軽快に再描画できるようにしている。
export default function MarkdownPreview({ markdown }: { markdown: string }) {
  return (
    <div className="prose article-prose max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'wrap' }],
        ]}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  )
}
