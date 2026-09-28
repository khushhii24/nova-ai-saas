import { useEffect, useState } from 'react'
import { useReducedMotion } from 'motion/react'

/**
 * Counts a numeric string up from zero, preserving its decimal precision so
 * "36.5" lands on "36.5" and not "37".
 *
 * Eased with the same quintic-out curve as every other entrance on the page —
 * a linear counter looks like a loading spinner, not an achievement.
 */
export function useCountUp(value: string, active: boolean, duration = 1400): string {
  const reduceMotion = useReducedMotion()
  const [display, setDisplay] = useState(reduceMotion ? value : '0')

  useEffect(() => {
    const target = Number.parseFloat(value)
    if (!active || Number.isNaN(target)) return

    const decimals = value.includes('.') ? value.split('.')[1].length : 0
    // Shorter under reduced motion, but still counts: a numeral changing in
    // place involves no spatial movement.
    const span = reduceMotion ? Math.min(duration, 600) : duration
    const start = performance.now()
    let raf = 0

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / span)
      // Quintic out — matches EASE_OUT's tail.
      const eased = 1 - (1 - t) ** 5
      setDisplay((target * eased).toFixed(decimals))
      if (t < 1) raf = requestAnimationFrame(tick)
      else setDisplay(value)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, active, duration, reduceMotion])

  return display
}
