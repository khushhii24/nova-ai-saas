import { Container } from '@/components/primitives/Container'
import { Icon } from '@/components/primitives/Icon'
import { Reveal } from '@/components/primitives/Reveal'
import { Section } from '@/components/primitives/Section'
import { SectionHeading } from '@/components/primitives/SectionHeading'
import { Tilt3D } from '@/components/primitives/Tilt3D'
import { FeatureArtwork } from '@/components/visuals/FeatureVisuals'
import { features, type Feature } from '@/data/features'
import { cn } from '@/lib/cn'

/**
 * Capability grid on a six-column bento rhythm: 4+2, then 2+4, then 3+3.
 *
 * The alternating wide block is what stops this reading as a card wall — the
 * eye lands in a different place in each row. Every card carries its own
 * visualisation and a concrete mono footnote instead of a second paragraph.
 */
export function Features() {
  return (
    <Section id="features" rule>
      <Container width="wide">
        <SectionHeading
          index="02"
          ghost
          kicker="Capabilities"
          title="Six things NOVA does, properly."
          emphasis="properly."
          description="Not a bundle of AI buttons bolted onto a notes app. Each of these was built to hand its output to the next one."
        />

        <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:mt-16 lg:grid-cols-6 lg:gap-4">
          {features.map((feature, index) => (
            <Reveal
              key={feature.id}
              delay={(index % 3) * 0.07}
              y={18}
              className={cn('min-w-0', feature.span)}
            >
              <FeatureCard feature={feature} />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  )
}

/**
 * The card tilts toward the cursor and lights where it is — one gesture, not
 * two: `Tilt3D` publishes the same pointer position the `spotlight-*`
 * utilities read, so the highlight always falls on the edge the tilt raises.
 * Both are written straight to the node, so a pointer crossing six cards costs
 * zero React renders.
 *
 * Inside, the icon and the artwork sit a step forward of the surface, which is
 * what makes the tilt read as a panel with things ON it rather than a printed
 * sheet being waved about.
 */
function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <Tilt3D
      as="article"
      frameClassName="h-full"
      max={6}
      perspective={900}
      lift={10}
      spotlight
      className={cn(
        'group/card relative flex h-full flex-col rounded-xl',
        'border border-line bg-surface/55 p-5 transition-colors duration-500 sm:p-6',
      )}
    >
      {/* The wash clips in its own layer, not on the card: `overflow` other
          than `visible` forces `transform-style: flat`, which would silently
          cancel every `depth-*` child below. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl"
      >
        <span className="absolute inset-0 spotlight-wash" />
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-xl spotlight-ring"
      />

      {/* `transform-style` is not inherited, so every wrapper between the
          tilting plane and a `depth-*` child has to re-declare it. */}
      <header className="preserve-3d relative flex items-center gap-2.5">
        <span
          className={cn(
            'grid size-7 place-items-center rounded-md border border-line bg-elevated',
            'depth-2 text-muted transition-colors duration-500 group-hover/card:text-accent',
          )}
        >
          <Icon name={feature.icon} size={14} />
        </span>
        <h3 className="text-h3">{feature.title}</h3>
      </header>

      <p className="relative mt-3 max-w-[46ch] text-caption leading-relaxed text-secondary">
        {feature.description}
      </p>

      {/* Artwork sits on the card's baseline rather than stretching. Cards in a
          row still equalise height via the grid, but the slack lands as
          whitespace above the visual instead of as a hole through the middle. */}
      <div className="preserve-3d relative mt-7 flex flex-1 items-end">
        <div className="w-full depth-1">
          <FeatureArtwork visual={feature.visual} />
        </div>
      </div>

      <footer className="relative mt-5 border-t border-line pt-3.5">
        <p className="font-mono text-[0.5625rem] uppercase tracking-[0.13em] text-muted">
          {feature.meta}
        </p>
      </footer>
    </Tilt3D>
  )
}
