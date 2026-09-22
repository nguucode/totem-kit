import type { Meta, StoryObj } from '@storybook/react-vite'
import docs from './docs.module.css'

const BREAKPOINTS = [
  { name: 'base', min: '0', px: '0px' },
  { name: 'sm', min: '40rem', px: '640px' },
  { name: 'md', min: '48rem', px: '768px' },
  { name: 'lg', min: '64rem', px: '1024px' },
  { name: 'xl', min: '80rem', px: '1280px' },
  { name: '2xl', min: '96rem', px: '1536px' },
] as const

// One row per breakpoint; each hides itself once the next one is reached, so
// exactly one is visible and it is the active one. Resize the preview to see
// it change.
const ACTIVE = [
  docs.bpBase,
  docs.bpSm,
  docs.bpMd,
  docs.bpLg,
  docs.bpXl,
  docs.bp2xl,
] as const

function ActiveBreakpoint() {
  return (
    <div className={docs.stack}>
      {BREAKPOINTS.map((bp, i) => (
        <div key={bp.name} className={`${ACTIVE[i]} ${docs.bpChip}`}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-body)', fontWeight: 500 }}>
            {bp.name}
          </span>
          <span style={{ fontSize: 'var(--text-body-sm)', opacity: 0.8 }}>
            active from {bp.min} ({bp.px}) up
          </span>
        </div>
      ))}
    </div>
  )
}

function Ladder() {
  return (
    <div className={docs.stack}>
      {BREAKPOINTS.filter((b) => b.name !== 'base').map((bp) => (
        <div key={bp.name} className={docs.row} style={{ gap: 'var(--space-3)' }}>
          <span className={docs.caption} style={{ width: '2.5rem', flexShrink: 0 }}>{bp.name}</span>
          <div
            style={{
              height: '1rem',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--muted)',
              width: `calc(${bp.min} / 96 * 100%)`,
            }}
          />
          <span className={docs.caption}>{bp.px}</span>
        </div>
      ))}
    </div>
  )
}

// Narrative and prose live in Breakpoints.mdx.
const meta = {
  title: 'Foundations/Breakpoints',
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Active: Story = {
  name: 'Active breakpoint',
  render: () => <ActiveBreakpoint />,
}

export const Scale: Story = {
  render: () => <Ladder />,
}
