import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { ProgressBar } from './ProgressBar'

const meta = {
  title: 'Components/Loaders/ProgressBar',
  component: ProgressBar,
  // Definition of done: a11y must pass as an error, ahead of the global switch in preview.tsx.
  parameters: { a11y: { test: 'error' } },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'inline-radio', options: ['primary', 'accent', 'secondary', 'destructive'] },
  },
  args: { value: 70, label: 'Uploading' },
  decorators: [(Story) => <div style={{ maxInlineSize: '24rem' }}>{Story()}</div>],
} satisfies Meta<typeof ProgressBar>

export default meta
type Story = StoryObj<typeof meta>

const stack = { display: 'grid', gap: 'var(--space-4)' }

export const Default: Story = {
  play: async ({ canvas }) => {
    const bar = canvas.getByRole('progressbar', { name: 'Uploading' })
    await expect(bar).toHaveAttribute('aria-valuenow', '70')
    await expect(bar).toHaveAttribute('aria-valuemax', '100')
  },
}

export const ValueLabel: Story = {
  args: { showValueLabel: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('70%')).toBeVisible()
  },
}

export const Variants: Story = {
  render: (args) => (
    <div style={stack}>
      {(['primary', 'accent', 'secondary', 'destructive'] as const).map((variant) => (
        <ProgressBar key={variant} {...args} variant={variant} label={variant} showValueLabel />
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div style={stack}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <ProgressBar key={size} {...args} size={size} label={size} isRounded />
      ))}
    </div>
  ),
}

export const Max: Story = {
  args: { value: 3, max: 5, showValueLabel: true, label: 'Steps done' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '5')
    await expect(canvas.getByText('60%')).toBeVisible()
  },
}

export const Indeterminate: Story = {
  args: { isIndeterminate: true, label: 'Connecting' },
  play: async ({ canvas }) => {
    // No value to report: aria-valuenow is absent, not 0.
    await expect(canvas.getByRole('progressbar', { name: 'Connecting' })).not.toHaveAttribute('aria-valuenow')
  },
}

export const WithoutVisibleLabel: Story = {
  args: { label: undefined, 'aria-label': 'Storage used' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('progressbar', { name: 'Storage used' })).toBeVisible()
  },
}
