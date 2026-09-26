import { useEffect, useState, type ComponentProps } from 'react'
import { cn } from '@/lib/utils'
import styles from './Spinner.module.css'

export interface SpinnerProps extends Omit<ComponentProps<'span'>, 'children'> {
  size?: 'sm' | 'md' | 'lg'
  /** Colour of the indicator. `accent` is the foreground, as on Button. */
  variant?: 'primary' | 'accent' | 'secondary'
  /** Wait this many milliseconds before showing, so a fast load never flashes a spinner. */
  delay?: number
  /** 0–100. Omit for an indeterminate, spinning indicator. */
  value?: number
  /** Spin even when `value` is given. */
  isIndeterminate?: boolean
  /** Shown under the indicator and used as its accessible name ("Loading" when omitted). */
  label?: string
}

// Circle of radius 10 in a 24-unit viewBox: the stroke scales with the size.
const R = 10
const C = 2 * Math.PI * R

export function Spinner({
  size = 'md',
  variant = 'accent',
  delay = 0,
  value,
  isIndeterminate = false,
  label,
  className,
  ...props
}: SpinnerProps) {
  const [elapsed, setElapsed] = useState(false)
  // Always after mount, even with no delay: the live region below has to be
  // in the page before its text arrives for the text to be announced.
  useEffect(() => {
    const timer = setTimeout(() => setElapsed(true), Math.max(0, delay))
    return () => clearTimeout(timer)
  }, [delay])

  const determinate = value !== undefined && !isIndeterminate
  const clamped = determinate ? Math.min(100, Math.max(0, value)) : 0
  const name = label || 'Loading'

  const indicator = (
    <svg viewBox="0 0 24 24" className={cn(styles.svg, !determinate && styles.spinning)} aria-hidden="true">
      <circle className={styles.track} cx="12" cy="12" r={R} />
      <circle
        className={styles.indicator}
        cx="12"
        cy="12"
        r={R}
        strokeDasharray={C}
        // Indeterminate shows a quarter arc; determinate shows the value.
        strokeDashoffset={determinate ? C * (1 - clamped / 100) : C * 0.75}
      />
    </svg>
  )

  // Determinate: a progressbar that says how far along it is.
  if (determinate) {
    if (delay > 0 && !elapsed) return null
    return (
      <span
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={name}
        className={cn(styles.spinner, styles[size], styles[variant], className)}
        {...props}
      >
        {indicator}
        {label && <span className={styles.label}>{label}</span>}
      </span>
    )
  }

  // Indeterminate: a polite live region that is in the page from the first
  // render, empty through the delay. Screen readers announce text inserted
  // into a live region that already exists, not a region that mounts full.
  return (
    <span
      role="status"
      aria-label={name}
      className={cn(styles.spinner, styles[size], styles[variant], className)}
      {...props}
    >
      {elapsed && (
        <>
          {indicator}
          <span className={label ? styles.label : styles.hiddenLabel}>{name}</span>
        </>
      )}
    </span>
  )
}
