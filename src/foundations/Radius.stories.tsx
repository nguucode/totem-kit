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
    const radiusOf = (el: Element) => getComputedStyle(el).borderRadius
    const scopeFor = (preset: string) =>
      canvas.getByText(`radius="${preset}"`).parentElement as HTMLElement

    // none flattens everything.
    const none = scopeFor('none')
    await expect(radiusOf(none.querySelector('button')!)).toBe('0px')

    // full pills the button but must NOT round the text field the same way.
    const full = scopeFor('full')
    const button = radiusOf(full.querySelector('button')!)
    const field = radiusOf(full.querySelector('input')!)
    await expect(button).toBe('9999px')
    await expect(field).not.toBe('9999px')
  },
}

export const Steps: Story = {
  render: () => <StepScale />,
}

export const Intent: Story = {
  render: () => <Intents />,
}
