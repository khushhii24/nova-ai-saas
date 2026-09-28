import type { ReactNode } from 'react'
import { Kicker } from './Kicker'
import { Reveal } from './Reveal'
import { Scramble } from './Scramble'
import { WordReveal } from './WordReveal'
import { cn } from '@/lib/cn'

type SectionHeadingProps = {
  kicker?: string
  index?: string
  /** Plain text — the reveal splits it into per-word masks. */
  title: string
  /** Word(s) set in the editorial serif italic. */
  emphasis?: string | string[]
  description?: ReactNode
  /** Right-hand slot for a CTA or a note, aligned to the title baseline. */
  aside?: ReactNode
  align?: 'left' | 'center'
  className?: string
  id?: string
  /** Oversized outlined index numeral behind the heading. */
  ghost?: boolean
  /** Heading level. Every section is h2; only the hero owns h1. */
  as?: 'h2' | 'h3'
}

export function SectionHeading({
  kicker,
  index,
  title,
  emphasis,
  description,
  aside,
  align = 'left',
  className,
  id,
  ghost = false,
  as = 'h2',
}: SectionHeadingProps) {
  const centered = align === 'center'

  return (
    <div
      className={cn(
        'relative flex flex-col gap-y-6',
        centered ? 'items-center text-center' : 'items-start',
        aside && !centered && 'lg:flex-row lg:items-end lg:justify-between lg:gap-x-12',
        className,
      )}
    >
      {/* Oversized numeral, cropped by the section. Pure texture — it gives the
          heading block something to sit against so every section does not open
          with the same small kicker on empty space. */}
      {ghost && index && (
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute -top-8 select-none text-outline',
            'font-display text-[clamp(7rem,15vw,13rem)] font-semibold leading-none',
            // Sits behind the kicker at narrow widths, so it has to stay pure
            // texture — legible as a shape, never competing as a numeral.
            'tracking-[-0.06em] opacity-40 lg:-top-14',
            centered ? 'left-1/2 -translate-x-1/2' : '-left-3 lg:-left-5',
          )}
        >
          {index}
        </span>
      )}

      <div
        className={cn(
          'relative flex flex-col gap-4',
          centered ? 'items-center' : 'items-start',
        )}
      >
        {kicker && (
          <Reveal y={10}>
            <Kicker index={index}>
              <Scramble text={kicker.toUpperCase()} />
            </Kicker>
          </Reveal>
        )}

        <WordReveal
          as={as}
          id={id}
          text={title}
          emphasis={emphasis}
          delay={0.05}
          className={cn('text-h2 max-w-[24ch]', centered && 'mx-auto')}
        />

        {description && (
          <Reveal delay={0.18}>
            <p className={cn('text-lead max-w-[52ch] text-secondary', centered && 'mx-auto')}>
              {description}
            </p>
          </Reveal>
        )}
      </div>

      {aside && (
        <Reveal delay={0.24} className={cn('relative', centered && 'mt-2')}>
          {aside}
        </Reveal>
      )}
    </div>
  )
}
