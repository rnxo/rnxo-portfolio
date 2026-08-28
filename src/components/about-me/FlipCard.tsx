import { useLayoutEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { motion } from 'motion/react'

const FLIP_DURATION = 0.7
const FLIP_EASE = [0.16, 1, 0.3, 1] as const
const DRAG_THRESHOLD = 5

type FlipCardProps = {
  front: ReactNode
  back: ReactNode
  label: string
}

export default function FlipCard({ front, back, label }: FlipCardProps) {
  const [flipped, setFlipped] = useState(false)
  const [heights, setHeights] = useState<{
    front: number
    back: number
  } | null>(null)
  const frontRef = useRef<HTMLDivElement>(null)
  const backRef = useRef<HTMLDivElement>(null)
  const pointerDownRef = useRef<{ x: number; y: number } | null>(null)

  // 両面の高さを測り、反転に合わせてカードの高さも追従させる
  useLayoutEffect(() => {
    const frontEl = frontRef.current
    const backEl = backRef.current
    if (!frontEl || !backEl) return

    const measure = () => {
      setHeights({ front: frontEl.offsetHeight, back: backEl.offsetHeight })
    }
    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(frontEl)
    observer.observe(backEl)
    return () => observer.disconnect()
  }, [])

  const measured = heights !== null

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    pointerDownRef.current = { x: e.clientX, y: e.clientY }
  }

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    const down = pointerDownRef.current
    pointerDownRef.current = null

    // 面の中のリンクは通常どおり遷移させ、反転はしない
    if ((e.target as HTMLElement).closest('a')) return

    // テキストをドラッグ選択した操作では反転しない
    if (
      down &&
      Math.hypot(e.clientX - down.x, e.clientY - down.y) > DRAG_THRESHOLD
    )
      return
    if (window.getSelection()?.toString()) return

    setFlipped((prev) => !prev)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.target !== e.currentTarget) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setFlipped((prev) => !prev)
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={label}
      aria-pressed={flipped}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="flip-card rise-in cursor-pointer"
    >
      <motion.div
        className="flip-card-inner"
        initial={false}
        animate={{
          rotateY: flipped ? 180 : 0,
          ...(heights
            ? { height: flipped ? heights.back : heights.front }
            : {}),
        }}
        transition={{ duration: FLIP_DURATION, ease: FLIP_EASE }}
      >
        <div
          ref={frontRef}
          className={`flip-face ${measured ? 'absolute inset-x-0 top-0' : 'relative'}`}
          inert={flipped}
          aria-hidden={flipped}
        >
          {front}
        </div>
        <div
          ref={backRef}
          className="flip-face flip-face-back absolute inset-x-0 top-0"
          inert={!flipped}
          aria-hidden={!flipped}
        >
          {back}
        </div>
      </motion.div>
    </div>
  )
}
