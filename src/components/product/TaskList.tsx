import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Icon } from '@/components/primitives/Icon'
import { Avatar } from './Avatar'
import { actors, tasks, type TaskPriority, type TaskStatus } from '@/data/workspace'
import { EASE_OUT } from '@/lib/motion'
import { cn } from '@/lib/cn'

const priorityTone: Record<TaskPriority, string> = {
  high: 'border-warning/30 bg-warning/10 text-warning',
  medium: 'border-line-strong bg-raised text-secondary',
  low: 'border-line bg-surface text-muted',
}

/** todo → doing → done → todo. Cheap to implement, and people always try it. */
const nextStatus: Record<TaskStatus, TaskStatus> = {
  todo: 'doing',
  doing: 'done',
  done: 'todo',
}

export function TaskList({
  limit = tasks.length,
  /** 'human' | 'agent' narrows to who owns the task. Drives the Tasks tabs. */
  ownerKind = 'all',
}: {
  limit?: number
  ownerKind?: 'all' | 'human' | 'agent'
}) {
  const [statuses, setStatuses] = useState<Record<string, TaskStatus>>(() =>
    Object.fromEntries(tasks.map((task) => [task.id, task.status])),
  )
  const reduceMotion = useReducedMotion()

  const cycle = (id: string) =>
    setStatuses((current) => ({ ...current, [id]: nextStatus[current[id]] }))

  const rows = (
    ownerKind === 'all'
      ? tasks
      : tasks.filter((task) => actors[task.actorId].kind === ownerKind)
  ).slice(0, limit)

  return (
    <ul className="flex flex-col">
      {rows.map((task) => {
        const status = statuses[task.id]
        const actor = actors[task.actorId]
        const isDone = status === 'done'

        return (
          <li
            key={task.id}
            className="group/task flex items-center gap-3 rounded-sm px-2 py-2 transition-colors duration-150 hover:bg-raised/60"
          >
            <button
              type="button"
              onClick={() => cycle(task.id)}
              aria-label={`${task.title} — status ${status}. Activate to change.`}
              className={cn(
                'grid size-4 shrink-0 place-items-center rounded-xs border transition-colors duration-200',
                isDone && 'border-success/60 bg-success/15 text-success',
                status === 'doing' && 'border-accent/60 bg-accent/12 text-accent',
                status === 'todo' && 'border-line-strong text-transparent hover:border-muted',
              )}
            >
              {isDone && <Icon name="check" size={10} strokeWidth={2.4} />}
              {status === 'doing' && (
                <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
              )}
            </button>

            <motion.span
              className={cn(
                'min-w-0 flex-1 truncate text-micro transition-colors duration-200',
                isDone ? 'text-muted line-through decoration-muted/60' : 'text-primary',
              )}
              animate={{ opacity: isDone ? 0.62 : 1 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.24, ease: EASE_OUT }}
            >
              {task.title}
            </motion.span>

            <span
              className={cn(
                'hidden shrink-0 rounded-xs border px-1.5 font-mono text-[0.5625rem] uppercase',
                'tracking-[0.1em] sm:inline',
                priorityTone[task.priority],
              )}
            >
              {task.priority}
            </span>

            <span className="hidden w-16 shrink-0 text-right font-mono text-[0.5625rem] uppercase tracking-[0.1em] text-muted md:inline">
              {task.due}
            </span>

            <Avatar actor={actor} size="xs" />
          </li>
        )
      })}
    </ul>
  )
}
