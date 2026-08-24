import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeStringify from 'rehype-stringify'
import rehypeShikiFromHighlighter from '@shikijs/rehype/core'
import { createHighlighterCore  } from 'shiki/core'
import type {HighlighterGeneric} from 'shiki/core';
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

export async function renderMarkdownToHtml(markdown: string): Promise<string> {
  const highlighter = await getHighlighter()

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
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
