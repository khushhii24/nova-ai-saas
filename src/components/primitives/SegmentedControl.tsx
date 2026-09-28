import { motion, useReducedMotion } from 'motion/react'
import { SPRING } from '@/lib/motion'
import { cn } from '@/lib/cn'

type Option<T extends string> = {
  value: T
  label: string
  /** Optional trailing tag, e.g. a discount. */
  badge?: string
}

type SegmentedControlProps<T extends string> = {
  options: Option<T>[]
  value: T
  onChange: (value: T) => void
  /** Accessible name for the group. */
  label: string
  className?: string
}

/**
 * Two-or-more-way switch with radiogroup semantics.
 *
 * Arrow keys move between options and only the selected option is in the tab
 * order, which is the behaviour assistive tech expects from a radio group —
 * a pair of plain buttons looks identical and behaves wrongly.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: SegmentedControlProps<T>) {
  const reduceMotion = useReducedMotion()
  const activeIndex = options.findIndex((option) => option.value === value)

  const onKeyDown = (event: React.KeyboardEvent) => {
    const forward = event.key === 'ArrowRight' || event.key === 'ArrowDown'
    const back = event.key === 'ArrowLeft' || event.key === 'ArrowUp'
    if (!forward && !back) return

    event.preventDefault()
    const next = forward
      ? (activeIndex + 1) % options.length
      : (activeIndex - 1 + options.length) % options.length
    onChange(options[next].value)
  }

  return (
    <div
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={cn(
        'inline-flex items-center gap-0.5 rounded-full border border-line bg-elevated/70 p-1',
        className,
      )}
    >
      {options.map((option) => {
        const isActive = option.value === value

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(option.value)}
            className={cn(
              'relative flex items-center gap-2 rounded-full px-3.5 py-1.5',
              'text-caption transition-colors duration-200',
              isActive ? 'text-primary' : 'text-secondary hover:text-primary',
            )}
          >
            {isActive && (
              <motion.span
                layoutId="segmented-active"
                aria-hidden="true"
                className="absolute inset-0 rounded-full border border-line-strong/70 bg-raised"
                transition={reduceMotion ? { duration: 0 } : SPRING}
              />
            )}
            <span className="relative">{option.label}</span>
            {option.badge && (
              <span
                className={cn(
                  'relative rounded-full px-1.5 py-px font-mono text-[0.5625rem] uppercase',
                  'tracking-[0.08em]',
                  isActive ? 'bg-accent/15 text-accent' : 'bg-line text-muted',
                )}
              >
                {option.badge}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
