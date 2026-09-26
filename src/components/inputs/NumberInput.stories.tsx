import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn } from 'storybook/test'
import { NumberInput } from './NumberInput'

const meta = {
  title: 'Components/Inputs/NumberInput',
  component: NumberInput,
  // Definition of done: a11y must pass as an error, ahead of the global switch in preview.tsx.
  parameters: { a11y: { test: 'error' } },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    appearance: { control: 'inline-radio', options: ['outlined', 'filled', 'underlined', 'unstyled'] },
    validationState: { control: 'inline-radio', options: ['default', 'success', 'error'] },
  },
  args: { label: 'Quantity', defaultValue: 6, min: 0, max: 100, onValueChange: fn() },
} satisfies Meta<typeof NumberInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas, userEvent, args }) => {
    const input = canvas.getByLabelText('Quantity')
    await expect(input).toHaveValue('6')
    await userEvent.click(canvas.getByRole('button', { name: /increase/i }))
    await expect(input).toHaveValue('7')
    await expect(args.onValueChange).toHaveBeenLastCalledWith(7)
    await userEvent.click(canvas.getByRole('button', { name: /decrease/i }))
    await expect(input).toHaveValue('6')
    // Arrow keys step from the field itself.
    await userEvent.click(input)
    await userEvent.keyboard('{ArrowUp}{ArrowUp}')
    await expect(input).toHaveValue('8')
    await userEvent.keyboard('{ArrowDown}')
    await expect(input).toHaveValue('7')
  },
}

export const Limits: Story = {
  args: { defaultValue: 99, max: 100 },
  play: async ({ canvas, userEvent }) => {
    const increase = canvas.getByRole('button', { name: /increase/i })
    await userEvent.click(increase)
    await expect(canvas.getByLabelText('Quantity')).toHaveValue('100')
    // At the limit, the button is disabled rather than silently doing nothing.
    await expect(increase).toBeDisabled()
  },
}

export const Step: Story = {
  args: { defaultValue: 10, step: 5 },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: /increase/i }))
    await expect(canvas.getByLabelText('Quantity')).toHaveValue('15')
  },
}

export const Precision: Story = {
  args: { label: 'Price', defaultValue: 9.5, step: 0.25, precision: 2 },
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByLabelText('Price')
    await expect(input).toHaveValue('9.50')
    await userEvent.click(canvas.getByRole('button', { name: /increase/i }))
    await expect(input).toHaveValue('9.75')
  },
}

export const Typing: Story = {
  play: async ({ canvas, userEvent, args }) => {
    const input = canvas.getByLabelText('Quantity')
    await userEvent.clear(input)
    await expect(args.onValueChange).toHaveBeenLastCalledWith(null)
    await userEvent.type(input, '42')
    await expect(args.onValueChange).toHaveBeenLastCalledWith(42)
  },
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--space-4)', justifyItems: 'start' }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <NumberInput key={size} {...args} size={size} label={size} />
      ))}
    </div>
  ),
}

export const Appearances: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--space-4)', justifyItems: 'start' }}>
      {(['outlined', 'filled', 'underlined', 'unstyled'] as const).map((appearance) => (
        <NumberInput key={appearance} {...args} appearance={appearance} label={appearance} />
      ))}
    </div>
  ),
}

export const Validation: Story = {
  args: { validationState: 'error', helperText: 'Order at least 1.', defaultValue: 0 },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Quantity')).toHaveAttribute('aria-invalid', 'true')
    await expect(canvas.getByLabelText('Quantity')).toHaveAccessibleDescription('Order at least 1.')
  },
}

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Quantity')).toBeDisabled()
    await expect(canvas.getByRole('button', { name: /increase/i })).toBeDisabled()
  },
}

export const ReadOnly: Story = {
  args: { readOnly: true },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: /increase/i }))
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const Controlled: Story = {
  render: function Render(args) {
    const [n, setN] = useState<number | null>(3)
    return (
      <div style={{ display: 'grid', gap: 'var(--space-4)', justifyItems: 'start' }}>
        <NumberInput {...args} defaultValue={undefined} value={n} onValueChange={setN} />
        <span>Value: {n ?? 'empty'}</span>
      </div>
    )
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: /increase/i }))
    await expect(canvas.getByText('Value: 4')).toBeVisible()
  },
}

export const InAForm: Story = {
  render: (args) => (
    <form aria-label="Order">
      <NumberInput {...args} name="quantity" />
    </form>
  ),
  play: async ({ canvasElement }) => {
    await expect(new FormData(canvasElement.querySelector('form')!).get('quantity')).toBe('6')
  },
}
