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
        <h2 className="mb-3 text-sm font-medium text-muted-foreground">Type scale</h2>
        <div className="flex flex-col gap-2">
          {SIZES.map((size) => (
            <div key={size} className="flex items-baseline gap-4">
              <span className="w-16 shrink-0 font-mono text-xs text-muted-foreground">{size}</span>
              <span className={size}>Totem Kit</span>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="mb-3 text-sm font-medium text-muted-foreground">Font weight</h2>
        <div className="flex flex-col gap-2">
          {WEIGHTS.map((weight) => (
            <div key={weight} className="flex items-baseline gap-4">
              <span className="w-24 shrink-0 font-mono text-xs text-muted-foreground">{weight}</span>
              <span className={`text-lg ${weight}`}>Totem Kit</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

const meta = {
  title: 'Foundations/Typography',
  render: () => <TypeScale />,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `Tailwind's default type scale and font weights, unmodified — no custom
font family or semantic role tokens (heading/body/caption) defined yet.
Components should reference a scale step directly (\`text-sm\`,
\`font-medium\`) until real typographic roles get designed.`,
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Scale: Story = {}
