import type { ElementType, ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Width = 'text' | 'default' | 'wide' | 'full'

const widths: Record<Width, string> = {
  /** Measure-limited prose. ~68ch at body size. */
  text: 'max-w-[44rem]',
  /** Standard content column. 1216px at 1440. */
  default: 'max-w-[76rem]',
  /** Product surfaces that want to breathe past the text column. */
  wide: 'max-w-[86rem]',
  full: 'max-w-none',
}

type ContainerProps = {
  children: ReactNode
  className?: string
  width?: Width
  as?: ElementType
}

export function Container({
  children,
  className,
  width = 'default',
  as: Tag = 'div',
}: ContainerProps) {
  return (
    <Tag className={cn('mx-auto w-full px-5 sm:px-7 lg:px-10', widths[width], className)}>
      {children}
    </Tag>
  )
}
