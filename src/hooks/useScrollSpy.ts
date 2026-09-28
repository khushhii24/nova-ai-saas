import { useEffect, useRef, useState } from 'react'

/**
 * Returns the id of the section currently occupying the reading position.
 *
 * Uses a band across the upper-middle of the viewport rather than a single
 * line, so short sections still register and the active nav item doesn't
 * flicker between two neighbours while scrolling.
 *
 * Ratios are kept in a ref rather than derived from each callback's entries:
 * an observer callback only reports the sections that *changed*, so picking a
 * winner from `entries` alone leaves the last match stuck on — which is how
 * you end up with "Products" underlined while sitting at the top of the page.
 */
export function useScrollSpy(ids: readonly string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null)
  const ratios = useRef(new Map<string, number>())

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null)

    if (elements.length === 0) return

    const seen = ratios.current

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          seen.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0)
        }

        let best: string | null = null
        let bestRatio = 0
        for (const [id, ratio] of seen) {
          if (ratio > bestRatio) {
            best = id
            bestRatio = ratio
          }
        }

        setActiveId(best)
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0, 0.2, 0.5, 1] },
    )

    elements.forEach((element) => observer.observe(element))
    return () => {
      observer.disconnect()
      seen.clear()
    }
  }, [ids])

  return activeId
}
