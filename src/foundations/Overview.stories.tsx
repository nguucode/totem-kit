import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Button } from '@/components/actions/Button'
import { TextInput } from '@/components/inputs/TextInput'
import { ACCENT_COLORS, GRAY_COLORS, SCALINGS, Theme } from '@/theme/Theme'

function Panel({ label }: { label: string }) {
  return (
    <div className="flex flex-col gap-3 rounded-panel border border-border bg-card p-4 text-card-foreground">
      <span className="text-sm font-medium">{label}</span>
      <TextInput label="Email" placeholder="you@example.com" />
      <div className="flex gap-2">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
      </div>
    </div>
  )
}

// Narrative and prose live in Overview.mdx.
const meta = {
  title: 'Foundations/Overview',
  component: Theme,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Theme>

export default meta
type Story = StoryObj<typeof meta>

export const AccentColor: Story = {
  name: 'Accent color',
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {ACCENT_COLORS.map((accent) => (
          <Theme key={accent} accentColor={accent} asChild>
            <Button size="sm">{accent}</Button>
          </Theme>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        Every label above clears 4.5:1 on its own fill — the warm hues take dark
        labels rather than white.
      </p>
    </div>
  ),
  play: async ({ canvas }) => {
    const solid = (name: string) =>
      getComputedStyle(canvas.getByRole('button', { name })).backgroundColor
    // Changing the accent has to actually move --primary.
    await expect(solid('blue')).not.toBe(solid('red'))
  },
}

export const GrayColor: Story = {
  name: 'Gray color',
  render: () => (
    <div className="grid gap-3 sm:grid-cols-3">
      {GRAY_COLORS.map((gray) => (
        <Theme key={gray} grayColor={gray} appearance="dark" className="rounded-panel p-3">
          <div className="flex items-center justify-between rounded-field bg-background px-3 py-2">
            <span className="text-sm text-foreground">{gray}</span>
            <span className="text-sm text-muted-foreground">muted</span>
          </div>
        </Theme>
      ))}
    </div>
  ),
}

export const Scaling: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {SCALINGS.map((scaling) => (
        <Theme key={scaling} scaling={scaling} className="flex items-center gap-3">
          <span className="w-12 shrink-0 font-mono text-xs text-muted-foreground">{scaling}</span>
          <Button>Button</Button>
          <TextInput placeholder="Input" className="w-40" />
        </Theme>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    const h = (label: string) =>
      canvas.getByText(label).parentElement!.querySelector('button')!.getBoundingClientRect().height
    // Scaling drives --spacing, so the control height has to follow it.
    await expect(h('90%')).toBeLessThan(h('110%'))
  },
}

export const Appearance: Story = {
  render: () => (
    <div className="grid gap-4 sm:grid-cols-2">
      <Theme appearance="light" className="rounded-panel bg-background p-4">
        <Panel label="appearance=&quot;light&quot;" />
      </Theme>
      <Theme appearance="dark" className="rounded-panel bg-background p-4">
        <Panel label="appearance=&quot;dark&quot;" />
      </Theme>
    </div>
  ),
  play: async ({ canvas }) => {
    const [light, dark] = canvas.getAllByText(/appearance=/)
    const bg = (el: HTMLElement) =>
      getComputedStyle(el.closest('.light, .dark') as HTMLElement).getPropertyValue('--background')
    await expect(bg(light)).not.toBe(bg(dark))
  },
}

export const TokenOverride: Story = {
  name: 'Token override',
  render: () => (
    <div className="grid gap-4 sm:grid-cols-2">
      <Theme className="rounded-panel p-4">
        <Panel label="default tokens" />
      </Theme>
      <Theme className="rounded-panel p-4" tokens={{ radius: '1.5rem', primary: 'oklch(0.55 0.2 150)' }}>
        <Panel label="radius + primary overridden" />
      </Theme>
    </div>
  ),
  play: async ({ canvas }) => {
    const scope = canvas.getByText('radius + primary overridden').closest('div[style]')
    await expect(scope).toHaveStyle({ '--radius': '1.5rem' })
  },
}

export const Nested: Story = {
  render: () => (
    <Theme appearance="dark" className="rounded-panel bg-background p-4">
      <div className="flex flex-col gap-4">
        <Panel label="dark page" />
        <Theme appearance="light" className="rounded-panel bg-background p-4">
          <Panel label="light island inside it" />
        </Theme>
      </div>
    </Theme>
  ),
  play: async ({ canvas }) => {
    const island = canvas.getByText('light island inside it').closest('.light')
    await expect(island).toBeInTheDocument()
    const value = getComputedStyle(island as HTMLElement).getPropertyValue('--background').trim()
    await expect(value).toBe('oklch(1 0 0)')
  },
}
