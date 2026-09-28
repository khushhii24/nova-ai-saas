import { useRef } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react'
import { Button } from '@/components/primitives/Button'
import { Container } from '@/components/primitives/Container'
import { Icon } from '@/components/primitives/Icon'
import { Kicker } from '@/components/primitives/Kicker'
import { Reveal } from '@/components/primitives/Reveal'
import { Section } from '@/components/primitives/Section'
import { Scramble } from '@/components/primitives/Scramble'
import { WordReveal } from '@/components/primitives/WordReveal'
import { AppShell } from '@/components/product/AppShell'
import { StatusDot } from '@/components/product/StatusDot'
import { agentCopy, agentRun } from '@/data/agent'
import { useAgentRun } from '@/hooks/useAgentRun'
import { EASE_OUT } from '@/lib/motion'
import { cn } from '@/lib/cn'

/**
 * The agent run, replayed.
 *
 * This is the page's strongest claim, so it is the one section that animates
 * on its own: the run starts when it scrolls into view and advances at the
 * pace the step durations describe. Everything a real run log shows is here —
 * the tool called, how long it took, and what came back — because a progress
 * bar with no evidence behind it is exactly what people distrust about agents.
 */
export function AgentWorkflow() {
  const logRef = useRef<HTMLDivElement>(null)
  const inView = useInView(logRef, { once: true, amount: 0.3 })
  const reduceMotion = useReducedMotion()
  const { completed, finished, elapsedSeconds, replay } = useAgentRun(agentRun.steps, inView)

  const total = agentRun.steps.length
  const progress = Math.min(1, completed / total)

  return (
    <Section id="agents" rule>
      <Container width="wide">
        <div className="grid gap-x-14 gap-y-12 lg:grid-cols-12">
          {/* ------------------------------- Copy ------------------------------- */}
          <div className="lg:col-span-5 lg:pt-4">
            <Reveal y={12}>
              <Kicker index="04">
                <Scramble text={agentCopy.kicker.toUpperCase()} />
              </Kicker>
            </Reveal>

            <h2 className="mt-4 text-h2">
              <WordReveal text="Don’t just use AI." delay={0.05} as="span" />
              <br />
              <WordReveal
                text="Put it to work."
                emphasis={['to', 'work.']}
                delay={0.16}
                as="span"
              />
            </h2>

            <Reveal delay={0.12}>
              <p className="text-lead mt-6 max-w-[42ch] text-secondary">{agentCopy.body}</p>
            </Reveal>

            <Reveal delay={0.18}>
              <dl className="mt-9 flex flex-col divide-y divide-line border-y border-line">
                {[
                  { label: 'Trigger', value: agentRun.trigger },
                  { label: 'Agent', value: `${agentRun.agent} · ${agentRun.model}` },
                  { label: 'Approval', value: 'Required before anything is published' },
                ].map((row) => (
                  <div key={row.label} className="flex gap-4 py-3.5">
                    <dt className="w-20 shrink-0 font-mono text-[0.625rem] uppercase tracking-[0.13em] text-muted">
                      {row.label}
                    </dt>
                    <dd className="min-w-0 flex-1 text-caption text-secondary">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={0.24} className="mt-8">
              <Button variant="secondary" size="md" leadingIcon="replay" onClick={replay}>
                Replay this run
              </Button>
            </Reveal>
          </div>

          {/* ------------------------------ Run log ----------------------------- */}
          <div ref={logRef} className="lg:col-span-7">
            <Reveal y={22}>
              <AppShell
                bare
                title={<span className="text-secondary">runs / competitor-landscape</span>}
                actions={
                  <span className="flex items-center gap-2 font-mono text-[0.5625rem] uppercase tracking-[0.1em] text-muted">
                    <Icon name="timer" size={11} />
                    {elapsedSeconds.toFixed(1)}s
                  </span>
                }
              >
                {/* Run header */}
                <div className="border-b border-line px-4 py-3.5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-muted">
                        Task
                      </p>
                      <h3 className="mt-1 truncate text-caption font-medium text-primary">
                        {agentRun.title}
                      </h3>
                    </div>
                    <span
                      className={cn(
                        'flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-1',
                        'font-mono text-[0.5625rem] uppercase tracking-[0.1em]',
                        finished
                          ? 'border-success/30 bg-success/10 text-success'
                          : 'border-accent/30 bg-accent/10 text-accent',
                      )}
                    >
                      <StatusDot status={finished ? 'done' : 'running'} />
                      {finished ? 'Complete' : `Step ${Math.min(completed + 1, total)}/${total}`}
                    </span>
                  </div>

                  <div className="mt-3 h-0.5 overflow-hidden rounded-full bg-line">
                    <motion.div
                      className={cn('h-full rounded-full', finished ? 'bg-success' : 'bg-accent')}
                      animate={{ width: `${progress * 100}%` }}
                      transition={
                        reduceMotion ? { duration: 0 } : { duration: 0.45, ease: EASE_OUT }
                      }
                    />
                  </div>
                </div>

                {/* Steps */}
                <ol className="relative px-4 py-3">
                  <span
                    aria-hidden="true"
                    className="absolute bottom-7 left-[1.375rem] top-7 w-px bg-line"
                  />

                  {agentRun.steps.map((step, index) => {
                    const isDone = index < completed
                    const isRunning = index === completed && !finished
                    const isQueued = index > completed

                    return (
                      <li
                        key={step.id}
                        className={cn(
                          'relative flex gap-3 py-2.5 transition-opacity duration-500',
                          isQueued ? 'opacity-40' : 'opacity-100',
                        )}
                      >
                        <span className="relative z-10 mt-px shrink-0 bg-surface">
                          <StatusDot
                            status={isDone ? 'done' : isRunning ? 'running' : 'queued'}
                            label={isDone ? 'Complete' : isRunning ? 'Running' : 'Queued'}
                          />
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                            <h4
                              className={cn(
                                'text-micro font-medium transition-colors duration-300',
                                isQueued ? 'text-muted' : 'text-primary',
                              )}
                            >
                              {step.label}
                            </h4>
                            <span
                              className={cn(
                                'rounded-xs border px-1.5 font-mono text-[0.5625rem] tracking-[0.02em]',
                                isRunning
                                  ? 'border-accent/35 bg-accent/10 text-accent'
                                  : 'border-line bg-canvas/60 text-muted',
                              )}
                            >
                              {step.tool}
                            </span>
                          </div>

                          <p className="mt-1 text-[0.6875rem] leading-relaxed text-secondary">
                            {step.detail}
                          </p>

                          <AnimatePresence>
                            {isDone && (
                              <motion.p
                                className="mt-1.5 flex items-center gap-1.5 font-mono text-[0.5625rem] uppercase tracking-[0.1em] text-muted"
                                initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -3 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, ease: EASE_OUT }}
                              >
                                <Icon name="check" size={9} className="text-success" />
                                {step.result}
                                <span aria-hidden="true" className="text-line-strong">
                                  ·
                                </span>
                                {(step.durationMs / 1000).toFixed(1)}s
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>
                      </li>
                    )
                  })}
                </ol>

                {/* Deliverable */}
                <AnimatePresence>
                  {finished && (
                    <motion.div
                      className="border-t border-line p-4"
                      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, ease: EASE_OUT }}
                    >
                      <div
                        className={cn(
                          'rounded-lg border border-accent/25 bg-accent/[0.055] p-3.5',
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-md border border-accent/30 bg-accent/12">
                            <Icon name="file-check" size={14} className="text-accent" />
                          </span>

                          <div className="min-w-0 flex-1">
                            <h4 className="text-caption font-medium text-primary">
                              {agentRun.output.title}
                            </h4>
                            <ul className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                              {agentRun.output.meta.map((chip) => (
                                <li
                                  key={chip}
                                  className="font-mono text-[0.5625rem] uppercase tracking-[0.1em] text-muted after:ml-2 after:text-line-strong after:content-['·'] last:after:content-['']"
                                >
                                  {chip}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <Icon
                            name="arrow-up-right"
                            size={14}
                            className="mt-1 shrink-0 text-muted"
                          />
                        </div>

                        <ul className="mt-3 flex flex-col gap-1.5 border-t border-accent/15 pt-3">
                          {agentRun.output.findings.map((finding, index) => (
                            <motion.li
                              key={finding}
                              className="flex gap-2 text-[0.6875rem] leading-relaxed text-secondary"
                              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, x: -5 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                duration: 0.4,
                                ease: EASE_OUT,
                                delay: reduceMotion ? 0 : 0.15 + index * 0.08,
                              }}
                            >
                              <span className="font-mono text-[0.5rem] text-accent">
                                {String(index + 1).padStart(2, '0')}
                              </span>
                              {finding}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </AppShell>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  )
}
