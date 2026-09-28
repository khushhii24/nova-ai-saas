import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react'
import { Container } from '@/components/primitives/Container'
import { Icon } from '@/components/primitives/Icon'
import { Reveal } from '@/components/primitives/Reveal'
import { Section } from '@/components/primitives/Section'
import { SectionHeading } from '@/components/primitives/SectionHeading'
import { AiPanel } from '@/components/product/AiPanel'
import { AppShell, ShellButton } from '@/components/product/AppShell'
import { AvatarStack } from '@/components/product/Avatar'
import { CommandPalette } from '@/components/product/CommandPalette'
import { Kbd } from '@/components/product/Kbd'
import { Sidebar } from '@/components/product/Sidebar'
import { Toast } from '@/components/product/Toast'
import { paneTabs, WorkspacePane } from '@/components/product/WorkspacePane'
import { actors, appNav, appSpaces, notifications, type CommandItem } from '@/data/workspace'
import { useHotkey } from '@/hooks/useHotkey'
import { EASE_OUT, SPRING } from '@/lib/motion'
import { cn } from '@/lib/cn'

/** Palette entries that navigate rather than "run". */
const PANE_FOR_COMMAND: Record<string, string> = {
  Home: 'home',
  Tasks: 'tasks',
  Analytics: 'analytics',
}

/**
 * The product experience — the section that has to carry the claim that this
 * is a real application.
 *
 * Every control does something: the sidebar switches panes, the tabs filter
 * real records, task checkboxes cycle status, the agent rows expand, ⌘K opens
 * a working palette, and the assistant streams once the section is on screen.
 * Nothing here is a static image.
 *
 * ⌘K is bound only while this section is in the viewport — a marketing page
 * that permanently captures the browser's find shortcut is a genuine
 * annoyance, not a flourish.
 */
