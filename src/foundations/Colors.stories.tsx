import type { Meta, StoryObj } from '@storybook/react-vite'

const COLORS = [
  'slate', 'gray', 'zinc', 'neutral', 'stone',
  'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal',
  'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose',
] as const

const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const

function Swatches() {
  return (
    <div className="flex flex-col gap-3">
      {COLORS.map((color) => (
        <div key={color} className="flex items-center gap-2">
          <span className="w-20 shrink-0 text-sm font-medium capitalize text-neutral-700">
            {color}
          </span>
          <div className="flex flex-1 overflow-hidden rounded-md">
            {SHADES.map((shade) => (
              <div
                key={shade}
                title={`${color}-${shade}`}
                className={`h-10 flex-1 bg-${color}-${shade}`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

const meta = {
  title: 'Atoms/Foundations/Colors',
  render: () => <Swatches />,
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Palette: Story = {}
