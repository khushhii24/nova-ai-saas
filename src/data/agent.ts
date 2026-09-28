import type { IconName } from '@/components/primitives/Icon'

/**
 * A single agent run, replayed step by step in the agent section.
 *
 * `durationMs` is what the UI animates against, so the pacing of the replay
 * mirrors the pacing the copy claims — a sweep that reads "12 seconds" should
 * not finish in one.
 */

export type AgentStep = {
  id: string
  label: string
  detail: string
  /** Registry icon for the tool the step calls. */
  icon: IconName
  /** Rendered in mono, like a real tool call. */
  tool: string
  durationMs: number
  /** Result summary shown once the step completes. */
  result: string
}

export const agentRun = {
  title: 'Research competitor landscape',
  trigger: 'Every Monday, 07:00 — or whenever someone asks',
  agent: 'Research Agent',
  model: 'nova-1 · reasoning',
  steps: [
    {
      id: 'plan',
      label: 'Plan',
      detail: 'Break the brief into research tracks and pick tools for each',
      icon: 'list',
      tool: 'nova.plan',
      durationMs: 900,
      result: '5 tracks',
    },
    {
      id: 'collect',
      label: 'Collect information',
      detail: 'Search the web, the workspace and connected sources in parallel',
      icon: 'tool-web',
      tool: 'web.search',
      durationMs: 2600,
      result: '42 sources',
    },
    {
      id: 'read',
      label: 'Read and extract',
      detail: 'Pull claims out of each source and keep the citation attached',
      icon: 'tool-docs',
      tool: 'docs.read',
      durationMs: 2000,
      result: '118 claims',
    },
    {
      id: 'analyze',
      label: 'Analyse findings',
      detail: 'Cluster the claims, flag the three that contradict each other',
      icon: 'tool-crm',
      tool: 'crm.query',
      durationMs: 1700,
      result: '312 deals cross-checked',
    },
    {
      id: 'write',
      label: 'Create summary',
      detail: 'Draft a two-page brief with inline citations and an owner per action',
      icon: 'tool-write',
      tool: 'nova.write',
      durationMs: 2200,
      result: '2 pages',
    },
    {
      id: 'deliver',
      label: 'Deliver report',
      detail: 'Post to #product-research and assign the follow-ups',
      icon: 'tool-post',
      tool: 'chat.post',
      durationMs: 900,
      result: '3 owners notified',
    },
  ] satisfies AgentStep[],
  output: {
    title: 'Q3 Competitor Landscape',
    meta: ['2 pages', '42 sources', '6 findings', '3 follow-ups'],
    findings: [
      'Halcyon moved upmarket — their entry tier now starts at 25 seats.',
      'Arcline shipped agent workflows, but single-step only.',
      'List pricing compressed to $20–28 per seat across the set.',
    ],
  },
} as const

export const agentCopy = {
  kicker: 'AI agents',
  headline: 'Don’t just use AI. Put it to work.',
  body: 'An agent takes a goal, plans the steps, calls the tools it needs and comes back with something finished. You review the output, not the process.',
} as const
