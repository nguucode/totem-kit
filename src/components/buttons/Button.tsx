import type { ComponentProps, ReactNode, Ref } from 'react'
import { Button as BaseButton } from '@base-ui/react/button'
import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { cn } from '@/lib/utils'
import styles from './Button.module.css'

interface ButtonBaseProps extends Omit<ComponentProps<'button'>, 'ref'> {
  ref?: Ref<HTMLElement>
  variant?: 'primary' | 'accent' | 'secondary' | 'destructive'
  appearance?: 'contained' | 'outlined' | 'ghost'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  startIcon?: ReactNode
  endIcon?: ReactNode
  /** Shows a spinner, blocks clicks and keeps focus, so a keyboard user is not dropped. On a link it behaves as disabled. */
  isLoading?: boolean
  isFullWidth?: boolean
  /** Renders an `<a>` instead of a `<button>`: it navigates, it does not act. */
  href?: string
  target?: string
  rel?: string
  /** Replaces the rendered element, e.g. a router's `<Link />`. */
  render?: useRender.RenderProp
}

/** An icon-only button has no text to name it, so `aria-label` is required. */
export type ButtonProps =
  | (ButtonBaseProps & { isIconOnly?: false })
  | (ButtonBaseProps & { isIconOnly: true; 'aria-label': string })

export function Button({
  variant = 'primary',
  appearance = 'contained',
  size = 'md',
  startIcon,
  endIcon,
  isLoading = false,
  isFullWidth = false,
  isIconOnly = false,
  href,
  target,
  rel,
  render,
  disabled,
  type = 'button',
  className,
  children,
  ...props
}: ButtonProps) {
  const content = (
    <>
      {isLoading && <span className={styles.spinner} aria-hidden="true" />}
      {startIcon && (
        <span className={styles.icon} aria-hidden="true">
          {startIcon}
        </span>
      )}
      {children}
      {endIcon && (
        <span className={styles.icon} aria-hidden="true">
          {endIcon}
        </span>
      )}
    </>
  )
  const own = {
    className: cn(
      styles.button,
      styles[variant],
      styles[appearance],
      styles[size],
      isIconOnly && styles.iconOnly,
      isFullWidth && styles.fullWidth,
      isLoading && styles.loading,
      className,
    ),
    'aria-busy': isLoading || undefined,
    children: content,
  }

  // `href` or `render` means someone else's element — an <a>, a router's
  // Link — whose semantics must survive: Base UI's Button would stamp
  // role="button" on it. Props are merged onto it instead.
  //
  // Disabled (or loading, which a link cannot show) drops the render
  // element too and leaves a bare <a> with no href: removing the href is
  // the only thing that stops an <a> navigating, and a router's Link keeps
  // its own. aria-disabled says why it is inert.
  const inert = disabled || isLoading
  const custom = useRender({
    enabled: href !== undefined || render !== undefined,
    render: inert ? undefined : render,
    defaultTagName: 'a',
    props: mergeProps<'a'>(own, props as ComponentProps<'a'>, {
      ...(!inert && href !== undefined && { href }),
      target,
      rel,
      'aria-disabled': inert || undefined,
    }),
  })
  if (custom) return custom

  return (
    <BaseButton
      {...props}
      {...own}
      type={type}
      disabled={disabled || isLoading}
      focusableWhenDisabled={isLoading}
    />
  )
}
