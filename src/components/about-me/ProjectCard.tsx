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
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="feature-card rise-in flex flex-col gap-3 rounded-2xl border p-5 no-underline"
    >
      <h2 className="display-title text-xl font-bold text-[var(--sea-ink)]">
        {name}
      </h2>
      <p className="demo-muted text-sm">{description}</p>
      <div className="mt-auto flex items-center justify-start gap-2">
         {techs?.map((tech) => <TechTag key={tech} tech={tech} />)}
      </div>
    </a>
  )
}
