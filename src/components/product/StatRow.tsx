import { useRef } from 'react'
import { useInView } from 'motion/react'
import { Icon } from '@/components/primitives/Icon'
import { Sparkline } from './Sparkline'
import { stats, type StatTile } from '@/data/workspace'
import { useCountUp } from '@/hooks/useCountUp'
import { cn } from '@/lib/cn'

/**
 * Three KPI tiles. The sparkline inherits the accent only for the trend line,
 * never for the number — a page of coloured numerals is the fastest way to
 * lose the restraint the rest of the design system is buying.
 *
 * Figures count up once on first view. Tabular numerals keep the tile from
 * twitching as the digits change width mid-count.
 */
export function StatRow({ className }: { className?: string }) {
  const ref = useRef<HTMLDListElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })

  return (
    <dl ref={ref} className={cn('grid grid-cols-1 gap-2 sm:grid-cols-3', className)}>
      {stats.map((stat, index) => (
        <Tile key={stat.id} stat={stat} active={inView} index={index} />
      ))}
    </dl>
  )
}

function Tile({ stat, active, index }: { stat: StatTile; active: boolean; index: number }) {
  const value = useCountUp(stat.value, active, 1200 + index * 180)

  return (
    // Container query, not a media query: this tile renders both in the wide
    // hero preview and in the dashboard's ~430px main pane at 1024. It has to
    // respond to the space it is *in*, not to the size of the window. Below
    // 10rem the sparkline is dropped so the label keeps its full width —
    // otherwise "Agent runs" truncates to "Agent…", which reads as broken.
    <div className="@container flex items-end justify-between gap-3 rounded-md border border-line bg-surface/70 p-3">
      <div className="min-w-0">
        <dt className="truncate font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-muted">
          {stat.label}
        </dt>
        <dd className="mt-1.5 flex items-baseline gap-2">
          <span className="text-[1.375rem] font-medium leading-none tracking-[-0.03em] text-primary tabular-nums">
            {value}
          </span>
          <span className="flex items-center gap-0.5 text-[0.625rem] font-medium text-success">
            <Icon name="trend" size={11} />
            {stat.delta}
          </span>
        </dd>
      </div>
      <Sparkline
        points={stat.spark}
        className="hidden h-6 w-16 text-accent/70 @[10rem]:block"
      />
    </div>
  )
}
