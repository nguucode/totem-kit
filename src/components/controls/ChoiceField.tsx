import type { ReactNode } from 'react'
import { Field } from '@base-ui/react/field'
import { cn } from '@/lib/utils'
import styles from './ChoiceField.module.css'

export type ValidationState = 'default' | 'success' | 'error'

/**
 * The shared classes, for controls that lay out their own field (Radio's
 * group). `control` goes on the control itself: first-line alignment,
 * focus ring, 44px touch target.
 */
export const choiceStyles = styles

export interface ChoiceFieldProps {
  /** The control: a Checkbox or Switch root, carrying `choiceStyles.control`. */
  children: ReactNode
  label?: ReactNode
  helperText?: ReactNode
  validationState?: ValidationState
  required?: boolean
  disabled?: boolean
  name?: string
  className?: string
}

/**
 * The label, helper text and validation wiring shared by Checkbox and Switch.
 * Base UI's Field does the ARIA: the label wraps the control, the helper is
 * its description, and `invalid` reaches the control as aria-invalid.
 * Internal — not exported from the package.
 */
export function ChoiceField({
  children,
  label,
  helperText,
  validationState = 'default',
  required,
  disabled,
  name,
  className,
}: ChoiceFieldProps) {
  return (
    <Field.Root
      name={name}
      disabled={disabled}
      invalid={validationState === 'error'}
      className={cn(styles.field, styles[validationState], className)}
    >
      <Field.Label className={styles.label}>
        {children}
        {label && (
          <span>
            {label}
            {required && (
              <span aria-hidden="true" className={styles.required}>
                *
              </span>
            )}
          </span>
        )}
      </Field.Label>
      {helperText && <Field.Description className={styles.helper}>{helperText}</Field.Description>}
    </Field.Root>
  )
}
