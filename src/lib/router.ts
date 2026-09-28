import { useCallback, useEffect, useSyncExternalStore, type MouseEvent } from 'react'

/**
 * A router in thirty lines, because this site has two routes.
 *
 * Pulling in react-router to choose between a marketing page and a sign-in page
 * would add a dependency larger than the feature. The History API already does
 * the work: `navigate` pushes, the browser's back button pops, and a custom
 * event covers the one case `popstate` does not fire for — our own pushes.
 *
 * Paths are normalised without their trailing slash so `/login` and `/login/`
 * are the same route.
 */

const ROUTE_EVENT = 'nova:route'

export const normalise = (path: string) => path.replace(/\/+$/, '') || '/'

function subscribe(onChange: () => void) {
  window.addEventListener('popstate', onChange)
  window.addEventListener(ROUTE_EVENT, onChange)
  return () => {
    window.removeEventListener('popstate', onChange)
    window.removeEventListener(ROUTE_EVENT, onChange)
  }
}

const getSnapshot = () => normalise(window.location.pathname)

/** Server snapshot — this build is client-only, but StrictMode asks for it. */
const getServerSnapshot = () => '/'

export function useRoute(): string {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export function navigate(to: string, options?: { replace?: boolean }) {
  const [pathname, hash = ''] = to.split('#')
  const target = normalise(pathname || '/')

  if (target === getSnapshot() && !hash) return

  const url = hash ? `${target}#${hash}` : target
  if (options?.replace) window.history.replaceState({}, '', url)
  else window.history.pushState({}, '', url)

  window.dispatchEvent(new Event(ROUTE_EVENT))

  // A route change is a new page: start it at the top. An in-page hash keeps
  // the browser's own anchor behaviour instead.
  if (!hash) window.scrollTo({ top: 0, behavior: 'instant' })
}

/** Click handler for anchors that should route instead of reload. */
export function useRouteLink(to: string, onNavigate?: () => void) {
  return useCallback(
    (event: MouseEvent<HTMLElement>) => {
      // Leave modified clicks to the browser — cmd-click must still open a tab.
      if (event.defaultPrevented) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      if (event.button !== 0) return

      event.preventDefault()
      onNavigate?.()
      navigate(to)
    },
    [to, onNavigate],
  )
}

/** Restores focus to the document top after a route change. */
export function useRouteFocus(path: string) {
  useEffect(() => {
    const heading = document.querySelector<HTMLElement>('[data-route-heading]')
    heading?.focus()
  }, [path])
}

const TITLES: Record<string, string> = {
  '/login': 'Sign in — NOVA',
}

const DEFAULT_TITLE = 'NOVA — Your entire workflow. One intelligent workspace.'

/** Keeps the tab title honest about which page you are on. */
export function useRouteTitle(path: string) {
  useEffect(() => {
    document.title = TITLES[path] ?? DEFAULT_TITLE
  }, [path])
}
