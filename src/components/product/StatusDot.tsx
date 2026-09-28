import { cn } from '@/lib/cn'

export type Status = 'done' | 'running' | 'queued' | 'alert'

const tone: Record<Status, string> = {
  done: 'bg-success',
  running: 'bg-accent',
  queued: 'bg-line-strong',
  alert: 'bg-warning',
}

/**
 * One state indicator for tasks, agent steps and connection health.
 * `running` gets a single expanding ring — the only looping animation allowed
 * in the product UI, because it maps to something genuinely in progress.
 */
export function StatusDot({
  status,
  label,
  className,
}: {
  status: Status
  label?: string
  className?: string
}) {
  return (
    <span className={cn('relative grid size-4 place-items-center', className)}>
      {label && <span className="sr-only">{label}</span>}
      {status === 'running' && (
        <span
          aria-hidden="true"
          className="absolute size-2 rounded-full bg-accent/60 motion-safe:animate-[nova-ping_1.9s_var(--ease-out-quint)_infinite]"
        />
      )}
      <span aria-hidden="true" className={cn('size-2 rounded-full', tone[status])} />
    </span>
  )
}
