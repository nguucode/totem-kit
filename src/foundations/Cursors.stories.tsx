import type { Meta, StoryObj } from '@storybook/react-vite'
import docs from './docs.module.css'

const TOKENS = [
  {
    token: '--cursor-button',
    value: 'default',
    usage: 'Button (and anything that behaves like one)',
    note: "Matches the browser's own convention: an interactive element that doesn't navigate to another page keeps the regular arrow, not a pointer.",
  },
  {
    token: '--cursor-disabled',
    value: 'not-allowed',
    usage: 'A disabled interactive element that stays hoverable',
    note: 'Button doesn’t use this — its disabled state is pointer-events-none, which makes the element untargetable, so no cursor would render anyway. Reach for this on a disabled control that stays hit-testable (e.g. wrapped in a tooltip explaining why).',
  },
] as const

function CursorTokens() {
  return (
    <div className={docs.stackWide} style={{ gap: 'var(--space-4)' }}>
      {TOKENS.map(({ token, value, usage, note }) => (
        <div key={token} className={docs.card} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div
              style={{
                display: 'flex',
                height: '3rem',
                width: '8rem',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 'var(--radius-md)',
                background: 'var(--secondary)',
                color: 'var(--secondary-foreground)',
                fontSize: 'var(--text-body)',
                cursor: `var(${token})`,
              }}
            >
              hover me
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-body)' }}>{token}</span>
              <span className={docs.caption}>{value}</span>
            </div>
          </div>
          <p className={docs.note}>
            <strong style={{ color: 'var(--foreground)', fontWeight: 500 }}>{usage}.</strong> {note}
          </p>
        </div>
      ))}
    </div>
  )
}

// Narrative and prose live in Cursors.mdx, which supersedes this file's
// autodocs page — this story exists to be embedded there via <Canvas>.
const meta = {
  title: 'Foundations/Cursors',
  render: () => <CursorTokens />,
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Tokens: Story = {}
