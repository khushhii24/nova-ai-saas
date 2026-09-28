import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { Button } from '@/components/primitives/Button'
import { Container } from '@/components/primitives/Container'
import { Icon } from '@/components/primitives/Icon'
import { Magnetic } from '@/components/primitives/Magnetic'
import { WordReveal } from '@/components/primitives/WordReveal'
import { HeroPreview } from '@/components/product/HeroPreview'
import { EASE_OUT } from '@/lib/motion'
import { cn } from '@/lib/cn'

const rise = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT } },
}

/**
 * Editorial asymmetric hero.
 *
 * The headline occupies seven of twelve columns and the supporting column is
 * bottom-aligned to it, so the two blocks share a baseline instead of sitting
 * in a centred stack.
 *
 * Two pieces of motion carry the opening:
 *   1. The headline is uncovered word by word (`WordReveal`) rather than faded.
 *   2. The product preview enters tilted back in perspective and *settles flat
 *      as you scroll into it* — scroll-driven, so it is reversible and paced by
 *      the reader rather than by a timer.
 */
export function Hero() {
  const reduceMotion = useReducedMotion()
  const previewRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  // Settle: tilted and small when it first appears, flat by the time it is
  // comfortably on screen.
  const { scrollYProgress: settle } = useScroll({
    target: previewRef,
    offset: ['start 0.95', 'start 0.32'],
  })
  const smooth = useSpring(settle, { stiffness: 120, damping: 28, mass: 0.5 })
  const rotateX = useTransform(smooth, [0, 1], [15, 0])
  const scale = useTransform(smooth, [0, 1], [0.9, 1])
  const previewY = useTransform(smooth, [0, 1], [56, 0])

  // Texture drifts slower than content — depth without a parallax gimmick.
  const { scrollYProgress: pageProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const gridY = useTransform(pageProgress, [0, 1], [0, 120])
  const glowY = useTransform(pageProgress, [0, 1], [0, 180])
  const copyY = useTransform(pageProgress, [0, 1], [0, -40])

  return (
    <section
      ref={sectionRef}
      id="main"
      className="relative overflow-hidden pb-24 pt-[calc(var(--nav-h)+3.5rem)] sm:pb-28 lg:pb-36 lg:pt-[calc(var(--nav-h)+5.5rem)]"
    >
      {/* Light falling from above, not a glowing blob. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[38rem]"
        style={{
          y: reduceMotion ? 0 : glowY,
          background:
            'linear-gradient(180deg, rgb(242 177 60 / 0.06) 0%, rgb(242 177 60 / 0.015) 26%, transparent 60%)',
        }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-grid"
        style={{
          y: reduceMotion ? 0 : gridY,
          maskImage: 'linear-gradient(180deg, rgb(0 0 0 / 0.55), transparent 78%)',
          WebkitMaskImage: 'linear-gradient(180deg, rgb(0 0 0 / 0.55), transparent 78%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grain opacity-[0.16] mix-blend-soft-light"
      />

      {/* Margin rules — the editorial device that frames the column. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 right-0">
        <Container width="wide" className="relative h-full">
          <span className="absolute left-5 top-0 h-full w-px bg-line/60 sm:left-7 lg:left-10" />
          <span className="absolute right-5 top-0 h-full w-px bg-line/60 sm:right-7 lg:right-10" />
        </Container>
      </div>

      <Container width="wide" className="relative">
        <motion.div
          className="grid gap-x-10 gap-y-9 lg:grid-cols-12 lg:items-end"
          style={{ y: reduceMotion ? 0 : copyY }}
        >
          <div className="lg:col-span-7">
            <motion.div
              className="mb-7 flex items-center gap-3 lg:mb-9"
              variants={rise}
              initial={reduceMotion ? 'visible' : 'hidden'}
              animate="visible"
            >
              <span
                className={cn(
                  'flex items-center gap-2 rounded-full border border-line bg-elevated/60',
                  'py-1 pl-2 pr-3 backdrop-blur-sm',
                )}
              >
                <span aria-hidden="true" className="relative grid size-3 place-items-center">
                  <span className="absolute size-1.5 rounded-full bg-accent/50 motion-safe:animate-[nova-ping_2.4s_var(--ease-out-quint)_infinite]" />
                  <span className="size-1.5 rounded-full bg-accent" />
                </span>
                <span className="font-mono text-kicker uppercase text-secondary">
                  Agent workflows are live
                </span>
              </span>
              <motion.span
                aria-hidden="true"
                className="hidden h-px flex-1 origin-left bg-line sm:block"
                initial={reduceMotion ? { scaleX: 1 } : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.1, ease: EASE_OUT, delay: 0.3 }}
              />
            </motion.div>

            <h1 className="text-display text-gradient-warm">
              <WordReveal text="Your entire workflow." trigger="mount" delay={0.1} as="span" />
              <br />
              <WordReveal
                text="One intelligent workspace."
                emphasis="intelligent"
                trigger="mount"
                delay={0.26}
                as="span"
              />
            </h1>
          </div>

          <motion.div
            className="flex flex-col gap-7 lg:col-span-5 lg:pb-3"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08, delayChildren: 0.55 } },
            }}
            initial={reduceMotion ? 'visible' : 'hidden'}
            animate="visible"
          >
            <motion.p variants={rise} className="text-lead max-w-[36ch] text-secondary">
              NOVA brings research, writing, analysis, automation, and AI agents into one
              workspace designed for modern teams.
            </motion.p>

            <motion.div variants={rise} className="flex flex-col gap-2.5 sm:flex-row">
              <Magnetic>
                <Button href="#pricing" size="lg" trailingIcon="arrow-right" className="w-full">
                  Start building free
                </Button>
              </Magnetic>
              <Button href="#workflow" variant="secondary" size="lg" leadingIcon="play">
                See how it works
              </Button>
            </motion.div>

            <motion.ul
              variants={rise}
              className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted"
            >
              {['Free to start', 'No credit card', '14-day Pro trial'].map((item) => (
                <li key={item} className="flex items-center gap-1.5">
                  <Icon name="check" size={11} className="text-accent" />
                  {item}
                </li>
              ))}
            </motion.ul>
          </motion.div>
        </motion.div>

        {/* Perspective lives on the wrapper; the child does the rotating. */}
        <div
          ref={previewRef}
          className="mt-16 lg:mt-24"
          style={{ perspective: '1600px', perspectiveOrigin: '50% 0%' }}
        >
          <motion.div
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: EASE_OUT, delay: reduceMotion ? 0 : 0.5 }}
            style={
              reduceMotion
                ? undefined
                : { rotateX, scale, y: previewY, transformOrigin: '50% 0%' }
            }
          >
            <HeroPreview />
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
