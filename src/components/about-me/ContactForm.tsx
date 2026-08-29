import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useServerFn } from '@tanstack/react-start'
import { sendContactMessage } from '#/server/contact.functions'

type ContactFields = {
  name: string
  email: string
  message: string
}

type InputStatus = 'idle' | 'sending' | 'sent'

const initialFields: ContactFields = { name: '', email: '', message: '' }

export function ContactForm() {
  const sendContact = useServerFn(sendContactMessage)
  const [fields, setFields] = useState<ContactFields>(initialFields)
  const [status, setStatus] = useState<InputStatus>('idle')
  const [error, setError] = useState('')

  const handleChange =
    (key: keyof ContactFields) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFields((prev) => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setStatus('sending')

    try {
      await sendContact({ data: fields })
      setStatus('sent')
      setFields(initialFields)
    } catch {
      setStatus('idle')
      setError('FAIL TO SEND MESSAGE. WAIT A FEW MINUTES AND TRY AGAIN')
    }
  }

  return (
    <div className="island-shell rise-in mx-auto flex min-h-100 w-full max-w-2xl flex-col rounded-2xl">
      <form
        className="flex w-full flex-1 flex-col p-10"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            {status === 'sent' && (
              <div className="demo-alert mb-4 text-sm">
                送信しました。返信をお待ちください。
              </div>
            )}
            {error && (
              <div className="demo-alert demo-alert-danger mb-4 text-sm">
                {error}
              </div>
            )}
            <label htmlFor="contact-name" className="island-kicker text-start">
              NAME
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              autoComplete="name"
              className="demo-input"
              placeholder="お名前"
              value={fields.name}
              onChange={handleChange('name')}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="contact-email" className="island-kicker text-start">
              EMAIL
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              className="demo-input"
              placeholder="you@example.com"
              value={fields.email}
              onChange={handleChange('email')}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="contact-message"
              className="island-kicker text-start"
            >
              MESSAGE
            </label>
            <textarea
              id="contact-message"
              name="message"
              className="demo-textarea"
              placeholder="ご用件をお書きください"
              required
              minLength={10}
              value={fields.message}
              onChange={handleChange('message')}
            />
          </div>
        </div>

        <div className="mt-auto flex flex-col items-center justify-center pt-8">
          <button
            type="submit"
            disabled={status === 'sending'}
            className="demo-button font-mechanic tracking-[0.16em]"
          >
            {status === 'sending' ? 'SENDING…' : 'SEND'}
          </button>
        </div>
      </form>
    </div>
  )
}
