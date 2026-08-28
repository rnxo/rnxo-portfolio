import { useRef, useState } from 'react'
import { useAnimate, stagger } from 'motion/react'
import ProjectCard from '#/components/about-me/ProjectCard'

export type Project = {
  name: string
  description: string
  url: string
  techs?: string[]
}

const PANEL_COUNT = 6
const PANEL_SELECTOR = '.curtain-panel'
const CURTAIN_DURATION = 0.45
const CURTAIN_STAGGER = 0.05
const CURTAIN_EASE = [0.76, 0, 0.24, 1] as const

export default function ProjectShowcase({ projects }: { projects: Project[] }) {
  const [index, setIndex] = useState(0)
  const isAnimatingRef = useRef(false)
  const [scope, animate] = useAnimate<HTMLDivElement>()

  if (projects.length === 0) return null

  const current = projects[index]

  async function handleCycle() {
    if (isAnimatingRef.current) return
    isAnimatingRef.current = true

    try {
      // カーテンを閉じる: 下から上へスタガーしながら伸びて覆う
      await animate(
        PANEL_SELECTOR,
        { scaleY: 1 },
        {
          duration: CURTAIN_DURATION,
          ease: CURTAIN_EASE,
          delay: stagger(CURTAIN_STAGGER, { from: 'first' }),
        },
      )

      // 完全に覆われた瞬間にデータを次のプロジェクトへ切替
      setIndex((prev) => (prev + 1) % projects.length)

      // カーテンを開く: 縮んで消えていく
      await animate(
        PANEL_SELECTOR,
        { scaleY: 0 },
        {
          duration: CURTAIN_DURATION,
          ease: CURTAIN_EASE,
          delay: stagger(CURTAIN_STAGGER, { from: 'last' }),
        },
      )
    } finally {
      isAnimatingRef.current = false
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.target !== e.currentTarget) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleCycle()
    }
  }

  return (
    <div
      ref={scope}
      role="button"
      tabIndex={0}
      aria-label="クリックで次のプロジェクトを表示"
      onClick={handleCycle}
      onKeyDown={handleKeyDown}
      className="showcase-card feature-card rise-in relative min-h-screen cursor-pointer overflow-hidden rounded-2xl border p-6 sm:min-h-[300px] sm:p-8"
    >
      <div
        className="pointer-events-none absolute inset-0 z-20 flex"
        aria-hidden="true"
      >
        {Array.from({ length: PANEL_COUNT }).map((_, i) => (
          <span key={i} className="curtain-panel flex-1" />
        ))}
      </div>

      <div className="relative z-10 flex h-full flex-col">
        <ProjectCard
          name={current.name}
          description={current.description}
          url={current.url}
          techs={current.techs}
        />
      </div>
    </div>
  )
}
