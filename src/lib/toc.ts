import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import { visit } from 'unist-util-visit'
import GithubSlugger from 'github-slugger'
import type { Heading, Text } from 'mdast'

export interface TocItem {
  id: string
  text: string
  depth: 2 | 3
}

// rehype-slugと同じ github-slugger を同じ走査順で使うことで、
// ここで作るTOCのリンク先idを実際のレンダリング結果の見出しidと一致させている。
export function extractHeadings(markdown: string): TocItem[] {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(markdown)
  const slugger = new GithubSlugger()
  const items: TocItem[] = []

  visit(tree, 'heading', (node: Heading) => {
    if (node.depth !== 2 && node.depth !== 3) return

    const text = node.children
      .filter((child): child is Text => child.type === 'text')
      .map((child) => child.value)
      .join('')
    if (!text) return

    items.push({ id: slugger.slug(text), text, depth: node.depth })
  })

  return items
}
