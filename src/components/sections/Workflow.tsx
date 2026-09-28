import { useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { Container } from '@/components/primitives/Container'
import { Icon } from '@/components/primitives/Icon'
import { Kicker } from '@/components/primitives/Kicker'
import { Reveal } from '@/components/primitives/Reveal'
import { Section } from '@/components/primitives/Section'
import { Scramble } from '@/components/primitives/Scramble'
import { WordReveal } from '@/components/primitives/WordReveal'
import { StageArtwork } from '@/components/visuals/StageVisuals'
import { workflowCopy, workflowStages } from '@/data/workflow'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { EASE_OUT } from '@/lib/motion'
import { cn } from '@/lib/cn'

/**
 * Capture → Think → Create → Automate → Ship.
 *
 * On desktop the stage is driven by scroll position through a tall spacer with
 * a sticky viewport, so the reader moves through the loop at their own pace and
 * can go backwards. Below `lg` that becomes a plain stacked list: scroll-linked
 * staging fights a thumb, and hijacking a phone's scroll to run an animation is
 * the fastest way to make someone leave.
 */
export function Workflow() {
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  return (
    <Section id="workflow" rule density={isDesktop ? 'tight' : 'default'}>
      <Container width="wide">
        <div className="grid gap-x-12 gap-y-5 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Reveal y={12}>
              <Kicker index="05">
                <Scramble text={workflowCopy.kicker.toUpperCase()} />
              </Kicker>
            </Reveal>
            <WordReveal
              as="h2"
              text="Capture, think, create, automate, ship."
              emphasis="ship."
              delay={0.05}
              className="mt-4 block text-h2 max-w-[20ch]"
            />
          </div>
          <Reveal delay={0.12} className="lg:col-span-5 lg:col-start-8 lg:self-end lg:pb-1">
            <p className="text-lead max-w-[42ch] text-secondary">{workflowCopy.body}</p>
          </Reveal>
        </div>
      </Container>

      {isDesktop ? <ScrollStepper /> : <StackedStages />}
    </Section>
  )
}

/* -------------------------------------------------------------------------- */
/* Desktop: scroll-linked                                                      */
/* -------------------------------------------------------------------------- */

function ScrollStepper() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    const index = Math.min(workflowStages.length - 1, Math.floor(value * workflowStages.length))
    setActive(index < 0 ? 0 : index)
  })

  const stage = workflowStages[active]

  return (
    <div ref={trackRef} className="relative mt-14 h-[320vh]">
      <div className="sticky top-[var(--rail-h)] flex h-[calc(100vh-var(--rail-h))] items-center">
        <Container width="wide" className="w-full">
          {/* Progress rail */}
          <div className="relative">
            <span aria-hidden="true" className="absolute inset-x-0 top-[0.4375rem] h-px bg-line" />
            <motion.span
              aria-hidden="true"
              className="absolute left-0 top-[0.4375rem] h-px origin-left bg-accent"
              style={{ scaleX: scrollYProgress, width: '100%' }}
            />

            <ol className="relative flex justify-between">
              {workflowStages.map((item, index) => {
                const isActive = index === active
                const isPast = index < active

                return (
                  <li key={item.id} className="flex flex-col items-center gap-3">
                    <span
                      className={cn(
                        'grid size-[0.875rem] place-items-center rounded-full border-2 bg-canvas',
                        'transition-colors duration-400',
                        isActive
                          ? 'border-accent'
                          : isPast
                            ? 'border-accent/45'
                            : 'border-line-strong',
                      )}
                    >
                      {isActive && <span className="size-1 rounded-full bg-accent" />}
                    </span>
                    <span
                      className={cn(
                        'font-mono text-[0.625rem] uppercase tracking-[0.14em] transition-colors duration-400',
                        isActive ? 'text-primary' : 'text-muted',
                      )}
                    >
                      {item.label}
                    </span>
                  </li>
                )
              })}
            </ol>
          </div>

          {/* Active stage */}
          <div className="mt-11 grid min-h-[21rem] grid-cols-12 gap-x-12">
            <div className="col-span-5 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: EASE_OUT }}
                >
                  <span className="flex items-center gap-2.5 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-accent">
                    {stage.index}
                    <span aria-hidden="true" className="h-px w-5 bg-accent/40" />
                    <span className="text-muted">
                      of {String(workflowStages.length).padStart(2, '0')}
                    </span>
                  </span>

                  <h3 className="mt-5 text-h1 max-w-[18ch]">{stage.title}</h3>

                  <p className="text-lead mt-5 max-w-[40ch] text-secondary">
                    {stage.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="col-span-7 flex items-center">
              <div className="w-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={stage.id}
                    initial={{ opacity: 0, y: 18, scale: 0.985 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -12, scale: 0.99 }}
                    transition={{ duration: 0.45, ease: EASE_OUT }}
                  >
                    <StageArtwork stage={stage.id} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Mobile / tablet: stacked                                                    */
/* -------------------------------------------------------------------------- */

function StackedStages() {
  return (
    <Container width="wide" className="mt-12">
      <ol className="flex flex-col">
        {workflowStages.map((stage, index) => (
          <Reveal
            as="li"
            key={stage.id}
            y={18}
            className={cn(
              'relative border-t border-line py-8',
              index === workflowStages.length - 1 && 'border-b',
            )}
          >
            <span className="flex items-center gap-2.5 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-accent">
              {stage.index}
              <span aria-hidden="true" className="h-px w-5 bg-accent/40" />
              <Icon name={stage.icon} size={13} />
            </span>

            <h3 className="mt-4 text-h3 max-w-[22ch]">{stage.title}</h3>
            <p className="mt-3 max-w-[48ch] text-caption leading-relaxed text-secondary">
              {stage.description}
            </p>

            <div className="mt-6">
              <StageArtwork stage={stage.id} />
            </div>
          </Reveal>
        ))}
      </ol>
    </Container>
  )
}
