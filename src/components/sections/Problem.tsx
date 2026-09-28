import { motion, useReducedMotion } from 'motion/react'
import { Container } from '@/components/primitives/Container'
import { Icon } from '@/components/primitives/Icon'
import { Kicker } from '@/components/primitives/Kicker'
import { Reveal } from '@/components/primitives/Reveal'
import { Section } from '@/components/primitives/Section'
import { Scramble } from '@/components/primitives/Scramble'
import { WordReveal } from '@/components/primitives/WordReveal'
import { Kbd } from '@/components/product/Kbd'
import { fragmentedStages, problemCopy, unifiedCapabilities } from '@/data/problem'
import { EASE_OUT, VIEWPORT_TALL } from '@/lib/motion'
import { cn } from '@/lib/cn'

/** Column centres of the five-card row, as viewBox percentages. */
const FUNNEL_ORIGINS = [9, 29, 49, 69, 89]

/**
 * Problem → solution.
 *
 * The argument is made geometrically rather than in prose: five misaligned
 * cards with dashed hand-offs on top, five curves funnelling into a single
 * point, one aligned surface underneath. The curves draw themselves on scroll,
 * so the convergence is something the reader watches happen.
 */
export function Problem() {
  const reduceMotion = useReducedMotion()

  return (
    <Section id="problem" rule>
      <Container width="wide">
        <div className="grid gap-x-12 gap-y-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal y={12}>
              <Kicker index="01">
                <Scramble text={problemCopy.kicker.toUpperCase()} />
              </Kicker>
            </Reveal>
            <WordReveal
              as="h2"
              text={problemCopy.headline}
              emphasis="twenty"
              delay={0.05}
              className="mt-4 block text-h2 max-w-[22ch]"
            />
          </div>
          <Reveal delay={0.12} className="lg:col-span-5 lg:self-end lg:pb-1">
            <p className="text-lead max-w-[46ch] text-secondary">{problemCopy.body}</p>
          </Reveal>
        </div>

        <div className="mt-14 lg:mt-20">
          {/* ---------------- Fragmented ---------------- */}
          <Reveal y={16} className="mb-5 flex items-center gap-3">
            <span className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted">
              {problemCopy.fragmentedLabel}
            </span>
            <span aria-hidden="true" className="h-px flex-1 bg-line" />
            <span className="hidden font-mono text-[0.625rem] uppercase tracking-[0.13em] text-muted sm:block">
              {problemCopy.fragmentedNote}
            </span>
          </Reveal>

          <ul className="flex flex-col gap-2.5 lg:flex-row lg:gap-0">
            {fragmentedStages.map((stage, index) => (
              <Reveal
                as="li"
                key={stage.id}
                delay={index * 0.06}
                y={14}
                className="flex min-w-0 flex-1 items-center gap-2"
              >
                <div
                  className={cn(
                    'min-w-0 flex-1 rounded-lg border border-dashed border-line-strong/80',
                    'bg-surface/50 p-3.5 transition-colors duration-300 hover:border-line-strong',
                    // Nothing quite lines up — that is the point.
                    index % 2 === 0 ? 'lg:rotate-[-0.7deg]' : 'lg:rotate-[0.55deg]',
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Icon name={stage.icon} size={14} className="text-muted" />
                    <h3 className="text-caption font-medium text-secondary">{stage.label}</h3>
                  </div>
                  <ul className="mt-2.5 flex flex-wrap gap-1">
                    {stage.tools.map((tool) => (
                      <li
                        key={tool}
                        className={cn(
                          'rounded-xs border border-line bg-canvas/60 px-1.5 py-0.5',
                          'font-mono text-[0.5625rem] tracking-[0.02em] text-muted',
                        )}
                      >
                        {tool}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Hand-off. Present on every card so widths stay equal. */}
                <span
                  aria-hidden="true"
                  className={cn(
                    'hidden w-7 shrink-0 justify-center lg:flex',
                    index === fragmentedStages.length - 1 && 'opacity-0',
                  )}
                >
                  <Icon name="arrow-right" size={14} className="text-line-strong" />
                </span>
              </Reveal>
            ))}
          </ul>

          {/* ---------------- Convergence ---------------- */}
          <div aria-hidden="true" className="relative">
            <svg
              viewBox="0 0 100 40"
              preserveAspectRatio="none"
              className="hidden h-24 w-full lg:block"
            >
              {FUNNEL_ORIGINS.map((x, index) => (
                <motion.path
                  key={x}
                  d={`M ${x} 0 C ${x} 17, 50 19, 50 40`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                  className="text-line-strong"
                  initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={VIEWPORT_TALL}
                  transition={{
                    duration: 1.1,
                    ease: EASE_OUT,
                    delay: reduceMotion ? 0 : 0.1 + index * 0.08,
                  }}
                />
              ))}
            </svg>

            {/* Mobile: a plain drop instead of a funnel. */}
            <div className="flex h-12 flex-col items-center justify-center gap-1 lg:hidden">
              <span className="h-6 w-px border-l border-dashed border-line-strong" />
              <Icon name="chevron-down" size={14} className="text-line-strong" />
            </div>

            <motion.span
              className="absolute bottom-0 left-1/2 hidden size-1.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-accent lg:block"
              initial={reduceMotion ? false : { scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={VIEWPORT_TALL}
              transition={{ duration: 0.4, ease: EASE_OUT, delay: reduceMotion ? 0 : 1.05 }}
            />
          </div>

          {/* ---------------- Unified ---------------- */}
          <Reveal y={18} delay={0.1}>
            <div className="mb-5 flex items-center gap-3">
              <span className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-accent">
                {problemCopy.unifiedLabel}
              </span>
              <span aria-hidden="true" className="h-px flex-1 bg-line" />
              <span className="hidden font-mono text-[0.625rem] uppercase tracking-[0.13em] text-muted sm:block">
                {problemCopy.unifiedNote}
              </span>
            </div>

            <div
              className={cn(
                'relative overflow-hidden rounded-xl border border-line bg-surface p-4 lift-2 sm:p-6',
              )}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-grid-sm opacity-40"
                style={{
                  maskImage: 'radial-gradient(110% 80% at 50% 0%, black, transparent 72%)',
                  WebkitMaskImage: 'radial-gradient(110% 80% at 50% 0%, black, transparent 72%)',
                }}
              />

              <div className="relative">
                <div
                  className={cn(
                    'flex items-center gap-2.5 rounded-md border border-line bg-elevated/80 px-3 py-2.5',
                  )}
                >
                  <Icon name="sparkles" size={14} className="text-accent" />
                  <span className="min-w-0 flex-1 truncate text-caption text-secondary">
                    Ask anything across research, docs, data and agents…
                  </span>
                  <Kbd className="hidden sm:inline-grid">⌘K</Kbd>
                </div>

                <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                  {unifiedCapabilities.map((capability, index) => (
                    <motion.li
                      key={capability.label}
                      className={cn(
                        'flex items-center gap-2 rounded-md border border-line bg-elevated/50 px-3 py-2.5',
                      )}
                      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={VIEWPORT_TALL}
                      transition={{
                        duration: 0.5,
                        ease: EASE_OUT,
                        delay: reduceMotion ? 0 : 0.18 + index * 0.06,
                      }}
                    >
                      <Icon name={capability.icon} size={14} className="text-accent" />
                      <span className="truncate text-caption text-primary">
                        {capability.label}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}
