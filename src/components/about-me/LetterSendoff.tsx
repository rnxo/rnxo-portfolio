import { useEffect, useRef } from 'react'
import { useAnimate } from 'motion/react'

type LetterSendOffProps = {
  name: string
  message: string
  onComplete: () => void
}

const CARD = '.sendoff-postcard'
const FACE = '.sendoff-postcard-face'
const SHADE = '.sendoff-plane-shade'
const RACK = '.sendoff-rack'

const EASE_SOFT = [0.16, 1, 0.3, 1] as const
const EASE_SWIFT = [0.76, 0, 0.24, 1] as const

// はがきと同じ4頂点・同じ単位(%)。ここが崩れるとモーフが壊れる
const PLANE_CLIP = 'polygon(0% 0%, 100% 50%, 0% 100%, 22% 52%)'

function formatToday() {
  const now = new Date()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}.${mm}.${dd}`
}

export function LetterSendoff({
  name,
  message,
  onComplete,
}: LetterSendOffProps) {
  const [scope, animate] = useAnimate<HTMLDivElement>()

  // 親の再レンダリングで演出が再実行されないよう、onComplete は ref 経由で読む
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onCompleteRef.current()
      return
    }

    let cancelled = false

    async function run() {
      // 1. はがき化
      await animate(
        CARD,
        { opacity: [0, 1], y: [26, 0], rotate: [-9, -3], scale: [0.84, 1] },
        { duration: 0.55, ease: EASE_SOFT },
      )
      if (cancelled) return

      // 2. ラック登場(背板・前板が同時に上がってくる)
      await animate(
        RACK,
        { opacity: [0, 1], y: [56, 0] },
        { duration: 0.45, ease: EASE_SOFT },
      )
      if (cancelled) return

      // 3'. 投函の反動(await せず 3 と並行)
      animate(RACK, { rotate: [0, -2.6, 1.7, 0] }, { duration: 0.7, ease: 'easeOut' })

      // 3. 投函
      await animate(
        CARD,
        { x: -4, y: 132, rotate: -5, scale: 0.6 },
        { duration: 0.55, ease: EASE_SWIFT },
      )
      if (cancelled) return

      // 4. 浮上(delay の 0.28 秒が「ラックに刺さったまま止まる」間になる)
      await animate(
        CARD,
        { y: 42, rotate: -8, scale: 0.66 },
        { duration: 0.5, delay: 0.28, ease: EASE_SOFT },
      )
      if (cancelled) return

      // 5a/5b. 宛名面を消し、紙の陰影を出す(どちらも await しない)
      animate(FACE, { opacity: 0 }, { duration: 0.28, ease: 'easeIn' })
      animate(SHADE, { opacity: 1 }, { duration: 0.4, delay: 0.12, ease: 'easeOut' })

      // 5c. 輪郭を紙飛行機に折る
      await animate(
        CARD,
        { clipPath: PLANE_CLIP, rotate: -16, scale: 0.46, y: 26 },
        { duration: 0.6, ease: EASE_SWIFT },
      )
      if (cancelled) return

      // 6'. ラック退場(await せず 6 と並行)
      animate(RACK, { opacity: 0, y: 28 }, { duration: 0.5, delay: 0.25, ease: 'easeIn' })

      // 6. 飛翔。いったん左に引いてから右上へ抜けて「助走」を作る。
      //    配列の先頭は 5c の終了値と必ず一致させること(ずれると開始時に飛ぶ)
      await animate(
        CARD,
        {
          x: [-4, -50, 126, 426],
          y: [26, 8, -78, -330],
          rotate: [-16, -10, -24, -36],
          scale: [0.46, 0.44, 0.38, 0.2],
          opacity: [1, 1, 1, 0],
        },
        { duration: 1.15, ease: EASE_SWIFT, times: [0, 0.16, 0.48, 1] },
      )
      if (cancelled) return

      onCompleteRef.current()
    }

    run()

    return () => {
      cancelled = true
    }
  }, [animate])

  return (
    <div
      ref={scope}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-30"
    >
      {/* 背板 + 先に届いている手紙2通 */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex justify-center">
        <svg
          className="sendoff-rack w-[min(20rem,92%)]"
          viewBox="0 0 320 132"
          fill="none"
        >
          <defs>
            <linearGradient id="sendoff-rack-back" x1="0" y1="0" x2="0" y2="1">
              <stop stopColor="#24405a" />
              <stop offset="1" stopColor="#14253a" />
            </linearGradient>
          </defs>
          <rect
            x="14"
            y="4"
            width="292"
            height="120"
            rx="9"
            fill="url(#sendoff-rack-back)"
          />
          <rect
            x="64"
            y="14"
            width="92"
            height="58"
            rx="3"
            fill="#f2ece0"
            transform="rotate(-4 110 43)"
          />
          <rect
            x="152"
            y="20"
            width="86"
            height="54"
            rx="3"
            fill="#e7edf3"
            transform="rotate(3 195 47)"
          />
        </svg>
      </div>

      {/* はがき(演出の主役) */}
      <div className="absolute inset-0 z-20 flex items-end justify-center">
        <div className="sendoff-postcard">
          <div className="sendoff-postcard-face">
            <div className="flex items-start justify-between">
              <span className="font-mechanic text-[7px] tracking-[0.24em]">
                POST CARD
              </span>
              {/* 切手の絵柄を紙飛行機にして伏線にする */}
              <svg width="22" height="26" viewBox="0 0 22 26" fill="none">
                <rect
                  x="0.75"
                  y="0.75"
                  width="20.5"
                  height="24.5"
                  rx="1.5"
                  fill="#f7f1e4"
                  stroke="#a9b8c6"
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                />
                <path d="M4 15 L18 7 L11 19 L9.6 14.6 Z" fill="#5d7f9e" />
              </svg>
            </div>

            <p className="mt-1.5 text-[9px] tracking-[0.12em]">To. SKYREMT</p>
            <div className="sendoff-rule mt-1" />

            <p className="font-signature mt-1.5 line-clamp-2 text-[13px] leading-tight">
              {message}
            </p>

            <div className="mt-auto flex items-end justify-between">
              <span
                className="text-[8px] tracking-[0.1em]"
                style={{ color: 'var(--paper-ink-soft)' }}
              >
                From. {name.trim() || 'Guest'}
              </span>
              <span className="sendoff-postmark font-mechanic text-[6px] tracking-[0.14em]">
                <span>SENT</span>
                <span>{formatToday()}</span>
              </span>
            </div>
          </div>

          <div className="sendoff-plane-shade" />
        </div>
      </div>

      {/* 前板 + OUTBOX のネームプレート。はがきはこの裏に差し込まれる */}
      <div className="absolute inset-x-0 bottom-0 z-30 flex justify-center">
        <svg
          className="sendoff-rack w-[min(20rem,92%)]"
          viewBox="0 0 320 132"
          fill="none"
        >
          <defs>
            <linearGradient id="sendoff-rack-front" x1="0" y1="0" x2="0" y2="1">
              <stop stopColor="#3f7099" />
              <stop offset="1" stopColor="#1d3348" />
            </linearGradient>
          </defs>
          <rect
            x="8"
            y="52"
            width="304"
            height="74"
            rx="10"
            fill="url(#sendoff-rack-front)"
          />
          <rect
            x="8"
            y="52"
            width="304"
            height="2"
            rx="1"
            fill="#ffffff"
            opacity="0.28"
          />
          <rect
            x="114"
            y="74"
            width="92"
            height="26"
            rx="5"
            fill="#0f2030"
            opacity="0.5"
          />
          <text
            x="160"
            y="91"
            textAnchor="middle"
            fontSize="11"
            letterSpacing="3.4"
            fill="#cfe2f2"
            fontFamily="Orbitron, sans-serif"
          >
            OUTBOX
          </text>
        </svg>
      </div>
    </div>
  )
}
