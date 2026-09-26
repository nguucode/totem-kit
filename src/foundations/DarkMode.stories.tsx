import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@/components/buttons/Button'
import { TextInput } from '@/components/inputs/TextInput'
import { Theme } from '@/theme/Theme'
import docs from './docs.module.css'

const PAIRS = [
  ['background', 'foreground'],
  ['card', 'card-foreground'],
  ['primary', 'primary-foreground'],
  ['muted', 'muted-foreground'],
  ['destructive', 'destructive-foreground'],
] as const

function Swatches() {
  return (
    <div className={docs.stack}>
      {PAIRS.map(([bg, fg]) => (
        <div
          key={bg}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            padding: 'var(--space-2) var(--space-3)',
            background: `var(--${bg})`,
            color: `var(--${fg})`,
          }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-body-sm)' }}>--{bg}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-body-sm)', opacity: 0.7 }}>--{fg}</span>
        </div>
      ))}
    </div>
  )
}

function Sample() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', background: 'var(--background)', color: 'var(--foreground)', padding: 'var(--space-4)' }}>
      <Swatches />
      <TextInput label="Email" placeholder="you@example.com" />
      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
        <Button>Save</Button>
        <Button variant="destructive">Delete</Button>
        <Button variant="secondary" appearance="outlined">Cancel</Button>
      </div>
    </div>
  )
}

// Narrative and prose live in DarkMode.mdx.
const meta = {
  title: 'Foundations/Dark mode',
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const SideBySide: Story = {
  name: 'Side by side',
  render: () => (
    <div className={docs.gridHalves} style={{ gap: 'var(--space-4)' }}>
      <Theme appearance="light" style={{ overflow: 'hidden', borderRadius: 'var(--radius-panel)', border: '1px solid var(--border)' }}>
        <Sample />
      </Theme>
      <Theme appearance="dark" style={{ overflow: 'hidden', borderRadius: 'var(--radius-panel)', border: '1px solid var(--border)' }}>
        <Sample />
      </Theme>
    </div>
  ),
}
