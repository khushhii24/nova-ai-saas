import { Container } from '@/components/primitives/Container'
import { Reveal } from '@/components/primitives/Reveal'
import { customerHeadline, customers } from '@/data/customers'
import { cn } from '@/lib/cn'

/**
 * Trust band. Kept to a single hairline-bounded strip — a logo wall with cards,
 * shadows or a heading hierarchy of its own steals weight from the hero.
 *
 * On phones the row scrolls slowly instead of wrapping ragged, which is the
 * only place on the site with a looping animation in the layout.
 */
export function SocialProof() {
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
        <Reveal className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-14">
          <p className="max-w-[22ch] shrink-0 font-mono text-[0.6875rem] uppercase leading-relaxed tracking-[0.13em] text-muted">
            {customerHeadline}
          </p>

          {/* Static row from sm up. */}
          <ul className="hidden min-w-0 flex-1 items-center justify-between gap-x-8 gap-y-5 sm:flex sm:flex-wrap lg:flex-nowrap">
            {wordmarks}
          </ul>

          {/* Marquee on phones. */}
          <div
            className="-mx-5 overflow-hidden sm:hidden"
            style={{
              maskImage:
                'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
              WebkitMaskImage:
                'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            }}
          >
            <div className="flex w-max motion-safe:animate-[nova-marquee_34s_linear_infinite]">
              {[0, 1].map((copy) => (
                <ul
                  key={copy}
                  aria-hidden={copy === 1}
                  className="flex shrink-0 items-center gap-9 pr-9"
                >
                  {wordmarks}
                </ul>
              ))}
            </div>
          </div>
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
