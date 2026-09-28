import { Container } from '@/components/primitives/Container'
import { Icon } from '@/components/primitives/Icon'
import { Reveal } from '@/components/primitives/Reveal'
import { Section } from '@/components/primitives/Section'
import { SectionHeading } from '@/components/primitives/SectionHeading'
import { usePointerSpotlight } from '@/hooks/usePointerSpotlight'
import { customers } from '@/data/customers'
import { testimonialCopy, testimonials, type Testimonial } from '@/data/testimonials'
import { cn } from '@/lib/cn'

/**
 * One quote at editorial scale, two supporting it.
 *
 * Each card carries its company in the *same* typographic treatment used on the
 * logo wall higher up the page — so the trust bar and the quotes reinforce each
 * other instead of being two unconnected claims. Rendering a company name in
 * body text throws that connection away.
 */
export function Testimonials() {
  const [featured, ...rest] = testimonials

  return (
    <Section id="testimonials" rule>
      <Container width="wide">
        <SectionHeading
          index="06"
          ghost
          kicker={testimonialCopy.kicker}
          title="Teams stop carrying context between tools."
          emphasis="context"
        />

        <div className="mt-12 grid gap-3 lg:mt-16 lg:grid-cols-12 lg:gap-4">
          <Reveal y={20} className="lg:col-span-7">
            <FeaturedQuote testimonial={featured} />
          </Reveal>

          <div className="flex flex-col gap-3 lg:col-span-5 lg:gap-4">
            {rest.map((testimonial, index) => (
              <Reveal key={testimonial.id} y={20} delay={0.08 + index * 0.07} className="flex-1">
                <SupportingQuote testimonial={testimonial} />
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}

/**
 * Renders the company in its logo-wall letterforms. Falls back to plain text
 * if a testimonial ever names a company that is not on the wall.
 */
function Wordmark({ company, className }: { company: string; className?: string }) {
  const mark = customers.find(
    (item) => item.name.toLowerCase().replace(/[^a-z]/g, '') === company.toLowerCase(),
  )

  if (!mark) {
    return <span className={cn('text-caption text-muted', className)}>{company}</span>
  }

  return <span className={cn(mark.className, 'text-muted', className)}>{mark.name}</span>
}

function FeaturedQuote({ testimonial }: { testimonial: Testimonial }) {
  const { ref, spotlightProps } = usePointerSpotlight<HTMLElement>()

  return (
    <figure
      ref={ref}
      {...spotlightProps}
      className={cn(
        'relative flex h-full flex-col justify-between gap-7 overflow-hidden rounded-xl',
        'border border-line bg-surface/60 p-6 sm:p-9',
      )}
    >
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 spotlight-wash" />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-xl spotlight-ring"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-sm opacity-30"
        style={{
          maskImage: 'radial-gradient(90% 70% at 100% 0%, black, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(90% 70% at 100% 0%, black, transparent 70%)',
        }}
      />

      <div className="relative">
        <Icon name="quote" size={34} className="text-line-strong" />
        <blockquote className="mt-5 font-serif text-[clamp(1.5rem,2.6vw,2.125rem)] leading-[1.3] tracking-[-0.018em] text-primary">
          {testimonial.quote}
        </blockquote>
      </div>

      <div className="relative border-t border-line pt-6">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
          <figcaption className="flex items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full border border-line-strong bg-raised text-[0.625rem] font-medium uppercase text-secondary">
              {testimonial.initials}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-caption font-medium text-primary">
                {testimonial.name}
              </span>
              <span className="mt-0.5 block truncate font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted">
                {testimonial.role}
              </span>
            </span>
          </figcaption>

          <Wordmark company={testimonial.company} className="leading-none" />
        </div>

        {testimonial.context && (
          <p className="mt-5 flex items-center gap-2 font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted">
            <Icon name="check" size={11} className="text-accent" />
            {testimonial.context}
          </p>
        )}
      </div>
    </figure>
  )
}

function SupportingQuote({ testimonial }: { testimonial: Testimonial }) {
  const { ref, spotlightProps } = usePointerSpotlight<HTMLElement>()

  return (
    <figure
      ref={ref}
      {...spotlightProps}
      className={cn(
        'relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl',
        'border border-line bg-surface/40 p-5 sm:p-6',
      )}
    >
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 spotlight-wash" />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-xl spotlight-ring"
      />

      <blockquote className="relative text-caption leading-relaxed text-secondary">
        “{testimonial.quote}”
      </blockquote>

      <figcaption className="relative flex items-end justify-between gap-4 border-t border-line pt-4">
        <span className="flex items-center gap-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-full border border-line-strong bg-raised text-[0.625rem] font-medium uppercase text-secondary">
            {testimonial.initials}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-micro font-medium text-primary">
              {testimonial.name}
            </span>
            <span className="mt-0.5 block truncate font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted">
              {testimonial.role}
            </span>
          </span>
        </span>

        <Wordmark company={testimonial.company} className="shrink-0 text-[1rem] leading-none" />
      </figcaption>
    </figure>
  )
}
