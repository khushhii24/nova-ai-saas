import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** Keycap. Used for real shortcuts only — decorative keycaps are noise. */
export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        'inline-grid h-5 min-w-5 place-items-center rounded-xs border border-line-strong',
        // Secondary rather than muted: keycaps sit on `raised`, the lightest
        // surface, where muted would drop under 4.5:1.
        'bg-raised px-1.5 font-mono text-[0.625rem] font-medium text-secondary',
        className,
      )}
    >
      {children}
    </kbd>
  )
}
