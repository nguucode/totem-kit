import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Button } from '@/components/actions/Button'
import { TextInput } from '@/components/inputs/TextInput'
import { Theme, type Radius as RadiusPreset } from '@/theme/Theme'

const STEPS = ['radius-sm', 'radius-md', 'radius-lg', 'radius-xl'] as const

function StepScale() {
  return (
    <div className="flex flex-wrap items-end gap-6">
      {STEPS.map((token) => (
        <div key={token} className="flex flex-col items-center gap-2">
          <div className="h-16 w-16 bg-primary" style={{ borderRadius: `var(--${token})` }} />
          <span className="font-mono text-xs text-muted-foreground">--{token}</span>
        </div>
      ))}
    </div>
  )
}

const INTENTS = [
  { token: 'radius-control', label: 'control', note: 'Button, badge' },
  { token: 'radius-field', label: 'field', note: 'Input, textarea' },
  { token: 'radius-panel', label: 'panel', note: 'Card, dialog' },
] as const

function Intents() {
  return (
    <div className="flex flex-wrap items-end gap-6">
      {INTENTS.map(({ token, label, note }) => (
        <div key={token} className="flex flex-col items-center gap-2">
          <div
            className="flex h-16 w-28 items-center justify-center bg-secondary text-sm text-secondary-foreground"
            style={{ borderRadius: `var(--${token})` }}
          >
            {label}
          </div>
          <span className="font-mono text-xs text-muted-foreground">--{token}</span>
          <span className="text-xs text-muted-foreground">{note}</span>
        </div>
      ))}
    </div>
  )
}

const PRESETS: RadiusPreset[] = ['none', 'small', 'medium', 'large', 'full']

function PresetRow({ preset }: { preset: RadiusPreset }) {
  return (
    <Theme radius={preset} className="flex flex-col gap-3">
      <span className="font-mono text-xs text-muted-foreground">radius="{preset}"</span>
      <div className="flex flex-wrap items-center gap-3">
        <Button>Button</Button>
        <TextInput placeholder="Input" className="w-40" />
        <div className="rounded-panel border border-border bg-card px-4 py-2 text-sm text-card-foreground">
          Panel
        </div>
      </div>
    </Theme>
  )
}

// Narrative and prose live in Radius.mdx.
const meta = {
  title: 'Foundations/Radius',
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Presets: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {PRESETS.map((preset) => (
        <PresetRow key={preset} preset={preset} />
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    const px = (el: Element) => Number.parseFloat(getComputedStyle(el).borderRadius)
    const scopeFor = (preset: string) =>
      canvas.getByText(`radius="${preset}"`).parentElement as HTMLElement
    const parts = (preset: string) => {
      const scope = scopeFor(preset)
      return {
        control: px(scope.querySelector('button')!),
        field: px(scope.querySelector('input')!),
        panel: px(scope.querySelector('.rounded-panel')!),
      }
    }

    // none flattens everything.
    const none = parts('none')
    await expect(none.control).toBe(0)
    await expect(none.field).toBe(0)
    await expect(none.panel).toBe(0)

    const large = parts('large')
    const full = parts('full')

    // full pills the control...
    await expect(full.control).toBeGreaterThan(1000)
    // ...but a field must never reach a pill. The input is 40px tall, so
    // anything at or above 20px is one.
    await expect(full.field).toBeLessThan(20)
    await expect(full.panel).toBeLessThan(1000)
    // ...and it still has to be a step up from large, or "full" would just
    // be "large with a pill button".
    await expect(full.field).toBeGreaterThan(large.field)
    await expect(full.panel).toBeGreaterThan(large.panel)
  },
}

export const Steps: Story = {
  render: () => <StepScale />,
}

export const Intent: Story = {
  render: () => <Intents />,
}
