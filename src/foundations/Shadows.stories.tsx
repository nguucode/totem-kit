import type { Meta, StoryObj } from '@storybook/react-vite'

const TOKENS = ['shadow-sm', 'shadow-md', 'shadow-lg', 'shadow-xl'] as const

function ShadowScale() {
  return (
    <div className="flex flex-wrap items-end gap-8 p-8">
      {TOKENS.map((token) => (
        <div key={token} className="flex flex-col items-center gap-3">
          <div className={`h-20 w-20 rounded-lg bg-card ${token}`} />
          <span className="font-mono text-xs text-muted-foreground">{token}</span>
        </div>
      ))}
    </div>
  )
}

// Narrative and prose live in Shadows.mdx, which supersedes this file's
// autodocs page — this story exists to be embedded there via <Canvas>.
const meta = {
  title: 'Foundations/Shadows',
  render: () => <ShadowScale />,
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Scale: Story = {}
