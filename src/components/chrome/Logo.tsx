import { cn } from '@/lib/cn'

/**
 * Wordmark. The glyph is a single unbroken stroke that traces an N and exits
 * upward — the "one path through the work" idea the product is selling,
 * rather than a generic spark or hexagon.
 *
 * `collapsed` retracts the word behind the glyph instead of unmounting it. The
 * masthead needs the word to leave as the rail contracts, and swapping the node
 * out mid-transition pops; animating `max-width` keeps it one movement.
 */
export function Logo({
  className,
  showWord = true,
  collapsed = false,
}: {
  className?: string
  showWord?: boolean
  collapsed?: boolean
}) {
  return (
    <span className={cn('flex items-center', className)}>
      <svg
        viewBox="0 0 24 24"
        className="size-[1.375rem] shrink-0 text-accent"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M5 19V6.2l14 11.6V5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="square"
        />
      </svg>

      {showWord && (
        <span
          className={cn(
            'overflow-hidden whitespace-nowrap font-display text-[1.0625rem]',
            'font-semibold leading-none tracking-[-0.04em] text-primary',
            'transition-[max-width,opacity,margin-left] duration-500 ease-[var(--ease-out-quint)]',
            collapsed ? 'ml-0 max-w-0 opacity-0' : 'ml-2.5 max-w-[7rem] opacity-100',
          )}
        >
          NOVA
        </span>
      )}
    </span>
  )
}
