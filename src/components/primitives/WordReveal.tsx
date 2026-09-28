import { Fragment } from 'react'
import { motion, useReducedMotion, type Variants } from 'motion/react'
import { EASE_OUT } from '@/lib/motion'
import { cn } from '@/lib/cn'

/** Static map — building a motion component during render would remount it. */
const MOTION_TAGS = {
  span: motion.span,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  div: motion.div,
} as const

type Tag = keyof typeof MOTION_TAGS

type WordRevealProps = {
  /** Plain text. Split on spaces so the reveal survives any wrap point. */
  text: string
  /**
   * Word (or words) set in the editorial serif italic. Matched with trailing
   * punctuation stripped, so `emphasis="properly"` matches "properly.".
   */
  emphasis?: string | string[]
  className?: string
  as?: Tag
  /** Seconds before the first word moves. */
  delay?: number
  /** Seconds between words. Keep small — a long cascade reads as a showreel. */
  stagger?: number
  /** `inView` by default; the hero drives its own timeline on mount. */
  trigger?: 'inView' | 'mount'
  id?: string
}

const strip = (value: string) => value.replace(/[.,—–!?:;]/g, '')

const wordVariants: Variants = {
  hidden: { y: '115%' },
  visible: { y: '0%', transition: { duration: 0.85, ease: EASE_OUT } },
}

/**
 * Masked word reveal — the page's signature entrance for display type.
 *
 * Each word sits in its own overflow-hidden box and rises from beneath it, so
 * a headline reads as being *uncovered* rather than faded in. Masking per word
 * rather than per line means it survives any measure and any rewrap between
 * breakpoints, which pre-split lines do not.
 *
 * The padding / negative-margin pairs give descenders and the serif italic's
 * overhang somewhere to live. Without them the mask crops the type.
 */
export function WordReveal({
  text,
  emphasis,
  className,
  as = 'span',
  delay = 0,
  stagger = 0.038,
  trigger = 'inView',
  id,
}: WordRevealProps) {
  const reduceMotion = useReducedMotion()
  const words = text.split(' ')

  const emphasised = new Set(
    (Array.isArray(emphasis) ? emphasis : emphasis ? [emphasis] : []).map(strip),
  )

  const content = words.map((value, index) => {
    const isEmphasis = emphasised.has(strip(value))
    const isLast = index === words.length - 1

    return (
      <Fragment key={`${value}-${index}`}>
        <span
          className={cn(
            'inline-block overflow-hidden align-bottom',
            // Headroom for descenders and the italic's overhang.
            '-mx-[0.07em] -mb-[0.16em] px-[0.07em] pb-[0.16em]',
          )}
        >
          <motion.span
            className={cn('inline-block', isEmphasis && 'font-editorial')}
            variants={wordVariants}
          >
            {value}
          </motion.span>
        </span>
        {/* The space must sit outside the mask or it collapses. */}
        {!isLast && ' '}
      </Fragment>
    )
  })

  // Reduced motion keeps the *rhythm* of the reveal but removes the travel:
  // the words fade up in sequence instead of rising out of masks. Stripping the
  // animation entirely left the page looking broken rather than calm.
  if (reduceMotion) {
    const ReducedTag = MOTION_TAGS[as]
    return (
      <ReducedTag
        id={id}
        className={className}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: stagger * 0.6, delayChildren: delay } },
        }}
        initial="hidden"
        {...(trigger === 'inView'
          ? { whileInView: 'visible' as const, viewport: { once: true, amount: 0.3 } }
          : { animate: 'visible' as const })}
      >
        {words.map((value, index) => {
          const isEmphasis = emphasised.has(strip(value))
          return (
            <Fragment key={`${value}-${index}`}>
              <motion.span
                className={cn('inline-block', isEmphasis && 'font-editorial')}
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { duration: 0.4, ease: EASE_OUT } },
                }}
              >
                {value}
              </motion.span>
              {index < words.length - 1 && ' '}
            </Fragment>
          )
        })}
      </ReducedTag>
    )
  }

  const MotionTag = MOTION_TAGS[as]

  return (
    <MotionTag
      id={id}
      className={className}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      initial="hidden"
      {...(trigger === 'inView'
        ? { whileInView: 'visible' as const, viewport: { once: true, amount: 0.3 } }
        : { animate: 'visible' as const })}
    >
      {content}
    </MotionTag>
  )
}
