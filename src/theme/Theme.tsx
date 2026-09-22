import { Slot } from 'radix-ui'
import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export type Appearance = 'light' | 'dark' | 'inherit'

export interface ThemeProps extends HTMLAttributes<HTMLDivElement> {
  /** `inherit` (default) leaves the surrounding appearance alone. */
  appearance?: Appearance
  /**
   * Token overrides for this scope, without the `--` prefix:
   * `{ radius: '1rem', primary: 'oklch(0.55 0.2 260)' }`. Any custom property
   * works, including ones Totem Kit doesn't define.
   */
  tokens?: Record<string, string>
  /** Apply to the single child instead of rendering a wrapper `<div>`. */
  asChild?: boolean
}

export const Theme = forwardRef<HTMLDivElement, ThemeProps>(
  ({ appearance = 'inherit', tokens, asChild, className, style, ...props }, ref) => {
    const Comp = asChild ? Slot.Root : 'div'
    return (
      <Comp
        ref={ref}
        className={cn(appearance !== 'inherit' && appearance, className)}
        style={{ ...tokensToStyle(tokens), ...style } as CSSProperties}
        {...props}
      />
    )
  },
)
Theme.displayName = 'Theme'

function tokensToStyle(tokens: Record<string, string> | undefined) {
  if (!tokens) return undefined
  return Object.fromEntries(
    Object.entries(tokens).map(([name, value]) => [
      name.startsWith('--') ? name : `--${name}`,
      value,
    ]),
  )
}
