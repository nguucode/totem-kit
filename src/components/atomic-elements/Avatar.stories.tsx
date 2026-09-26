import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor } from 'storybook/test'
import { Avatar } from './Avatar'

// A self-contained stand-in portrait, so stories never depend on the network.
const portrait =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#c7d2fe"/><circle cx="32" cy="26" r="12" fill="#6366f1"/><rect x="12" y="42" width="40" height="30" rx="20" fill="#6366f1"/></svg>',
  )

const meta = {
  title: 'Components/Atomic Elements/Avatar',
  component: Avatar,
  // Definition of done: a11y must pass as an error, ahead of the global switch in preview.tsx.
  parameters: { a11y: { test: 'error' } },
  args: { imageSrc: portrait, imageAlt: 'Mary Thompson' },
  argTypes: {
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg'] },
    appearance: { control: 'inline-radio', options: ['circle', 'square'] },
  },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

const row = { display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }

export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('img', { name: 'Mary Thompson' })).toBeVisible()
    // The <img> itself is silent; the name is on the container.
    await expect(canvasElement.querySelector('img')).toHaveAttribute('alt', '')
  },
}

export const Sizes: Story = {
  render: (args) => (
    <div style={row}>
      {(['xs', 'sm', 'md', 'lg'] as const).map((size) => (
        <Avatar key={size} {...args} size={size} imageAlt={size} />
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    const widths = ['xs', 'sm', 'md', 'lg'].map(
      (n) => canvas.getByRole('img', { name: n }).getBoundingClientRect().width,
    )
    await expect(widths).toEqual([24, 32, 40, 48])
  },
}

export const Fallbacks: Story = {
  render: (args) => (
    <div style={row}>
      <Avatar {...args} />
      <Avatar {...args} imageSrc={undefined} initials="SR" imageAlt="Sam Rivera" />
      <Avatar {...args} imageSrc={undefined} imageAlt="Unknown user" />
    </div>
  ),
}

export const BrokenImage: Story = {
  args: { imageSrc: 'data:image/png;base64,broken', initials: 'mt' },
  play: async ({ canvas, canvasElement }) => {
    await waitFor(() => expect(canvasElement.querySelector('img')).toBeNull())
    // Initials are uppercased by style, not by rewriting what was passed.
    await expect(canvas.getByText('mt')).toBeVisible()
  },
}

export const Placeholder: Story = {
  args: { imageSrc: undefined, imageAlt: undefined },
  play: async ({ canvasElement }) => {
    // No name means decorative: hidden, not announced as an empty image.
    await expect(canvasElement.querySelector('span')).toHaveAttribute('aria-hidden', 'true')
    await expect(canvasElement.querySelector('svg')).toBeVisible()
  },
}

export const EmptySource: Story = {
  args: { imageSrc: '' },
  play: async ({ canvasElement }) => {
    // '' is no image: straight to the placeholder, no broken <img> first.
    await expect(canvasElement.querySelector('img')).toBeNull()
    await expect(canvasElement.querySelector('svg')).toBeVisible()
  },
}

export const Square: Story = {
  args: { appearance: 'square', size: 'lg' },
  render: (args) => (
    <div style={row}>
      <Avatar {...args} />
      <Avatar {...args} imageSrc={undefined} initials="SR" imageAlt="Sam Rivera" />
    </div>
  ),
}
