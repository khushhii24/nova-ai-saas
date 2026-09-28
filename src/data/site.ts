import type { BrandGlyphName } from '@/components/primitives/BrandGlyphs'

/**
 * Site-level content. Every href resolves to a real section on this page —
 * this is a single-page concept build, so nothing links into a void.
 */

export const brand = {
  name: 'NOVA',
  tagline: 'Your entire workflow. One intelligent workspace.',
  description:
    'NOVA brings research, writing, analysis, automation, and AI agents into one workspace designed for modern teams.',
  year: 2026,
} as const

export type NavLink = { label: string; href: string }

/**
 * The page's own sections, in document order — and the *only* navigation
 * vocabulary the masthead uses.
 *
 * There is deliberately no Products / Solutions / Resources / Pricing taxonomy
 * here. That IA describes a company with many pages; this is one page, and
 * inventing parent categories for anchors that live 800px apart is the tell
 * that a header was copied rather than designed. The index and the position
 * readout both read from this array, so what the nav says you can reach and
 * what the page actually contains cannot drift apart.
 *
 * Order must match document order in App.tsx. The rail numbers these 01–08 and
 * lights one tick per section already passed, so a list in any other order
 * counts wrong. `#main` and `#cta` are deliberately absent: the hero is where
 * you start, not somewhere you navigate to, and the closing CTA is the job of
 * the "Get started" button.
 */
export type Section = { id: string; label: string }

export const sections: Section[] = [
  { id: 'problem', label: 'Problem' },
  { id: 'features', label: 'Capabilities' },
  { id: 'product', label: 'Product' },
  { id: 'agents', label: 'Agents' },
  { id: 'workflow', label: 'Workflow' },
  { id: 'testimonials', label: 'Customers' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'faq', label: 'Questions' },
]

export type FooterColumn = { title: string; links: NavLink[] }

export const footerColumns: FooterColumn[] = [
  {
    title: 'Product',
    links: [
      { label: 'Workspace', href: '#product' },
      { label: 'AI agents', href: '#agents' },
      { label: 'Automations', href: '#features' },
      { label: 'Analytics', href: '#product' },
      { label: 'Integrations', href: '#faq' },
    ],
  },
  {
    title: 'Solutions',
    links: [
      { label: 'Product teams', href: '#workflow' },
      { label: 'Research', href: '#agents' },
      { label: 'Operations', href: '#problem' },
      { label: 'Marketing', href: '#features' },
      { label: 'Agencies', href: '#testimonials' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '#faq' },
      { label: 'Changelog', href: '#workflow' },
      { label: 'Guides', href: '#features' },
      { label: 'Community', href: '#testimonials' },
      { label: 'Support', href: '#faq' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#problem' },
      { label: 'Customers', href: '#customers' },
      { label: 'Careers', href: '#cta' },
      { label: 'Blog', href: '#testimonials' },
      { label: 'Contact', href: '#cta' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '#faq' },
      { label: 'Terms', href: '#faq' },
      { label: 'Security', href: '#faq' },
      { label: 'DPA', href: '#faq' },
      { label: 'Subprocessors', href: '#faq' },
    ],
  },
]

export type SocialLink = { label: string; href: string; glyph: BrandGlyphName }

export const socialLinks: SocialLink[] = [
  { label: 'NOVA on X', href: 'https://x.com', glyph: 'x' },
  { label: 'NOVA on LinkedIn', href: 'https://www.linkedin.com', glyph: 'linkedin' },
  { label: 'NOVA on GitHub', href: 'https://github.com', glyph: 'github' },
]

/**
 * Anchors used by the scroll-spy. Derived from `sections` so the spy can never
 * observe an id the index does not list. Module-level, so the reference is
 * stable and `useScrollSpy`'s effect does not re-run on every render.
 */
export const sectionIds: readonly string[] = sections.map((section) => section.id)
