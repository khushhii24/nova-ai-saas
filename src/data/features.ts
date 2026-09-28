import type { IconName } from '@/components/primitives/Icon'

/**
 * Six capabilities, six different visual treatments.
 *
 * `visual` selects a bespoke mini-visualisation rather than a shared card
 * illustration, and `span` drives an alternating bento rhythm on a 6-column
 * grid: 4+2, then 2+4, then 3+3. Equal cards would read as a template.
 */

export type FeatureVisual =
  | 'research'
  | 'writing'
  | 'agents'
  | 'analysis'
  | 'team'
  | 'automations'

export type Feature = {
  id: string
  icon: IconName
  title: string
  description: string
  /** Column span at `lg` on a 6-col grid. */
  span: string
  visual: FeatureVisual
  /** Small mono label in the card footer — a concrete detail, not a slogan. */
  meta: string
}

export const features: Feature[] = [
  {
    id: 'research',
    icon: 'research',
    title: 'AI Research',
    description:
      'Turn scattered information into structured insights. Point NOVA at a question and it reads your documents, your connected sources and the web, then hands back findings with citations you can open.',
    span: 'lg:col-span-4',
    visual: 'research',
    meta: '42 sources → 6 findings',
  },
  {
    id: 'writing',
    icon: 'writing',
    title: 'AI Writing',
    description:
      'Draft, refine and transform content in seconds — in the same document where the research lives.',
    span: 'lg:col-span-2',
    visual: 'writing',
    meta: 'Same doc · citations intact',
  },
  {
    id: 'agents',
    icon: 'agents',
    title: 'AI Agents',
    description:
      'Delegate repetitive workflows to agents that plan, use tools and report back.',
    span: 'lg:col-span-2',
    visual: 'agents',
    meta: '3 running · 128 this month',
  },
  {
    id: 'analysis',
    icon: 'analysis',
    title: 'Intelligent Analysis',
    description:
      'Understand documents, datasets and business information. Drop in a spreadsheet, a contract or a quarter of support tickets and ask what changed — NOVA reads the whole thing and shows its working.',
    span: 'lg:col-span-4',
    visual: 'analysis',
    meta: 'PDF · CSV · XLSX · Docs · Tickets',
  },
  {
    id: 'team',
    icon: 'team',
    title: 'Team Workspace',
    description:
      'Keep humans and AI working together in one place, with a shared history of who — or what — did the work.',
    span: 'lg:col-span-3',
    visual: 'team',
    meta: 'Comments · Mentions · Presence',
  },
  {
    id: 'automations',
    icon: 'automations',
    title: 'Automations',
    description:
      'Turn repetitive processes into reusable workflows that run on a trigger, a schedule, or a teammate saying so.',
    span: 'lg:col-span-3',
    visual: 'automations',
    meta: 'Trigger → Steps → Delivery',
  },
]
