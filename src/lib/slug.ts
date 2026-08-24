// タイトルから簡易スラッグを生成する(3章のとおり、生成後は手動編集可能)。
// 日本語タイトルなどASCII化できない場合は短いランダムIDにフォールバックする。
export function slugify(title: string): string {
  const ascii = title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  if (ascii.length >= 3) return ascii

  return `article-${crypto.randomUUID().slice(0, 8)}`
}
