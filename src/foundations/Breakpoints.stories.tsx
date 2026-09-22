import type { Meta, StoryObj } from '@storybook/react-vite'

const BREAKPOINTS = [
  { name: 'base', min: '0', px: '0px' },
  { name: 'sm', min: '40rem', px: '640px' },
  { name: 'md', min: '48rem', px: '768px' },
  { name: 'lg', min: '64rem', px: '1024px' },
  { name: 'xl', min: '80rem', px: '1280px' },
  { name: '2xl', min: '96rem', px: '1536px' },
] as const

// One row per breakpoint; each hides itself once the next one is reached, so
// exactly one is visible and it is the active one. Resize the preview to see
// it change.
const ACTIVE = [
  'flex sm:hidden',
  'hidden sm:flex md:hidden',
  'hidden md:flex lg:hidden',
  'hidden lg:flex xl:hidden',
  'hidden xl:flex 2xl:hidden',
  'hidden 2xl:flex',
] as const

function ActiveBreakpoint() {
  return (
    <div className="flex flex-col gap-2">
      {BREAKPOINTS.map((bp, i) => (
        <div
          key={bp.name}
          className={`${ACTIVE[i]} items-center gap-3 rounded-md bg-primary px-3 py-2 text-primary-foreground`}
        >
          <span className="font-mono text-sm font-medium">{bp.name}</span>
          <span className="text-xs opacity-80">
            active from {bp.min} ({bp.px}) up
          </span>
        </div>
      ))}
    </div>
  )
}

function Ladder() {
  return (
    <div className="flex flex-col gap-2">
      {BREAKPOINTS.filter((b) => b.name !== 'base').map((bp) => (
        <div key={bp.name} className="flex items-center gap-3">
          <span className="w-10 shrink-0 font-mono text-xs text-muted-foreground">{bp.name}</span>
          <div
            className="h-4 rounded-sm bg-muted"
            style={{ width: `calc(${bp.min} / 96 * 100%)` }}
          />
          <span className="font-mono text-xs text-muted-foreground">{bp.px}</span>
        </div>
      ))}
    </div>
  )
}

// Narrative and prose live in Breakpoints.mdx.
const meta = {
  title: 'Foundations/Breakpoints',
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Active: Story = {
  name: 'Active breakpoint',
  render: () => <ActiveBreakpoint />,
}

export const Scale: Story = {
  render: () => <Ladder />,
}
