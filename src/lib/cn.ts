import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/**
 * Theme-aware class merging.
 *
 * tailwind-merge only knows Tailwind's *default* scales. Our theme adds custom
 * font sizes (`text-micro`) and custom colours (`text-accent-ink`) that both
 * look like `text-*`, so out of the box it files them in the same conflict
 * group and silently drops one:
 *
 *   twMerge('text-accent-ink', 'text-micro')  // -> 'text-micro'   (colour lost)
 *   twMerge('text-micro', 'text-primary')     // -> 'text-primary' (size lost)
 *
 * That is not hypothetical — it stripped the dark ink off primary buttons and
 * knocked the whole app-UI type scale back to the inherited 16px. Declaring the
 * scales below puts each class in the right group.
 */

const FONT_SIZES = [
  'display',
  'h1',
  'h2',
  'h3',
  'lead',
  'body',
  'caption',
  'micro',
  'kicker',
] as const

const COLORS = [
  'canvas',
  'canvas-deep',
  'surface',
  'elevated',
  'raised',
  'line',
  'line-strong',
  'primary',
  'secondary',
  'muted',
  'accent',
  'accent-hover',
  'accent-press',
  'accent-ink',
  'success',
  'warning',
  'error',
] as const

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: [...FONT_SIZES] }],
      'text-color': [{ text: [...COLORS] }],
      'bg-color': [{ bg: [...COLORS] }],
      // Without this, `font-display` is unknown to twMerge and can collide
      // with `font-medium` in the same class string.
      'font-family': [{ font: ['display'] }],
      'border-color': [{ border: [...COLORS] }],
      // Custom background-image utilities, so they never collide with bg-color.
      'bg-image': ['bg-grid', 'bg-grid-sm', 'bg-grain'],
    },
  },
})

/** Merge conditional class names, with later Tailwind utilities winning. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
