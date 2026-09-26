import type { ComponentProps, MouseEventHandler } from 'react'
import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { cn } from '@/lib/utils'
import styles from './Card.module.css'

export interface CardProps extends Omit<ComponentProps<'div'>, 'onClick'> {
  /** Padding and the gap between children. */
  size?: 'xs' | 'sm' | 'md' | 'lg'
  appearance?: 'elevated' | 'outline' | 'filled' | 'unstyled'
  /** How children flow: stacked, or side by side (e.g. media and text). */
  orientation?: 'vertical' | 'horizontal'
  isRounded?: boolean
  hasBorder?: boolean
  /** Makes the whole card a `<button>`. Its content must then be non-interactive. */
  onClick?: MouseEventHandler<HTMLElement>
  /** Replaces the element — `<a href>` or a router's Link for a card that navigates. */
  render?: useRender.RenderProp
}

export function Card({
  size = 'sm',
  appearance = 'elevated',
  orientation = 'vertical',
  isRounded = true,
  hasBorder = true,
  onClick,
  render,
  className,
  ...props
}: CardProps) {
  const interactive = onClick !== undefined || render !== undefined
  return useRender({
    render,
    defaultTagName: onClick ? 'button' : 'div',
    props: mergeProps<'div'>(
      {
        className: cn(
          styles.card,
          styles[size],
          styles[appearance],
          styles[orientation],
          isRounded && styles.rounded,
          hasBorder && appearance !== 'unstyled' && styles.bordered,
          interactive && styles.interactive,
          className,
        ),
        ...(onClick && { type: 'button', onClick }),
      } as ComponentProps<'div'>,
      props,
    ),
  })
}
