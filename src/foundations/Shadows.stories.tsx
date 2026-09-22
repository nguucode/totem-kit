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

const meta = {
  title: 'Foundations/Shadows',
  render: () => <ShadowScale />,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `Overrides Tailwind's own \`--shadow-*\` theme namespace, so \`shadow-sm\`
through \`shadow-xl\` stay dark-mode-aware without a new utility. Flat black
shadows read fine on a light surface but go near-invisible on a dark one,
so the \`.dark\` values in \`src/tokens.css\` bump the alpha — this page
looks the same in both themes for that reason, by design.`,
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Scale: Story = {}
