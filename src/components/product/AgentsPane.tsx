import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Icon } from '@/components/primitives/Icon'
import { StatusDot } from './StatusDot'
import { agentRoster } from '@/data/workspace'
import { DISCLOSURE_TRANSITION, EASE_OUT } from '@/lib/motion'
import { cn } from '@/lib/cn'

const statusLabel = {
  running: 'Running',
  done: 'Idle',
  queued: 'Scheduled',
} as const

/**
 * Agent roster with expand/collapse. Only one card is open at a time —
 * accordions that allow everything open at once always end up as a wall.
 */
export function AgentsPane() {
  const [openId, setOpenId] = useState<string | null>(agentRoster[0].id)
  const reduceMotion = useReducedMotion()

  return (
    <ul className="flex flex-col gap-2">
      {agentRoster.map((agent) => {
        const isOpen = openId === agent.id
        const panelId = `agent-panel-${agent.id}`

        return (
          <li
            key={agent.id}
            className={cn(
              'overflow-hidden rounded-md border bg-canvas/40 transition-colors duration-300',
              isOpen ? 'border-line-strong' : 'border-line',
            )}
          >
            <h4>
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : agent.id)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left"
              >
                <StatusDot status={agent.status} label={statusLabel[agent.status]} />

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-micro font-medium text-primary">
                    {agent.name}
                  </span>
                  <span className="mt-0.5 block truncate text-[0.625rem] text-muted">
                    {agent.description}
                  </span>
                </span>

                <span className="hidden shrink-0 text-right font-mono text-[0.5625rem] uppercase tracking-[0.1em] text-muted sm:block">
                  <span className="block">{agent.schedule}</span>
                  <span className="block">{agent.totalRuns} runs</span>
                </span>

                <motion.span
                  className="shrink-0 text-muted"
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={reduceMotion ? { duration: 0 } : { duration: 0.28, ease: EASE_OUT }}
                >
                  <Icon name="chevron-down" size={14} />
                </motion.span>
              </button>
            </h4>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  key="panel"
                  initial="collapsed"
                  animate="open"
                  exit="collapsed"
                  variants={{ collapsed: { height: 0, opacity: 0 }, open: { height: 'auto', opacity: 1 } }}
                  transition={reduceMotion ? { duration: 0 } : DISCLOSURE_TRANSITION}
                  className="overflow-hidden"
                >
                  <div className="border-t border-line px-3 py-3">
                    <p className="mb-2 font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-muted">
                      Last run · {agent.lastRun}
                    </p>
                    <ol className="flex flex-col gap-1.5">
                      {agent.recent.map((step, index) => (
                        <li key={step} className="flex items-start gap-2">
                          <span className="mt-1 font-mono text-[0.5rem] text-accent">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span className="min-w-0 flex-1 text-[0.6875rem] leading-relaxed text-secondary">
                            {step}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        )
      })}
    </ul>
  )
}
