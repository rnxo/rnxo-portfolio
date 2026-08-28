type ProjectCardProps = {
  name: string
  description: string
  url: string
  techs?: string[]
}

function TechTag({ tech }: { tech: string }) {
  return <span className="demo-pill w-fit">{tech}</span>
}

export default function ProjectCard({
  name,
  description,
  url,
  techs,
}: ProjectCardProps) {
  return (
    <div className="flex flex-col h-full gap-3">
      <h2 className="display-title text-xl font-bold text-(--sea-ink) sm:text-2xl">
        {name}
      </h2>
      <div className="flex flex-col h-full mt-auto">
        <p className="demo-muted text-sm sm:text-base">{description}</p>
      </div>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="mt-auto flex flex-wrap items-center gap-2">
          {techs?.map((tech) => (
            <TechTag key={tech} tech={tech} />
          ))}
        </div>
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
