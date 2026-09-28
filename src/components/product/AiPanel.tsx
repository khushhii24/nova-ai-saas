import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Icon } from '@/components/primitives/Icon'
import { Avatar } from './Avatar'
import { Kbd } from './Kbd'
import { actors, aiThread } from '@/data/workspace'
import { useTypewriter } from '@/hooks/useTypewriter'
import { EASE_OUT } from '@/lib/motion'
import { cn } from '@/lib/cn'

type Phase = 'idle' | 'thinking' | 'streaming'

/**
 * The assistant panel.
 *
 * Three details do the heavy lifting for believability:
 *   1. A short "reading sources" phase before any text appears. Real models
 *      pause; instant text reads as a scripted animation.
 *   2. Irregular character bursts (see `useTypewriter`) instead of a metronome.
 *   3. Sources appear *after* the answer, the way a citation pass actually
 *      resolves — and they carry counts, so they look retrieved not invented.
 */
export function AiPanel({ active, className }: { active: boolean; className?: string }) {
  const reduceMotion = useReducedMotion()
  const [phase, setPhase] = useState<Phase>('idle')

  useEffect(() => {
    if (!active) {
      setPhase('idle')
      return
    }

    if (reduceMotion) {
      setPhase('streaming')
      return
    }

    setPhase('thinking')
    const toStreaming = setTimeout(() => setPhase('streaming'), 1100)
    return () => clearTimeout(toStreaming)
  }, [active, reduceMotion])

  const { output, done } = useTypewriter(aiThread.response, {
    start: phase === 'streaming',
    speed: 11,
  })

  return (
    <aside
      aria-label="NOVA assistant"
      className={cn('flex h-full flex-col bg-canvas/40', className)}
    >
      <header className="flex items-center gap-2 border-b border-line px-3 py-2.5">
        <span className="grid size-5 place-items-center rounded-xs bg-accent/12">
          <Icon name="sparkles" size={11} className="text-accent" />
        </span>
        <h3 className="flex-1 text-[0.6875rem] font-medium text-primary">Ask NOVA</h3>
        <span className="hidden rounded-xs border border-line bg-surface px-1.5 font-mono text-[0.5625rem] text-muted sm:inline">
          nova-1
        </span>
      </header>

      <div className="flex-1 overflow-hidden px-3 py-3">
        {/* Question */}
        <div className="flex gap-2">
          <Avatar actor={actors.naomi} size="xs" />
          <p className="min-w-0 flex-1 text-[0.6875rem] leading-relaxed text-secondary">
            {aiThread.prompt}
          </p>
        </div>

        {/* Answer */}
        <div className="mt-3.5 flex gap-2">
          <span className="grid size-5 shrink-0 place-items-center rounded-full border border-accent/35 bg-accent/12 font-mono text-[0.5625rem] font-semibold text-accent">
            N
          </span>

          <div className="min-w-0 flex-1">
            <AnimatePresence mode="wait">
              {phase === 'thinking' && (
                <motion.div
                  key="thinking"
                  className="flex items-center gap-2 py-0.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.16 }}
                >
                  <span aria-hidden="true" className="flex gap-1">
                    {[0, 1, 2].map((dot) => (
                      <motion.span
                        key={dot}
                        className="size-1 rounded-full bg-accent"
                        animate={{ opacity: [0.25, 1, 0.25] }}
                        transition={{
                          duration: 1.1,
                          repeat: Infinity,
                          delay: dot * 0.16,
                          ease: 'easeInOut',
                        }}
                      />
                    ))}
                  </span>
                  <span className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted">
                    Reading 3 sources
                  </span>
                </motion.div>
              )}

              {phase === 'streaming' && (
                <motion.p
                  key="answer"
                  className="text-[0.6875rem] leading-relaxed text-secondary"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  aria-live="polite"
                >
                  {output}
                  {!done && (
                    <span
                      aria-hidden="true"
                      className="ml-0.5 inline-block h-3 w-[0.1875rem] translate-y-px bg-accent align-middle motion-safe:animate-[nova-caret_1s_step-end_infinite]"
                    />
                  )}
                </motion.p>
              )}

              {phase === 'idle' && (
                <p
                  key="idle"
                  className="text-[0.6875rem] leading-relaxed text-muted"
                >
                  Scroll down to run this question.
                </p>
              )}
            </AnimatePresence>

            {/* Citations land once the answer is complete. */}
            <AnimatePresence>
              {done && phase === 'streaming' && (
                <motion.div
                  className="mt-3 flex flex-col gap-1.5"
                  initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: EASE_OUT }}
                >
                  <p className="font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-muted">
                    Sources
                  </p>
                  {aiThread.sources.map((source, index) => (
                    <motion.button
                      key={source.id}
                      type="button"
                      className={cn(
                        'flex items-center gap-2 rounded-sm border border-line bg-surface/80 px-2 py-1.5',
                        'text-left transition-colors duration-150 hover:border-line-strong hover:bg-raised',
                      )}
                      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.34, ease: EASE_OUT, delay: 0.06 * index }}
                    >
                      <Icon name={source.icon} size={11} className="text-muted" />
                      <span className="min-w-0 flex-1 truncate text-[0.625rem] text-secondary">
                        {source.label}
                      </span>
                      <span className="shrink-0 font-mono text-[0.5625rem] text-muted">
                        {source.meta}
                      </span>
                    </motion.button>
                  ))}

                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {aiThread.followUps.map((followUp) => (
                      <button
                        key={followUp}
                        type="button"
                        className={cn(
                          'rounded-full border border-line bg-surface/60 px-2.5 py-1 text-[0.625rem]',
                          'text-secondary transition-colors duration-150',
                          'hover:border-accent/40 hover:text-primary',
                        )}
                      >
                        {followUp}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="border-t border-line p-2.5">
        <div
          className={cn(
            'flex items-center gap-2 rounded-sm border border-line bg-surface px-2.5 py-2',
            'transition-colors duration-200 focus-within:border-accent/45',
          )}
        >
          <Icon name="sparkles" size={12} className="text-muted" />
          <input
            type="text"
            aria-label="Ask NOVA a question"
            placeholder="Ask a follow-up…"
            className="min-w-0 flex-1 bg-transparent text-[0.6875rem] text-primary outline-none placeholder:text-muted"
          />
          <Kbd>⌘J</Kbd>
        </div>
      </div>
    </aside>
  )
}
