import { useState } from 'react'
import { Container } from '@/components/primitives/Container'
import { Icon } from '@/components/primitives/Icon'
import { Reveal } from '@/components/primitives/Reveal'
import { customerHeadline, customers } from '@/data/customers'
import { cn } from '@/lib/cn'

/**
 * Trust band. Kept to a single hairline-bounded strip — a logo wall with cards,
 * shadows or a heading hierarchy of its own steals weight from the hero.
 *
 * The row travels continuously at every breakpoint. Two identical copies sit
 * side by side and the track translates exactly -50%, so the loop closes on
 * itself with no visible seam and no JavaScript driving the motion.
 *
 * Moving content that starts on its own and runs longer than five seconds owes
 * the reader a way to stop it (WCAG 2.2.2), so there are two:
 *   1. It pauses while the pointer is over the strip — discoverable, but only
 *      if you happen to have a pointer and happen to hover.
 *   2. A real toggle, which is the one that actually satisfies the criterion:
 *      it is keyboard reachable, labelled, and reports state via aria-pressed.
 *
 * There is deliberately no focus-within rule. Nothing inside the strip is
 * focusable — the wordmarks are fictional companies, not links — so it would
 * be a rule that can never fire.
 *
 * Under `prefers-reduced-motion` the track is replaced outright by a wrapped
 * static row — not merely frozen, since a paused `w-max` track would sit
 * clipped at the container edge with half its logos unreachable.
 */
export function SocialProof() {
  const [paused, setPaused] = useState(false)

  const wordmarks = customers.map((customer) => (
    <li
      key={customer.name}
      className={cn(
        'shrink-0 whitespace-nowrap text-muted transition-colors duration-300 hover:text-secondary',
        customer.className,
      )}
    >
      {customer.name}
    </li>
  ))

  return (
    <section id="customers" aria-label="Customers" className="relative py-12 sm:py-14">
      <div aria-hidden="true" className="absolute inset-x-0 top-0">
        <Container width="wide" className="px-0">
          <div className="rule-x" />
        </Container>
      </div>

      <Container width="wide">
        <Reveal className="flex flex-col gap-7 lg:flex-row lg:items-center lg:gap-14">
          <div className="flex shrink-0 flex-col items-start gap-3.5">
            <p className="max-w-[22ch] font-mono text-[0.6875rem] uppercase leading-relaxed tracking-[0.13em] text-muted">
              {customerHeadline}
            </p>

            <button
              type="button"
              onClick={() => setPaused((value) => !value)}
              aria-pressed={paused}
              className={cn(
                'flex items-center gap-1.5 rounded-sm font-mono text-[0.625rem] uppercase',
                'tracking-[0.13em] text-muted transition-colors duration-200 hover:text-primary',
                // Nothing is moving under reduced motion, so the control would
                // be a button that does nothing.
                'motion-reduce:hidden',
              )}
            >
              <Icon name={paused ? 'play' : 'pause'} size={11} aria-hidden="true" />
              {paused ? 'Play' : 'Pause'}
              <span className="sr-only"> scrolling logos</span>
            </button>
          </div>

          {/* --- Moving track (motion-safe only) ------------------------- */}
          <div
            className={cn(
              'group/marquee -mx-5 min-w-0 flex-1 overflow-hidden sm:mx-0',
              'motion-reduce:hidden',
            )}
            style={{
              maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
              WebkitMaskImage:
                'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
            }}
          >
            <div
              className={cn(
                'flex w-max animate-[nova-marquee_48s_linear_infinite]',
                'group-hover/marquee:[animation-play-state:paused]',
                paused && '[animation-play-state:paused]',
              )}
            >
              {/* The second copy is the seam-filler — identical geometry, hidden
                  from assistive tech so the names are announced once. */}
              {[0, 1].map((copy) => (
                <ul
                  key={copy}
                  aria-hidden={copy === 1}
                  className="flex shrink-0 items-center gap-10 pr-10 sm:gap-14 sm:pr-14"
                >
                  {wordmarks}
                </ul>
              ))}
            </div>
          </div>

          {/* --- Static fallback (reduced motion only) ------------------- */}
          <ul className="hidden min-w-0 flex-1 flex-wrap items-center gap-x-10 gap-y-5 motion-reduce:flex">
            {wordmarks}
          </ul>
        </Reveal>
      </Container>

      <div aria-hidden="true" className="absolute inset-x-0 bottom-0">
        <Container width="wide" className="px-0">
          <div className="rule-x" />
        </Container>
      </div>
    </section>
  )
}
