import { motion, useReducedMotion } from 'motion/react'
import { analytics } from '@/data/workspace'
import { EASE_OUT, VIEWPORT } from '@/lib/motion'
import { cn } from '@/lib/cn'

/**
 * Column chart + share breakdown, drawn by hand.
 *
 * Bars grow from the baseline on first view only. The busiest day is the one
 * that gets the accent — a chart where every bar is coloured communicates
 * nothing, so colour is reserved for the single fact worth noticing.
 */
export function AnalyticsPane() {
  const reduceMotion = useReducedMotion()
  const max = Math.max(...analytics.runsByDay.map((day) => day.value))
  const peak = analytics.runsByDay.reduce((best, day) => (day.value > best.value ? day : best))

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="mb-3 flex items-baseline justify-between">
          <h4 className="text-micro font-medium text-primary">Agent runs</h4>
          <p className="font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-muted">
            Last 7 days
          </p>
        </div>

        <div className="flex h-28 items-end gap-1.5 sm:gap-2">
          {analytics.runsByDay.map((day, index) => {
            const isPeak = day.day === peak.day
            const height = `${Math.round((day.value / max) * 100)}%`

            return (
              <div key={day.day} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
                <div className="relative flex w-full flex-1 items-end">
                  <motion.div
                    className={cn(
                      'w-full rounded-t-xs',
                      isPeak ? 'bg-accent/85' : 'bg-line-strong',
                    )}
                    initial={reduceMotion ? false : { height: 0 }}
                    whileInView={{ height }}
                    viewport={VIEWPORT}
                    transition={{
                      duration: 0.7,
                      ease: EASE_OUT,
                      delay: reduceMotion ? 0 : index * 0.05,
                    }}
                    style={reduceMotion ? { height } : undefined}
                  />
                </div>
                <span
                  className={cn(
                    'font-mono text-[0.5625rem] uppercase tracking-[0.08em]',
                    isPeak ? 'text-secondary' : 'text-muted',
                  )}
                >
                  {day.day.slice(0, 1)}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="border-t border-line pt-4">
        <h4 className="mb-3 text-micro font-medium text-primary">Where the time went</h4>
        <ul className="flex flex-col gap-2.5">
          {analytics.breakdown.map((row, index) => (
            <li key={row.label} className="flex items-center gap-3">
              <span className="w-24 shrink-0 truncate text-[0.6875rem] text-secondary">
                {row.label}
              </span>
              <span className="relative h-1 min-w-0 flex-1 overflow-hidden rounded-full bg-line">
                <motion.span
                  className={cn(
                    'absolute inset-y-0 left-0 rounded-full',
                    index === 0 ? 'bg-accent/80' : 'bg-line-strong',
                  )}
                  initial={reduceMotion ? false : { width: 0 }}
                  whileInView={{ width: `${row.share * 100}%` }}
                  viewport={VIEWPORT}
                  transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.1 + index * 0.07 }}
                  style={reduceMotion ? { width: `${row.share * 100}%` } : undefined}
                />
              </span>
              <span className="w-9 shrink-0 text-right font-mono text-[0.625rem] text-muted">
                {Math.round(row.share * 100)}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
