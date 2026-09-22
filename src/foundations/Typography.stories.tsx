import type { Meta, StoryObj } from '@storybook/react-vite'

const SIZES = [
  'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl',
  'text-2xl', 'text-3xl', 'text-4xl', 'text-5xl', 'text-6xl',
] as const

function TypeScale() {
  return (
    <div className="flex flex-col gap-2">
      {SIZES.map((size) => (
        <div key={size} className="flex items-baseline gap-4">
          <span className="w-16 shrink-0 font-mono text-xs text-muted-foreground">{size}</span>
          <span className={size}>Totem Kit</span>
        </div>
      ))}
    </div>
  )
}

const WEIGHTS = [
  'font-light', 'font-normal', 'font-medium', 'font-semibold', 'font-bold',
] as const

function FontWeight() {
  return (
    <div className="flex flex-col gap-2">
      {WEIGHTS.map((weight) => (
        <div key={weight} className="flex items-baseline gap-4">
          <span className="w-24 shrink-0 font-mono text-xs text-muted-foreground">{weight}</span>
          <span className={`text-lg ${weight}`}>Totem Kit</span>
        </div>
      ))}
    </div>
  )
}

// Narrative and prose live in Typography.mdx, which supersedes this file's
// autodocs page — these stories exist to be embedded there via <Canvas>.
const meta = {
  title: 'Foundations/Typography',
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Scale: Story = {
  render: () => <TypeScale />,
}

export const Weight: Story = {
  render: () => <FontWeight />,
}
