import { useRef } from 'react'
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react'
import { cn } from '@/lib/cn'

const WORDS = [
  'Research',
  'Writing',
  'Analysis',
  'Agents',
  'Automations',
  'Collaboration',
]

/** Keeps a value looping inside a range without ever snapping. */
function wrap(min: number, max: number, value: number): number {
  const range = max - min
  return ((((value - min) % range) + range) % range) + min
}

/**
 * Full-bleed type band.
 *
 * Two jobs. First, it breaks the card rhythm — after a bento grid and before
 * the product window, the page needs one moment that is not a bordered box.
 * Second, it reacts to you: scroll velocity adds to its speed and skews it, and
 * scrolling *up* reverses it. The band is always drifting, so the page never
 * feels frozen, but it responds to the reader rather than looping obliviously.
 *
 * Alternate words are outlined rather than filled, which gives the row rhythm
 * without introducing a second weight or a second colour.
 */
export function Marquee() {
  const reduceMotion = useReducedMotion()
  const baseX = useMotionValue(0)
  const direction = useRef(1)

  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 46,
    stiffness: 380,
  })
  const velocityFactor = useTransform(smoothVelocity, [0, 1400], [0, 4], { clamp: false })
  const skewX = useTransform(smoothVelocity, [-2200, 0, 2200], [3.5, 0, -3.5], { clamp: true })

  const x = useTransform(baseX, (value) => `${wrap(-50, 0, value)}%`)

  useAnimationFrame((_time, delta) => {
    if (reduceMotion) return

    // 2.1% of the track per second at rest.
    let moveBy = direction.current * -2.1 * (delta / 1000)

    const factor = velocityFactor.get()
    if (factor < 0) direction.current = -1
    else if (factor > 0) direction.current = 1

    moveBy += moveBy * Math.abs(factor)
    baseX.set(baseX.get() + moveBy)
  })

  const row = (copy: number) => (
    <div
      key={copy}
      aria-hidden={copy === 1}
      className="flex shrink-0 items-center gap-8 pr-8 sm:gap-11 sm:pr-11"
    >
      {WORDS.map((item, index) => (
        <span key={item} className="flex shrink-0 items-center gap-8 sm:gap-11">
          <span
            className={cn(
              'font-display whitespace-nowrap leading-none',
              'text-[clamp(1.625rem,3.4vw,2.75rem)] font-medium tracking-[-0.025em]',
              index % 2 === 0 ? 'text-primary/85' : 'text-outline',
            )}
          >
            {item}
          </span>
          <span
            aria-hidden="true"
            className="size-1 shrink-0 rotate-45 bg-accent/70 sm:size-1.5"
          />
        </span>
      ))}
    </div>
  )

  return (
    <section aria-label="What NOVA does" className="relative overflow-hidden py-9 lg:py-11">
      <div aria-hidden="true" className="absolute inset-x-0 top-0">
        <div className="mx-auto max-w-[86rem] rule-x" />
      </div>

      <motion.div
        className="flex w-max select-none will-change-transform"
        style={reduceMotion ? undefined : { x, skewX }}
      >
        {[0, 1].map(row)}
      </motion.div>

      {/* Fades the band into the page rather than letting it hit the edges. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, var(--color-canvas) 0%, transparent 14%, transparent 86%, var(--color-canvas) 100%)',
        }}
      />

      <div aria-hidden="true" className="absolute inset-x-0 bottom-0">
        <div className="mx-auto max-w-[86rem] rule-x" />
      </div>
    </section>
  )
}
