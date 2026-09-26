import type { ComponentProps, CSSProperties } from 'react'
import { cn } from '@/lib/utils'
import styles from './Skeleton.module.css'

export interface SkeletonProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** A number is pixels; a string is any CSS length. */
  width?: string | number
  height?: string | number
  appearance?: 'circle' | 'square' | 'rounded'
  /** Several lines of text: stacked bars, the last one shorter. A circle's rows are rounded bars. */
  rows?: number
  isFullWidth?: boolean
  /** A gentle pulse. Off by default: many pulsing shapes are noise. */
  hasAnimation?: boolean
}

const length = (v: string | number | undefined) => (typeof v === 'number' ? `${v}px` : v)

/**
 * A placeholder in the shape of content that is still loading. Decorative:
 * put `aria-busy` on the region it stands in for, and announce the load
 * elsewhere if it matters.
 */
export function Skeleton({
  width,
  height,
  appearance = 'square',
  rows,
  isFullWidth = false,
  hasAnimation = false,
  className,
  style,
  ...props
}: SkeletonProps) {
  const inlineSize = isFullWidth ? '100%' : length(width)

  if (rows && rows > 1) {
    // Lines of text are bars: a circle would stack into a column of dots.
    const line = cn(styles.bone, styles[appearance === 'circle' ? 'rounded' : appearance], styles.line, hasAnimation && styles.animated)
    return (
      <div aria-hidden="true" className={cn(styles.rows, className)} style={{ inlineSize, ...style } as CSSProperties} {...props}>
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className={line} style={{ blockSize: length(height) }} />
        ))}
      </div>
    )
  }
  // A circle takes its height from its width, so `height` is ignored.
  const blockSize = appearance === 'circle' ? undefined : length(height)
  return (
    <div
      aria-hidden="true"
      className={cn(styles.bone, styles[appearance], hasAnimation && styles.animated, className)}
      style={{ inlineSize, blockSize, ...style } as CSSProperties}
      {...props}
    />
  )
}
