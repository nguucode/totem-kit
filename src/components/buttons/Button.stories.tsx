import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { Icon } from '@/lib/icon'
import { ACCENT_COLORS, Theme } from '@/theme/Theme'
import { Button } from './Button'

const meta = {
  title: 'Components/Buttons/Button',
  component: Button,
  // Definition of done: a11y must pass as an error, ahead of the global switch in preview.tsx.
  parameters: { a11y: { test: 'error' } },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'accent', 'secondary', 'destructive'] },
    appearance: { control: 'inline-radio', options: ['contained', 'outlined', 'ghost'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'xl'] },
    startIcon: { control: false },
    endIcon: { control: false },
    render: { control: false },
  },
  args: { children: 'Button', onClick: fn() },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

const row = { display: 'flex', flexWrap: 'wrap' as const, gap: 'var(--space-3)', alignItems: 'center' }
const grid = { display: 'grid', gap: 'var(--space-3)' }

export const Default: Story = {
  play: async ({ canvas, userEvent, args }) => {
    const button = canvas.getByRole('button', { name: 'Button' })
    await expect(button).toHaveAttribute('type', 'button')
    await userEvent.click(button)
    await userEvent.keyboard('{Enter}')
    await userEvent.keyboard(' ')
    await expect(args.onClick).toHaveBeenCalledTimes(3)
  },
}

export const Matrix: Story = {
  render: (args) => (
    <div style={grid}>
      {(['contained', 'outlined', 'ghost'] as const).map((appearance) => (
        <div key={appearance} style={row}>
          {(['primary', 'accent', 'secondary', 'destructive'] as const).map((variant) => (
            <Button key={variant} {...args} variant={variant} appearance={appearance}>
              {variant}
            </Button>
          ))}
        </div>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div style={row}>
      {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Button key={size} {...args} size={size}>
          {size}
        </Button>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    const heights = ['sm', 'md', 'lg', 'xl'].map(
      (n) => canvas.getByRole('button', { name: n }).getBoundingClientRect().height,
    )
    await expect(heights).toEqual([32, 40, 48, 56])
  },
}

export const WithIcons: Story = {
  args: { startIcon: <Icon name="plus" />, endIcon: <Icon name="chevron-down" />, children: 'Add product' },
  play: async ({ canvas }) => {
    // Icons are decoration; the name is the label alone.
    await expect(canvas.getByRole('button')).toHaveAccessibleName('Add product')
  },
}

export const IconOnly: Story = {
  args: { isIconOnly: true, 'aria-label': 'Close', children: <Icon name="close" /> },
  render: (args) => (
    <div style={row}>
      {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Button key={size} {...args} size={size} appearance="ghost" />
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    const [sm] = canvas.getAllByRole('button', { name: 'Close' })
    const box = sm.getBoundingClientRect()
    await expect(box.width).toBe(box.height)
  },
}

export const Loading: Story = {
  args: { isLoading: true, children: 'Save' },
  play: async ({ canvas, userEvent, args }) => {
    const button = canvas.getByRole('button', { name: 'Save' })
    await expect(button).toHaveAttribute('aria-busy', 'true')
    await expect(button).toHaveAttribute('aria-disabled', 'true')
    // Still in the tab order, so focus is not dropped mid-submit...
    await userEvent.tab()
    await expect(button).toHaveFocus()
    // ...but it does not act.
    await userEvent.keyboard('{Enter}')
    await expect(args.onClick).not.toHaveBeenCalled()
  },
}

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Button' })).toBeDisabled()
  },
}

export const Href: Story = {
  args: { href: '#zweihander', children: 'Documentation' },
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: 'Documentation' })
    await expect(link).toHaveAttribute('href', '#zweihander')
    await expect(link).not.toHaveAttribute('type')
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument()

    // Styling a link as a Button must not take away the hand the browser
    // gives every other link. Compared against a bare <a href> rather than
    // the literal 'pointer', so overriding --cursor-link keeps this honest.
    const bare = document.createElement('a')
    bare.href = '#'
    document.body.append(bare)
    await expect(getComputedStyle(link).cursor).toBe(getComputedStyle(bare).cursor)
    bare.remove()
  },
}

