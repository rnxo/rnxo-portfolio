import { ImageResponse, loadGoogleFont } from 'workers-og'
import { getEnv } from './env.server'

const OG_WIDTH = 1200
const OG_HEIGHT = 630
// 大文字表記を直接埋め込む(CSSのtext-transformで大文字化すると、
// フォントサブセットに小文字分の字形しか含まれず表示が欠ける)。
const BRAND = 'SKYREMT'
const FONT_FAMILY = 'Noto Sans JP'

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// DESIGN.md 9章の配色に合わせたシンプルなOGP画像テンプレート
// (生成画像は静的PNGなのでライトテーマの色を固定で使う)。
function renderOgHtml(title: string): string {
  return `
    <div style="display:flex;flex-direction:column;justify-content:space-between;width:100%;height:100%;padding:64px;background:linear-gradient(160deg,#f3f6fb,#e7edf5);font-family:'${FONT_FAMILY}';">
      <div style="display:flex;align-items:center;font-size:30px;font-weight:700;color:#2f5a8a;letter-spacing:4px;">${BRAND}</div>
      <div style="display:flex;font-size:58px;font-weight:800;line-height:1.28;color:#17293a;">${escapeHtml(title)}</div>
    </div>
  `
}

export function ogImageKey(slug: string): string {
  return `og-images/${slug}.png`
}

export async function generateAndCacheOgImage(
  slug: string,
  title: string,
): Promise<ArrayBuffer> {
  const { MEDIA } = getEnv()
  // 日本語タイトルの字形が欠けないよう、実際に使う文字だけを含むGoogle Fontsのサブセットを都度取得する。
  const fontData = await loadGoogleFont({
    family: FONT_FAMILY,
    weight: 700,
    text: `${BRAND}${title}`,
  })
  const response = new ImageResponse(renderOgHtml(title), {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    fonts: [
      { name: FONT_FAMILY, data: fontData, weight: 700, style: 'normal' },
    ],
  })
  const buffer = await response.arrayBuffer()
  await MEDIA.put(ogImageKey(slug), buffer, {
    httpMetadata: { contentType: 'image/png' },
  })
  return buffer
}

export async function getCachedOgImage(
  slug: string,
): Promise<R2ObjectBody | null> {
  const { MEDIA } = getEnv()
  return MEDIA.get(ogImageKey(slug))
}

export async function deleteCachedOgImage(slug: string): Promise<void> {
  const { MEDIA } = getEnv()
  await MEDIA.delete(ogImageKey(slug))
}
