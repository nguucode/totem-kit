import { useEffect, useState, type ComponentProps } from 'react'
import { cn } from '@/lib/utils'
import styles from './Spinner.module.css'

export interface SpinnerProps extends Omit<ComponentProps<'span'>, 'children'> {
  size?: 'sm' | 'md' | 'lg'
  /** Colour of the indicator. */
  variant?: 'primary' | 'secondary' | 'neutral'
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
  variant = 'neutral',
  delay = 0,
  value,
  isIndeterminate = false,
  label,
  className,
  ...props
}: SpinnerProps) {
  const [shown, setShown] = useState(delay <= 0)
  useEffect(() => {
    if (delay <= 0) return
    const timer = setTimeout(() => setShown(true), delay)
    return () => clearTimeout(timer)
  }, [delay])
  if (!shown) return null

  const determinate = value !== undefined && !isIndeterminate
  const clamped = determinate ? Math.min(100, Math.max(0, value)) : 0
  const name = label ?? 'Loading'

  return (
    <span
      // Indeterminate: a status that announces itself politely. Determinate:
      // a progressbar that says how far along it is.
      {...(determinate
        ? { role: 'progressbar', 'aria-valuenow': clamped, 'aria-valuemin': 0, 'aria-valuemax': 100 }
        : { role: 'status' })}
      aria-label={name}
      className={cn(styles.spinner, styles[size], styles[variant], className)}
      {...props}
    >
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
      {label && <span className={styles.label}>{label}</span>}
    </span>
  )
}
