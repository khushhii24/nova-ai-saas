import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'

type Options = {
  /** Start typing only once this flips true — e.g. when scrolled into view. */
  start?: boolean
  /** Average ms per character. Real typing is jittery, so this is a mean. */
  speed?: number
  /** Pause before the first character appears. */
  delay?: number
}

/**
 * Simulates token-by-token streaming for the AI panels.
 *
 * Characters land in small irregular bursts rather than one per tick — a
 * perfectly even typewriter is the tell that it is a CSS animation. Respects
 * reduced-motion by resolving to the full string immediately.
 */
export function useTypewriter(
  text: string,
  { start = true, speed = 14, delay = 0 }: Options = {},
): { output: string; done: boolean } {
  const reduceMotion = useReducedMotion()
  const [output, setOutput] = useState('')
  const frame = useRef(0)

  useEffect(() => {
    if (!start) {
      setOutput('')
      return
    }

    if (reduceMotion) {
      setOutput(text)
      return
    }

    let cancelled = false
    frame.current = 0
    setOutput('')

    const timers: ReturnType<typeof setTimeout>[] = []

    const tick = () => {
      if (cancelled) return
      // 1–3 characters per burst keeps the cadence organic.
      const burst = 1 + Math.floor(Math.random() * 3)
      frame.current = Math.min(text.length, frame.current + burst)
      setOutput(text.slice(0, frame.current))

      if (frame.current < text.length) {
        const jitter = speed * (0.55 + Math.random())
        timers.push(setTimeout(tick, jitter))
      }
    }

    timers.push(setTimeout(tick, delay))

    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [text, start, speed, delay, reduceMotion])

  return { output, done: output.length === text.length }
}
