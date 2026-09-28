import { Container } from '@/components/primitives/Container'
import { brandGlyphs } from '@/components/primitives/BrandGlyphs'
import { Logo } from './Logo'
import { brand, footerColumns, socialLinks } from '@/data/site'
import { cn } from '@/lib/cn'

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-canvas-deep pt-16 lg:pt-20">
      <Container width="wide" className="relative">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3">
            <Logo />
            <p className="mt-5 max-w-[26ch] text-micro leading-relaxed text-muted">
              One intelligent workspace for research, writing, analysis and the work you would
              rather not do twice.
            </p>

            <ul className="mt-6 flex items-center gap-2">
              {socialLinks.map((social) => {
                const Glyph = brandGlyphs[social.glyph]
                return (
                  <li key={social.glyph}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={social.label}
                      className={cn(
                        'grid size-9 place-items-center rounded-md border border-line bg-surface/60',
                        'text-muted transition-colors duration-200',
                        'hover:border-line-strong hover:text-secondary',
                      )}
                    >
                      <Glyph className="size-[0.875rem]" />
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:col-span-9 lg:grid-cols-5"
          >
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h2 className="font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-muted">
                  {column.title}
                </h2>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className={cn(
                          'rounded-sm text-micro text-secondary transition-colors duration-200',
                          'hover:text-primary',
                        )}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div
          className={cn(
            'mt-16 flex flex-col-reverse items-start gap-5 border-t border-line py-7',
            'sm:flex-row sm:items-center sm:justify-between',
          )}
        >
          <p className="font-mono text-[0.625rem] uppercase tracking-[0.1em] text-muted">
            © {brand.year} {brand.name} Labs
            <span aria-hidden="true" className="mx-2 text-line-strong">
              ·
            </span>
            <span className="normal-case tracking-normal">
              A portfolio concept, not a real company
            </span>
          </p>

          <p className="flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-muted">
            <span aria-hidden="true" className="relative grid size-2.5 place-items-center">
              <span className="absolute size-1.5 rounded-full bg-success/50 motion-safe:animate-[nova-ping_2.6s_var(--ease-out-quint)_infinite]" />
              <span className="size-1.5 rounded-full bg-success" />
            </span>
            All systems operational
          </p>
        </div>
      </Container>

      {/* Wordmark bleeding off the bottom edge. The negative margin absorbs the
          internal leading above the caps, which otherwise opens a gap that
          reads as a mistake rather than as a crop. */}
      <div
        aria-hidden="true"
        className="relative -mt-10 select-none overflow-hidden sm:-mt-16 lg:-mt-20"
      >
        <Container width="wide">
          <span
            className={cn(
              'font-display block translate-y-[0.24em] text-center text-[clamp(5rem,20vw,17rem)]',
              'font-semibold leading-none tracking-[-0.06em] text-line/50',
            )}
          >
            NOVA
          </span>
        </Container>
      </div>
    </footer>
  )
}
