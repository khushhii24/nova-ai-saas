import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type SectionProps = {
  id?: string
  children: ReactNode
  className?: string
  /** Draws the fading hairline that separates major sections. */
  rule?: boolean
  /** Tighter vertical rhythm for sections that follow a related one. */
  density?: 'default' | 'tight' | 'loose'
  'aria-label'?: string
  'aria-labelledby'?: string
}

const density = {
  tight: 'py-16 md:py-20 lg:py-24',
  default: 'py-20 md:py-28 lg:py-36',
  loose: 'py-24 md:py-36 lg:py-48',
}

/**
 * Owns the site's vertical rhythm. Sections never set their own py — that is
 * how spacing drifts and a page starts to look assembled rather than designed.
 */
export function Section({
  id,
  children,
  className,
  rule = false,
  density: d = 'default',
  ...aria
}: SectionProps) {
  return (
    <section id={id} className={cn('relative', density[d], className)} {...aria}>
      {rule && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0">
          <div className="mx-auto max-w-[86rem] rule-x" />
        </div>
      )}
      {children}
    </section>
  )
}
