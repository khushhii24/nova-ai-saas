import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { EASE_OUT, VIEWPORT } from '@/lib/motion'
import { cn } from '@/lib/cn'

type RevealProps = {
  children: ReactNode
  className?: string
  /** Seconds. Use small values (0.05–0.2) — long chains read as a demo reel. */
  delay?: number
  /** Travel distance in px. 0 gives a pure fade. */
  y?: number
  as?: 'div' | 'li' | 'section' | 'header' | 'span'
}

/**
 * One scroll-entrance for the entire site. Every section uses this so the
 * rhythm of reveals is identical top to bottom — inconsistent entrance timing
 * is one of the loudest "assembled from templates" tells.
 *
 * Reduced motion does **not** mean no animation. WCAG 2.3.3 targets motion that
 * can trigger vestibular symptoms — translation, parallax, scale, spin — not
 * feedback as such. So the travel is dropped and the fade is kept: the page
 * still feels alive, nothing moves through space.
 */
export function Reveal({ children, className, delay = 0, y = 20, as = 'div' }: RevealProps) {
  const reduceMotion = useReducedMotion()
  const MotionTag = motion[as]

  return (
    <MotionTag
      className={cn(className)}
      initial={{ opacity: 0, y: reduceMotion ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{
        duration: reduceMotion ? 0.45 : 0.72,
        ease: EASE_OUT,
        delay: reduceMotion ? Math.min(delay, 0.1) : delay,
      }}
    >
      {children}
    </MotionTag>
  )
}
