import { forwardRef, useId, type InputHTMLAttributes, type MouseEvent } from 'react'
import { cn } from '@/lib/utils'
import styles from './TextInput.module.css'

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  /** Shown below the input; replaced by `error` when set. */
  helperText?: string
  /** Puts the input in an invalid state and shows this message instead of `helperText`. */
  error?: string
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, label, helperText, error, required, id, ...props }, ref) => {
    const generatedId = useId()
    const inputId = id ?? generatedId
    const helperId = `${inputId}-helper`
    const errorId = `${inputId}-error`
    const describedBy =
      [error ? errorId : null, !error && helperText ? helperId : null].filter(Boolean).join(' ') ||
      undefined

    return (
      <div className={styles.field}>
        {label && (
          <label
            htmlFor={inputId}
            className={styles.label}
            onMouseDown={preventSelectionOnDoubleClick}
          >
            {label}
            {required && (
              <span aria-hidden="true" className={styles.required}>
                *
              </span>
            )}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={!!error || undefined}
          aria-describedby={describedBy}
          className={cn(styles.input, error && styles.invalid, className)}
          {...props}
        />
        {error ? (
          <p id={errorId} className={styles.error}>
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className={styles.helper}>
            {helperText}
          </p>
        ) : null}
      </div>
    )
  },
)
TextInput.displayName = 'TextInput'

// Double-clicking a label otherwise selects its text, which reads as a
// glitch when the click was meant for the field. Clicks that land on a
// nested control are left alone.
function preventSelectionOnDoubleClick(event: MouseEvent<HTMLLabelElement>) {
  if ((event.target as HTMLElement).closest('button, input, select, textarea')) return
  if (event.detail > 1) event.preventDefault()
}
