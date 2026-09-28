import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Icon } from '@/components/primitives/Icon'
import { Kbd } from './Kbd'
import { commandGroups, type CommandItem } from '@/data/workspace'
import { EASE_OUT } from '@/lib/motion'
import { cn } from '@/lib/cn'

type CommandPaletteProps = {
  open: boolean
  onClose: () => void
  onSelect?: (item: CommandItem) => void
}

/**
 * Command palette scoped to the product window rather than the page.
 *
 * It renders inside the app frame, which is the honest thing to do — a
 * marketing page stealing ⌘K globally is a real annoyance. The shortcut is
 * only bound while the product section is on screen (see Dashboard).
 *
 * Keyboard model matches what people expect from a palette: type to filter,
 * ↑/↓ to move, Enter to run, Esc to dismiss.
 */
export function CommandPalette({ open, onClose, onSelect }: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  const groups = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return commandGroups

    return commandGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => item.label.toLowerCase().includes(needle)),
      }))
      .filter((group) => group.items.length > 0)
  }, [query])

  /** Flat order drives arrow-key navigation across group boundaries. */
  const flatItems = useMemo(() => groups.flatMap((group) => group.items), [groups])

  useEffect(() => setActiveIndex(0), [query])

  useEffect(() => {
    if (!open) {
      setQuery('')
      setActiveIndex(0)
      return
    }
    // Defer so the element exists before focus moves.
    const id = requestAnimationFrame(() => inputRef.current?.focus())
    return () => cancelAnimationFrame(id)
  }, [open])

  useEffect(() => {
    if (!open) return
    const active = listRef.current?.querySelector('[data-active="true"]')
    active?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, open])

  const commit = (item: CommandItem | undefined) => {
    if (!item) return
    onSelect?.(item)
    onClose()
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      onClose()
      return
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((index) => (flatItems.length ? (index + 1) % flatItems.length : 0))
      return
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((index) =>
        flatItems.length ? (index - 1 + flatItems.length) % flatItems.length : 0,
      )
      return
    }
    if (event.key === 'Enter') {
      event.preventDefault()
      commit(flatItems[activeIndex])
    }
  }

  let runningIndex = -1

  return (
    <AnimatePresence>
      {open && (
        <div className="absolute inset-0 z-30 flex items-start justify-center px-3 pt-8 sm:pt-12">
          <motion.div
            className="absolute inset-0 bg-canvas-deep/72 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className={cn(
              'relative w-full max-w-[32rem] overflow-hidden rounded-lg border border-line-strong',
              'bg-elevated/98 shadow-[0_32px_64px_-24px_rgb(0_0_0/0.85)] backdrop-blur-xl',
            )}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.99 }}
            transition={{ duration: 0.22, ease: EASE_OUT }}
            onKeyDown={onKeyDown}
          >
            <div className="flex items-center gap-2.5 border-b border-line px-3.5 py-3">
              <Icon name="search" size={15} className="text-muted" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search or run a command…"
                aria-label="Search commands"
                className={cn(
                  'min-w-0 flex-1 bg-transparent text-caption text-primary outline-none',
                  'placeholder:text-muted',
                )}
              />
              <Kbd>Esc</Kbd>
            </div>

            <div ref={listRef} className="max-h-[17rem] overflow-y-auto overscroll-contain p-1.5">
              {groups.length === 0 && (
                <p className="px-2.5 py-8 text-center text-micro text-muted">
                  Nothing matches “{query}”.
                </p>
              )}

              {groups.map((group) => (
                <div key={group.id} className="mb-1 last:mb-0">
                  <p className="px-2.5 pb-1 pt-2 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted">
                    {group.title}
                  </p>
                  <ul>
                    {group.items.map((item) => {
                      runningIndex += 1
                      const index = runningIndex
                      const isActive = index === activeIndex

                      return (
                        <li key={item.id}>
                          <button
                            type="button"
                            data-active={isActive}
                            onMouseMove={() => setActiveIndex(index)}
                            onClick={() => commit(item)}
                            className={cn(
                              'flex w-full items-center gap-2.5 rounded-sm px-2.5 py-2 text-left',
                              'text-micro transition-colors duration-150',
                              isActive ? 'bg-raised text-primary' : 'text-secondary',
                            )}
                          >
                            <Icon
                              name={item.icon}
                              size={14}
                              className={isActive ? 'text-accent' : 'text-muted'}
                            />
                            <span className="min-w-0 flex-1 truncate">{item.label}</span>
                            {item.hint && (
                              <span className="font-mono text-[0.625rem] text-muted">
                                {item.hint}
                              </span>
                            )}
                            {item.shortcut && <Kbd>{item.shortcut}</Kbd>}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 border-t border-line px-3.5 py-2 font-mono text-[0.625rem] text-muted">
              <span className="flex items-center gap-1.5">
                <Kbd>↑</Kbd>
                <Kbd>↓</Kbd> navigate
              </span>
              <span className="flex items-center gap-1.5">
                <Kbd>↵</Kbd> run
              </span>
              <span className="ml-auto hidden sm:inline">NOVA</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
