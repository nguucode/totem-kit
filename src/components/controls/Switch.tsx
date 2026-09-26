import type { ReactNode, Ref } from 'react'
import { Switch as BaseSwitch } from '@base-ui/react/switch'
import { cn } from '@/lib/utils'
import { ChoiceField, choiceStyles, type ValidationState } from './ChoiceField'
import styles from './Switch.module.css'

export interface SwitchProps {
  ref?: Ref<HTMLElement>
  /** Controlled state. */
  checked?: boolean
  /** Uncontrolled starting state (the spec's `defaultValue`). */
  defaultChecked?: boolean
  /** The spec's `onChange`. Base UI's event details are dropped. */
  onCheckedChange?: (checked: boolean) => void
  label?: ReactNode
  helperText?: ReactNode
  name?: string
  /** Submitted when on; "on" by default, like a checkbox. */
  value?: string
  size?: 'sm' | 'md' | 'lg'
  /** Colour of the on state. */
  variant?: 'primary' | 'accent' | 'secondary' | 'destructive'
  disabled?: boolean
  required?: boolean
  readOnly?: boolean
  validationState?: ValidationState
  id?: string
  className?: string
  'aria-label'?: string
}

export function Switch({
  label,
  helperText,
  name,
  size = 'md',
  variant = 'primary',
  disabled,
  required,
  validationState,
  className,
  onCheckedChange,
  ...props
}: SwitchProps) {
  return (
    <ChoiceField
      label={label}
      helperText={helperText}
      validationState={validationState}
      required={required}
      disabled={disabled}
      name={name}
      className={cn(styles[size], className)}
    >
      <BaseSwitch.Root
        {...props}
        required={required}
        onCheckedChange={onCheckedChange && ((next) => onCheckedChange(next))}
        className={cn(choiceStyles.control, styles.track, styles[variant])}
      >
        <BaseSwitch.Thumb className={styles.thumb} />
      </BaseSwitch.Root>
    </ChoiceField>
  )
}
