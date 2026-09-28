import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Button } from '@/components/primitives/Button'
import { Container } from '@/components/primitives/Container'
import { Icon } from '@/components/primitives/Icon'
import { Reveal } from '@/components/primitives/Reveal'
import { Section } from '@/components/primitives/Section'
import { Tilt3D } from '@/components/primitives/Tilt3D'
import { SectionHeading } from '@/components/primitives/SectionHeading'
import { SegmentedControl } from '@/components/primitives/SegmentedControl'
import { plans, pricingCopy, type BillingPeriod, type Plan } from '@/data/pricing'
import { EASE_OUT } from '@/lib/motion'
import { cn } from '@/lib/cn'
import { Magnetic } from '@/components/primitives/Magnetic'

/**
 * Pricing. The period switch is real: it changes the figure, the unit line and
 * the footnote, and the numeral swaps with a short vertical slide so the change
 * is legible rather than instantaneous.
 */
export function Pricing() {
  const [period, setPeriod] = useState<BillingPeriod>('monthly')

  return (
    <Section id="pricing" rule>
      <Container width="wide">
        <SectionHeading
          index="07"
          ghost
          kicker={pricingCopy.kicker}
          title="Simple while you’re small. Serious when you’re not."
          emphasis="Serious"
          description={pricingCopy.body}
          aside={
            <SegmentedControl
              label="Billing period"
              value={period}
              onChange={setPeriod}
              options={[
                { value: 'monthly', label: 'Monthly' },
                { value: 'yearly', label: 'Yearly', badge: pricingCopy.yearlySaving },
              ]}
            />
          }
        />

        <div className="mt-12 grid gap-3 lg:mt-16 lg:grid-cols-3 lg:gap-4">
          {plans.map((plan, index) => (
            <Reveal key={plan.id} y={20} delay={index * 0.07} className="min-w-0">
              <PlanCard plan={plan} period={period} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2} className="mt-8">
          <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2.5">
            {[
              { label: 'Cancel any time', icon: 'check' as const },
              { label: 'Export everything, always', icon: 'check' as const },
              { label: 'Your data never trains a model', icon: 'shield' as const },
            ].map((item) => (
              <li
                key={item.label}
                className="flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted"
              >
                <Icon name={item.icon} size={11} className="text-accent" />
                {item.label}
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </Section>
  )
}

function PlanCard({ plan, period }: { plan: Plan; period: BillingPeriod }) {
  const reduceMotion = useReducedMotion()
  const price = period === 'monthly' ? plan.monthly : plan.yearly
  const isQuoted = price === null

  // The featured plan sits closer to the viewer and tips a little further, so
  // the row has a genuine focal depth instead of only a brighter border.
  return (
    <Tilt3D
      as="article"
      frameClassName="h-full"
      max={plan.featured ? 6 : 4}
      perspective={1000}
      lift={plan.featured ? 22 : 8}
      spotlight
      className={cn(
        'relative flex h-full flex-col rounded-xl border bg-surface/50 p-6',
        'transition-colors duration-500 sm:p-7',
        plan.featured ? 'border-accent/35 bg-surface/80 lift-2' : 'border-line',
      )}
    >
      {/* Decoration clips inside its own layer rather than on the card.
          `overflow` other than `visible` forces `transform-style: flat`, so
          clipping on the card would silently cancel the depth layers — and it
          also cropped the "Most popular" badge, which deliberately overhangs
          the top edge. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl"
      >
        <span className="absolute inset-0 spotlight-wash" />
        {plan.featured && (
          <span
            className="absolute inset-x-0 -top-px h-24"
            style={{
              background: 'linear-gradient(180deg, rgb(242 177 60 / 0.08), transparent 100%)',
            }}
          />
        )}
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-xl spotlight-ring"
      />

      {/* Sits deliberately astride the top border, so it must stay outside the
          clip layer above. */}
      {plan.featured && (
        <span
          className={cn(
            'absolute -top-2.5 left-6 rounded-full border border-accent/35 bg-canvas px-2.5 py-0.5',
            'font-mono text-[0.5625rem] uppercase tracking-[0.13em] text-accent',
          )}
        >
          Most popular
        </span>
      )}

      <header className="relative">
        <h3 className="text-h3">{plan.name}</h3>
        <p className="mt-2 min-h-[2.75rem] max-w-[34ch] text-micro leading-relaxed text-secondary">
          {plan.tagline}
        </p>
      </header>

      <div className="relative mt-5 flex items-end gap-2 border-b border-line pb-6">
        {isQuoted ? (
          <span className="text-[2.5rem] font-medium leading-none tracking-[-0.04em] text-primary">
            {plan.customLabel}
          </span>
        ) : (
          <span className="flex items-end">
            <span className="mr-0.5 self-start pt-1.5 text-lead text-muted">$</span>
            <span className="relative block h-10 overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={`${plan.id}-${price}`}
                  className="block text-[2.5rem] font-medium leading-none tracking-[-0.04em] text-primary"
                  initial={reduceMotion ? { opacity: 0 } : { y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={reduceMotion ? { opacity: 0 } : { y: -16, opacity: 0 }}
                  transition={{ duration: 0.28, ease: EASE_OUT }}
                >
                  {price}
                </motion.span>
              </AnimatePresence>
            </span>
          </span>
        )}

        <span className="pb-0.5 font-mono text-[0.625rem] uppercase leading-relaxed tracking-[0.1em] text-muted">
          {plan.unit}
          {!isQuoted && period === 'yearly' && price !== 0 && (
            <span className="block text-accent">{pricingCopy.yearlyNote}</span>
          )}
        </span>
      </div>

      <ul className="relative mt-6 flex flex-1 flex-col gap-2.5">
        {plan.features.map((feature, index) => {
          const isLeadIn = index === 0 && feature.endsWith('plus')

          return (
            <li
              key={feature}
              className={cn(
                'flex items-start gap-2.5',
                isLeadIn && 'pb-1 font-mono text-[0.5625rem] uppercase tracking-[0.12em]',
              )}
            >
              {!isLeadIn && (
                <Icon
                  name="check"
                  size={13}
                  className={cn('mt-0.5 shrink-0', plan.featured ? 'text-accent' : 'text-muted')}
                />
              )}
              <span
                className={cn(
                  isLeadIn ? 'text-muted' : 'text-micro leading-relaxed text-secondary',
                )}
              >
                {feature}
              </span>
            </li>
          )
        })}
      </ul>

      <footer className="relative mt-7">
        <Magnetic strength={plan.featured ? 0.16 : 0}>
          <Button
            href="#cta"
            variant={plan.ctaVariant}
            size="lg"
            className="w-full"
            trailingIcon={plan.featured ? 'arrow-right' : undefined}
          >
            {plan.cta}
          </Button>
        </Magnetic>
        <p className="mt-3 text-center font-mono text-[0.5625rem] uppercase tracking-[0.1em] text-muted">
          {plan.footnote}
        </p>
      </footer>
    </Tilt3D>
  )
}