export function ProductExperience() {
  const frameRef = useRef<HTMLDivElement>(null)
  const inView = useInView(frameRef, { once: false, amount: 0.3 })
  const streamOnce = useInView(frameRef, { once: true, amount: 0.35 })
  const reduceMotion = useReducedMotion()

  const [paneId, setPaneId] = useState('home')
  const [tab, setTab] = useState('All')
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [bellOpen, setBellOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const tabs = paneTabs[paneId]
  const activeItem = [...appNav, ...appSpaces].find((item) => item.id === paneId)

  const selectPane = useCallback((id: string) => {
    setPaneId(id)
    setTab('All')
    setBellOpen(false)
  }, [])

  useHotkey(
    'k',
    (event) => {
      if (!inView) return
      event.preventDefault()
      setPaletteOpen((open) => !open)
    },
    { meta: true, allowInInput: true },
  )

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(timer)
  }, [toast])

  const onCommand = (item: CommandItem) => {
    const target = PANE_FOR_COMMAND[item.label]
    if (target) {
      selectPane(target)
      setToast(`Opened ${item.label}`)
      return
    }
    setToast(`Ran “${item.label}”`)
  }

  return (
    <Section id="product" rule>
      <Container width="wide">
        <SectionHeading
          index="03"
          ghost
          kicker="Product"
          title="One window. Everything in it."
          emphasis="Everything"
          description="The workspace, the tasks, the agents and the assistant share one surface — and one set of permissions."
          aside={
            <span
              className={cn(
                'flex items-center gap-2 rounded-full border border-line bg-elevated/60 px-3 py-1.5',
              )}
            >
              <Icon name="info" size={12} className="text-accent" />
              <span className="text-micro text-secondary">
                This one is live — try <Kbd className="mx-0.5">⌘K</Kbd>
              </span>
            </span>
          }
        />

        <Reveal y={24} className="mt-12 lg:mt-16">
          <div ref={frameRef}>
            <AppShell
              bare
              title={
                <span className="flex items-center gap-1.5">
                  Fieldnote
                  <Icon name="chevron-right" size={11} className="text-line-strong" />
                  <span className="text-secondary">{activeItem?.label ?? 'Home'}</span>
                </span>
              }
              actions={
                <>
                  <button
                    type="button"
                    onClick={() => setPaletteOpen(true)}
                    className={cn(
                      'mr-1 hidden items-center gap-2 rounded-full border border-line bg-surface/80 px-2.5 py-1',
                      'transition-colors duration-200 hover:border-line-strong hover:bg-raised sm:flex',
                    )}
                  >
                    <Icon name="search" size={11} className="text-muted" />
                    <span className="font-mono text-[0.5625rem] uppercase tracking-[0.1em] text-muted">
                      Search
                    </span>
                    <Kbd className="h-4">⌘K</Kbd>
                  </button>

                  <div className="relative">
                    <ShellButton
                      label="Notifications"
                      onClick={() => setBellOpen((open) => !open)}
                    >
                      <span className="relative">
                        <Icon name="bell" size={14} />
                        <span className="absolute -right-0.5 -top-0.5 size-1.5 rounded-full bg-accent" />
                      </span>
                    </ShellButton>

                    <AnimatePresence>
                      {bellOpen && (
                        <motion.div
                          className={cn(
                            'absolute right-0 top-9 z-40 w-[17rem] overflow-hidden rounded-lg',
                            'border border-line-strong bg-elevated/98 backdrop-blur-xl',
                            'shadow-[0_24px_48px_-20px_rgb(0_0_0/0.85)]',
                          )}
                          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
                          transition={{ duration: 0.2, ease: EASE_OUT }}
                        >
                          <p className="border-b border-line px-3 py-2 font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-muted">
                            Notifications
                          </p>
                          <ul className="divide-y divide-line">
                            {notifications.map((item) => (
                              <li key={item.id} className="flex gap-2 px-3 py-2.5">
                                <Icon
                                  name={item.icon}
                                  size={12}
                                  className="mt-0.5 shrink-0 text-accent"
                                />
                                <div className="min-w-0">
                                  <p className="text-[0.6875rem] leading-snug text-primary">
                                    {item.title}
                                  </p>
                                  <p className="mt-0.5 font-mono text-[0.5625rem] leading-relaxed text-muted">
                                    {item.detail}
                                  </p>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <span className="ml-1 hidden sm:block">
                    <AvatarStack
                      actors={[actors.naomi, actors.daniel, actors.sara, actors.research]}
                      size="xs"
                    />
                  </span>
                </>
              }
            >
              <div className="grid lg:h-[34rem] lg:grid-cols-[13.5rem_minmax(0,1fr)_17.5rem]">
                <Sidebar
                  activeId={paneId}
                  onSelect={selectPane}
                  className="hidden lg:flex"
                />

                <div className="relative flex min-w-0 flex-col">
                  {/* Sidebar collapses to a scrolling chip rail on small screens,
                      so pane switching survives down to 390px. */}
                  <div className="flex gap-1.5 overflow-x-auto border-b border-line px-3 py-2 no-scrollbar lg:hidden">
                    {[...appNav, ...appSpaces].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => selectPane(item.id)}
                        aria-current={item.id === paneId ? 'page' : undefined}
                        className={cn(
                          'flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1',
                          'text-[0.6875rem] transition-colors duration-200',
                          item.id === paneId
                            ? 'border-accent/40 bg-accent/10 text-primary'
                            : 'border-line bg-surface text-secondary',
                        )}
                      >
                        <Icon name={item.icon} size={11} />
                        {item.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 border-b border-line px-3 py-2">
                    {tabs ? (
                      <div role="tablist" aria-label="Filter" className="flex items-center gap-0.5">
                        {tabs.map((label) => {
                          const isActive = label === tab
                          return (
                            <button
                              key={label}
                              type="button"
                              role="tab"
                              aria-selected={isActive}
                              onClick={() => setTab(label)}
                              className={cn(
                                'relative rounded-sm px-2.5 py-1 text-[0.6875rem] transition-colors duration-200',
                                isActive ? 'text-primary' : 'text-muted hover:text-secondary',
                              )}
                            >
                              {isActive && (
                                <motion.span
                                  layoutId="pane-tab"
                                  aria-hidden="true"
                                  className="absolute inset-0 rounded-sm border border-line-strong/60 bg-raised"
                                  transition={reduceMotion ? { duration: 0 } : SPRING}
                                />
                              )}
                              <span className="relative">{label}</span>
                            </button>
                          )
                        })}
                      </div>
                    ) : (
                      <h3 className="text-micro font-medium text-primary">
                        {activeItem?.label ?? 'Home'}
                      </h3>
                    )}

                    <div className="ml-auto flex items-center gap-1">
                      <ShellButton label="Filter">
                        <Icon name="filter" size={13} />
                      </ShellButton>
                      <ShellButton label="New document">
                        <Icon name="plus" size={14} />
                      </ShellButton>
                    </div>
                  </div>

                  <div className="h-[22rem] min-h-0 overflow-y-auto p-3 no-scrollbar lg:h-auto lg:flex-1">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${paneId}-${tab}`}
                        initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -4 }}
                        transition={{ duration: 0.2, ease: EASE_OUT }}
                      >
                        <WorkspacePane paneId={paneId} tab={tab} />
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* The pane scrolls but the scrollbar is hidden, so the fade
                      is the only cue that there is more below. */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-surface to-transparent"
                  />
                </div>

                <AiPanel active={streamOnce} className="hidden border-l border-line lg:flex" />
              </div>

              {/* Assistant stacks under the workspace below lg. */}
              <div className="border-t border-line lg:hidden">
                <AiPanel active={streamOnce} />
              </div>

              <CommandPalette
                open={paletteOpen}
                onClose={() => setPaletteOpen(false)}
                onSelect={onCommand}
              />
              <Toast message={toast} />
            </AppShell>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}
