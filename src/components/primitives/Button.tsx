import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { Icon, type IconName } from './Icon'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'inverse'
type Size = 'sm' | 'md' | 'lg'

const base =
  'group/btn relative inline-flex select-none items-center justify-center gap-2 ' +
  'whitespace-nowrap rounded-md font-medium tracking-[-0.01em] ' +
  'transition-[background-color,border-color,color,transform,box-shadow] duration-200 ' +
  'ease-[var(--ease-out-quint)] active:translate-y-px ' +
  'disabled:pointer-events-none disabled:opacity-45'

const variants: Record<Variant, string> = {
  /** The only element on the page allowed a filled accent. */
  primary:
    'bg-accent text-accent-ink shadow-[inset_0_1px_0_0_rgb(255_255_255/0.28)] ' +
    'hover:bg-accent-hover active:bg-accent-press',
  secondary:
    'border border-line bg-elevated/60 text-primary lift-1 backdrop-blur-sm ' +
    'hover:border-line-strong hover:bg-raised',
  ghost: 'text-secondary hover:bg-elevated/70 hover:text-primary',
  /** For the light-on-dark inversion in the closing CTA. */
  inverse:
    'bg-canvas text-primary shadow-[inset_0_1px_0_0_rgb(255_255_255/0.1)] hover:bg-[#191614]',
}

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-micro',
  md: 'h-10 px-4 text-caption',
  lg: 'h-12 px-5 text-[0.9375rem]',
}

type ButtonProps = {
  children: ReactNode
  variant?: Variant
  size?: Size
  className?: string
  /** Renders an anchor instead of a button. */
  href?: string
  /** Trailing glyph that nudges on hover. */
  trailingIcon?: IconName
  leadingIcon?: IconName
  newTab?: boolean
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  href,
  trailingIcon,
  leadingIcon,
  newTab,
  ...rest
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className)
  const iconSize = size === 'lg' ? 16 : 14

  const inner = (
    <>
      {leadingIcon && <Icon name={leadingIcon} size={iconSize} />}
      {children}
      {trailingIcon && (
        <Icon
          name={trailingIcon}
          size={iconSize}
          className="transition-transform duration-300 ease-[var(--ease-out-quint)] group-hover/btn:translate-x-0.5"
        />
      )}
    </>
  )

  if (href) {
    // `rest` has to reach the anchor too. Without this an `onClick` passed
    // alongside `href` is silently dropped, which is how a menu CTA ends up
    // navigating without closing the menu behind it.
    const { type: _type, ...anchorProps } = rest
    return (
      <a
        href={href}
        className={classes}
        {...(anchorProps as AnchorHTMLAttributes<HTMLAnchorElement>)}
        {...(newTab ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
      >
        {inner}
      </a>
    )
  }

  return (
    <button type="button" className={classes} {...rest}>
      {inner}
    </button>
  )
}