export const DisabledHref: Story = {
  args: { href: '#zweihander', disabled: true, children: 'Documentation' },
  play: async ({ canvasElement }) => {
    // No href is what actually stops an <a> navigating.
    const a = canvasElement.querySelector('a')!
    await expect(a).not.toHaveAttribute('href')
    await expect(a).toHaveAttribute('aria-disabled', 'true')
  },
}

/** A router's Link, or any element: props and styles merge onto it. */
export const Render: Story = {
  args: { render: <a href="#settings" />, children: 'Settings', variant: 'secondary' },
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: 'Settings' })
    // The render element's own href survives.
    await expect(link).toHaveAttribute('href', '#settings')
    await expect(link).not.toHaveAttribute('role')
  },
}

export const DisabledRender: Story = {
  args: { render: <a href="#settings" />, disabled: true, children: 'Settings' },
  play: async ({ canvasElement }) => {
    // The render element's own href would still navigate from the keyboard,
    // so a disabled render drops it.
    const a = canvasElement.querySelector('a')!
    await expect(a).not.toHaveAttribute('href')
    await expect(a).toHaveAttribute('aria-disabled', 'true')
  },
}

export const FullWidth: Story = {
  args: { isFullWidth: true },
  render: (args) => (
    <div style={{ inlineSize: '20rem' }}>
      <Button {...args} />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button').getBoundingClientRect().width).toBe(320)
  },
}

/**
 * Every state of every variant × appearance, under all seventeen accents,
 * in both modes, measured: the label must clear 4.5:1 on its fill at rest,
 * on hover and when pressed. The colours are read back from the button's
 * own state properties, resolved by the browser and composited over the
 * page, so this measures the CSS that ships rather than a copy of it.
 */
export const StateContrast: Story = {
  parameters: { a11y: { test: 'off' } },
  render: () => (
    <div>
      {(['light', 'dark'] as const).map((mode) => (
        <Theme key={mode} appearance={mode} style={{ background: 'var(--background)', padding: 8 }}>
          {ACCENT_COLORS.map((accent) => (
            <Theme key={accent} accentColor={accent} style={{ display: 'flex', gap: 4 }}>
              {(['primary', 'accent', 'secondary', 'destructive'] as const).flatMap((variant) =>
                (['contained', 'outlined', 'ghost'] as const).map((appearance) => (
                  <Button
                    key={variant + appearance}
                    size="sm"
                    variant={variant}
                    appearance={appearance}
                    data-audit={`${mode} ${accent} ${variant} ${appearance}`}
                  >
                    Aa
                  </Button>
                )),
              )}
            </Theme>
          ))}
        </Theme>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const ctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true })!
    // Resolve any CSS colour (oklch, color-mix, alpha) to sRGB, composited
    // over the page colour, by painting it.
    const rgb = (color: string, over?: string) => {
      ctx.clearRect(0, 0, 1, 1)
      if (over) {
        ctx.fillStyle = over
        ctx.fillRect(0, 0, 1, 1)
      }
      ctx.fillStyle = color
      ctx.fillRect(0, 0, 1, 1)
      return [...ctx.getImageData(0, 0, 1, 1).data.slice(0, 3)]
    }
    const lum = ([r, g, b]: number[]) =>
      [r, g, b]
        .map((c) => c / 255)
        .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
        .reduce((sum, c, i) => sum + c * [0.2126, 0.7152, 0.0722][i], 0)
    const ratio = (a: number[], b: number[]) => {
      const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m)
      return (x + 0.05) / (y + 0.05)
    }

    const failures: string[] = []
    for (const button of canvasElement.querySelectorAll<HTMLElement>('[data-audit]')) {
      const probe = document.createElement('span')
      button.append(probe)
      const page = getComputedStyle(button.parentElement!.parentElement!).backgroundColor
      for (const state of ['', '-hover', '-active']) {
        probe.style.background = `var(--button-bg${state})`
        probe.style.color = `var(--button-fg${state})`
        const { backgroundColor, color } = getComputedStyle(probe)
        const bg = rgb(backgroundColor, page)
        const value = ratio(rgb(color, rgb(backgroundColor, page).length ? `rgb(${bg})` : page), bg)
        if (value < 4.5) failures.push(`${button.dataset.audit}${state || ' rest'}: ${value.toFixed(2)}`)
      }
      probe.remove()
    }
    await expect(failures).toEqual([])
  },
}
