import type { Transition, Variants } from 'motion/react'

/**
 * Motion vocabulary for the whole site.
 *
 * Two rules keep this feeling premium rather than like a motion demo:
 *   1. Only opacity, transform and clip animate. Never layout-affecting props.
 *   2. One easing curve for entrances (EASE_OUT) and one spring for anything
 *      the user directly caused. Mixed curves are what makes motion feel cheap.
 */

/** Long, decelerating tail. Entrances, reveals, scroll-triggered content. */
export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1]

/** Symmetrical. Used for state changes that can reverse (accordions, tabs). */
export const EASE_IN_OUT: [number, number, number, number] = [0.76, 0, 0.24, 1]

/** Direct manipulation: toggles, thumbs, anything that follows a click. */
export const SPRING: Transition = {
  type: 'spring',
  stiffness: 380,
  damping: 32,
  mass: 0.7,
}

/** Softer spring for larger travel (drawers, panels). */
export const SPRING_SOFT: Transition = {
  type: 'spring',
  stiffness: 240,
  damping: 28,
  mass: 0.9,
}

/** Shared viewport config so every section triggers at the same point. */
export const VIEWPORT = { once: true, amount: 0.25 } as const

/** Viewport config for tall blocks that would otherwise never hit `amount`. */
export const VIEWPORT_TALL = { once: true, amount: 0.12 } as const

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.72, ease: EASE_OUT } },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: EASE_OUT } },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.97, y: 14 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.85, ease: EASE_OUT },
  },
}

/** Parent variant: children inherit `hidden` / `visible` and cascade. */
export function staggerParent(stagger = 0.07, delayChildren = 0): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren },
    },
  }
}

/** Entrance used by list items inside a `staggerParent`. */
export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
}

/** Accordion / disclosure. Height is animated deliberately and only here. */
export const disclosure: Variants = {
  collapsed: { height: 0, opacity: 0 },
  open: { height: 'auto', opacity: 1 },
}

export const DISCLOSURE_TRANSITION: Transition = {
  height: { duration: 0.34, ease: EASE_IN_OUT },
  opacity: { duration: 0.22, ease: 'linear' },
}
