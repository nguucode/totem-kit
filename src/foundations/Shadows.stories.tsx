import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Theme } from '@/theme/Theme'
import docs from './docs.module.css'

const STEPS = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const

function Swatch({ step }: { step: string }) {
  return (
    // The caption clears the largest step's reach rather than sitting inside
    // it: 2xl extends about 3rem below the box, so a tighter gap puts the
    // label in the shadow and both read as mud.
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-12)' }}>
      <div
        style={{
          height: '4.5rem',
          width: '4.5rem',
          borderRadius: 'var(--radius-panel)',
          background: 'var(--card)',
          boxShadow: `var(--shadow-${step})`,
        }}
      />
      <span className={docs.caption}>--shadow-{step}</span>
    </div>
  )
}

function ShadowScale() {
  return (
    <div className={docs.rowWrap} style={{ padding: 'var(--space-6)', gap: 'var(--space-12)' }}>
      {STEPS.map((step) => (
        <Swatch key={step} step={step} />
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

/** Both appearances at once — the toolbar can only show one at a time. */
export const Modes: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gap: 'var(--space-4)',
        gridTemplateColumns: 'repeat(auto-fit, minmax(18rem, 1fr))',
      }}
    >
      {(['light', 'dark'] as const).map((appearance) => (
        <Theme
          key={appearance}
          appearance={appearance}
          style={{
            background: 'var(--background)',
            // The light panel is white on a white page, so without this its
            // edge is invisible and the comparison looks one-sided.
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-panel)',
            padding: 'var(--space-6)',
          }}
        >
          <div className={docs.caption} style={{ marginBottom: 'var(--space-6)' }}>
            {appearance}
          </div>
          <div className={docs.rowWrap} style={{ gap: 'var(--space-8)' }}>
            {(['xs', 'md', '2xl'] as const).map((step) => (
              <Swatch key={step} step={step} />
            ))}
          </div>
        </Theme>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    // The point of the alpha scale: the same token is not the same value in
    // both modes. If someone copies the light values into .dark, this fails.
    const shadows = (['light', 'dark'] as const).map((mode) =>
      getComputedStyle(canvas.getByText(mode).parentElement!).getPropertyValue('--shadow-md').trim(),
    )
    await expect(shadows[0]).not.toBe(shadows[1])
    await expect(shadows.every(Boolean)).toBe(true)
  },
}
