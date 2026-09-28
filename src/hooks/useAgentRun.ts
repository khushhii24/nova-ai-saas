import { useCallback, useEffect, useState } from 'react'

type Step = { durationMs: number }

/**
 * Drives the replay of a recorded agent run.
 *
 * `completed` is the number of finished steps, so step `i` is done when
 * `i < completed`, running when `i === completed`, and queued otherwise — one
 * number instead of a set, which keeps the render logic trivial.
 *
 * Pacing comes from each step's own `durationMs` rather than a fixed interval,
 * so the replay matches the timings the copy advertises. It runs under reduced
 * motion too: nothing here moves through space, and the sequence is the point.
 */
export function useAgentRun(steps: readonly Step[], active: boolean) {
  const [completed, setCompleted] = useState(0)
  const [runToken, setRunToken] = useState(0)

  useEffect(() => {
    if (!active) return

    // Reduced motion still steps through the run. The steps *are* the section's
    // content — skipping to the end would delete the argument, not calm it.
    // Nothing translates here; only status colours and text change.
    setCompleted(0)
    let cancelled = false
    const timers: ReturnType<typeof setTimeout>[] = []
    let elapsed = 0

    steps.forEach((step, index) => {
      elapsed += step.durationMs
      timers.push(
        setTimeout(() => {
          if (!cancelled) setCompleted(index + 1)
        }, elapsed),
      )
    })

    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [active, runToken, steps])

  const replay = useCallback(() => {
    setCompleted(0)
    setRunToken((token) => token + 1)
  }, [])

  /** Seconds of work accounted for so far, for the elapsed readout. */
  const elapsedSeconds =
    steps.slice(0, completed).reduce((total, step) => total + step.durationMs, 0) / 1000

  return {
    completed,
    finished: completed >= steps.length,
    started: active,
    elapsedSeconds,
    replay,
  }
}
