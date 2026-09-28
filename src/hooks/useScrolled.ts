import { useEffect, useState } from 'react'

/** True once the window has scrolled past `threshold` px. Passive listener. */
export function useScrolled(threshold = 16): boolean {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const read = () => setScrolled(window.scrollY > threshold)
    read()
    window.addEventListener('scroll', read, { passive: true })
    return () => window.removeEventListener('scroll', read)
  }, [threshold])

  return scrolled
}
