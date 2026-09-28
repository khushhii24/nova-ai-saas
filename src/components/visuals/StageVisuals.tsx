import { motion, useReducedMotion } from 'motion/react'
import { Icon, type IconName } from '@/components/primitives/Icon'
import { Avatar } from '@/components/product/Avatar'
import { Kbd } from '@/components/product/Kbd'
import { StatusDot } from '@/components/product/StatusDot'
import { actors } from '@/data/workspace'
import { EASE_OUT } from '@/lib/motion'
import type { StageVisual } from '@/data/workflow'
import { cn } from '@/lib/cn'

/**
 * One visualisation per workflow stage.
 *
 * These are larger and more detailed than the feature-grid visuals because the
 * workflow section is where a visitor slows down. They re-enter on every stage
 * change, which is why each is a self-contained component with its own
 * entrance rather than a set of shared slots.
 */

const panel = 'rounded-lg border border-line bg-surface/70 p-5'

/** Inset "page" — a darker well that low-contrast content can sit legibly on. */
const well = 'rounded-md border border-line bg-canvas/55 p-3.5'

function Row({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.36, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  )
}

/* ------------------------------- 01 Capture ------------------------------- */

function CaptureVisual() {
  const items: { label: string; source: string; icon: IconName }[] = [
    { label: 'Halcyon pricing page', source: 'web clip', icon: 'tool-web' },
    { label: 'Re: renewal terms', source: 'email', icon: 'at' },
    { label: 'retention.xlsx', source: 'upload', icon: 'sheet' },
    { label: '312 closed-lost deals', source: 'CRM sync', icon: 'tool-crm' },
  ]

  return (
    <div className={cn(panel, 'flex flex-col gap-2')}>
      <div className="flex items-center justify-between">
        <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted">Inbox</p>
        <span className="font-mono text-[0.625rem] text-muted">4 new</span>
      </div>

      {items.map((item, index) => (
        <Row key={item.label} delay={0.06 * index}>
          <div className="flex items-center gap-2.5 rounded-md border border-line bg-canvas/50 px-3 py-2.5">
            <Icon name={item.icon} size={12} className="text-muted" />
            <span className="min-w-0 flex-1 truncate text-micro text-primary">
              {item.label}
            </span>
            <span className="shrink-0 font-mono text-[0.5625rem] uppercase tracking-[0.1em] text-muted">
              {item.source}
            </span>
            <span className="flex shrink-0 items-center gap-1 rounded-xs border border-success/25 bg-success/10 px-1 font-mono text-[0.5625rem] uppercase tracking-[0.08em] text-success">
              <Icon name="check" size={8} />
              indexed
            </span>
          </div>
        </Row>
      ))}
    </div>
  )
}

/* -------------------------------- 02 Think -------------------------------- */

function ThinkVisual() {
  return (
    <div className={cn(panel, 'flex flex-col gap-3')}>
      <div className="flex items-center gap-2.5 rounded-md border border-line bg-canvas/50 px-3 py-2.5">
        <Icon name="sparkles" size={12} className="text-accent" />
        <span className="min-w-0 flex-1 truncate text-micro text-secondary">
          Why did self-serve retention drop?
        </span>
        <Kbd className="h-4">↵</Kbd>
      </div>

      <Row delay={0.08}>
        <p className="text-micro leading-relaxed text-secondary">
          Retention fell after the March onboarding change
          <sup className="ml-0.5 font-mono text-[0.5625rem] text-accent">[7]</sup>. Users who skipped
          the import step churned at roughly twice the rate
          <sup className="ml-0.5 font-mono text-[0.5625rem] text-accent">[12]</sup> — and the step
          became optional in that release
          <sup className="ml-0.5 font-mono text-[0.5625rem] text-accent">[31]</sup>.
        </p>
      </Row>

      <Row delay={0.16}>
        <div className="flex flex-wrap gap-1.5 border-t border-line pt-3">
          {[
            { label: 'Churn interviews', icon: 'doc' as IconName },
            { label: 'retention.xlsx', icon: 'sheet' as IconName },
            { label: 'Release notes', icon: 'branch' as IconName },
          ].map((source) => (
            <span
              key={source.label}
              className="flex items-center gap-1.5 rounded-xs border border-line bg-canvas/60 px-1.5 py-0.5 font-mono text-[0.625rem] text-muted"
            >
              <Icon name={source.icon} size={10} />
              {source.label}
            </span>
          ))}
        </div>
      </Row>
    </div>
  )
}

