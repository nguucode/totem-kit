import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'
import styles from './Divider.module.css'

export interface DividerProps extends ComponentProps<'hr'> {
  orientation?: 'horizontal' | 'vertical'
  /** Indents both ends so the line stops short of its container's edges. */
  inset?: boolean
  /** Line thickness: 1px, 2px, 4px. */
  size?: 'sm' | 'md' | 'lg'
  /** uiguideline calls this `variant`; renamed because `variant` means color here. */
  appearance?: 'solid' | 'dashed'
}

export function Divider({
  orientation = 'horizontal',
  inset = false,
  size = 'sm',
  appearance = 'solid',
  className,
  ...props
}: DividerProps) {
  return (
    <hr
      // <hr> is already role="separator" (horizontal). Only the vertical
      // case needs saying, or a screen reader announces the wrong axis.
      aria-orientation={orientation === 'vertical' ? 'vertical' : undefined}
      className={cn(
        styles.divider,
        styles[orientation],
        styles[size],
        styles[appearance],
        inset && styles.inset,
        className,
      )}
      {...props}
    />
  )
}
