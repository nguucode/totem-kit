import type { Meta, StoryObj } from '@storybook/react-vite'

// Tailwind's spacing scale is a single --spacing multiplier (default 0.25rem);
// every step below is `calc(var(--spacing) * n)`, so this stays in sync if the
// multiplier is ever retokenized (e.g. from Figma).
const STEPS = [0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64]

function SpacingScale() {
  return (
    <div className="flex flex-col gap-2">
      {STEPS.map((step) => (
        <div key={step} className="flex items-center gap-4">
          <span className="w-10 shrink-0 font-mono text-xs text-muted-foreground">{step}</span>
          <div
            className="h-4 rounded-sm bg-primary"
            style={{ width: `calc(var(--spacing) * ${step})` }}
          />
        </div>
      ))}
    </div>
  )
}

const meta = {
  title: 'Foundations/Spacing',
  render: () => <SpacingScale />,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `Tailwind's spacing scale is a single \`--spacing\` multiplier (default
\`0.25rem\`); every step is \`calc(var(--spacing) * n)\`. Retokenizing the
multiplier (e.g. from Figma) rescales every \`p-*\`/\`gap-*\`/\`w-*\` utility
in the kit at once — nothing below needs to change to stay in sync.`,
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Scale: Story = {}