/* ------------------------------- 03 Create -------------------------------- */

function CreateVisual() {
  const reduceMotion = useReducedMotion()
  const lines = ['w-full', 'w-[92%]', 'w-[97%]', 'w-[68%]', 'w-[88%]', 'w-[76%]']

  return (
    <div className="grid gap-2.5 sm:grid-cols-[0.82fr_1fr]">
      <div className={cn(panel, 'flex flex-col gap-2')}>
        <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted">
          Findings
        </p>

        {['Month-two cliff', 'Import step optional', 'Pricing not the cause'].map(
          (finding, index) => (
            <Row key={finding} delay={index * 0.07}>
              <span className="flex items-center gap-2 rounded-sm border border-line bg-canvas/50 px-2.5 py-2 text-micro text-secondary">
                <span className="font-mono text-[0.5625rem] text-accent">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {finding}
              </span>
            </Row>
          ),
        )}

        <p className="mt-auto flex items-center gap-1.5 border-t border-line pt-2.5 font-mono text-[0.5625rem] uppercase tracking-[0.1em] text-muted">
          <Icon name="check" size={9} className="text-accent" />
          3 selected
        </p>
      </div>

      <div className={cn(panel, 'flex flex-col gap-2.5')}>
        <div className="flex items-center gap-2">
          <Icon name="doc" size={12} className="text-muted" />
          <span className="min-w-0 flex-1 truncate text-micro font-medium text-primary">
            Onboarding fix — proposal
          </span>
        </div>

        {/* The lines sit in a darker well; on the panel tint they were too
            close in value to register as text at 6px. */}
        <div className={cn(well, 'flex flex-1 flex-col justify-center gap-2.5')}>
          {lines.map((width, index) => (
            <motion.span
              key={width + index}
              // Only opacity and x animate. Animating width from 0 would leave
              // the bar collapsed, because the width comes from the class.
              className={cn('h-1.5 rounded-full bg-line-strong', width)}
              initial={reduceMotion ? false : { opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.34, ease: EASE_OUT, delay: 0.04 + index * 0.035 }}
            />
          ))}
          <motion.span
            className="h-1.5 w-[38%] rounded-full bg-accent/55"
            initial={reduceMotion ? false : { opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.34, ease: EASE_OUT, delay: 0.04 + lines.length * 0.035 }}
          />
        </div>

        <span className="flex items-center gap-1.5 font-mono text-[0.5625rem] uppercase tracking-[0.1em] text-accent">
          <Icon name="sparkles" size={9} />
          Drafted from 3 findings
        </span>
      </div>
    </div>
  )
}

/* ------------------------------ 04 Automate ------------------------------- */

