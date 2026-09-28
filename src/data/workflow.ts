import type { IconName } from '@/components/primitives/Icon'

/**
 * The five-stage product narrative. Each stage owns a small, distinct product
 * visualisation — see `components/visuals/StageVisuals.tsx`.
 */

export type StageVisual = 'capture' | 'think' | 'create' | 'automate' | 'ship'

export type WorkflowStage = {
  id: StageVisual
  index: string
  label: string
  icon: IconName
  title: string
  description: string
}

export const workflowStages: WorkflowStage[] = [
  {
    id: 'capture',
    index: '01',
    label: 'Capture',
    icon: 'capture',
    title: 'Everything lands in one inbox',
    description:
      'Clip a page, forward an email, drop a file, or connect a source. NOVA files it, reads it and makes it searchable alongside everything else.',
  },
  {
    id: 'think',
    index: '02',
    label: 'Think',
    icon: 'think',
    title: 'Ask questions across all of it',
    description:
      'Query the whole workspace at once. Every answer cites the paragraph it came from, so you can check the reasoning instead of trusting it.',
  },
  {
    id: 'create',
    index: '03',
    label: 'Create',
    icon: 'create',
    title: 'Draft where the research already is',
    description:
      'Turn a thread of findings into a brief, a spec or a deck outline without leaving the document or losing the citations.',
  },
  {
    id: 'automate',
    index: '04',
    label: 'Automate',
    icon: 'automate',
    title: 'Save the path, not just the result',
    description:
      'Any sequence you repeat becomes a reusable workflow. Give it a trigger and an agent runs it on schedule, with a log you can audit.',
  },
  {
    id: 'ship',
    index: '05',
    label: 'Ship',
    icon: 'ship',
    title: 'Publish where your team already works',
    description:
      'Push finished work into chat, your tracker or an inbox, with owners assigned and the source thread attached.',
  },
]

export const workflowCopy = {
  kicker: 'How it works',
  headline: 'Capture, think, create, automate, ship.',
  body: 'One loop, five stages, no hand-offs between tools. Scroll to move through it.',
} as const
