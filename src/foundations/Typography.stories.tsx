import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

const HEADINGS = [
  { cls: 'text-heading-2xl', atlassian: 'xxlarge', px: '32 / 36' },
  { cls: 'text-heading-xl', atlassian: 'xlarge', px: '28 / 32' },
  { cls: 'text-heading-lg', atlassian: 'large', px: '24 / 28' },
  { cls: 'text-heading-md', atlassian: 'medium', px: '20 / 24' },
  { cls: 'text-heading-sm', atlassian: 'small', px: '16 / 20' },
  { cls: 'text-heading-xs', atlassian: 'xsmall', px: '14 / 20' },
  { cls: 'text-heading-2xs', atlassian: 'xxsmall', px: '12 / 16' },
] as const

const BODY = [
  { cls: 'text-body-lg', atlassian: 'body.large', px: '16 / 24' },
  { cls: 'text-body', atlassian: 'body', px: '14 / 20' },
  { cls: 'text-body-sm', atlassian: 'body.small', px: '12 / 16' },
] as const

function Row({ cls, atlassian, px }: { cls: string; atlassian: string; px: string }) {
  return (
    <div className="flex items-baseline gap-4 border-b border-border py-2">
      <span className="w-40 shrink-0 font-mono text-body-sm text-muted-foreground">{cls}</span>
      <span className={`flex-1 ${cls}`}>Totem Kit</span>
      <span className="w-28 shrink-0 text-right font-mono text-body-sm text-muted-foreground">
        {px}
      </span>
      <span className="w-28 shrink-0 text-right font-mono text-body-sm text-muted-foreground">
        {atlassian}
      </span>
    </div>
  )
}

const WEIGHTS = [
  { cls: 'font-normal', value: 400, name: 'regular' },
  { cls: 'font-medium', value: 500, name: 'medium' },
  { cls: 'font-semibold', value: 600, name: 'semibold' },
  { cls: 'font-bold', value: 700, name: 'bold' },
] as const

// Narrative and prose live in Typography.mdx.
const meta = {
  title: 'Foundations/Typography',
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Headings: Story = {
  render: () => (
    <div className="flex flex-col">
      {HEADINGS.map((h) => (
        <Row key={h.cls} {...h} />
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    // The role has to carry its weight, not just its size.
    const el = canvas.getByText('Totem Kit', { selector: '.text-heading-lg' })
    await expect(getComputedStyle(el).fontWeight).toBe('700')
  },
}

export const Body: Story = {
  render: () => (
    <div className="flex flex-col">
      {BODY.map((b) => (
        <Row key={b.cls} {...b} />
      ))}
    </div>
  ),
}

export const Weights: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      {WEIGHTS.map(({ cls, value, name }) => (
        <div key={cls} className="flex items-baseline gap-4">
          <span className="w-32 shrink-0 font-mono text-body-sm text-muted-foreground">{cls}</span>
          <span className={`text-body-lg ${cls}`}>Totem Kit</span>
          <span className="font-mono text-body-sm text-muted-foreground">
            {value} · {name}
          </span>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    // A weight utility must beat the weight baked into the role token.
    const el = canvas.getByText('Totem Kit', { selector: '.font-bold' })
    await expect(getComputedStyle(el).fontWeight).toBe('700')
  },
}

export const Families: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <span className="font-mono text-body-sm text-muted-foreground">font-sans</span>
        <span className="text-heading-md font-sans">Totem Kit — system-ui 0123</span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-mono text-body-sm text-muted-foreground">font-mono</span>
        <span className="text-heading-md font-mono">Totem Kit — ui-monospace 0123</span>
      </div>
    </div>
  ),
  play: async ({ canvas }) => {
    const sans = canvas.getByText(/system-ui/)
    await expect(getComputedStyle(sans).fontFamily).toContain('system-ui')
  },
}
