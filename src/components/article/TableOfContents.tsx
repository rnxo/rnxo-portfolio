import type { TocItem } from '#/lib/toc'

export default function TableOfContents({ items }: { items: Array<TocItem> }) {
  if (items.length === 0) return null

  return (
    <nav aria-label="目次" className="island-shell rounded-2xl p-5">
      <p className="island-kicker mb-3">目次</p>
      <ol className="space-y-2 text-sm">
        {items.map((item) => (
          <li key={item.id} className={item.depth === 3 ? 'pl-4' : undefined}>
            <a
              href={`#${item.id}`}
              className="text-[var(--sea-ink-soft)] no-underline hover:text-[var(--sea-ink)]"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
