import { Label } from 'radix-ui'
import { forwardRef, useId, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

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
      <div className="flex flex-col gap-1.5">
        {label && (
          <Label.Root htmlFor={inputId} className="text-body font-medium text-foreground">
            {label}
            {required && (
              <span aria-hidden="true" className="ml-0.5 text-destructive">
                *
              </span>
            )}
          </Label.Root>
        )}
        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={!!error || undefined}
          aria-describedby={describedBy}
          className={cn(
            'h-10 w-full rounded-field border border-input bg-background px-3 text-body text-foreground transition-colors',
            'placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-destructive focus-visible:ring-destructive',
            className,
          )}
          {...props}
        />
        {error ? (
          <p id={errorId} className="text-body text-destructive">
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-body text-muted-foreground">
            {helperText}
          </p>
        ) : null}
      </div>
    )
  },
)
TextInput.displayName = 'TextInput'
