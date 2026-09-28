/**
 * Fictional testimonials. Written to be believable rather than glowing — each
 * one names a specific, slightly inconvenient detail, which is how real quotes
 * read. One is featured at editorial scale; the other two support it.
 */

export type Testimonial = {
  id: string
  quote: string
  name: string
  role: string
  company: string
  initials: string
  featured?: boolean
  /** Short attribution detail under the quote in the featured card. */
  context?: string
}

export const testimonials: Testimonial[] = [
  {
    id: 'q1',
    quote:
      'We replaced four tools with NOVA over about a month. The part I didn’t expect: our research actually gets read now, because it sits next to the work instead of in a folder nobody opens.',
    name: 'Naomi Cortez',
    role: 'VP Operations',
    company: 'Fieldnote',
    initials: 'NC',
    featured: true,
    context: '38-person team · migrated from four tools',
  },
  {
    id: 'q2',
    quote:
      'The agents run our weekly competitor sweep end to end. That used to be most of someone’s Monday.',
    name: 'Daniel Okafor',
    role: 'Head of Research',
    company: 'Kestrel',
    initials: 'DO',
  },
  {
    id: 'q3',
    quote:
      'First AI tool our non-technical team adopted without a single training session. They just started using it.',
    name: 'Sara Lindqvist',
    role: 'Chief of Staff',
    company: 'Obsidia',
    initials: 'SL',
  },
]

export const testimonialCopy = {
  kicker: 'Customers',
  headline: 'Teams stop carrying context between tools.',
} as const
