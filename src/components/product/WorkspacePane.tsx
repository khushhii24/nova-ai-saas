import { ActivityFeed } from './ActivityFeed'
import { AgentsPane } from './AgentsPane'
import { AnalyticsPane } from './AnalyticsPane'
import { DocumentList } from './DocumentList'
import { StatRow } from './StatRow'
import { TaskList } from './TaskList'
import { appSpaces } from '@/data/workspace'
import type { DocKind } from '@/data/workspace'

/**
 * Pane configuration for the workspace.
 *
 * Tabs are declared here alongside the pane so every tab that renders has a
 * filter behind it. A tab row that only changes an underline is worse than no
 * tab row — it is the clearest sign a demo is a mockup.
 */
export type PaneId = 'home' | 'documents' | 'tasks' | 'agents' | 'analytics' | string

export const paneTabs: Record<string, string[]> = {
  documents: ['All', 'Docs', 'Sheets', 'Decks'],
  tasks: ['All', 'My tasks', 'Agent tasks'],
}

const kindForTab: Record<string, DocKind[] | undefined> = {
  All: undefined,
  Docs: ['doc'],
  Sheets: ['sheet'],
  Decks: ['deck'],
}

const ownerForTab: Record<string, 'all' | 'human' | 'agent'> = {
  All: 'all',
  'My tasks': 'human',
  'Agent tasks': 'agent',
}

function PaneHeading({ children }: { children: string }) {
  return (
    <h4 className="mb-1 px-2 font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-muted">
      {children}
    </h4>
  )
}

export function WorkspacePane({ paneId, tab }: { paneId: PaneId; tab: string }) {
  const space = appSpaces.find((item) => item.id === paneId)

  if (space) {
    return (
      <div className="flex flex-col gap-5">
        <PaneHeading>{`${space.label} · documents`}</PaneHeading>
        <DocumentList space={space.label} />
      </div>
    )
  }

  switch (paneId) {
    case 'documents':
      return <DocumentList kinds={kindForTab[tab]} />

    case 'tasks':
      return <TaskList ownerKind={ownerForTab[tab] ?? 'all'} />

    case 'agents':
      return <AgentsPane />

    case 'analytics':
      return <AnalyticsPane />

    case 'home':
    default:
      return (
        <div className="flex flex-col gap-6">
          <StatRow />

          <div>
            <PaneHeading>Recent documents</PaneHeading>
            <DocumentList limit={4} />
          </div>

          <div>
            <PaneHeading>In progress</PaneHeading>
            <TaskList limit={3} />
          </div>

          <div className="border-t border-line pt-4">
            <PaneHeading>Team activity</PaneHeading>
            <div className="px-2">
              <ActivityFeed limit={4} />
            </div>
          </div>
        </div>
      )
  }
}
