/**
 * Fictional customers, set as typographic wordmarks.
 *
 * Each one gets its own letterform treatment — a real logo wall is a mix of
 * serifs, monos and weights. Rendering seven names in one font is the fastest
 * way to make a trust bar look fake.
 */

export type Wordmark = {
  name: string
  /** Per-brand type treatment. */
  className: string
}

export const customers: Wordmark[] = [
  { name: 'ARCLINE', className: 'font-mono text-[0.9375rem] font-medium tracking-[0.2em]' },
  { name: 'Fieldnote', className: 'font-serif text-[1.375rem] italic tracking-[-0.01em]' },
  { name: 'Kestrel', className: 'text-[1.25rem] font-semibold tracking-[-0.04em]' },
  { name: 'OBSIDIA', className: 'text-[1.0625rem] font-normal tracking-[0.26em]' },
  { name: 'Truss°', className: 'text-[1.3125rem] font-bold tracking-[-0.045em]' },
  { name: 'Halcyon', className: 'font-serif text-[1.375rem] tracking-[-0.005em]' },
  { name: 'MERIDIAN', className: 'font-mono text-[0.875rem] font-normal tracking-[0.22em]' },
]

export const customerHeadline = 'Trusted by modern teams building what comes next.'