function AutomateVisual() {
  const nodes: { label: string; icon: IconName; tone: 'trigger' | 'step' }[] = [
    { label: 'Mondays 07:00', icon: 'clock', tone: 'trigger' },
    { label: 'Sweep sources', icon: 'tool-web', tone: 'step' },
    { label: 'Draft the brief', icon: 'tool-write', tone: 'step' },
    { label: 'Assign owners', icon: 'users', tone: 'step' },
  ]

  return (
    <div className={cn(panel, 'flex flex-col gap-3')}>
      <div className="flex items-center justify-between">
        <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted">
          Workflow
        </p>
        <span className="flex items-center gap-1 rounded-xs border border-accent/30 bg-accent/10 px-1.5 py-0.5 font-mono text-[0.5625rem] uppercase tracking-[0.08em] text-accent">
          <Icon name="check" size={8} />
          saved
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        {nodes.map((node, index) => (
          <Row key={node.label} delay={index * 0.08}>
            <div className="flex items-center gap-2">
              <span className="relative grid w-3 shrink-0 place-items-center">
                <span
                  className={cn(
                    'size-1.5 rounded-full',
                    node.tone === 'trigger' ? 'bg-accent' : 'bg-line-strong',
                  )}
                />
                {index < nodes.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute left-1/2 top-2.5 h-[1.625rem] w-px -translate-x-1/2 bg-line"
                  />
                )}
              </span>
              <span className="flex min-w-0 flex-1 items-center gap-2 rounded-md border border-line bg-canvas/50 px-3 py-2.5">
                <Icon
                  name={node.icon}
                  size={11}
                  className={node.tone === 'trigger' ? 'text-accent' : 'text-muted'}
                />
                <span className="min-w-0 flex-1 truncate text-micro text-secondary">
                  {node.label}
                </span>
                {node.tone === 'trigger' && (
                  <span className="shrink-0 font-mono text-[0.5625rem] uppercase tracking-[0.1em] text-muted">
                    trigger
                  </span>
                )}
              </span>
            </div>
          </Row>
        ))}
      </div>

      <p className="flex items-center gap-1.5 border-t border-line pt-2.5 font-mono text-[0.5625rem] uppercase tracking-[0.1em] text-muted">
        <StatusDot status="queued" />
        Next run in 3 days
      </p>
    </div>
  )
}

/* -------------------------------- 05 Ship --------------------------------- */

function ShipVisual() {
  const destinations: { label: string; detail: string; icon: IconName }[] = [
    { label: '#product-research', detail: 'posted', icon: 'message' },
    { label: 'Tracker — 3 issues', detail: 'owners assigned', icon: 'tasks' },
    { label: 'Weekly digest', detail: 'queued for Friday', icon: 'at' },
  ]

  return (
    <div className="flex flex-col gap-2.5">
      {destinations.map((destination, index) => (
        <Row key={destination.label} delay={index * 0.08}>
          <div className={cn(panel, 'flex items-center gap-3 py-2.5')}>
            <span className="grid size-7 shrink-0 place-items-center rounded-md border border-line bg-canvas/60">
              <Icon name={destination.icon} size={13} className="text-muted" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-micro text-primary">
                {destination.label}
              </span>
              <span className="mt-0.5 block font-mono text-[0.5625rem] uppercase tracking-[0.1em] text-muted">
                {destination.detail}
              </span>
            </span>
            <Icon name="status-done" size={13} className="shrink-0 text-success" />
          </div>
        </Row>
      ))}

      <Row delay={0.22}>
        <div className="flex items-center gap-2 rounded-lg border border-line bg-canvas/40 px-3 py-2.5">
          <span className="flex -space-x-1.5">
            <Avatar actor={actors.naomi} size="xs" className="ring-2 ring-canvas" />
            <Avatar actor={actors.daniel} size="xs" className="ring-2 ring-canvas" />
            <Avatar actor={actors.sara} size="xs" className="ring-2 ring-canvas" />
          </span>
          <span className="text-[0.6875rem] text-muted">
            3 owners notified · source thread attached
          </span>
        </div>
      </Row>
    </div>
  )
}

/* -------------------------------------------------------------------------- */

const stageVisuals: Record<StageVisual, () => React.JSX.Element> = {
  capture: CaptureVisual,
  think: ThinkVisual,
  create: CreateVisual,
  automate: AutomateVisual,
  ship: ShipVisual,
}

export function StageArtwork({ stage }: { stage: StageVisual }) {
  const Artwork = stageVisuals[stage]
  return <Artwork />
}
