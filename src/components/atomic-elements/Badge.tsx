import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import styles from './Badge.module.css'

export interface BadgeProps extends Omit<ComponentProps<'span'>, 'children'> {
  count?: number
  variant?: 'primary' | 'accent' | 'secondary' | 'destructive'
  size?: 'sm' | 'md'
  /** A dot with no number: "something new", not "how many". */
  isDot?: boolean
  /** Counts above this show as `maxCount+`. */
  maxCount?: number
  /** Pins the badge to a corner of `children` instead of sitting inline. */
  isFloating?: boolean
  floatingPlacement?: 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end'
  /** The element a floating badge is pinned to. */
  children?: ReactNode
}

export function Badge({
  count,
  variant = 'primary',
  size = 'md',
  isDot = false,
  maxCount,
  isFloating = false,
  floatingPlacement = 'top-end',
  children,
  className,
  ...props
}: BadgeProps) {
  const hasBadge = isDot || count !== undefined
  const badge = hasBadge && (
    <span
      // A labelled badge is an image of a state: a plain span may not carry
      // aria-label. An unlabelled dot says nothing, and a floating badge sits
      // outside the element it describes, so both are hidden — the meaning
      // belongs in the anchor's own name.
      role={props['aria-label'] ? 'img' : undefined}
      aria-hidden={!props['aria-label'] && (isDot || isFloating) ? true : undefined}
      className={cn(
        styles.badge,
        styles[variant],
        styles[size],
        isDot && styles.dot,
        isFloating && [styles.floating, styles[floatingPlacement]],
        className,
      )}
      {...props}
    >
      {isDot ? null : maxCount !== undefined && count! > maxCount ? `${maxCount}+` : count}
    </span>
  )

  if (children === undefined) return badge
  return (
    <span className={styles.anchor}>
      {children}
      {badge}
    </span>
  )
}
