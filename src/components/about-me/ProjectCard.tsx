type ProjectCardProps = {
  name: string
  devPeriod: string
  img: string
  description: string
  url: string
  techs?: string[]
}

function TechTag({ tech }: { tech: string }) {
  return <span className="demo-pill w-fit">{tech}</span>
}

export default function ProjectCard({
  name,
  devPeriod,
  img,
  description,
  url,
  techs,
}: ProjectCardProps) {
  return (
    <div className="showcase-card feature-card rise-in relative flex min-h-115 w-full max-w-100 cursor-pointer flex-col overflow-hidden rounded-2xl border p-4 sm:p-5">
      <span className="text-lagoon-deep font-mechanic text-start">
        {devPeriod}
      </span>
      <img
        src={img}
        width={300}
        className="w-full h-40 rounded-xl border-2 border-lagoon-deep"
      />
      <h2 className="mt-5 display-title line-clamp-2 text-xl font-bold text-(--sea-ink) sm:text-2xl">
        {name}
      </h2>

      <p className="demo-muted line-clamp-3 text-sm">{description}</p>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap items-center gap-2">
          {techs?.map((tech) => (
            <TechTag key={tech} tech={tech} />
          ))}
        </div>
        <a
          href="https://github.com/rnxo"
          target="_blank"
          rel="noreferrer"
          className="hidden rounded-xl p-2 text-[var(--sea-ink-soft)] transition hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)] sm:block"
        >
          <span className="sr-only">Go to GitHub</span>
          <svg viewBox="0 0 16 16" aria-hidden="true" width="24" height="24">
            <path
              fill="currentColor"
              d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"
            />
          </svg>
        </a>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          className="demo-button shrink-0"
        >
          見る ↗
        </a>
      </div>
    </div>
  )
}
