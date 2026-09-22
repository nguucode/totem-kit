import type { Meta, StoryObj } from '@storybook/react-vite'

const PAIRS = [
  ['background', 'foreground'],
  ['card', 'card-foreground'],
  ['popover', 'popover-foreground'],
  ['primary', 'primary-foreground'],
  ['secondary', 'secondary-foreground'],
  ['muted', 'muted-foreground'],
  ['accent', 'accent-foreground'],
  ['destructive', 'destructive-foreground'],
] as const

const LINES = ['border', 'input', 'ring'] as const

function SemanticTokens() {
  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="mb-3 text-sm font-medium text-muted-foreground">Surface / foreground pairs</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {PAIRS.map(([bg, fg]) => (
            <div
              key={bg}
              className="flex h-24 flex-col justify-between rounded-lg border border-border p-3"
              style={{ background: `var(--${bg})`, color: `var(--${fg})` }}
            >
              <span className="text-xs font-mono opacity-70">--{bg}</span>
              <span className="text-xs font-mono opacity-70">--{fg}</span>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="mb-3 text-sm font-medium text-muted-foreground">Lines</h2>
        <div className="flex gap-6">
          {LINES.map((token) => (
            <div key={token} className="flex flex-col items-center gap-2">
              <div
                className="h-10 w-24 rounded-md"
                style={{ boxShadow: `inset 0 0 0 2px var(--${token})` }}
              />
              <span className="font-mono text-xs text-muted-foreground">--{token}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

const COLORS = [
  'slate', 'gray', 'zinc', 'neutral', 'stone',
  'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal',
  'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose',
] as const

const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const

function Primitives() {
  return (
    <div className="flex flex-col gap-3">
      {COLORS.map((color) => (
        <div key={color} className="flex items-center gap-2">
          <span className="w-20 shrink-0 text-sm font-medium capitalize text-muted-foreground">
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
  title: 'Foundations/Colors',
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Semantic: Story = {
  render: () => <SemanticTokens />,
}

export const Primitives_: Story = {
  name: 'Primitives',
  render: () => <Primitives />,
}
