import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { Button } from '@/components/buttons/Button'
import { Avatar } from '@/components/atomic-elements/Avatar'
import { Card } from './Card'

const title = { margin: 0, fontSize: 'var(--text-heading-xs)', lineHeight: 'var(--leading-heading-xs)', fontWeight: 600 }
const muted = { margin: 0, color: 'var(--muted-foreground)' }

const Content = () => (
  <>
    <h3 style={title}>Payment method</h3>
    <p style={muted}>Change how you pay for your plan.</p>
  </>
)

const meta = {
  title: 'Components/Data Display/Card',
  component: Card,
  // Definition of done: a11y must pass as an error, ahead of the global switch in preview.tsx.
  parameters: { a11y: { test: 'error' } },
  argTypes: {
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg'] },
    appearance: { control: 'inline-radio', options: ['elevated', 'outline', 'filled', 'unstyled'] },
    orientation: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
    render: { control: false },
  },
  args: { children: <Content /> },
  decorators: [(Story) => <div style={{ maxInlineSize: '24rem' }}>{Story()}</div>],
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Appearances: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
      {(['elevated', 'outline', 'filled', 'unstyled'] as const).map((appearance) => (
        <Card key={appearance} {...args} appearance={appearance}>
          <h3 style={title}>{appearance}</h3>
          <p style={muted}>Change how you pay for your plan.</p>
        </Card>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
      {(['xs', 'sm', 'md', 'lg'] as const).map((size) => (
        <Card key={size} {...args} size={size} data-size={size} />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const pads = ['xs', 'sm', 'md', 'lg'].map(
      (s) => getComputedStyle(canvasElement.querySelector(`[data-size="${s}"]`)!).paddingTop,
    )
    await expect(pads).toEqual(['12px', '16px', '24px', '32px'])
  },
}

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
    children: (
      <>
        <Avatar initials="MT" size="md" />
        <div style={{ display: 'grid', gap: 'var(--space-1)', flex: 1 }}>
          <h3 style={title}>Mary Thompson</h3>
          <p style={muted}>Product designer</p>
        </div>
        <Button size="sm" appearance="outlined" variant="secondary">
          Follow
        </Button>
      </>
    ),
  },
}

export const NoBorderSquare: Story = {
  args: { hasBorder: false, isRounded: false },
}

/**
 * The whole card is one button, so its content must be phrasing content:
 * spans, not headings or paragraphs, and nothing interactive.
 */
export const Clickable: Story = {
  args: {
    onClick: fn(),
    children: (
      <>
        <span style={title}>Payment method</span>
        <span style={muted}>Change how you pay for your plan.</span>
      </>
    ),
  },
  play: async ({ canvas, userEvent, args }) => {
    const card = canvas.getByRole('button', { name: /Payment method/ })
    await expect(card).toHaveAttribute('type', 'button')
    await userEvent.click(card)
    await userEvent.tab({ shift: true })
    await userEvent.tab()
    await expect(card).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await expect(args.onClick).toHaveBeenCalledTimes(2)
  },
}

/** A card that navigates renders a real link. */
export const Link: Story = {
  args: { render: <a href="#billing" /> },
  play: async ({ canvas, userEvent }) => {
    const link = canvas.getByRole('link', { name: /Payment method/ })
    await expect(link).toHaveAttribute('href', '#billing')
    await expect(link).not.toHaveAttribute('type')
    await userEvent.tab()
    await expect(link).toHaveFocus()
  },
}
