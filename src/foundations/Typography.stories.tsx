import type { Meta, StoryObj } from '@storybook/react-vite'

const SIZES = [
  'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl',
  'text-2xl', 'text-3xl', 'text-4xl', 'text-5xl', 'text-6xl',
] as const

const WEIGHTS = [
  'font-light', 'font-normal', 'font-medium', 'font-semibold', 'font-bold',
] as const

function TypeScale() {
  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="mb-3 text-sm font-medium text-neutral-500">Type scale</h2>
        <div className="flex flex-col gap-2">
          {SIZES.map((size) => (
            <div key={size} className="flex items-baseline gap-4">
              <span className="w-16 shrink-0 font-mono text-xs text-neutral-400">{size}</span>
              <span className={size}>Totem Kit</span>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="mb-3 text-sm font-medium text-neutral-500">Font weight</h2>
        <div className="flex flex-col gap-2">
          {WEIGHTS.map((weight) => (
            <div key={weight} className="flex items-baseline gap-4">
              <span className="w-24 shrink-0 font-mono text-xs text-neutral-400">{weight}</span>
              <span className={`text-lg ${weight}`}>Totem Kit</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

const meta = {
  title: 'Atoms/Foundations/Typography',
  render: () => <TypeScale />,
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Scale: Story = {}
