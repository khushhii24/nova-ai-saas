import {
  ArrowRight,
  ArrowUpRight,
  AtSign,
  Bell,
  Bot,
  ChartColumn,
  Check,
  ChevronDown,
  ChevronRight,
  CircleCheck,
  Clock,
  Compass,
  Database,
  FileCheck,
  FileSearch,
  FileSpreadsheet,
  FileText,
  Funnel,
  GitBranch,
  Globe,
  Hash,
  House,
  Inbox,
  Info,
  Lightbulb,
  ListChecks,
  MessageSquare,
  PenLine,
  Play,
  Plug,
  Plus,
  Presentation,
  Quote,
  Rocket,
  RotateCcw,
  ScanLine,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  SquareCheck,
  Table2,
  Timer,
  TrendingUp,
  TriangleAlert,
  Users,
  WandSparkles,
  Workflow,
  X,
  Zap,
  Eye,
  EyeOff,
  Lock,
  LogIn,
  Pause,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

/**
 * Single icon registry.
 *
 * Data files reference icons by *name*, never by component, so the mock data
 * layer stays plain serialisable JSON — exactly what an API would hand back.
 * Swapping icon libraries is then a one-file change.
 *
 * Keep this map tight: entries are reachable from an object literal, so an
 * unused key keeps its glyph in the bundle. `npm run lint:icons` reports any
 * that nothing references.
 */
export const icons = {
  // Interface
  'arrow-right': ArrowRight,
  'arrow-up-right': ArrowUpRight,
  'chevron-down': ChevronDown,
  'chevron-right': ChevronRight,
  check: Check,
  close: X,
  plus: Plus,
  search: Search,
  filter: Funnel,
  play: Play,
  pause: Pause,
  replay: RotateCcw,
  info: Info,

  // App chrome
  home: House,
  doc: FileText,
  sheet: FileSpreadsheet,
  deck: Presentation,
  table: Table2,
  space: Hash,
  tasks: SquareCheck,
  agents: Bot,
  analytics: ChartColumn,
  settings: Settings,
  bell: Bell,
  clock: Clock,
  timer: Timer,
  users: Users,
  message: MessageSquare,
  at: AtSign,

  // Capability
  research: Compass,
  writing: PenLine,
  analysis: ScanLine,
  team: Users,
  automations: Workflow,
  capture: Inbox,
  think: Lightbulb,
  create: WandSparkles,
  automate: Zap,
  ship: Rocket,
  sparkles: Sparkles,

  // Agent tools
  'tool-web': Globe,
  'tool-docs': FileSearch,
  'tool-crm': Database,
  'tool-write': PenLine,
  'tool-post': Send,

  // Status
  'status-done': CircleCheck,
  'status-alert': TriangleAlert,

  // Trust / plumbing
  shield: ShieldCheck,
  lock: Lock,
  eye: Eye,
  'eye-off': EyeOff,
  'log-in': LogIn,
  plug: Plug,
  branch: GitBranch,
  trend: TrendingUp,
  list: ListChecks,
  quote: Quote,
  'file-check': FileCheck,
} satisfies Record<string, LucideIcon>

export type IconName = keyof typeof icons

type IconProps = {
  name: IconName
  className?: string
  /** px. Default 16 — the site's body-adjacent size. */
  size?: number
  /** 1.6 reads finer and more expensive than Lucide's default 2. */
  strokeWidth?: number
}

export function Icon({ name, className, size = 16, strokeWidth = 1.6 }: IconProps) {
  const Glyph = icons[name]
  return (
    <Glyph
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size}
      strokeWidth={strokeWidth}
      className={cn('shrink-0', className)}
    />
  )
}
