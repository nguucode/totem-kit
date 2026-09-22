import type { Meta, StoryObj } from '@storybook/react-vite'
import docs from './docs.module.css'
import { PALETTE, STEPS } from './palette'

function BandSwatches({ pairs }: { pairs: readonly (readonly [string, string])[] }) {
  return (
    <div className={docs.grid}>
      {pairs.map(([bg, fg]) => (
        <div
          key={bg}
          className={docs.swatchPair}
          style={{ background: `var(--${bg})`, color: `var(--${fg})` }}
        >
          <span className={docs.swatchLabel}>--{bg}</span>
          <span className={docs.swatchLabel}>--{fg}</span>
        </div>
      ))}
    </div>
  )
}

const LINES = ['border', 'input', 'ring'] as const

function LineSwatches() {
  return (
    <div style={{ display: 'flex', gap: 'var(--space-6)' }}>
      {LINES.map((token) => (
        <div
          key={token}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}
        >
          <div
            style={{
              height: '2.5rem',
              width: '6rem',
              borderRadius: 'var(--radius-md)',
              boxShadow: `inset 0 0 0 2px var(--${token})`,
            }}
          />
          <span className={docs.caption}>--{token}</span>
        </div>
      ))}
    </div>
  )
}

function PrimitiveSwatches() {
  return (
    <div className={docs.stack}>
      {Object.entries(PALETTE).map(([hue, values]) => (
        <div key={hue} className={docs.rampRow}>
          <span className={docs.rampName}>{hue}</span>
          <div className={docs.ramp}>
            {values.map((value, i) => (
              <div
                key={STEPS[i]}
                title={`${hue}-${STEPS[i]}`}
                className={docs.rampStep}
                style={{ background: value }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// Narrative and prose live in Colors.mdx — these stories exist to be embedded
// there via <Canvas>.
const meta = {
  title: 'Foundations/Colors',
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Surfaces: Story = {
  render: () => (
    <BandSwatches
      pairs={[
        ['background', 'foreground'],
        ['card', 'card-foreground'],
        ['popover', 'popover-foreground'],
      ]}
    />
  ),
}

export const SubtleSurfaces: Story = {
  name: 'Subtle surfaces',
  render: () => (
    <BandSwatches
      pairs={[
        ['muted', 'muted-foreground'],
        ['accent', 'accent-foreground'],
      ]}
    />
  ),
}

export const SolidActions: Story = {
  name: 'Solid actions',
  render: () => (
    <BandSwatches
      pairs={[
        ['primary', 'primary-foreground'],
        ['secondary', 'secondary-foreground'],
        ['destructive', 'destructive-foreground'],
      ]}
    />
  ),
}

export const LinesAndFocus: Story = {
  name: 'Lines and focus',
  render: () => <LineSwatches />,
}

export const Primitives: Story = {
  render: () => <PrimitiveSwatches />,
}
