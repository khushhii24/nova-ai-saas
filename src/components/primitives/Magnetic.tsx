import { useRef, type ReactNode } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'

type MagneticProps = {
  children: ReactNode
  className?: string
  /** Fraction of the cursor offset the element travels. Keep under ~0.3. */
  strength?: number
  /** Extra hit area around the element, in px, where the pull begins. */
  padding?: number
}

/**
 * Pulls its child gently toward the cursor and springs back on exit.
 *
 * Reserved for primary CTAs. Applied broadly it turns a page into a fairground;
 * applied to the one button you want pressed, it reads as the page noticing you.
 * Strength stays low on purpose — the effect should be felt before it is seen.
 */
export function Magnetic({
  children,
  className,
  strength = 0.22,
  padding = 18,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 260, damping: 18, mass: 0.6 })
  const springY = useSpring(y, { stiffness: 260, damping: 18, mass: 0.6 })

  if (reduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: springX, y: springY }}
      onPointerMove={(event) => {
        if (event.pointerType !== 'mouse') return
        const node = ref.current
        if (!node) return

        const rect = node.getBoundingClientRect()
        const centreX = rect.left + rect.width / 2
        const centreY = rect.top + rect.height / 2
        const withinX = Math.abs(event.clientX - centreX) < rect.width / 2 + padding
        const withinY = Math.abs(event.clientY - centreY) < rect.height / 2 + padding

        if (!withinX || !withinY) return
        x.set((event.clientX - centreX) * strength)
        y.set((event.clientY - centreY) * strength * 0.7)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}
