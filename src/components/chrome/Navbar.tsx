import { useCallback, useRef, useState } from 'react'
import { Button } from '@/components/primitives/Button'
import { Logo } from './Logo'
import { IndexOverlay } from './IndexOverlay'
import { sectionIds, sections } from '@/data/site'
import { useScrolled } from '@/hooks/useScrolled'
import { useScrollSpy } from '@/hooks/useScrollSpy'
import { cn } from '@/lib/cn'

/**
 * Masthead, then rail.
 *
 * The structural bet: on a one-page site a persistent link row is furniture.
 * There are seven anchors and the reader is already travelling through all of
 * them, so four links repeated on every screen buy nothing — they are there
 * because templates have them. This header trades them for the one thing a
 * scrolling reader actually lacks, which is knowing where they are.
 *
 * At rest it is a masthead: no bar, no fill, no border. The wordmark sits on
 * the hero's left margin rule, one hairline runs across the dead space, and the
 * cluster lands on the right margin rule — the same two rules the hero draws
 * down the page, so the header reads as the hero's first line rather than a hat
 * resting on top of it.
 *
 * Past 24px it does not morph into a floating blurred pill. It collapses to a
 * full-bleed rail on solid canvas with a hairline underneath — an architectural
 * band, deliberately not an island — and the space the links never occupied
 * fills with a position readout driven by the existing scroll-spy: section
 * number, section name, and a tick per section with the passed ones lit.
 *
 * Everything else moves into the index overlay, which is now the navigation at
 * every breakpoint rather than a phone fallback.
 */
export function Navbar() {
  const scrolled = useScrolled(24)
  const activeId = useScrollSpy(sectionIds)
  const [indexOpen, setIndexOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const closeIndex = useCallback(() => {
    setIndexOpen(false)
    triggerRef.current?.focus()
  }, [])

  const activeIndex = sections.findIndex((section) => section.id === activeId)
  // Above the first tracked section the spy reports nothing, which is a real
  // state — you are in the hero — not an error to paper over with section one.
  const position = activeIndex >= 0 ? activeIndex + 1 : 0
  const label = activeIndex >= 0 ? sections[activeIndex].label : 'Overview'

  return (
    <>
      <a
        href="#main"
        className={cn(
          'fixed left-5 top-3 z-[90] -translate-y-20 rounded-md border border-line-strong',
          'bg-elevated px-4 py-2 text-caption text-primary',
          'transition-transform duration-200 ease-[var(--ease-out-quint)]',
          'focus-visible:translate-y-0',
        )}
      >
        Skip to content
      </a>

      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 border-b',
          'transition-[height,background-color,border-color] duration-500',
          'ease-[var(--ease-out-quint)]',
          scrolled
            ? 'h-[var(--rail-h)] border-line bg-canvas'
            : 'h-[var(--nav-h)] border-transparent bg-transparent',
        )}
      >
        <div className="mx-auto flex h-full w-full max-w-[86rem] items-center gap-4 px-5 sm:px-7 lg:px-10">
          <a
            href="#main"
            aria-label="NOVA — top of page"
            className="shrink-0 rounded-sm transition-opacity duration-200 hover:opacity-80"
          >
            <Logo collapsed={scrolled} />
          </a>

          {/* The slot that a link row would have occupied. At rest it holds a
              rule; scrolled, it holds the readout. Both are decorative — the
              same position information reaches assistive tech through
              `aria-current` inside the index. */}
          <div aria-hidden="true" className="relative h-full min-w-0 flex-1">
            <span
              className={cn(
                // Below sm there is no dead space left to span, and a 50px
                // stub reads as an accident rather than as a rule.
                'absolute inset-x-0 top-1/2 hidden h-px bg-line-strong sm:block',
                'transition-opacity duration-300',
                scrolled ? 'opacity-0' : 'opacity-100',
              )}
            />

            <div
              className={cn(
                // inset-0 (not inset-y-0 left-0) so the readout is bounded by the
                // slot and truncates, instead of growing under the Index button
                // on a narrow viewport.
                'absolute inset-0 flex items-center gap-3 overflow-hidden pr-2',
                'transition-opacity duration-300',
                scrolled ? 'opacity-100 delay-150' : 'opacity-0',
              )}
            >
              {/* Below sm the counter is the first thing to go: the section name
                  answers "where am I" on its own, the number does not. */}
              <span className="hidden font-mono text-kicker tabular-nums text-secondary sm:inline">
                {String(position).padStart(2, '0')}
                <span className="px-1 text-muted">/</span>
                {String(sections.length).padStart(2, '0')}
              </span>

              <span className="hidden h-2.5 w-px shrink-0 bg-line-strong sm:block" />

              <span className="truncate font-mono text-kicker uppercase text-primary">{label}</span>

              <span className="hidden shrink-0 items-center gap-1 md:flex">
                {sections.map((section, index) => (
                  <span
                    key={section.id}
                    className={cn(
                      'block h-px w-3 transition-colors duration-300',
                      index < position ? 'bg-accent' : 'bg-muted/70',
                    )}
                  />
                ))}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <button
              ref={triggerRef}
              type="button"
              onClick={() => setIndexOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={indexOpen}
              className={cn(
                'group/idx flex items-center gap-2.5 rounded-sm px-2 py-2',
                'font-mono text-kicker uppercase text-secondary',
                'transition-colors duration-200 hover:text-primary',
              )}
            >
              <span aria-hidden="true" className="flex flex-col gap-[3px]">
                <span className="block h-px w-4 bg-current" />
                <span className="block h-px w-4 bg-current" />
                <span
                  className={cn(
                    'block h-px w-2.5 bg-current',
                    'transition-[width] duration-300 ease-[var(--ease-out-quint)]',
                    'group-hover/idx:w-4',
                  )}
                />
              </span>
              Index
            </button>

            <Button href="#cta" size="sm">
              Get started
            </Button>
          </div>
        </div>
      </header>

      <IndexOverlay open={indexOpen} onClose={closeIndex} activeId={activeId} />
    </>
  )
}
