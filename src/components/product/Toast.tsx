import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Icon } from '@/components/primitives/Icon'
import { EASE_OUT } from '@/lib/motion'
import { cn } from '@/lib/cn'

/**
 * Confirmation toast, anchored inside the app frame rather than the viewport —
 * a marketing page throwing toasts into the corner of the browser is
 * disorienting, because nothing the visitor did was real.
 */
export function Toast({ message }: { message: string | null }) {
  const reduceMotion = useReducedMotion()

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          role="status"
          aria-live="polite"
          className={cn(
            'absolute bottom-3 left-1/2 z-40 flex max-w-[calc(100%-1.5rem)] -translate-x-1/2',
            'items-center gap-2 rounded-full border border-line-strong bg-elevated/95 py-2 pl-3 pr-4',
            'shadow-[0_20px_40px_-16px_rgb(0_0_0/0.8)] backdrop-blur-xl',
          )}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: 0.26, ease: EASE_OUT }}
        >
          <Icon name="status-done" size={13} className="text-success" />
          <span className="truncate text-[0.6875rem] text-secondary">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
