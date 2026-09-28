import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Icon } from '@/components/primitives/Icon'
import { Tilt3D } from '@/components/primitives/Tilt3D'
import { Sparkline } from '@/components/product/Sparkline'
import { StatusDot } from '@/components/product/StatusDot'
import { EASE_OUT } from '@/lib/motion'
import { cn } from '@/lib/cn'

/**
 * The sign-in page's only decoration.
 *
 * Three plates from the product — a running agent, a finished document, a
 * counter — hung on separate Z planes inside one tilting frame. Because the
 * frame is `preserve-3d` and each plate carries its own `translateZ`, moving
 * the cursor sweeps the near plate further than the far one: the depth is
 * measured by the browser, not implied by a drop shadow.
 *
 * It is the product's own material rather than an abstract gradient, so the
 * page still says what NOVA is while you are signing into it.
 */
export function AuthStack() {
  const reduceMotion = useReducedMotion()

  return (
    <div className="relative flex h-[calc(100dvh-var(--nav-h))] items-center justify-center">
      {/* Light from above, matching the hero. Not a blob: a gradient with a
          direction, masked out before it reaches the fold. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(38rem 26rem at 62% 34%, rgb(242 177 60 / 0.055), transparent 70%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid"
        style={{
          maskImage: 'radial-gradient(30rem 24rem at 60% 40%, rgb(0 0 0 / 0.5), transparent 75%)',
          WebkitMaskImage:
            'radial-gradient(30rem 24rem at 60% 40%, rgb(0 0 0 / 0.5), transparent 75%)',
        }}
      />

      <Tilt3D
        frameClassName="relative w-full max-w-[34rem]"
        className="relative aspect-[5/4.4] w-full"
        max={9}
        perspective={1200}
        lift={0}
      >
        {/* Far plate — the workspace behind everything. */}
        <Plate
          delay={0.1}
          reduceMotion={reduceMotion}
          z={-40}
          rotate={-2}
          className="absolute left-[8%] top-[6%] w-[74%]"
        >
          <PlateHeader label="Workspace" meta="Fieldnote" />
          <div className="space-y-2 p-3.5">
            {['Q3 competitor landscape', 'Churn interviews — synthesis', 'Pricing experiment'].map(
              (title) => (
                <div key={title} className="flex items-center gap-2.5">
                  <Icon name="doc" size={12} className="shrink-0 text-muted" />
                  <span className="truncate text-[0.6875rem] text-secondary">{title}</span>
                </div>
              ),
            )}
          </div>
        </Plate>

        {/* Mid plate — the counter. */}
        <Plate
          delay={0.22}
          reduceMotion={reduceMotion}
          z={16}
          rotate={1}
          className="absolute right-[4%] top-[30%] w-[46%]"
        >
          <div className="p-3.5">
            <p className="font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-muted">
              Hours returned
            </p>
            <div className="mt-2 flex items-end justify-between gap-3">
              <span className="text-[1.75rem] font-medium leading-none tracking-[-0.03em] text-primary">
                36.5
              </span>
              <Sparkline
                points={[0.28, 0.34, 0.31, 0.46, 0.52, 0.49, 0.64, 0.71, 0.82]}
                className="text-accent"
                width={80}
                height={28}
              />
            </div>
          </div>
        </Plate>

        {/* Near plate — the agent actually working. This is the one that should
            sweep furthest, so it carries the largest Z. */}
        <Plate
          delay={0.34}
          reduceMotion={reduceMotion}
          z={64}
          rotate={-1}
          className="absolute bottom-[8%] left-[2%] w-[66%]"
        >
          <PlateHeader label="Research agent" meta="running" running />
          <div className="p-3.5">
            <p className="text-[0.75rem] leading-snug text-primary">
              Reading 42 sources on the Halcyon pricing change.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span
                aria-hidden="true"
                className="h-px flex-1 overflow-hidden rounded-full bg-line-strong"
              >
                <motion.span
                  className="block h-px bg-accent"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 0.68 }}
                  style={{ transformOrigin: 'left' }}
                  transition={{
                    duration: reduceMotion ? 0 : 1.6,
                    ease: EASE_OUT,
                    delay: reduceMotion ? 0 : 0.8,
                  }}
                />
              </span>
              <span className="font-mono text-[0.5625rem] tabular-nums text-muted">68%</span>
            </div>
          </div>
        </Plate>
      </Tilt3D>
    </div>
  )
}

function Plate({
  children,
  className,
  z,
  rotate,
  delay,
  reduceMotion,
}: {
  children: ReactNode
  className?: string
  z: number
  rotate: number
  delay: number
  reduceMotion: boolean | null
}) {
  return (
    <motion.div
      aria-hidden="true"
      className={cn(
        'overflow-hidden rounded-lg border border-line bg-surface/90',
        'shadow-[0_30px_60px_-28px_rgb(0_0_0/0.9)]',
        className,
      )}
      // Z and rotation both come from motion values rather than `depth-*` /
      // `rotate-*` classes: motion owns this node's inline transform, and an
      // inline transform beats a utility class every time.
      style={{ z, rotate }}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0.4 : 0.8, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  )
}

function PlateHeader({
  label,
  meta,
  running = false,
}: {
  label: string
  meta: string
  running?: boolean
}) {
  return (
    <div className="flex items-center justify-between border-b border-line bg-elevated/60 px-3.5 py-2">
      <span className="font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-secondary">
        {label}
      </span>
      <span className="flex items-center gap-1.5">
        {running && <StatusDot status="running" label="Agent running" />}
        <span className="font-mono text-[0.5625rem] uppercase tracking-[0.1em] text-muted">
          {meta}
        </span>
      </span>
    </div>
  )
}
