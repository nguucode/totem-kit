import type { ComponentProps, CSSProperties } from 'react'
import { cn } from '@/lib/utils'
import styles from './Skeleton.module.css'

export interface SkeletonProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** A number is pixels; a string is any CSS length. */
  width?: string | number
  height?: string | number
  appearance?: 'circle' | 'square' | 'rounded'
  /** Several lines of text: stacked bars, the last one shorter. */
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
  const shape = cn(styles.bone, styles[appearance], hasAnimation && styles.animated)
  const size = { inlineSize: isFullWidth ? '100%' : length(width), blockSize: length(height) } as CSSProperties

  if (rows && rows > 1) {
    return (
      <div aria-hidden="true" className={cn(styles.rows, className)} style={{ ...size, blockSize: undefined, ...style }} {...props}>
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className={cn(shape, styles.line)} style={{ blockSize: length(height) }} />
        ))}
      </div>
    )
  }
  return <div aria-hidden="true" className={cn(shape, className)} style={{ ...size, ...style }} {...props} />
}
