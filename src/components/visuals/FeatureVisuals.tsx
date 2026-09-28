import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { Icon } from '@/components/primitives/Icon'
import { StatusDot } from '@/components/product/StatusDot'
import { Avatar } from '@/components/product/Avatar'
import { actors } from '@/data/workspace'
import { useTypewriter } from '@/hooks/useTypewriter'
import { EASE_OUT, VIEWPORT } from '@/lib/motion'
import type { FeatureVisual } from '@/data/features'
import { cn } from '@/lib/cn'

/**
 * Six different visualisations, one per capability.
 *
 * Each is built from the same primitives as the real product UI (same type
 * sizes, same hairlines, same status colours) so the feature grid reads as
 * screenshots of one system rather than six unrelated illustrations.
 */

const surface = 'rounded-md border border-line bg-canvas/50 p-3'

/* -------------------------------------------------------------------------- */
/* AI Research — scattered sources resolve into cited findings                 */
/* -------------------------------------------------------------------------- */

function ResearchVisual() {
  const reduceMotion = useReducedMotion()
  const findings = [
    { width: 'w-[86%]', cite: '12' },
    { width: 'w-[64%]', cite: '07' },
    { width: 'w-[74%]', cite: '31' },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-1.5">
        {Array.from({ length: 7 }).map((_, index) => (
          <motion.span
            key={index}
            className="h-6 flex-1 rounded-xs border border-dashed border-line-strong/70 bg-surface"
            initial={reduceMotion ? false : { opacity: 0, y: -5 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.4, ease: EASE_OUT, delay: index * 0.045 }}
          />
        ))}
        <span className="shrink-0 pl-1 font-mono text-[0.5625rem] text-muted">+35</span>
      </div>

      <div className={cn(surface, 'flex flex-col gap-2.5')}>
        {findings.map((finding, index) => (
          <motion.div
            key={finding.cite}
            className="flex items-center gap-2"
            initial={reduceMotion ? false : { opacity: 0, x: -6 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.35 + index * 0.1 }}
          >
            <span className="grid size-4 shrink-0 place-items-center rounded-xs bg-accent/12 font-mono text-[0.5rem] font-medium text-accent">
              {index + 1}
            </span>
            <span className={cn('h-1.5 rounded-full bg-line-strong', finding.width)} />
            <span className="ml-auto shrink-0 font-mono text-[0.5rem] text-muted">
              [{finding.cite}]
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* AI Writing — a selection is rewritten in place                             */
/* -------------------------------------------------------------------------- */

function WritingVisual() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const { output, done } = useTypewriter(
    'Churn concentrates in month two, not month one.',
    { start: inView, speed: 26, delay: 500 },
  )

  return (
    <div ref={ref} className="flex flex-col gap-3">
      <div className={cn(surface, 'text-[0.6875rem] leading-relaxed text-muted')}>
        Users who churn tend to do so{' '}
        <span className="rounded-xs bg-accent/18 px-0.5 text-secondary">
          at some point after signing up
        </span>
        , which suggests onboarding.
      </div>

      <div className="flex gap-1.5">
        {['Rewrite', 'Expand', 'Shorten'].map((action, index) => (
          <span
            key={action}
            className={cn(
              'rounded-xs border px-1.5 py-0.5 font-mono text-[0.5625rem] uppercase tracking-[0.08em]',
              index === 0
                ? 'border-accent/35 bg-accent/12 text-accent'
                : 'border-line bg-surface text-muted',
            )}
          >
            {action}
          </span>
        ))}
      </div>

      <div className={cn(surface, 'min-h-[3.25rem] text-[0.6875rem] leading-relaxed text-primary')}>
        {output}
        {!done && inView && (
          <span
            aria-hidden="true"
            className="ml-0.5 inline-block h-3 w-[0.1875rem] translate-y-px bg-accent align-middle motion-safe:animate-[nova-caret_1s_step-end_infinite]"
          />
        )}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* AI Agents — three agents, one mid-run                                      */
/* -------------------------------------------------------------------------- */

function AgentsVisual() {
  const reduceMotion = useReducedMotion()
  const rows = [
    { name: 'Research Agent', status: 'running' as const, progress: 0.62, step: 'Reading 42 sources' },
    { name: 'Docs Agent', status: 'done' as const, progress: 1, step: 'Updated 6 pages' },
    { name: 'Digest Agent', status: 'queued' as const, progress: 0, step: 'Monday 07:00' },
  ]

  return (
    <ul className="flex flex-col gap-2">
      {rows.map((row, index) => (
        <motion.li
          key={row.name}
          className={cn(surface, 'flex flex-col gap-2 py-2.5')}
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.45, ease: EASE_OUT, delay: index * 0.09 }}
        >
          <div className="flex items-center gap-2">
            <StatusDot status={row.status} />
            <span className="min-w-0 flex-1 truncate text-[0.6875rem] text-primary">
              {row.name}
            </span>
            <span className="shrink-0 font-mono text-[0.5rem] uppercase tracking-[0.1em] text-muted">
              {row.step}
            </span>
          </div>
          <span className="h-0.5 overflow-hidden rounded-full bg-line">
            <motion.span
              className={cn(
                'block h-full rounded-full',
                row.status === 'done' ? 'bg-success/70' : 'bg-accent',
              )}
              initial={reduceMotion ? false : { width: 0 }}
              whileInView={{ width: `${row.progress * 100}%` }}
              viewport={VIEWPORT}
              transition={{ duration: 1.1, ease: EASE_OUT, delay: 0.25 + index * 0.09 }}
              style={reduceMotion ? { width: `${row.progress * 100}%` } : undefined}
            />
          </span>
        </motion.li>
      ))}
    </ul>
  )
}

/* -------------------------------------------------------------------------- */
/* Intelligent Analysis — a sheet read, with the outlier flagged              */
/* -------------------------------------------------------------------------- */

function AnalysisVisual() {
  const reduceMotion = useReducedMotion()
  const rows = [
    { label: 'Enterprise', value: '92.4%', flagged: false },
    { label: 'Mid-market', value: '88.1%', flagged: false },
    { label: 'Self-serve', value: '61.7%', flagged: true },
    { label: 'Education', value: '90.3%', flagged: false },
  ]

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-1.5">
        {[
          { label: 'retention.xlsx', icon: 'sheet' as const },
          { label: 'contract.pdf', icon: 'doc' as const },
          { label: 'tickets.csv', icon: 'table' as const },
        ].map((file) => (
          <span
            key={file.label}
            className="flex items-center gap-1.5 rounded-xs border border-line bg-surface px-1.5 py-1 font-mono text-[0.5625rem] text-muted"
          >
            <Icon name={file.icon} size={10} />
            {file.label}
          </span>
        ))}
      </div>

      <div className={cn(surface, 'relative overflow-hidden p-0')}>
        {/* Read pass — sweeps once, then stops. Looping would be decoration. */}
        {!reduceMotion && (
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-accent/10 to-transparent"
            initial={{ y: -40, opacity: 0 }}
            whileInView={{ y: 120, opacity: [0, 1, 1, 0] }}
            viewport={VIEWPORT}
            transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.3 }}
          />
        )}

        <ul className="relative divide-y divide-line">
          {rows.map((row, index) => (
            <motion.li
              key={row.label}
              className="flex items-center gap-2 px-2.5 py-[0.4375rem]"
              initial={reduceMotion ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.4, delay: 0.35 + index * 0.12 }}
            >
              <span className="min-w-0 flex-1 truncate text-[0.6875rem] text-secondary">
                {row.label}
              </span>
              <span
                className={cn(
                  'font-mono text-[0.625rem]',
                  row.flagged ? 'text-warning' : 'text-muted',
                )}
              >
                {row.value}
              </span>
              {row.flagged && (
                <span className="flex items-center gap-1 rounded-xs border border-warning/30 bg-warning/10 px-1 font-mono text-[0.5rem] uppercase tracking-[0.08em] text-warning">
                  <Icon name="status-alert" size={8} />
                  outlier
                </span>
              )}
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Team Workspace — humans and agents in one history                          */
/* -------------------------------------------------------------------------- */

function TeamVisual() {
  const reduceMotion = useReducedMotion()
  const history = [
    { actor: actors.naomi, text: 'edited the summary', at: '2m' },
    { actor: actors.research, text: 'added 3 citations', at: '14m' },
    { actor: actors.sara, text: 'resolved a comment', at: '1h' },
  ]

  return (
    <div className="flex flex-col gap-3">
      <div className={cn(surface, 'flex items-start gap-2')}>
        <Avatar actor={actors.naomi} size="xs" />
        <p className="min-w-0 flex-1 text-[0.6875rem] leading-relaxed text-secondary">
          Can we cut step 3 entirely?
          <span className="ml-1.5 font-mono text-[0.5rem] uppercase tracking-[0.1em] text-accent">
            @Sara
          </span>
        </p>
      </div>

      <ul className="flex flex-col gap-1.5">
        {history.map((entry, index) => (
          <motion.li
            key={entry.actor.id}
            className="flex items-center gap-2"
            initial={reduceMotion ? false : { opacity: 0, x: -6 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.45, ease: EASE_OUT, delay: 0.15 + index * 0.09 }}
          >
            <Avatar actor={entry.actor} size="xs" />
            <span className="min-w-0 flex-1 truncate text-[0.625rem] text-secondary">
              <span className="text-primary">{entry.actor.name}</span> {entry.text}
            </span>
            <span className="shrink-0 font-mono text-[0.5rem] text-muted">{entry.at}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Automations — trigger, steps, delivery                                     */
/* -------------------------------------------------------------------------- */

function AutomationsVisual() {
  const reduceMotion = useReducedMotion()
  const chain = [
    { label: 'Monday 07:00', icon: 'clock' as const, tone: 'trigger' },
    { label: 'Sweep sources', icon: 'tool-web' as const, tone: 'step' },
    { label: 'Draft brief', icon: 'tool-write' as const, tone: 'step' },
    { label: 'Post to chat', icon: 'tool-post' as const, tone: 'delivery' },
  ]

  return (
    <div className="flex flex-col gap-2">
      {chain.map((node, index) => (
        <motion.div
          key={node.label}
          className="flex items-center gap-2.5"
          initial={reduceMotion ? false : { opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.45, ease: EASE_OUT, delay: index * 0.1 }}
        >
          <span className="relative grid w-4 shrink-0 place-items-center">
            <span
              className={cn(
                'size-1.5 rounded-full',
                node.tone === 'trigger'
                  ? 'bg-accent'
                  : node.tone === 'delivery'
                    ? 'bg-success'
                    : 'bg-line-strong',
              )}
            />
            {index < chain.length - 1 && (
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-3 h-[1.375rem] w-px -translate-x-1/2 bg-line"
              />
            )}
          </span>

          <span
            className={cn(
              'flex min-w-0 flex-1 items-center gap-2 rounded-md border border-line bg-canvas/50 px-2.5 py-1.5',
            )}
          >
            <Icon
              name={node.icon}
              size={11}
              className={node.tone === 'trigger' ? 'text-accent' : 'text-muted'}
            />
            <span className="min-w-0 flex-1 truncate text-[0.6875rem] text-secondary">
              {node.label}
            </span>
            {node.tone === 'trigger' && (
              <span className="shrink-0 font-mono text-[0.5rem] uppercase tracking-[0.1em] text-muted">
                trigger
              </span>
            )}
          </span>
        </motion.div>
      ))}
    </div>
  )
}

/* -------------------------------------------------------------------------- */

const visuals: Record<FeatureVisual, () => React.JSX.Element> = {
  research: ResearchVisual,
  writing: WritingVisual,
  agents: AgentsVisual,
  analysis: AnalysisVisual,
  team: TeamVisual,
  automations: AutomationsVisual,
}

export function FeatureArtwork({ visual }: { visual: FeatureVisual }) {
  const Artwork = visuals[visual]
  return <Artwork />
}
