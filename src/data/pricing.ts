/**
 * Pricing. `monthly` / `yearly` are numbers so the toggle can animate between
 * them; `null` means the plan is quoted rather than listed.
 */

export type BillingPeriod = 'monthly' | 'yearly'

export type Plan = {
  id: string
  name: string
  tagline: string
  monthly: number | null
  yearly: number | null
  /** Replaces the price when there is no number. */
  customLabel?: string
  unit: string
  cta: string
  ctaVariant: 'primary' | 'secondary'
  featured?: boolean
  /** First item is rendered as the "everything in X, plus" lead-in. */
  features: string[]
  footnote: string
}

export const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'For one person finding out whether this works.',
    monthly: 0,
    yearly: 0,
    unit: 'forever',
    cta: 'Start building free',
    ctaVariant: 'secondary',
    features: [
      '1 workspace, unlimited documents',
      '200 AI actions per month',
      'Research and writing tools',
      '2 connected sources',
      'Community support',
    ],
    footnote: 'No card required.',
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'For people who work inside NOVA every day.',
    monthly: 24,
    yearly: 19,
    unit: 'per user / month',
    cta: 'Start 14-day trial',
    ctaVariant: 'primary',
    featured: true,
    features: [
      'Everything in Starter, plus',
      'Unlimited AI actions',
      '3 agents running concurrently',
      'Automations on a schedule',
      '10 connected sources',
      'Version history for 90 days',
      'Priority support',
    ],
    footnote: 'Cancel any time. Trial does not require a card.',
  },
  {
    id: 'business',
    name: 'Business',
    tagline: 'For teams that need control over how AI touches their data.',
    monthly: null,
    yearly: null,
    customLabel: 'Custom',
    unit: 'annual agreement',
    cta: 'Talk to sales',
    ctaVariant: 'secondary',
    features: [
      'Everything in Pro, plus',
      'SSO/SAML and SCIM provisioning',
      'Unlimited agents and sources',
      'Audit log and data residency',
      'Custom retention policies',
      'Dedicated success manager',
    ],
    footnote: 'Security review and DPA included.',
  },
]

export const pricingCopy = {
  kicker: 'Pricing',
  headline: 'Simple while you’re small. Serious when you’re not.',
  body: 'Every plan includes the full workspace. You pay for how much you hand to the AI, not for the features you can see.',
  yearlySaving: 'Save 20%',
  yearlyNote: 'billed annually',
} as const
