import type { Meta, StoryObj } from '@storybook/react-vite'

const TOKENS = ['radius-sm', 'radius-md', 'radius-lg', 'radius-xl'] as const

function RadiusScale() {
  return (
    <div className="flex flex-wrap items-end gap-6">
      {TOKENS.map((token) => (
        <div key={token} className="flex flex-col items-center gap-2">
          <div
            className="h-16 w-16 bg-primary"
            style={{ borderRadius: `var(--${token})` }}
          />
          <span className="font-mono text-xs text-muted-foreground">--{token}</span>
        </div>
      ))}
    </div>
  )
}

// Narrative and prose live in Radius.mdx, which supersedes this file's
// autodocs page — this story exists to be embedded there via <Canvas>.
const meta = {
  title: 'Foundations/Radius',
  render: () => <RadiusScale />,
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Scale: Story = {}
