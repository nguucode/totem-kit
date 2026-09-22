import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@/components/actions/Button'
import { TextInput } from '@/components/inputs/TextInput'
import { Theme } from '@/theme/Theme'

const PAIRS = [
  ['background', 'foreground'],
  ['card', 'card-foreground'],
  ['primary', 'primary-foreground'],
  ['muted', 'muted-foreground'],
  ['destructive', 'destructive-foreground'],
] as const

function Swatches() {
  return (
    <div className="flex flex-col gap-2">
      {PAIRS.map(([bg, fg]) => (
        <div
          key={bg}
          className="flex items-center justify-between rounded-md border border-border px-3 py-2"
          style={{ background: `var(--${bg})`, color: `var(--${fg})` }}
        >
          <span className="font-mono text-xs">--{bg}</span>
          <span className="font-mono text-xs opacity-70">--{fg}</span>
        </div>
      ))}
    </div>
  )
}

function Sample() {
  return (
    <div className="flex flex-col gap-4 bg-background p-4 text-foreground">
      <Swatches />
      <TextInput label="Email" placeholder="you@example.com" />
      <div className="flex gap-2">
        <Button>Save</Button>
        <Button variant="destructive">Delete</Button>
        <Button variant="outline">Cancel</Button>
      </div>
    </div>
  )
}

// Narrative and prose live in DarkMode.mdx.
const meta = {
  title: 'Foundations/Dark mode',
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const SideBySide: Story = {
  name: 'Side by side',
  render: () => (
    <div className="grid gap-4 sm:grid-cols-2">
      <Theme appearance="light" className="overflow-hidden rounded-lg border border-border">
        <Sample />
      </Theme>
      <Theme appearance="dark" className="overflow-hidden rounded-lg border border-border">
        <Sample />
      </Theme>
    </div>
  ),
}
