import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Button } from '@/components/actions/Button'
import { TextInput } from '@/components/inputs/TextInput'
import { Theme } from '@/theme/Theme'

function Panel({ label }: { label: string }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 text-card-foreground">
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

export const Appearance: Story = {
  render: () => (
    <div className="grid gap-4 sm:grid-cols-2">
      <Theme appearance="light" className="rounded-lg bg-background p-4">
        <Panel label="appearance=&quot;light&quot;" />
      </Theme>
      <Theme appearance="dark" className="rounded-lg bg-background p-4">
        <Panel label="appearance=&quot;dark&quot;" />
      </Theme>
    </div>
  ),
  play: async ({ canvas }) => {
    // A dark scope must resolve --background to the dark value while the
    // light scope beside it keeps the light one.
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
      <Theme className="rounded-lg p-4">
        <Panel label="default tokens" />
      </Theme>
      <Theme
        className="rounded-lg p-4"
        tokens={{ radius: '1.5rem', primary: 'oklch(0.55 0.2 264)' }}
      >
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
    <Theme appearance="dark" className="rounded-lg bg-background p-4">
      <div className="flex flex-col gap-4">
        <Panel label="dark page" />
        <Theme appearance="light" className="rounded-lg bg-background p-4">
          <Panel label="light island inside it" />
        </Theme>
      </div>
    </Theme>
  ),
  play: async ({ canvas }) => {
    const island = canvas.getByText('light island inside it').closest('.light')
    await expect(island).toBeInTheDocument()
    // The nested light scope re-declares the light values, so it wins over
    // the dark ancestor for anything reading --background.
    const value = getComputedStyle(island as HTMLElement).getPropertyValue('--background').trim()
    await expect(value).toBe('oklch(1 0 0)')
  },
}
