import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeStringify from 'rehype-stringify'
import rehypeShikiFromHighlighter from '@shikijs/rehype/core'
import { createHighlighterCore } from 'shiki/core'
import type { HighlighterGeneric } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import githubLight from '@shikijs/themes/github-light'
import githubDark from '@shikijs/themes/github-dark'
import langJavascript from '@shikijs/langs/javascript'
import langTypescript from '@shikijs/langs/typescript'
import langJsx from '@shikijs/langs/jsx'
import langTsx from '@shikijs/langs/tsx'
import langJson from '@shikijs/langs/json'
import langBash from '@shikijs/langs/bash'
import langShellscript from '@shikijs/langs/shellscript'
import langPython from '@shikijs/langs/python'
import langHtml from '@shikijs/langs/html'
import langCss from '@shikijs/langs/css'
import langScss from '@shikijs/langs/scss'
import langMarkdown from '@shikijs/langs/markdown'
import langYaml from '@shikijs/langs/yaml'
import langSql from '@shikijs/langs/sql'
import langGo from '@shikijs/langs/go'
import langRust from '@shikijs/langs/rust'
import langJava from '@shikijs/langs/java'
import langC from '@shikijs/langs/c'
import langCpp from '@shikijs/langs/cpp'
import langCsharp from '@shikijs/langs/csharp'
import langPhp from '@shikijs/langs/php'
import langRuby from '@shikijs/langs/ruby'
import langSwift from '@shikijs/langs/swift'
import langKotlin from '@shikijs/langs/kotlin'
import langDockerfile from '@shikijs/langs/dockerfile'
import langDiff from '@shikijs/langs/diff'
import langGraphql from '@shikijs/langs/graphql'
import langToml from '@shikijs/langs/toml'
import { visit } from 'unist-util-visit'
import type { Code, Root } from 'mdast'

// Cloudflare Workersのバンドルサイズを抑えるため、shikiは"full bundle"(全言語)ではなく
// createHighlighterCore + 個別言語importの構成にしている。JS正規表現エンジンを使い、
// oniguruma(WASM)には依存しない。
let highlighterPromise: Promise<HighlighterGeneric<any, any>> | null = null

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighterCore({
      themes: [githubLight, githubDark],
      langs: [
        langJavascript,
        langTypescript,
        langJsx,
        langTsx,
        langJson,
        langBash,
        langShellscript,
        langPython,
        langHtml,
        langCss,
        langScss,
        langMarkdown,
        langYaml,
        langSql,
        langGo,
        langRust,
        langJava,
        langC,
        langCpp,
        langCsharp,
        langPhp,
        langRuby,
        langSwift,
        langKotlin,
        langDockerfile,
        langDiff,
        langGraphql,
        langToml,
      ],
      engine: createJavaScriptRegexEngine(),
    })
  }
  return highlighterPromise
}

// Zenn記法の ```ts:Button.tsx / ```ts: Button.tsx に対応する。
// CommonMarkのinfo stringは最初の空白までがlangになるため、素のままだと
// lang が "ts:Button.tsx" や "ts:" になりShikiが言語を解決できず、
// fallbackLanguage(plaintext)に落ちてハイライトが効かなくなる。
// ここで言語とファイル名を分離し、ファイル名はmetaへ退避しておく。
function remarkCodeFilename() {
  return (tree: Root) => {
    visit(tree, 'code', (node: Code) => {
      if (!node.lang) return
      const colon = node.lang.indexOf(':')
      if (colon === -1) return

      const filename = node.lang.slice(colon + 1).trim()
      const lang = node.lang.slice(0, colon).trim()

      node.lang = lang || null
      node.meta = [filename, node.meta].filter(Boolean).join(' ').trim() || null
    })
  }
}

export async function renderMarkdownToHtml(markdown: string): Promise<string> {
  const highlighter = await getHighlighter()

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkCodeFilename)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: 'wrap' })
    .use(rehypeShikiFromHighlighter, highlighter, {
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
      fallbackLanguage: 'plaintext',
    })
    .use(rehypeStringify)
    .process(markdown)

  return String(file)
}
