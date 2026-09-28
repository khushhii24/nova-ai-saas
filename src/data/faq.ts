/**
 * FAQ. Answers are written to actually resolve the question — a FAQ that
 * restates the marketing copy is worse than no FAQ.
 */

export type FaqItem = { id: string; question: string; answer: string }

export const faqs: FaqItem[] = [
  {
    id: 'f1',
    question: 'What is NOVA, exactly?',
    answer:
      'A workspace where the research, the writing, the analysis and the automation all happen in the same place, with AI available at each step. Think of it as documents and tasks that can read each other — plus agents that can act on what they find.',
  },
  {
    id: 'f2',
    question: 'Does NOVA replace our existing tools?',
    answer:
      'Some of them. Teams usually retire their notes app, their standalone AI subscription and a couple of spreadsheets in the first month. NOVA does not replace your tracker, your CRM or your chat tool — it connects to them, so finished work lands where your team already looks.',
  },
  {
    id: 'f3',
    question: 'What is an AI agent here?',
    answer:
      'A saved goal plus the tools it is allowed to use. You describe an outcome — “sweep our competitors every Monday and post a brief” — and the agent plans the steps, calls the tools, and reports back with its working visible. You approve the output; you can also require approval before any step that writes somewhere.',
  },
  {
    id: 'f4',
    question: 'Can my team collaborate in the same document?',
    answer:
      'Yes — live cursors, comments, mentions and version history. Agent edits appear in the same history as human edits, labelled, so you can always see which change came from where.',
  },
  {
    id: 'f5',
    question: 'Can I connect external tools?',
    answer:
      'NOVA ships with connectors for chat, trackers, CRMs, cloud storage and email, plus a REST API and webhooks for anything else. Connected sources are indexed for search and become available to agents according to the permissions you set.',
  },
  {
    id: 'f6',
    question: 'Is my data used to train models?',
    answer:
      'No. Your content is never used to train foundation models, yours or anyone else’s. Data is encrypted in transit and at rest, access is scoped per workspace, and Business plans add audit logging, data residency and custom retention.',
  },
  {
    id: 'f7',
    question: 'Can I try NOVA for free?',
    answer:
      'Starter is free forever and includes 200 AI actions a month — enough to judge whether it fits how you work. Pro has a 14-day trial with no card required.',
  },
  {
    id: 'f8',
    question: 'What happens to my work if we leave?',
    answer:
      'Everything exports. Documents leave as Markdown or PDF, tables as CSV, and the full workspace as a single archive including version history. No export fee, no support ticket required.',
  },
]

export const faqCopy = {
  kicker: 'FAQ',
  headline: 'Questions teams ask before switching.',
  asideTitle: 'Still deciding?',
  asideBody: 'A 20-minute walkthrough with someone who has migrated a team before.',
  asideCta: 'Book a walkthrough',
} as const
