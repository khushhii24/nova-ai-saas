import { Button } from '@/components/primitives/Button'
import { Container } from '@/components/primitives/Container'
import { Icon } from '@/components/primitives/Icon'
import { Reveal } from '@/components/primitives/Reveal'
import { Section } from '@/components/primitives/Section'
import { WordReveal } from '@/components/primitives/WordReveal'
import { cn } from '@/lib/cn'
import { Magnetic } from '@/components/primitives/Magnetic'

/**
 * Closing CTA — the page's one inversion.
 *
 * After roughly nine screens of warm near-black, turning the lights on is the
 * strongest signal available that this is the end of the argument, and it costs
 * nothing but a token swap: the same warm white that has been the text colour
 * all along becomes the surface.
 */
export function FinalCta() {
  return (
    <Section id="cta" density="tight">
      <Container width="wide">
        <Reveal y={26}>
          <div
            className={cn(
              'relative isolate overflow-hidden rounded-2xl bg-primary',
              'px-6 py-16 text-center sm:px-10 sm:py-20 lg:py-28',
            )}
          >
            {/* Grain keeps the light panel from reading as flat vector fill. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-grain opacity-[0.22] mix-blend-multiply"
            />

            {/* Embossed wordmark, cropped by the panel. */}
            <span
              aria-hidden="true"
              className={cn(
                'pointer-events-none absolute -bottom-[0.32em] left-1/2 -translate-x-1/2',
                'font-display select-none text-[clamp(7rem,26vw,22rem)] font-semibold leading-none',
                'tracking-[-0.06em] text-canvas/[0.042]',
              )}
            >
              NOVA
            </span>

            <div className="relative mx-auto flex max-w-[42rem] flex-col items-center">
              <span
                className={cn(
                  'flex items-center gap-2 rounded-full border border-canvas/20 px-3 py-1',
                  'font-mono text-kicker uppercase text-canvas/70',
                )}
              >
                <Icon name="sparkles" size={11} />
                Start in under five minutes
              </span>

              <WordReveal
                as="h2"
                text="Give your team an unfair advantage."
                emphasis="unfair"
                delay={0.08}
                className="mt-7 block text-h1 text-canvas"
              />

              <p className="mt-5 max-w-[44ch] text-lead text-canvas/72">
                Bring the research, the writing and the busywork into one place — and hand the
                repetitive half of it to an agent.
              </p>

              <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:gap-5">
                <Magnetic strength={0.26} padding={26}>
                  <Button variant="inverse" size="lg" href="#pricing" trailingIcon="arrow-right">
                    Start building with NOVA
                  </Button>
                </Magnetic>
                <a
                  href="#faq"
                  className={cn(
                    'rounded-sm text-caption text-canvas/78 underline decoration-canvas/35',
                    'underline-offset-4 transition-colors duration-200',
                    'hover:text-canvas hover:decoration-canvas/60',
                  )}
                >
                  or talk to sales
                </a>
              </div>

              <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                {['Free forever plan', 'No credit card', 'Export any time'].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-1.5 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-canvas/62"
                  >
                    <Icon name="check" size={11} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}
