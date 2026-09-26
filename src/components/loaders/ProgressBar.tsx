import type { ReactNode } from 'react'
import { Progress } from '@base-ui/react/progress'
import { cn } from '@/lib/utils'
import styles from './ProgressBar.module.css'

export interface ProgressBarProps extends Omit<Progress.Root.Props, 'value' | 'children' | 'className' | 'render'> {
  value?: number
  /** The spec's `maxValue`. */
  max?: number
  size?: 'sm' | 'md' | 'lg'
  isRounded?: boolean
  variant?: 'primary' | 'accent' | 'secondary' | 'destructive'
  /** Progress is happening but how much is unknown: a sliding bar. */
  isIndeterminate?: boolean
  /** Show the value ("70%") after the bar. */
  showValueLabel?: boolean
  /** A visible label above the bar; also its accessible name. */
  label?: ReactNode
  /** The accessible name when there is no visible `label`. */
  'aria-label'?: string
  className?: string
}

export function ProgressBar({
  value = 0,
  max = 100,
  size = 'md',
  isRounded = false,
  variant = 'primary',
  isIndeterminate = false,
  showValueLabel = false,
  label,
  className,
  'aria-label': ariaLabel,
  ...props
}: ProgressBarProps) {
  return (
    <Progress.Root
      {...props}
      value={isIndeterminate ? null : value}
      max={max}
      aria-label={label ? undefined : ariaLabel}
      className={cn(styles.root, styles[size], styles[variant], isRounded && styles.rounded, className)}
    >
      {label && <Progress.Label className={styles.label}>{label}</Progress.Label>}
      <div className={styles.row}>
        <Progress.Track className={styles.track}>
          <Progress.Indicator className={styles.indicator} />
        </Progress.Track>
        {showValueLabel && !isIndeterminate && <Progress.Value className={styles.value} />}
      </div>
    </Progress.Root>
  )
}
