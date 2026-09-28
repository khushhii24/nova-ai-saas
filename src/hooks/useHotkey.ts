import { useEffect } from 'react'

type Options = {
  /** Require Cmd on macOS / Ctrl elsewhere. */
  meta?: boolean
  /** Ignore the hotkey while the user is typing in a field. */
  allowInInput?: boolean
}

/**
 * Bind a single global hotkey. `key` is compared case-insensitively against
 * `event.key`, so pass 'k' rather than 'KeyK'.
 */
export function useHotkey(
  key: string,
  handler: (event: KeyboardEvent) => void,
  { meta = false, allowInInput = false }: Options = {},
): void {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== key.toLowerCase()) return
      if (meta && !(event.metaKey || event.ctrlKey)) return
      if (!meta && (event.metaKey || event.ctrlKey || event.altKey)) return

      if (!allowInInput) {
        const target = event.target as HTMLElement | null
        const tag = target?.tagName
        if (tag === 'INPUT' || tag === 'TEXTAREA' || target?.isContentEditable) return
      }

      handler(event)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [key, handler, meta, allowInInput])
}
