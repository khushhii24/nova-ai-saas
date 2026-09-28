import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'

/**
 * Reading-progress hairline pinned to the very top of the viewport.
 *
 * Fades in only once you have actually started reading, so the top of the page
 * stays clean. Spring-smoothed, because a progress bar wired directly to raw
 * scroll offset jitters on trackpads.
 */
export function ScrollProgress() {
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 40, mass: 0.4 })
  const opacity = useTransform(scrollYProgress, [0, 0.012, 0.985, 1], [0, 1, 1, 0])

  // Kept under reduced motion: a reading-position indicator is orientation, not
  // decoration. Only the spring smoothing is dropped, so it tracks scroll
  // exactly rather than easing behind it.
  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[80] h-px origin-left bg-accent"
      style={{ scaleX: reduceMotion ? scrollYProgress : scaleX, opacity }}
    />
  )
}
