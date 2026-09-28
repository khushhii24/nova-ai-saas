import { motion, useReducedMotion } from 'motion/react'
import { AppShell, ShellButton } from './AppShell'
import { ActivityFeed } from './ActivityFeed'
import { AvatarStack } from './Avatar'
import { DocumentList } from './DocumentList'
import { Kbd } from './Kbd'
import { StatRow } from './StatRow'
import { StatusDot } from './StatusDot'
import { Icon } from '@/components/primitives/Icon'
import { Tilt3D } from '@/components/primitives/Tilt3D'
import { actors, notifications } from '@/data/workspace'
import { EASE_OUT } from '@/lib/motion'
import { cn } from '@/lib/cn'

/**
 * Hero product view — the workspace "Today" screen.
 *
 * Intentionally a *different* screen from the one in the Product Experience
 * section further down. Showing the same dashboard twice is the tell that a
 * page only had one asset to work with.
 *
 * The whole view sits on a tilting plane, with the agent notification floating
 * 58px in front of the glass, so moving the cursor produces real parallax
 * between them instead of one sheet shearing. The drop shadow is what sells it:
 * it is cast onto a surface measurably behind it.
 *
 * Only the notification carries depth. Anything inside `AppShell` cannot: the
 * shell clips its own content, and `overflow` other than `visible` forces
 * `transform-style: flat` on everything below it.
 */
export function HeroPreview() {
  const reduceMotion = useReducedMotion()
  const notification = notifications[0]

  return (
    <Tilt3D frameClassName="relative" className="relative" max={5} perspective={1500} lift={18}>
      <AppShell
        bare
        title={
          <span className="flex items-center gap-1.5">
            Fieldnote
            <Icon name="chevron-right" size={11} className="text-line-strong" />
            <span className="text-secondary">Home</span>
          </span>
        }
        actions={
          <>
            <div
              className={cn(
                'mr-1 hidden items-center gap-2 rounded-full border border-line bg-surface/80',
                'px-2.5 py-1 sm:flex',
              )}
            >
              <Icon name="search" size={11} className="text-muted" />
              <span className="font-mono text-[0.5625rem] uppercase tracking-[0.1em] text-muted">
                Search
              </span>
              <Kbd className="h-4">⌘K</Kbd>
            </div>
            <ShellButton label="Notifications">
              <span className="relative">
                <Icon name="bell" size={14} />
                <span className="absolute -right-0.5 -top-0.5 size-1.5 rounded-full bg-accent" />
              </span>
            </ShellButton>
            <span className="ml-1 hidden sm:block">
              <AvatarStack
                actors={[actors.naomi, actors.daniel, actors.sara, actors.research]}
                size="xs"
              />
            </span>
          </>
        }
      >
        <div className="grid gap-px bg-line md:grid-cols-[1.55fr_1fr]">
          <div className="bg-surface p-3.5 sm:p-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-muted">
                  Thursday, 24 September
                </p>
                <p className="mt-1.5 text-[1.0625rem] font-medium tracking-[-0.02em] text-primary">
                  Three agents finished work overnight.
                </p>
              </div>
              <span className="flex items-center gap-1.5 rounded-full border border-line bg-elevated px-2 py-1">
                <StatusDot status="running" label="One agent still running" />
                <span className="font-mono text-[0.5625rem] uppercase tracking-[0.1em] text-secondary">
                  1 running
                </span>
              </span>
            </div>

            <StatRow className="mt-4" />

            <div className="mt-5">
              <div className="mb-1 flex items-center justify-between px-2">
                <p className="font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-muted">
                  Recent documents
                </p>
                <span className="flex items-center gap-1 font-mono text-[0.5625rem] uppercase tracking-[0.1em] text-muted">
                  View all
                  <Icon name="arrow-right" size={10} />
                </span>
              </div>
              <DocumentList limit={4} />
            </div>
          </div>

          <div className="hidden bg-surface p-3.5 sm:p-5 md:block">
            <p className="mb-2 font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-muted">
              Team activity
            </p>
            <ActivityFeed limit={5} />
          </div>
        </div>
      </AppShell>

      {/* One floating element only — the product doing something unprompted. */}
      <motion.div
        className={cn(
          'absolute -bottom-5 right-3 hidden w-[19rem] items-start gap-2.5 rounded-lg',
          'border border-line-strong bg-elevated/95 p-3 backdrop-blur-xl',
          'shadow-[0_28px_56px_-20px_rgb(0_0_0/0.85)] sm:flex lg:-right-6',
        )}
        style={{ z: 58 }}
        initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 14, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: EASE_OUT, delay: reduceMotion ? 0 : 1.15 }}
      >
        <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-accent/35 bg-accent/12 font-mono text-[0.5625rem] font-semibold text-accent">
          RA
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[0.6875rem] font-medium leading-snug text-primary">
            {notification.title}
          </p>
          <p className="mt-0.5 font-mono text-[0.5625rem] leading-relaxed text-muted">
            {notification.detail}
          </p>
        </div>
        <Icon name="status-done" size={13} className="mt-0.5 shrink-0 text-success" />
      </motion.div>
    </Tilt3D>
  )
}
