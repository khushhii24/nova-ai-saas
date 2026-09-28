import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type AppShellProps = {
  children: ReactNode
  /** Left-hand title area — usually a breadcrumb. */
  title?: ReactNode
  /** Right-hand controls in the title bar. */
  actions?: ReactNode
  className?: string
  /** Body padding is opt-out so panes can bleed to the frame. */
  bare?: boolean
}

/**
 * The application frame shared by every product surface on the page.
 *
 * Deliberately *not* browser chrome — no URL bar, no traffic lights in macOS
 * colours. A neutral title bar keeps the focus on the product and avoids the
 * "screenshot in a fake browser" look that dates a SaaS page instantly.
 */
export function AppShell({ children, title, actions, className, bare = false }: AppShellProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-line bg-surface lift-3',
        className,
      )}
    >
      <div className="flex h-11 items-center gap-3 border-b border-line bg-elevated/90 px-3 sm:px-4">
        <div aria-hidden="true" className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-line-strong" />
          <span className="size-2 rounded-full bg-line-strong/70" />
          <span className="size-2 rounded-full bg-line-strong/45" />
        </div>

        {title && (
          <div className="min-w-0 flex-1 truncate pl-1 font-mono text-[0.6875rem] tracking-[0.04em] text-muted">
            {title}
          </div>
        )}

        {actions && <div className="ml-auto flex items-center gap-1.5">{actions}</div>}
      </div>

      <div className={cn(!bare && 'p-3 sm:p-4')}>{children}</div>
    </div>
  )
}

/** Small square control for the app title bar. */
export function ShellButton({
  children,
  label,
  onClick,
  className,
}: {
  children: ReactNode
  label: string
  onClick?: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        'grid size-7 place-items-center rounded-sm text-muted transition-colors duration-200',
        'hover:bg-raised hover:text-secondary',
        className,
      )}
    >
      {children}
    </button>
  )
}
