import type { MouseEvent, ReactNode } from 'react'
import { Field } from '@base-ui/react/field'
import { cn } from '@/lib/utils'
import styles from './InputField.module.css'

export type ValidationState = 'default' | 'success' | 'error'
export type InputSize = 'sm' | 'md' | 'lg'
export type InputAppearance = 'outlined' | 'filled' | 'underlined' | 'unstyled'

/**
 * The shared classes. `box` goes on the element that draws the field (the
 * border, fill and focus ring); `control` on the <input>/<textarea> inside
 * it; `affix` on a prefix or suffix.
 */
export const inputStyles = styles

/** The class list for a field box of this size and appearance. */
export function boxClass(size: InputSize, appearance: InputAppearance) {
  return cn(styles.box, styles[size], styles[appearance])
}

/**
 * For the box's onMouseDown: a press on its padding or a prefix focuses the
 * control, as a click anywhere on a native field would. Presses on the
 * control itself or on a button in the box are left alone.
 */
export function focusControl(event: MouseEvent<HTMLElement>) {
  const target = event.target as HTMLElement
  if (target.closest('input, textarea, button')) return
  const control = event.currentTarget.querySelector<HTMLElement>('input, textarea')
  if (!control || control.matches(':disabled')) return
  event.preventDefault()
  control.focus()
}

export interface InputFieldProps {
  /** The field box, carrying `boxClass()`, with a Field.Control inside. */
  children: ReactNode
  label?: ReactNode
  helperText?: ReactNode
  validationState?: ValidationState
  required?: boolean
  disabled?: boolean
  name?: string
  isFullWidth?: boolean
  className?: string
}

/**
 * The label, helper text and validation wiring shared by Text Input,
 * Textarea, Search and Number Input. Base UI's Field associates the label
 * with the control, makes the helper its description and puts
 * aria-invalid on it. Internal — not exported from the package.
 */
export function InputField({
  children,
  label,
  helperText,
  validationState = 'default',
  required,
  disabled,
  name,
  isFullWidth,
  className,
}: InputFieldProps) {
  return (
    <Field.Root
      name={name}
      disabled={disabled}
      invalid={validationState === 'error'}
      className={cn(styles.field, styles[`state-${validationState}`], isFullWidth && styles.fullWidth, className)}
    >
      {label && (
        <Field.Label className={styles.label}>
          {label}
          {required && (
            <span aria-hidden="true" className={styles.required}>
              *
            </span>
          )}
        </Field.Label>
      )}
      {children}
      {helperText && <Field.Description className={styles.helper}>{helperText}</Field.Description>}
    </Field.Root>
  )
}
