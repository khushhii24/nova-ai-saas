import { useCallback, useRef } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'

/**
 * Tracks the pointer inside an element and writes its position to CSS custom
 * properties (`--mx`, `--my`) plus a 0→1 `--spot` intensity.
 *
 * Deliberately writes to the DOM rather than to React state: a card grid that
 * re-renders on every mousemove is the difference between a premium feel and
 * a janky one. Nothing here triggers a render.
 */
export function usePointerSpotlight<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null)

  const onPointerMove = useCallback((event: ReactPointerEvent<T>) => {
    const node = ref.current
    if (!node) return
    // Fine pointers only — a spotlight that follows a finger is noise.
    if (event.pointerType !== 'mouse') return

    const rect = node.getBoundingClientRect()
    node.style.setProperty('--mx', `${event.clientX - rect.left}px`)
    node.style.setProperty('--my', `${event.clientY - rect.top}px`)
    node.style.setProperty('--spot', '1')
  }, [])

  const onPointerLeave = useCallback(() => {
    ref.current?.style.setProperty('--spot', '0')
  }, [])

  return { ref, spotlightProps: { onPointerMove, onPointerLeave } }
}
