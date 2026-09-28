import type { Actor } from '@/data/workspace'
import { cn } from '@/lib/cn'

type AvatarProps = {
  actor: Actor
  size?: 'xs' | 'sm' | 'md'
  className?: string
}

const sizes = {
  xs: 'size-5 text-[0.5625rem]',
  sm: 'size-6 text-[0.625rem]',
  md: 'size-8 text-[0.6875rem]',
}

/**
 * Agents and people are visually distinct at a glance — agents get the accent
 * and a mono face. In a product where both edit the same document, that
 * distinction is the whole trust story, so it is never left to a label alone.
 */
export function Avatar({ actor, size = 'sm', className }: AvatarProps) {
  const isAgent = actor.kind === 'agent'

  return (
    <span
      title={actor.name}
      className={cn(
        'grid shrink-0 place-items-center rounded-full border font-medium uppercase',
        sizes[size],
        isAgent
          ? 'border-accent/35 bg-accent/12 font-mono tracking-tight text-accent'
          : 'border-line-strong bg-raised text-secondary',
        className,
      )}
    >
      {actor.initials}
    </span>
  )
}

/** Overlapping stack for presence indicators. */
export function AvatarStack({
  actors,
  size = 'sm',
  max = 4,
}: {
  actors: Actor[]
  size?: 'xs' | 'sm' | 'md'
  max?: number
}) {
  const shown = actors.slice(0, max)
  const overflow = actors.length - shown.length

  return (
    <div className="flex items-center">
      <div className="flex -space-x-1.5">
        {shown.map((actor) => (
          <Avatar
            key={actor.id}
            actor={actor}
            size={size}
            className="ring-2 ring-surface"
          />
        ))}
      </div>
      {overflow > 0 && (
        <span className="ml-2 font-mono text-[0.625rem] text-muted">+{overflow}</span>
      )}
    </div>
  )
}
