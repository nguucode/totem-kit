import type { Meta, StoryObj } from '@storybook/react-vite'
import docs from './docs.module.css'

// Every step is `calc(0.25rem * n * var(--scaling))`, so the whole scale moves
// with one multiplier.
const STEPS = [0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64]

function SpacingScale() {
  return (
    <div className={docs.stack}>
      {STEPS.map((step) => (
        <div key={step} className={docs.row}>
          <span className={docs.caption} style={{ width: '2.5rem', flexShrink: 0 }}>
            {step}
          </span>
          <div
            style={{
              height: '1rem',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--primary)',
              width: `calc(0.25rem * ${step} * var(--scaling))`,
            }}
          />
        </div>
      ))}
    </div>
  )
}

// Narrative and prose live in Spacing.mdx.
const meta = {
  title: 'Foundations/Spacing',
  render: () => <SpacingScale />,
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Scale: Story = {}
