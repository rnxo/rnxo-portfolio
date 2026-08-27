import { createServerFn } from '@tanstack/react-start'
import { renderMarkdownToHtml } from './markdown.server'

const introCode = [
  '```ts',
  'const me: Profile = {',
  "  name: 'skyremt',",
  "  colleague: '京都コンピュータ学院',",
  "  gole: 'フルスタックエンジニア',",
  "  favs-anime: ['ギルクラ', 'ダリフラ', '東京グール'],",
  "  motto: '自分の知らない景色を求めて',",
  '}',
  '',
  'console.log(',
  '  `日々新しい技術に触れながら、つよつよエンジニアを目指しています。`,',
  ')',
  '```',
].join('\n')

export const getIntroCodeHtml = createServerFn({ method: 'GET' }).handler(
  async () => {
    return renderMarkdownToHtml(introCode)
  },
)
