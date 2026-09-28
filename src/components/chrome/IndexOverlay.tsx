import { useEffect, useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Button } from '@/components/primitives/Button'
import { Icon } from '@/components/primitives/Icon'
import { Logo } from './Logo'
import { sections } from '@/data/site'
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'
import { useRouteLink } from '@/lib/router'
import { EASE_OUT } from '@/lib/motion'
import { cn } from '@/lib/cn'

type IndexOverlayProps = {
  open: boolean
  onClose: () => void
  /** Section currently under the reading position, from the scroll-spy. */
  activeId: string | null
}

const FOCUSABLE = 'a[href], button:not([disabled])'

/**
 * The site's navigation — at every breakpoint, not just on phones.
 *
 * Because the masthead no longer carries a link row, this overlay is the only
 * way to jump between sections with a pointer, which raises what it owes the
 * keyboard: Escape closes, Tab is trapped inside the panel, focus lands on the
 * panel when it opens and is returned to the trigger by the parent when it
 * shuts. The current section is marked with `aria-current`, which is also how
 * assistive tech gets the position information the visual readout shows.
 *
 * Links are set at display scale with an index number. A menu that occupies the
 * whole viewport has room to be a page; shrinking it back down to a dropdown
 * would waste the only advantage it has.
 */
export function IndexOverlay({ open, onClose, activeId }: IndexOverlayProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  // Close the overlay *and* route, in that order, so the scroll lock is
  // released before the new page mounts.
  const goLogin = useRouteLink('/login', onClose)
  useLockBodyScroll(open)

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab') return

      const panel = panelRef.current
      if (!panel) return

      const focusables = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (focusables.length === 0) return

      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const active = document.activeElement

      // The panel itself is the initial focus target, so shift-tabbing off it
      // has to wrap to the end rather than escaping to the page behind.
      if (event.shiftKey && (active === first || active === panel)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  useEffect(() => {
    if (open) panelRef.current?.focus()
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-label="Section index"
          className="fixed inset-0 z-[60] flex flex-col bg-canvas"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-grid opacity-60"
          />

          <div className="relative mx-auto flex h-[var(--nav-h)] w-full max-w-[86rem] shrink-0 items-center justify-between px-5 sm:px-7 lg:px-10">
            <Logo />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close index"
              className="grid size-10 place-items-center rounded-md border border-line bg-elevated/70 text-secondary transition-colors duration-200 hover:text-primary"
            >
              <Icon name="close" size={18} />
            </button>
          </div>

          {/* `justify-center` on a scroll container clips the top of overflowing
              content out of reach, so centring happens on an inner block with
              `min-h-full` instead: centred when there is room, scrolled from the
              top when there is not. */}
          <nav aria-label="Sections" className="relative flex-1 overflow-y-auto">
            <div className="mx-auto flex min-h-full w-full max-w-[86rem] flex-col justify-center px-5 pb-8 sm:px-7 lg:px-10">
              <ul className="flex flex-col">
                {sections.map((section, index) => {
                  const isActive = activeId === section.id

                  return (
                    <motion.li
                      key={section.id}
                      className="border-b border-line last:border-b-0"
                      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        ease: EASE_OUT,
                        delay: reduceMotion ? 0 : 0.06 + index * 0.045,
                      }}
                    >
                      <a
                        href={`#${section.id}`}
                        onClick={onClose}
                        aria-current={isActive ? 'true' : undefined}
                        className={cn(
                          'group/link flex items-baseline gap-4 py-3',
                          'font-display text-[clamp(1.5rem,4.2vh,2.75rem)] leading-[1.15]',
                          'tracking-[-0.021em] transition-colors duration-200',
                          isActive ? 'text-primary' : 'text-secondary hover:text-primary',
                        )}
                      >
                        <span
                          className={cn(
                            'font-mono text-kicker',
                            isActive ? 'text-accent' : 'text-muted',
                          )}
                        >
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="flex-1">{section.label}</span>
                        {isActive && (
                          <span className="font-mono text-kicker uppercase text-accent">
                            You are here
                          </span>
                        )}
                        <Icon
                          name="arrow-up-right"
                          size={20}
                          className="translate-y-1 text-muted transition-transform duration-300 ease-[var(--ease-out-quint)] group-hover/link:translate-x-1"
                        />
                      </a>
                    </motion.li>
                  )
                })}
              </ul>

              <motion.div
                className="mt-7 flex flex-col gap-2.5 sm:flex-row"
                initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  ease: EASE_OUT,
                  delay: reduceMotion ? 0 : 0.4,
                }}
              >
                <Button href="#cta" size="lg" onClick={onClose} className="sm:w-56">
                  Get started
                </Button>
                <Button
                  href="/login"
                  variant="secondary"
                  size="lg"
                  leadingIcon="log-in"
                  onClick={goLogin}
                  className="sm:w-40"
                >
                  Log in
                </Button>
              </motion.div>
            </div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
