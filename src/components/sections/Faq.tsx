import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Button } from '@/components/primitives/Button'
import { Container } from '@/components/primitives/Container'
import { Icon } from '@/components/primitives/Icon'
import { Kicker } from '@/components/primitives/Kicker'
import { Reveal } from '@/components/primitives/Reveal'
import { Section } from '@/components/primitives/Section'
import { Scramble } from '@/components/primitives/Scramble'
import { WordReveal } from '@/components/primitives/WordReveal'
import { faqCopy, faqs } from '@/data/faq'
import { DISCLOSURE_TRANSITION, EASE_OUT } from '@/lib/motion'
import { cn } from '@/lib/cn'

/**
 * FAQ as a two-column editorial spread: a sticky heading and contact card on
 * the left, the disclosure list on the right.
 *
 * One item open at a time, and the first is open by default so the section
 * never reads as a stack of closed doors. The plus mark rotates to an ×, which
 * is a clearer affordance than a chevron for "this closes".
 */
export function Faq() {
  const [openId, setOpenId] = useState<string | null>(faqs[0].id)
  const reduceMotion = useReducedMotion()

  return (
    <Section id="faq" rule>
      <Container width="wide">
        <div className="grid gap-x-14 gap-y-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-[calc(var(--rail-h)+2.5rem)]">
              <Reveal y={12}>
                <Kicker index="08">
                  <Scramble text={faqCopy.kicker.toUpperCase()} />
                </Kicker>
              </Reveal>

              <WordReveal
                as="h2"
                text="Questions teams ask before switching."
                emphasis="before"
                delay={0.05}
                className="mt-4 block text-h2 max-w-[16ch]"
              />

              <Reveal delay={0.14}>
                <div className="mt-8 rounded-xl border border-line bg-surface/50 p-5">
                  <h3 className="text-caption font-medium text-primary">{faqCopy.asideTitle}</h3>
                  <p className="mt-2 text-micro leading-relaxed text-secondary">
                    {faqCopy.asideBody}
                  </p>
                  <Button
                    href="#cta"
                    variant="secondary"
                    size="sm"
                    className="mt-4"
                    trailingIcon="arrow-right"
                  >
                    {faqCopy.asideCta}
                  </Button>
                </div>
              </Reveal>
            </div>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <ul className="flex flex-col">
              {faqs.map((item, index) => {
                const isOpen = openId === item.id
                const panelId = `faq-panel-${item.id}`
                const buttonId = `faq-button-${item.id}`

                return (
                  <Reveal
                    as="li"
                    key={item.id}
                    y={14}
                    delay={Math.min(index * 0.04, 0.2)}
                    className={cn(
                      'border-t border-line',
                      index === faqs.length - 1 && 'border-b',
                    )}
                  >
                    <h3>
                      <button
                        type="button"
                        id={buttonId}
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => setOpenId(isOpen ? null : item.id)}
                        className={cn(
                          'group/q flex w-full items-start gap-5 py-5 text-left',
                          'transition-colors duration-300',
                        )}
                      >
                        <span
                          className={cn(
                            'min-w-0 flex-1 text-h3 transition-colors duration-300',
                            isOpen
                              ? 'text-primary'
                              : 'text-secondary group-hover/q:text-primary',
                          )}
                        >
                          {item.question}
                        </span>

                        <motion.span
                          aria-hidden="true"
                          className={cn(
                            'mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border',
                            'transition-colors duration-300',
                            isOpen
                              ? 'border-accent/40 bg-accent/10 text-accent'
                              : 'border-line bg-elevated/60 text-muted group-hover/q:border-line-strong',
                          )}
                          animate={{ rotate: isOpen ? 45 : 0 }}
                          transition={
                            reduceMotion ? { duration: 0 } : { duration: 0.3, ease: EASE_OUT }
                          }
                        >
                          <Icon name="plus" size={14} />
                        </motion.span>
                      </button>
                    </h3>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="panel"
                          id={panelId}
                          role="region"
                          aria-labelledby={buttonId}
                          initial="collapsed"
                          animate="open"
                          exit="collapsed"
                          variants={{
                            collapsed: { height: 0, opacity: 0 },
                            open: { height: 'auto', opacity: 1 },
                          }}
                          transition={reduceMotion ? { duration: 0 } : DISCLOSURE_TRANSITION}
                          className="overflow-hidden"
                        >
                          <p className="max-w-[58ch] pb-6 pr-12 text-caption leading-relaxed text-secondary">
                            {item.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Reveal>
                )
              })}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  )
}
