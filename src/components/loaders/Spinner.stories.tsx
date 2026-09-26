import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor } from 'storybook/test'
import { Spinner } from './Spinner'

const meta = {
  title: 'Components/Loaders/Spinner',
  component: Spinner,
  // Definition of done: a11y must pass as an error, ahead of the global switch in preview.tsx.
  parameters: { a11y: { test: 'error' } },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'neutral'] },
  },
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

const row = { display: 'flex', gap: 'var(--space-6)', alignItems: 'center' }

export const Default: Story = {
  play: async ({ canvas }) => {
    // A status, named "Loading" when no label is given.
    await expect(canvas.getByRole('status', { name: 'Loading' })).toBeVisible()
  },
}

export const WithLabel: Story = {
  args: { label: 'Loading projects…' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status', { name: 'Loading projects…' })).toBeVisible()
    await expect(canvas.getByText('Loading projects…')).toBeVisible()
  },
}

export const Sizes: Story = {
  render: (args) => (
    <div style={row}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Spinner key={size} {...args} size={size} label={size} />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const widths = [...canvasElement.querySelectorAll('svg')].map((s) => s.getBoundingClientRect().width)
    await expect(widths).toEqual([16, 24, 32])
  },
}

export const Variants: Story = {
  render: (args) => (
    <div style={row}>
      {(['primary', 'secondary', 'neutral'] as const).map((variant) => (
        <Spinner key={variant} {...args} variant={variant} label={variant} />
      ))}
    </div>
  ),
}

/** With a value it becomes a progress ring and says how far along it is. */
export const Determinate: Story = {
  args: { value: 70, label: 'Uploading', variant: 'primary', size: 'lg' },
  play: async ({ canvas }) => {
    const ring = canvas.getByRole('progressbar', { name: 'Uploading' })
    await expect(ring).toHaveAttribute('aria-valuenow', '70')
  },
}

/** Nothing for the first 400ms, so a fast load never flashes a spinner. */
export const Delay: Story = {
  args: { delay: 400 },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('status')).toBeNull()
    await waitFor(() => expect(canvas.getByRole('status')).toBeVisible(), { timeout: 2000 })
  },
}
