import { Slot } from 'radix-ui'
import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export type Appearance = 'light' | 'dark' | 'inherit'

export type Radius = 'none' | 'small' | 'medium' | 'large' | 'full'

/**
 * Each preset scales the whole radius scale. Only `full` raises
 * `--radius-full`, which is what lets controls opt into a pill while fields
 * and panels keep their step.
 */
const RADIUS_PRESETS: Record<Radius, Record<string, string>> = {
  none: { 'radius-factor': '0', 'radius-full': '0px' },
  small: { 'radius-factor': '0.5', 'radius-full': '0px' },
  medium: { 'radius-factor': '1', 'radius-full': '0px' },
  large: { 'radius-factor': '1.5', 'radius-full': '0px' },
  full: { 'radius-factor': '1.5', 'radius-full': '9999px' },
}

export interface ThemeProps extends HTMLAttributes<HTMLDivElement> {
  /** `inherit` (default) leaves the surrounding appearance alone. */
  appearance?: Appearance
  /** Rescales rounding for this scope. Inherits when omitted. */
  radius?: Radius
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
  ({ appearance = 'inherit', radius, tokens, asChild, className, style, ...props }, ref) => {
    const Comp = asChild ? Slot.Root : 'div'
    // `tokens` is applied last so an explicit --radius-factor can override
    // whatever preset `radius` selected.
    const resolved = { ...(radius && RADIUS_PRESETS[radius]), ...tokens }
    return (
      <Comp
        ref={ref}
        className={cn(appearance !== 'inherit' && appearance, className)}
        style={{ ...tokensToStyle(resolved), ...style } as CSSProperties}
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
