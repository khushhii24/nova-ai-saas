import type { IconName } from '@/components/primitives/Icon'

/**
 * The fragmentation story. Each stage of the workflow names the tools it is
 * usually spread across — specific enough to be recognisable, which is what
 * makes a problem section land instead of reading as filler.
 */

export type FragmentedStage = {
  id: string
  label: string
  icon: IconName
  tools: string[]
}

export const fragmentedStages: FragmentedStage[] = [
  { id: 'research', label: 'Research', icon: 'research', tools: ['31 open tabs', 'Bookmarks', 'PDFs'] },
  { id: 'write', label: 'Write', icon: 'writing', tools: ['Docs', 'Notes app', 'A second AI tab'] },
  { id: 'analyze', label: 'Analyze', icon: 'analysis', tools: ['Spreadsheets', 'BI tool', 'CSV exports'] },
  { id: 'automate', label: 'Automate', icon: 'automate', tools: ['Zaps', 'Scripts', 'Someone remembering'] },
  { id: 'collaborate', label: 'Collaborate', icon: 'team', tools: ['Chat', 'Email threads', 'Screenshots'] },
]

export const unifiedCapabilities: { label: string; icon: IconName }[] = [
  { label: 'Research', icon: 'research' },
  { label: 'Write', icon: 'writing' },
  { label: 'Analyze', icon: 'analysis' },
  { label: 'Automate', icon: 'automate' },
  { label: 'Collaborate', icon: 'team' },
]

export const problemCopy = {
  kicker: 'The problem',
  headline: 'Work shouldn’t feel like switching between twenty tools.',
  body: 'Every hand-off between tools drops the context that made the work good. The research never reaches the draft. The analysis never reaches the decision. Most of the day goes into carrying things across the gaps.',
  fragmentedLabel: 'Today',
  fragmentedNote: 'Five stages. Fifteen tools. Context lost at every arrow.',
  unifiedLabel: 'With NOVA',
  unifiedNote: 'One workspace. Shared context. Nothing to carry across.',
} as const
