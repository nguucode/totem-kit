import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Button } from '@/components/buttons/Button'
import { TextInput } from '@/components/inputs/TextInput'
import { Theme, type Radius as RadiusPreset } from '@/theme/Theme'
import docs from './docs.module.css'

const COL: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 'var(--space-2)',
}

const STEPS = ['radius-sm', 'radius-md', 'radius-lg', 'radius-xl'] as const

function StepScale() {
  return (
    <div className={docs.rowWrap}>
      {STEPS.map((token) => (
        <div key={token} style={COL}>
          <div
            style={{
              height: '4rem',
              width: '4rem',
              background: 'var(--primary)',
              borderRadius: `var(--${token})`,
            }}
          />
          <span className={docs.caption}>--{token}</span>
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
    <div className={docs.rowWrap}>
      {INTENTS.map(({ token, label, note }) => (
        <div key={token} style={COL}>
          <div
            style={{
              display: 'flex',
              height: '4rem',
              width: '7rem',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--secondary)',
              color: 'var(--secondary-foreground)',
              fontSize: 'var(--text-body)',
              borderRadius: `var(--${token})`,
            }}
          >
            {label}
          </div>
          <span className={docs.caption}>--{token}</span>
          <span className={docs.caption}>{note}</span>
        </div>
      ))}
    </div>
  )
}

const PRESETS: RadiusPreset[] = ['none', 'small', 'medium', 'large', 'full']

function PresetRow({ preset }: { preset: RadiusPreset }) {
  return (
    <Theme radius={preset} className={docs.stack}>
      <span className={docs.caption}>radius="{preset}"</span>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-3)' }}>
        <Button>Button</Button>
        <div style={{ width: '10rem' }}>
          <TextInput aria-label="Input" placeholder="Input" isFullWidth />
        </div>
        <div
          data-panel
          style={{
            border: '1px solid var(--border)',
            background: 'var(--card)',
            color: 'var(--card-foreground)',
            padding: 'var(--space-2) var(--space-4)',
            fontSize: 'var(--text-body)',
            borderRadius: 'var(--radius-panel)',
          }}
        >
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
    <div className={docs.stackWide}>
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
        // The field's corner is on the box that draws it, not the bare <input>.
        field: px(scope.querySelector('input')!.parentElement!),
        panel: px(scope.querySelector('[data-panel]')!),
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
