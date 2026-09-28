import { useEffect, useState } from 'react'

/**
 * Subscribe to a media query. Used to swap *behaviour* (not just styling) at
 * breakpoints — e.g. the workflow rail is scroll-linked on desktop and a
 * plain stacked list on mobile, where scroll-linking fights the thumb.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches)
    setMatches(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}
