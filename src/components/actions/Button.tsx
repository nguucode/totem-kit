import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Slot } from '@/lib/slot'
import { cn } from '@/lib/utils'
import styles from './Button.module.css'

export type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link'
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Merge props onto the single child instead of rendering a `<button>`. */
  asChild?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref}
        className={cn(styles.button, styles[variant], styles[size], className)}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'
