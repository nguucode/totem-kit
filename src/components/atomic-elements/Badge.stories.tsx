import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Button } from '@/components/buttons/Button'
import { Badge } from './Badge'

const meta = {
  title: 'Components/Atomic Elements/Badge',
  component: Badge,
  // Definition of done: a11y must pass as an error, ahead of the global switch in preview.tsx.
  parameters: { a11y: { test: 'error' } },
  args: { count: 8 },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'accent', 'secondary', 'destructive'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    floatingPlacement: {
      control: 'inline-radio',
      options: ['top-start', 'top-end', 'bottom-start', 'bottom-end'],
    },
    children: { control: false },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

const row = { display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('8')).toBeVisible()
  },
}

export const Variants: Story = {
  render: (args) => (
    <div style={row}>
      <Badge {...args} variant="primary" />
      <Badge {...args} variant="accent" />
      <Badge {...args} variant="secondary" />
      <Badge {...args} variant="destructive" />
      <Badge {...args} isDot variant="primary" />
      <Badge {...args} isDot variant="accent" />
      <Badge {...args} isDot variant="secondary" />
      <Badge {...args} isDot variant="destructive" />
    </div>
  ),
}

export const Sizes: Story = {
  args: { count: 3 },
  render: (args) => (
    <div style={row}>
      <Badge {...args} size="sm" />
      <Badge {...args} size="md" />
      <Badge {...args} size="sm" isDot />
      <Badge {...args} size="md" isDot />
    </div>
  ),
  play: async ({ canvas }) => {
    const [sm, md] = canvas.getAllByText('3')
    await expect(sm.getBoundingClientRect().height).toBe(16)
    await expect(md.getBoundingClientRect().height).toBe(20)
    // A single digit stays a circle, not an oval.
    await expect(md.getBoundingClientRect().width).toBe(20)
  },
}

export const MaxCount: Story = {
  args: { count: 120, maxCount: 99, variant: 'destructive' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('99+')).toBeVisible()
  },
}

export const Dot: Story = {
  args: { isDot: true },
  play: async ({ canvasElement }) => {
    // Unlabelled, a dot is decoration and is hidden from assistive tech.
    await expect(canvasElement.querySelector('span')).toHaveAttribute('aria-hidden', 'true')
  },
}

export const LabelledDot: Story = {
  args: { isDot: true, 'aria-label': 'Online', variant: 'accent' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('img', { name: 'Online' })).toBeVisible()
  },
}

export const LabelledCount: Story = {
  args: { count: 3, 'aria-label': '3 unread messages' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('img', { name: '3 unread messages' })).toBeVisible()
  },
}

export const Inline: Story = {
  args: { count: 12 },
  render: (args) => (
    <Button variant="secondary">
      Inbox <Badge {...args} />
    </Button>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button')).toHaveAccessibleName('Inbox 12')
  },
}

export const Floating: Story = {
  args: { count: 4, isFloating: true, variant: 'destructive' },
  render: (args) => (
    <div style={{ ...row, gap: 'var(--space-12)', padding: 'var(--space-6)' }}>
      {(['top-start', 'top-end', 'bottom-start', 'bottom-end'] as const).map((p) => (
        <Badge key={p} {...args} floatingPlacement={p}>
          <Button variant="secondary">{p}</Button>
        </Badge>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: /^top-end/ }).getBoundingClientRect()
    const badge = canvas.getAllByText('4')[1].getBoundingClientRect()
    // Hidden: read after the button it would be a stray "4".
    await expect(canvas.getAllByText('4')[1]).toHaveAttribute('aria-hidden', 'true')
    // Centred on the button's top-right corner.
    await expect(Math.round(badge.left + badge.width / 2)).toBe(Math.round(button.right))
    await expect(Math.round(badge.top + badge.height / 2)).toBe(Math.round(button.top))
  },
}

export const FloatingDot: Story = {
  args: { isDot: true, isFloating: true, variant: 'destructive' },
  render: (args) => (
    <div style={{ padding: 'var(--space-4)' }}>
      <Badge {...args}>
        <Button variant="secondary">Notifications</Button>
      </Badge>
    </div>
  ),
}
