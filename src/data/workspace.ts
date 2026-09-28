import type { IconName } from '@/components/primitives/Icon'

/**
 * Mock application state for the product surfaces.
 *
 * Shaped the way a real API would return it — flat records, ids, and
 * pre-formatted relative timestamps so no clock is needed. Every component
 * that renders app UI reads from here, so swapping in a real backend means
 * replacing this module with fetches, not touching the views.
 */

/* -------------------------------------------------------------------------- */
/* Navigation                                                                  */
/* -------------------------------------------------------------------------- */

export type AppNavItem = {
  id: string
  label: string
  icon: IconName
  badge?: string
}

export const appNav: AppNavItem[] = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'documents', label: 'Documents', icon: 'doc', badge: '74' },
  { id: 'tasks', label: 'Tasks', icon: 'tasks', badge: '6' },
  { id: 'agents', label: 'Agents', icon: 'agents', badge: '3' },
  { id: 'analytics', label: 'Analytics', icon: 'analytics' },
]

export const appSpaces: AppNavItem[] = [
  { id: 'product', label: 'Product', icon: 'space' },
  { id: 'research', label: 'Research', icon: 'space' },
  { id: 'gtm', label: 'Go-to-market', icon: 'space' },
]

/* -------------------------------------------------------------------------- */
/* People & agents                                                             */
/* -------------------------------------------------------------------------- */

export type Actor = {
  id: string
  name: string
  /** Distinguishes teammates from agents everywhere in the UI. */
  kind: 'human' | 'agent'
  initials: string
}

export const actors: Record<string, Actor> = {
  naomi: { id: 'naomi', name: 'Naomi Cortez', kind: 'human', initials: 'NC' },
  daniel: { id: 'daniel', name: 'Daniel Okafor', kind: 'human', initials: 'DO' },
  sara: { id: 'sara', name: 'Sara Lindqvist', kind: 'human', initials: 'SL' },
  marco: { id: 'marco', name: 'Marco Fenn', kind: 'human', initials: 'MF' },
  research: { id: 'research', name: 'Research Agent', kind: 'agent', initials: 'RA' },
  docs: { id: 'docs', name: 'Docs Agent', kind: 'agent', initials: 'DA' },
  digest: { id: 'digest', name: 'Digest Agent', kind: 'agent', initials: 'DG' },
}

/* -------------------------------------------------------------------------- */
/* Documents                                                                   */
/* -------------------------------------------------------------------------- */

export type DocKind = 'doc' | 'sheet' | 'deck'

export type DocRow = {
  id: string
  title: string
  kind: DocKind
  space: string
  actorId: keyof typeof actors
  editedAt: string
  /** Marks work an agent touched. */
  aiLabel?: string
}

export const documents: DocRow[] = [
  {
    id: 'd1',
    title: 'Q3 competitor landscape',
    kind: 'doc',
    space: 'Research',
    actorId: 'research',
    editedAt: '12m ago',
    aiLabel: 'Agent draft',
  },
  {
    id: 'd2',
    title: 'Pricing experiment — cohort results',
    kind: 'sheet',
    space: 'Go-to-market',
    actorId: 'daniel',
    editedAt: '1h ago',
  },
  {
    id: 'd3',
    title: 'Onboarding teardown v4',
    kind: 'deck',
    space: 'Product',
    actorId: 'sara',
    editedAt: '3h ago',
  },
  {
    id: 'd4',
    title: 'Churn interviews — synthesis',
    kind: 'doc',
    space: 'Research',
    actorId: 'research',
    editedAt: '5h ago',
    aiLabel: 'Summarised',
  },
  {
    id: 'd5',
    title: 'EU launch checklist',
    kind: 'doc',
    space: 'Go-to-market',
    actorId: 'marco',
    editedAt: 'Yesterday',
  },
]

/* -------------------------------------------------------------------------- */
/* Tasks                                                                       */
/* -------------------------------------------------------------------------- */

export type TaskStatus = 'done' | 'doing' | 'todo'
export type TaskPriority = 'high' | 'medium' | 'low'

export type TaskRow = {
  id: string
  title: string
  status: TaskStatus
  actorId: keyof typeof actors
  priority: TaskPriority
  due: string
}

