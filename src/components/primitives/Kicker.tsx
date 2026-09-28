import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type KickerProps = {
  children: ReactNode
  className?: string
  /** Index label, e.g. "02" — rendered before a hairline tick. */
  index?: string
}

/**
 * Section eyebrow. Mono, wide-tracked, muted — the typographic signal that a
 * new section has started, so headings never need a coloured badge.
 */
export function Kicker({ children, className, index }: KickerProps) {
  return (
    <p
      className={cn(
        'flex items-center gap-2.5 font-mono text-kicker font-medium uppercase text-muted',
        className,
      )}
    >
      {index && (
        <>
          <span className="text-accent">{index}</span>
          <span aria-hidden="true" className="h-px w-5 bg-line-strong" />
        </>
      )}
      {children}
    </p>
  )
}
