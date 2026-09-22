import type { Meta, StoryObj } from '@storybook/react-vite'

// Grouped the way Radix Themes explains its 12-step color scale (backgrounds,
// interactive/subtle surfaces, borders, solid actions) — a flat token set
// instead of a 12-step-per-color scale, but the same reading order.
const BANDS = [
  {
    title: 'Backgrounds',
    description: 'Page and container surfaces.',
    pairs: [
      ['background', 'foreground'],
      ['card', 'card-foreground'],
      ['popover', 'popover-foreground'],
    ],
  },
  {
    title: 'Subtle surfaces',
    description: 'Hover states, selected rows, low-emphasis fills.',
    pairs: [
      ['muted', 'muted-foreground'],
      ['accent', 'accent-foreground'],
    ],
  },
  {
    title: 'Solid actions',
    description: 'Filled buttons and other high-emphasis controls.',
    pairs: [
      ['primary', 'primary-foreground'],
      ['secondary', 'secondary-foreground'],
      ['destructive', 'destructive-foreground'],
    ],
  },
] as const

const LINES = ['border', 'input', 'ring'] as const

function SemanticTokens() {
  return (
    <div className="flex flex-col gap-8">
      {BANDS.map((band) => (
        <section key={band.title}>
          <h2 className="text-sm font-medium text-foreground">{band.title}</h2>
          <p className="mb-3 text-xs text-muted-foreground">{band.description}</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {band.pairs.map(([bg, fg]) => (
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
      ))}
      <section>
        <h2 className="text-sm font-medium text-foreground">Borders &amp; lines</h2>
        <p className="mb-3 text-xs text-muted-foreground">Dividers, input outlines, focus rings.</p>
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
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `Semantic tokens are what components consume — \`bg-primary\`, not
\`bg-neutral-900\` — grouped the way [Radix Themes explains its color
scale](https://www.radix-ui.com/themes/docs/theme/color): backgrounds,
then subtle surfaces (hover/selected states), then solid actions (filled
buttons), then borders. Totem Kit keeps a flat token set rather than
Radix's 12-step-per-color scale — see **Primitives** below for the raw
Tailwind palette those semantic tokens are cut from.`,
      },
    },
  },
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
