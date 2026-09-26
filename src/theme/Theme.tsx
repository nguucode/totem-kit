import type { ComponentProps, CSSProperties } from 'react'
import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { cn } from '@/lib/utils'
/* The palette names come out of the same build as the [data-accent] /
   [data-gray] blocks they have to match, so a hue cannot exist in one and
   not the other. Re-exported here because this is where consumers look. */
import type { AccentColor, GrayColor } from './palettes'

export { ACCENT_COLORS, GRAY_COLORS } from './palettes'
export type { AccentColor, GrayColor }

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

export const SCALINGS = ['90%', '95%', '100%', '105%', '110%'] as const
export type Scaling = (typeof SCALINGS)[number]

export interface ThemeProps extends ComponentProps<'div'> {
  /** `inherit` (default) leaves the surrounding appearance alone. */
  appearance?: Appearance
  /**
   * The brand hue. Drives `--primary` and `--ring` — not the token named
   * `--accent`, which is a subtle surface and a different thing entirely.
   */
  accentColor?: AccentColor
  /** The neutral ramp behind backgrounds, text, borders and muted surfaces. */
  grayColor?: GrayColor
  /** Multiplies spacing and the type scale. */
  scaling?: Scaling
  /** Rescales rounding for this scope. Inherits when omitted. */
  radius?: Radius
  /**
   * Token overrides for this scope, without the `--` prefix:
   * `{ radius: '1rem', primary: 'oklch(0.55 0.2 260)' }`. Any custom property
   * works, including ones Zweihänder doesn't define.
   */
  tokens?: Record<string, string>
  /** Apply to this element instead of rendering a wrapper `<div>`. */
  render?: useRender.RenderProp
}

export function Theme({
  appearance = 'inherit',
  accentColor,
  grayColor,
  scaling,
  radius,
  tokens,
  render,
  className,
  style,
  ...props
}: ThemeProps) {
  // `tokens` is applied last so an explicit --radius-factor or --scaling can
  // override whatever preset selected it.
  const resolved = {
    ...(radius && RADIUS_PRESETS[radius]),
    ...(scaling && { scaling: String(Number.parseInt(scaling, 10) / 100) }),
    ...tokens,
  }
  return useRender({
    render,
    defaultTagName: 'div',
    props: mergeProps<'div'>(
      {
        // Attributes rather than inline styles: an accent is a whole palette
        // of six values, and [data-accent] keeps them in the stylesheet
        // instead of restating them on every scope.
        'data-accent': accentColor,
        'data-gray': grayColor,
        className: cn(appearance !== 'inherit' && appearance, className),
        style: { ...tokensToStyle(resolved), ...style } as CSSProperties,
      } as ComponentProps<'div'>,
      props,
    ),
  })
}

function tokensToStyle(tokens: Record<string, string> | undefined) {
  if (!tokens) return undefined
  return Object.fromEntries(
    Object.entries(tokens).map(([name, value]) => [
      name.startsWith('--') ? name : `--${name}`,
      value,
    ]),
  )
}
