import { motion, useReducedMotion } from 'motion/react'
import { Icon } from '@/components/primitives/Icon'
import { Avatar } from './Avatar'
import { appNav, appSpaces, actors } from '@/data/workspace'
import { SPRING } from '@/lib/motion'
import { cn } from '@/lib/cn'

type SidebarProps = {
  activeId: string
  onSelect: (id: string) => void
  className?: string
}

export function Sidebar({ activeId, onSelect, className }: SidebarProps) {
  const reduceMotion = useReducedMotion()

  const renderItem = (
    item: { id: string; label: string; icon: 'home' | string; badge?: string },
    index: number,
  ) => {
    const isActive = item.id === activeId

    return (
      <li key={item.id}>
        <button
          type="button"
          onClick={() => onSelect(item.id)}
          aria-current={isActive ? 'page' : undefined}
          className={cn(
            'relative flex w-full items-center gap-2.5 rounded-sm px-2 py-[0.4375rem]',
            'text-micro transition-colors duration-200',
            isActive ? 'text-primary' : 'text-secondary hover:bg-raised/60 hover:text-primary',
          )}
        >
          {isActive && (
            <motion.span
              layoutId="sidebar-active"
              aria-hidden="true"
              className="absolute inset-0 rounded-sm border border-line-strong/70 bg-raised"
              transition={reduceMotion ? { duration: 0 } : SPRING}
            />
          )}
          <Icon
            name={item.icon as 'home'}
            size={14}
            className={cn('relative', isActive ? 'text-accent' : 'text-muted')}
          />
          <span className="relative min-w-0 flex-1 truncate text-left">{item.label}</span>
          {item.badge && (
            <span className="relative font-mono text-[0.625rem] text-muted">{item.badge}</span>
          )}
          <span className="sr-only">{index === 0 ? '' : ''}</span>
        </button>
      </li>
    )
  }

  return (
    <nav
      aria-label="Workspace"
      className={cn('flex h-full flex-col gap-5 border-r border-line bg-canvas/40 p-2.5', className)}
    >
      <div className="flex items-center gap-2 px-1 pt-1">
        <span className="grid size-6 place-items-center rounded-sm bg-accent/12 font-mono text-[0.625rem] font-semibold text-accent">
          N
        </span>
        <span className="min-w-0 flex-1 truncate text-micro font-medium text-primary">
          Fieldnote
        </span>
        <Icon name="chevron-down" size={12} className="text-muted" />
      </div>

      <ul className="flex flex-col gap-0.5">{appNav.map(renderItem)}</ul>

      <div className="flex flex-col gap-1.5">
        <p className="px-2 font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-muted">
          Spaces
        </p>
        <ul className="flex flex-col gap-0.5">{appSpaces.map(renderItem)}</ul>
      </div>

      <div className="mt-auto flex items-center gap-2 border-t border-line px-1 pt-3">
        <Avatar actor={actors.naomi} size="xs" />
        <span className="min-w-0 flex-1 truncate text-[0.6875rem] text-secondary">
          {actors.naomi.name}
        </span>
        <Icon name="settings" size={13} className="text-muted" />
      </div>
    </nav>
  )
}
