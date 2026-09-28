import { useCallback, useRef, type ReactNode, type RefObject } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { cn } from '@/lib/cn'

type Tilt3DProps = {
  children: ReactNode
  className?: string
  /** Wrapper class — carries the perspective, so it must not be transformed. */
  frameClassName?: string
  /** Peak rotation at the edges, in degrees. Past ~10 it stops reading as a
   *  surface and starts reading as a toy. */
  max?: number
  /** Viewer distance. Smaller = more extreme foreshortening. */
  perspective?: number
  /** How far the whole plane comes toward the viewer while hovered, in px. */
  lift?: number
  /** Publish --mx/--my/--spot so `spotlight-*` utilities light the same edge the
   *  tilt raises. Without this the highlight and the geometry disagree. */
  spotlight?: boolean
  as?: Tag
}

/** Static map — building a motion component during render would remount it. */
const MOTION_TAGS = {
  div: motion.div,
  article: motion.article,
  section: motion.section,
} as const

type Tag = keyof typeof MOTION_TAGS

const SPRING = { stiffness: 180, damping: 22, mass: 0.6 } as const

/**
 * Tilts its contents in real perspective as the pointer crosses them.
 *
 * The important part is `transform-style: preserve-3d` on the moving plane:
 * children marked `depth-1/2/3` sit on their own Z planes, so a tilt produces
 * genuine parallax between the layers — near things sweep further than far
 * things — rather than the whole card skewing as one flat sheet. That
 * difference is most of what separates "3D" from "a CSS trick".
 *
 * Nothing here triggers a React render: the pointer writes to motion values and
 * CSS custom properties directly, so a cursor crossing a six-card grid costs
 * nothing.
 *
 * Coarse pointers get no tilt — a card that lurches under a thumb is a bug, not
 * a delight — and `prefers-reduced-motion` drops the wrapper entirely, since
 * this is exactly the vestibular-trigger motion WCAG 2.3.3 is about.
 */
export function Tilt3D({
  children,
  className,
  frameClassName,
  max = 7,
  perspective = 1100,
  lift = 14,
  spotlight = false,
  as = 'div',
}: Tilt3DProps) {
  // One ref shared by three possible tags; the DOM API used here (rect +
  // style) is on HTMLElement, so the cast is safe and keeps the call sites
  // free of generics.
  const ref = useRef<HTMLElement>(null) as RefObject<HTMLDivElement>
  const reduceMotion = useReducedMotion()

  // The pointer writes to the *source* values and the springs follow them.
  // Setting a spring's own output instead makes it jump and then be dragged
  // straight back to whatever its source still says — which is zero, forever.
  const targetX = useMotionValue(0)
  const targetY = useMotionValue(0)
  const targetZ = useMotionValue(0)

  const rotateX = useSpring(targetX, SPRING)
  const rotateY = useSpring(targetY, SPRING)
  const z = useSpring(targetZ, SPRING)

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (event.pointerType !== 'mouse') return
      const node = ref.current
      if (!node) return

      const rect = node.getBoundingClientRect()
      const px = (event.clientX - rect.left) / rect.width
      const py = (event.clientY - rect.top) / rect.height

      // Pointer above centre tips the top edge away, which is what a physical
      // panel pinned at its centre would do.
      targetX.set((0.5 - py) * max * 2)
      targetY.set((px - 0.5) * max * 2)
      targetZ.set(lift)

      if (spotlight) {
        node.style.setProperty('--mx', `${event.clientX - rect.left}px`)
        node.style.setProperty('--my', `${event.clientY - rect.top}px`)
        node.style.setProperty('--spot', '1')
      }
    },
    [lift, max, spotlight, targetX, targetY, targetZ],
  )

  const onPointerLeave = useCallback(() => {
    targetX.set(0)
    targetY.set(0)
    targetZ.set(0)
    if (spotlight) ref.current?.style.setProperty('--spot', '0')
  }, [spotlight, targetX, targetY, targetZ])

  const MotionTag = MOTION_TAGS[as]

  if (reduceMotion) {
    const StaticTag = as
    return (
      <div className={cn(frameClassName)}>
        <StaticTag className={cn(className)}>{children}</StaticTag>
      </div>
    )
  }

  return (
    <div className={cn(frameClassName)} style={{ perspective: `${perspective}px` }}>
      <MotionTag
        ref={ref}
        className={cn('preserve-3d', className)}
        style={{ rotateX, rotateY, z }}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        {children}
      </MotionTag>
    </div>
  )
}