export const tasks: TaskRow[] = [
  {
    id: 't1',
    title: 'Summarise 14 churn interviews',
    status: 'done',
    actorId: 'research',
    priority: 'high',
    due: 'Today',
  },
  {
    id: 't2',
    title: 'Draft Q3 landscape brief',
    status: 'doing',
    actorId: 'research',
    priority: 'high',
    due: 'Today',
  },
  {
    id: 't3',
    title: 'Wire analytics events for the trial flow',
    status: 'doing',
    actorId: 'daniel',
    priority: 'medium',
    due: 'Fri',
  },
  {
    id: 't4',
    title: 'Review pricing page copy',
    status: 'todo',
    actorId: 'naomi',
    priority: 'medium',
    due: 'Tomorrow',
  },
  {
    id: 't5',
    title: 'Approve EU launch checklist',
    status: 'todo',
    actorId: 'sara',
    priority: 'high',
    due: 'Thu',
  },
  {
    id: 't6',
    title: 'Refresh integration docs',
    status: 'todo',
    actorId: 'docs',
    priority: 'low',
    due: 'Next week',
  },
]

/* -------------------------------------------------------------------------- */
/* Activity                                                                    */
/* -------------------------------------------------------------------------- */

export type ActivityItem = {
  id: string
  actorId: keyof typeof actors
  text: string
  detail?: string
  at: string
  icon: IconName
}

export const activity: ActivityItem[] = [
  {
    id: 'a1',
    actorId: 'research',
    text: 'finished Competitor sweep',
    detail: '42 sources · 6 findings',
    at: '4m',
    icon: 'status-done',
  },
  {
    id: 'a2',
    actorId: 'naomi',
    text: 'commented on Onboarding teardown v4',
    detail: '“Can we cut step 3 entirely?”',
    at: '18m',
    icon: 'message',
  },
  {
    id: 'a3',
    actorId: 'digest',
    text: 'ran Weekly digest',
    detail: '3 documents created',
    at: '1h',
    icon: 'automations',
  },
  {
    id: 'a4',
    actorId: 'daniel',
    text: 'connected a CRM source',
    detail: 'Deals, contacts, closed-lost reasons',
    at: '2h',
    icon: 'plug',
  },
  {
    id: 'a5',
    actorId: 'docs',
    text: 'updated 6 pages in Integrations',
    at: '4h',
    icon: 'doc',
  },
]

/* -------------------------------------------------------------------------- */
/* Stats & analytics                                                           */
/* -------------------------------------------------------------------------- */

export type StatTile = {
  id: string
  label: string
  value: string
  delta: string
  trend: 'up' | 'flat'
  /** Normalised 0–1 sparkline samples. */
  spark: number[]
}

export const stats: StatTile[] = [
  {
    id: 's1',
    label: 'Agent runs',
    value: '128',
    delta: '+18%',
    trend: 'up',
    spark: [0.3, 0.42, 0.36, 0.55, 0.48, 0.7, 0.62, 0.85, 1],
  },
  {
    id: 's2',
    label: 'Hours returned',
    value: '36.5',
    delta: '+12%',
    trend: 'up',
    spark: [0.4, 0.38, 0.5, 0.46, 0.62, 0.58, 0.74, 0.8, 0.92],
  },
  {
    id: 's3',
    label: 'Docs created',
    value: '74',
    delta: '+9%',
    trend: 'up',
    spark: [0.5, 0.55, 0.52, 0.6, 0.58, 0.66, 0.72, 0.7, 0.84],
  },
]

export const analytics = {
  runsByDay: [
    { day: 'Mon', value: 14 },
    { day: 'Tue', value: 19 },
    { day: 'Wed', value: 16 },
    { day: 'Thu', value: 24 },
    { day: 'Fri', value: 31 },
    { day: 'Sat', value: 9 },
    { day: 'Sun', value: 15 },
  ],
  breakdown: [
    { label: 'Research', share: 0.42 },
    { label: 'Documentation', share: 0.27 },
    { label: 'Reporting', share: 0.19 },
    { label: 'Triage', share: 0.12 },
  ],
} as const

/* -------------------------------------------------------------------------- */
/* AI panel thread                                                             */
/* -------------------------------------------------------------------------- */

export type ThreadSource = { id: string; label: string; icon: IconName; meta: string }

