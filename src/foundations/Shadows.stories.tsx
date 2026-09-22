import type { Meta, StoryObj } from '@storybook/react-vite'
import docs from './docs.module.css'

const TOKENS = ['shadow-sm', 'shadow-md', 'shadow-lg', 'shadow-xl'] as const

function ShadowScale() {
  return (
    <div className={docs.rowWrap} style={{ padding: 'var(--space-8)', gap: 'var(--space-8)' }}>
      {TOKENS.map((token) => (
        <div
          key={token}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-3)' }}
        >
          <div
            style={{
              height: '5rem',
              width: '5rem',
              borderRadius: 'var(--radius-panel)',
              background: 'var(--card)',
              boxShadow: `var(--${token})`,
            }}
          />
          <span className={docs.caption}>--{token}</span>
        </div>
      ))}
    </div>
  )
}

// Narrative and prose live in Shadows.mdx.
const meta = {
  title: 'Foundations/Shadows',
  render: () => <ShadowScale />,
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Scale: Story = {}
