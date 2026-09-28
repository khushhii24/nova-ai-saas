import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/cn'

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\<>[]{}=+*#%$'

/**
 * Resolves text out of random glyphs, left to right.
 *
 * Used only on the mono section kickers. It suits them because mono is already
 * the typeface for "a machine produced this", and because the label is short
 * enough that the effect finishes before it becomes irritating — which is the
 * usual failure mode of decode effects.
 *
 * Width is reserved by a hidden copy of the final string, so nothing reflows
 * while the characters settle.
 */
export function Scramble({
  text,
  className,
  /** ms each character spends scrambling before it locks. */
  speed = 34,
}: {
  text: string
  className?: string
  speed?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduceMotion = useReducedMotion()
  const [output, setOutput] = useState(reduceMotion ? text : '')

  useEffect(() => {
    if (!inView) return
    if (reduceMotion) {
      setOutput(text)
      return
    }

    let frame = 0
    let raf = 0
    let last = 0

    const tick = (now: number) => {
      if (now - last >= speed) {
        last = now
        frame += 1

        const settled = Math.floor(frame / 2)
        setOutput(
          text
            .split('')
            .map((char, index) => {
              if (index < settled) return char
              if (char === ' ') return ' '
              return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
            })
            .join(''),
        )

        if (settled >= text.length) return
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, text, speed, reduceMotion])

  return (
    <span ref={ref} className={cn('relative inline-block', className)}>
      {/* Reserves the final width so the label cannot reflow mid-decode. */}
      <span aria-hidden="true" className="invisible">
        {text}
      </span>
      <span className="absolute inset-0" aria-label={text}>
        {output}
      </span>
    </span>
  )
}
