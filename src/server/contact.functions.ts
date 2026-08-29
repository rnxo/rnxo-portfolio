import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { getEnv } from './env.server'

// wrangler.jsonc の destination_address と必ず一致させる。
// 検証済み宛先以外に送ると無料枠から外れるため、コード側にも固定値で持つ。
const CONTACT_TO = 'kcinritz@gmail.com'
const CONTACT_FROM = 'noreply@skyremt.dev'

// 名前は件名に埋め込むため、改行を含むとヘッダを分割される恐れがある。
// 検証段階で改行・制御文字を落としておく。
const singleLine = (value: string) => value.replace(/[\r\n\t]/g, ' ').trim()

const contactSchema = z.object({
  name: z.string().transform(singleLine).pipe(z.string().min(1).max(100)),
  email: z.email().max(254),
  message: z.string().trim().min(10).max(4000),
})

// HTML 本文にそのまま入れると、入力内容がタグとして解釈されてしまう。
function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export const sendContactMessage = createServerFn({ method: 'POST' })
  .validator(contactSchema)
  .handler(async ({ data }) => {
    const { EMAIL } = getEnv()

    const subject = `[skyremt.dev] お問い合わせ: ${data.name}`

    const text = [
      `お名前: ${data.name}`,
      `メール: ${data.email}`,
      '',
      data.message,
    ].join('\n')

    // text だけだと一部のクライアントで読みにくく、html だけだと
    // プレーンテキスト表示のクライアントで空になる。両方入れる。
    const html = [
      `<p><strong>お名前</strong>: ${escapeHtml(data.name)}</p>`,
      `<p><strong>メール</strong>: ${escapeHtml(data.email)}</p>`,
      `<hr>`,
      `<p style="white-space:pre-wrap">${escapeHtml(data.message)}</p>`,
    ].join('')

    try {
      await EMAIL.send({
        to: CONTACT_TO,
        from: { email: CONTACT_FROM, name: 'skyremt.dev contact' },
        // 訪問者は宛先ではなくヘッダに入れる。Gmail からそのまま返信でき、
        // 宛先ではないので課金対象にならない。
        replyTo: data.email,
        subject,
        text,
        html,
      })
    } catch (error) {
      console.error('[contact] send failed', error)
      throw new Error('送信に失敗しました。時間をおいて再度お試しください。')
    }

    return { ok: true }
  })
