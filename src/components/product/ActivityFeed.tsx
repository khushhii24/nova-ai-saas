import { Icon } from '@/components/primitives/Icon'
import { Avatar } from './Avatar'
import { activity, actors } from '@/data/workspace'
import { cn } from '@/lib/cn'

export function ActivityFeed({ limit = activity.length }: { limit?: number }) {
  const items = activity.slice(0, limit)

  return (
    <ul className="relative flex flex-col">
      {/* Timeline rail, stopped short of the last avatar so it doesn't dangle. */}
      <span
        aria-hidden="true"
        className="absolute bottom-5 left-[0.6875rem] top-5 w-px bg-line"
      />

      {items.map((item) => {
        const actor = actors[item.actorId]

        return (
          <li key={item.id} className="relative flex gap-3 py-2">
            <span className="relative z-10 bg-surface">
              <Avatar actor={actor} size="xs" className="ring-2 ring-surface" />
            </span>

            <div className="min-w-0 flex-1">
              <p className="text-[0.6875rem] leading-snug text-secondary">
                <span className="font-medium text-primary">{actor.name}</span> {item.text}
              </p>
              {item.detail && (
                <p className="mt-0.5 truncate font-mono text-[0.5625rem] tracking-[0.02em] text-muted">
                  {item.detail}
                </p>
              )}
            </div>

            <span className="flex shrink-0 items-start gap-1.5 pt-px">
              <Icon
                name={item.icon}
                size={11}
                className={cn(item.icon === 'status-done' ? 'text-success' : 'text-muted')}
              />
              <span className="font-mono text-[0.5625rem] text-muted">{item.at}</span>
            </span>
          </li>
        )
      })}
    </ul>
  )
}
