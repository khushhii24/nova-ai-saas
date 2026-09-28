import type { SVGProps } from 'react'

/**
 * Brand marks are drawn here rather than pulled from an icon set — Lucide
 * dropped third-party logos, and these need to be solid fills to sit at the
 * same optical weight as the stroked UI icons at 16px.
 */

export function XGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  )
}

export function LinkedInGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05a3.75 3.75 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  )
}

export function GitHubGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.75.09-.73.09-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.31.76-1.61-2.67-.31-5.47-1.34-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.31-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.87.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.6-2.8 5.61-5.48 5.91.43.37.81 1.1.81 2.22v3.29c0 .32.21.7.82.58A12 12 0 0 0 12 .5Z" />
    </svg>
  )
}

/**
 * Drawn as one path in `currentColor` rather than the four-colour mark. Every
 * other brand glyph on this site is monochrome, and the palette allows exactly
 * one accent — dropping Google's red/blue/green/yellow in beside a single amber
 * would be the loudest thing on the page. Swap in the official full-colour
 * asset if this ever ships against Google's brand terms.
 */
export function GoogleGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12.24 10.4v3.36h5.56c-.23 1.45-1.7 4.25-5.56 4.25-3.34 0-6.07-2.77-6.07-6.18s2.73-6.18 6.07-6.18c1.9 0 3.18.81 3.91 1.51l2.66-2.56C17.1 2.99 14.87 2 12.24 2 6.98 2 2.72 6.26 2.72 11.52s4.26 9.52 9.52 9.52c5.5 0 9.14-3.86 9.14-9.3 0-.62-.07-1.1-.15-1.58h-8.99Z" />
    </svg>
  )
}

export const brandGlyphs = {
  x: XGlyph,
  linkedin: LinkedInGlyph,
  github: GitHubGlyph,
  google: GoogleGlyph,
}

export type BrandGlyphName = keyof typeof brandGlyphs
