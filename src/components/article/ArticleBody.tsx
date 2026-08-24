// 公開記事ページ用。Markdownはサーバー側(src/server/markdown.server.ts)で
// あらかじめHTMLに変換済みなので、ここではクライアントにMarkdown/シンタックス
// ハイライトの処理系を一切バンドルせずに描画するだけで済む。
export default function ArticleBody({ html }: { html: string }) {
  return (
    <div
      className="prose article-prose max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