export const aiThread = {
  prompt: 'What changed in our competitor landscape this quarter?',
  /** Streamed a character at a time by the AI panel. */
  response:
    'Three shifts matter. Halcyon moved upmarket — their new Teams tier starts at 25 seats, which vacates the 5–20 seat band you win most often. Arcline shipped agent workflows in August, though their docs describe a single-step runner rather than multi-step. And list pricing across the set compressed to $20–28 per seat, so discounting is no longer a differentiator.',
  followUps: [
    'Which accounts does the Halcyon change open up?',
    'Draft a one-page brief for the GTM sync',
  ],
  sources: [
    { id: 'src1', label: 'Q3 competitor landscape', icon: 'doc', meta: 'Workspace doc' },
    { id: 'src2', label: '42 web sources', icon: 'tool-web', meta: 'Crawled 18 Sep' },
    { id: 'src3', label: 'Closed-lost reasons', icon: 'tool-crm', meta: '312 deals' },
  ] satisfies ThreadSource[],
} as const

/* -------------------------------------------------------------------------- */
/* Command palette                                                             */
/* -------------------------------------------------------------------------- */

export type CommandItem = {
  id: string
  label: string
  icon: IconName
  shortcut?: string
  hint?: string
}

export type CommandGroup = { id: string; title: string; items: CommandItem[] }

export const commandGroups: CommandGroup[] = [
  {
    id: 'actions',
    title: 'Actions',
    items: [
      { id: 'c1', label: 'Ask NOVA anything', icon: 'sparkles', shortcut: '⌘J' },
      { id: 'c2', label: 'New document', icon: 'plus', shortcut: '⌘N' },
      { id: 'c3', label: 'Run an agent', icon: 'agents', shortcut: '⌘R' },
      { id: 'c4', label: 'Start an automation', icon: 'automate', shortcut: '⌘⇧A' },
      { id: 'c5', label: 'Connect a source', icon: 'plug' },
    ],
  },
  {
    id: 'documents',
    title: 'Recent documents',
    items: [
      { id: 'c6', label: 'Q3 competitor landscape', icon: 'doc', hint: 'Research' },
      { id: 'c7', label: 'Pricing experiment — cohort results', icon: 'sheet', hint: 'GTM' },
      { id: 'c8', label: 'Onboarding teardown v4', icon: 'deck', hint: 'Product' },
    ],
  },
  {
    id: 'navigate',
    title: 'Jump to',
    items: [
      { id: 'c9', label: 'Home', icon: 'home' },
      { id: 'c10', label: 'Tasks', icon: 'tasks' },
      { id: 'c11', label: 'Analytics', icon: 'analytics' },
      { id: 'c12', label: 'Settings', icon: 'settings' },
    ],
  },
]

/* -------------------------------------------------------------------------- */
/* Agent roster                                                                */
/* -------------------------------------------------------------------------- */

export type AgentCard = {
  id: string
  name: string
  description: string
  status: 'running' | 'done' | 'queued'
  schedule: string
  lastRun: string
  totalRuns: number
  /** Steps from the most recent run, revealed when the card is expanded. */
  recent: string[]
}

export const agentRoster: AgentCard[] = [
  {
    id: 'research',
    name: 'Research Agent',
    description: 'Sweeps competitors, customers and the web, then writes the brief.',
    status: 'running',
    schedule: 'Mondays, 07:00',
    lastRun: '4m ago',
    totalRuns: 42,
    recent: [
      'Planned 5 research tracks',
      'Searched 42 sources across web and workspace',
      'Cross-checked 312 closed-lost deals',
      'Drafted a 2-page brief with citations',
    ],
  },
  {
    id: 'docs',
    name: 'Docs Agent',
    description: 'Keeps documentation in step with what actually shipped.',
    status: 'done',
    schedule: 'On every release',
    lastRun: '4h ago',
    totalRuns: 61,
    recent: [
      'Read 12 merged changes',
      'Updated 6 pages in Integrations',
      'Flagged 2 pages for a human review',
    ],
  },
  {
    id: 'digest',
    name: 'Digest Agent',
    description: 'Turns a week of workspace activity into a short read.',
    status: 'queued',
    schedule: 'Fridays, 16:00',
    lastRun: '6d ago',
    totalRuns: 25,
    recent: [
      'Collected 61 updates',
      'Grouped them into 4 themes',
      'Posted the digest to the team channel',
    ],
  },
]

/* -------------------------------------------------------------------------- */
/* Notifications                                                               */
/* -------------------------------------------------------------------------- */

export type Notification = {
  id: string
  title: string
  detail: string
  icon: IconName
}

export const notifications: Notification[] = [
  {
    id: 'n1',
    title: 'Research Agent finished Competitor sweep',
    detail: '2 pages · 42 sources · posted to #product-research',
    icon: 'status-done',
  },
  {
    id: 'n2',
    title: 'Weekly digest is ready',
    detail: '3 documents created from 61 updates',
    icon: 'automations',
  },
]
