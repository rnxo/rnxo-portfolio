import { useState, type ChangeEvent } from 'react'

type ContactFields = {
  name: string
  email: string
  message: string
}

const initialFields: ContactFields = { name: '', email: '', message: '' }

export function ContactForm() {
  const [fields, setFields] = useState<ContactFields>(initialFields)

  const handleChange =
    (key: keyof ContactFields) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFields((prev) => ({ ...prev, [key]: e.target.value }))

  return (
    <div className="island-shell rise-in mx-auto flex min-h-100 w-full max-w-2xl flex-col rounded-2xl">
      <form
        className="flex w-full flex-1 flex-col p-10"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
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
              value={fields.message}
              onChange={handleChange('message')}
            />
          </div>
        </div>

        <div className="mt-auto flex flex-col items-center justify-center pt-8">
          <button
            type="submit"
            className="demo-button font-mechanic tracking-[0.16em]"
          >
            SEND
          </button>
        </div>
      </form>
    </div>
  )
}
