import type { Meta, StoryObj } from '@storybook/react-vite'

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
    <div className="flex flex-col gap-4">
      {TOKENS.map(({ token, value, usage, note }) => (
        <div key={token} className="flex flex-col gap-2 rounded-lg border border-border p-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-12 w-32 items-center justify-center rounded-md bg-secondary text-sm text-secondary-foreground"
              style={{ cursor: `var(${token})` }}
            >
              hover me
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-sm text-foreground">{token}</span>
              <span className="font-mono text-xs text-muted-foreground">{value}</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{usage}.</span> {note}
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
