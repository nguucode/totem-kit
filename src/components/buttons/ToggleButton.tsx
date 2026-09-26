import type { MouseEventHandler, ReactNode, Ref } from 'react'
import { Toggle } from '@base-ui/react/toggle'
import { cn } from '@/lib/utils'
import { Button, type ButtonProps } from './Button'
import styles from './ToggleButton.module.css'

interface ToggleButtonBaseProps {
  ref?: Ref<HTMLButtonElement>
  /** Colour of the pressed state. Unpressed is always neutral. */
  variant?: 'primary' | 'accent' | 'secondary' | 'destructive'
  /** Style of the pressed state. */
  appearance?: 'contained' | 'outlined' | 'ghost'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  startIcon?: ReactNode
  endIcon?: ReactNode
  isLoading?: boolean
  isFullWidth?: boolean
  disabled?: boolean
  /** Controlled pressed state (the spec's `isSelected`). */
  pressed?: boolean
  defaultPressed?: boolean
  onPressedChange?: (pressed: boolean) => void
  onClick?: MouseEventHandler<HTMLButtonElement>
  className?: string
  children?: ReactNode
  id?: string
  name?: string
  value?: string
  title?: string
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-describedby'?: string
}

/** An icon-only toggle has no text to name it, so `aria-label` is required. */
export type ToggleButtonProps =
  | (ToggleButtonBaseProps & { isIconOnly?: false })
  | (ToggleButtonBaseProps & { isIconOnly: true; 'aria-label': string })

export function ToggleButton({
  variant = 'primary',
  appearance = 'contained',
  size,
  startIcon,
  endIcon,
  isLoading,
  isFullWidth,
  isIconOnly,
  pressed,
  defaultPressed,
  onPressedChange,
  disabled,
  className,
  children,
  ...props
}: ToggleButtonProps) {
  return (
    <Toggle
      {...props}
      pressed={pressed}
      defaultPressed={defaultPressed}
      onPressedChange={onPressedChange ? (next) => onPressedChange(next) : undefined}
      disabled={disabled}
      render={(toggleProps, state) => {
        const buttonProps = {
          ...toggleProps,
          // Off is the same neutral button whatever the pressed style is, so
          // "on" is always the one that stands out.
          variant: state.pressed ? variant : 'secondary',
          appearance: state.pressed ? appearance : appearance === 'ghost' ? 'ghost' : 'outlined',
          size,
          startIcon,
          endIcon,
          isLoading,
          isFullWidth,
          // Its aria-label reached Toggle with the other props and comes back
          // in toggleProps, which is what Button's icon-only type asks for.
          isIconOnly,
          disabled,
          className: cn(state.pressed && appearance !== 'contained' && styles.tinted, className),
          children,
        } as ButtonProps
        return <Button {...buttonProps} />
      }}
    />
  )
}
