import { Icon, type IconName } from '@/components/primitives/Icon'
import { Avatar } from './Avatar'
import { actors, documents, type DocKind } from '@/data/workspace'
import { cn } from '@/lib/cn'

const kindIcon: Record<DocKind, IconName> = {
  doc: 'doc',
  sheet: 'sheet',
  deck: 'deck',
}

export function DocumentList({
  limit = documents.length,
  /** Restricts the list to certain document kinds. Drives the Documents tabs. */
  kinds,
  /** Restricts to one space. Drives the sidebar space selection. */
  space,
  className,
}: {
  limit?: number
  kinds?: DocKind[]
  space?: string
  className?: string
}) {
  const rows = documents
    .filter((row) => (kinds ? kinds.includes(row.kind) : true))
    .filter((row) => (space ? row.space === space : true))
    .slice(0, limit)

  if (rows.length === 0) {
    return (
      <p className="px-2 py-8 text-center text-micro text-muted">
        Nothing here yet.
      </p>
    )
  }

  return (
    <ul className={cn('flex flex-col', className)}>
      {rows.map((row) => {
        const actor = actors[row.actorId]

        return (
          <li key={row.id}>
            <button
              type="button"
              className={cn(
                'group/row flex w-full items-center gap-3 rounded-sm px-2 py-2 text-left',
                'transition-colors duration-150 hover:bg-raised/70',
              )}
            >
              <Icon
                name={kindIcon[row.kind]}
                size={14}
                className="text-muted transition-colors duration-150 group-hover/row:text-accent"
              />

              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="min-w-0 truncate text-micro text-primary">{row.title}</span>
                  {row.aiLabel && (
                    <span
                      className={cn(
                        'hidden shrink-0 rounded-xs border border-accent/25 bg-accent/10 px-1.5',
                        'font-mono text-[0.5625rem] uppercase tracking-[0.1em] text-accent sm:inline',
                      )}
                    >
                      {row.aiLabel}
                    </span>
                  )}
                </span>
                <span className="mt-0.5 flex items-center gap-1.5 font-mono text-[0.5625rem] uppercase tracking-[0.1em] text-muted">
                  {row.space}
                  <span aria-hidden="true">·</span>
                  {row.editedAt}
                </span>
              </span>

              <Avatar actor={actor} size="xs" />
              <Icon
                name="chevron-right"
                size={13}
                className="text-muted opacity-0 transition-opacity duration-150 group-hover/row:opacity-100"
              />
            </button>
          </li>
        )
      })}
    </ul>
  )
}
