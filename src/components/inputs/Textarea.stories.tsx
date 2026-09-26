import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn } from 'storybook/test'
import { Textarea } from './Textarea'

const meta = {
  title: 'Components/Inputs/Textarea',
  component: Textarea,
  // Definition of done: a11y must pass as an error, ahead of the global switch in preview.tsx.
  parameters: { a11y: { test: 'error' } },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    appearance: { control: 'inline-radio', options: ['outlined', 'filled', 'underlined', 'unstyled'] },
    validationState: { control: 'inline-radio', options: ['default', 'success', 'error'] },
    resize: { control: 'inline-radio', options: ['none', 'both', 'vertical', 'horizontal'] },
  },
  args: { label: 'Message', placeholder: 'Write a message…', onChange: fn() },
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

const stack = { display: 'grid', gap: 'var(--space-4)', justifyItems: 'start' }

export const Default: Story = {
  play: async ({ canvas, userEvent, args }) => {
    const box = canvas.getByLabelText('Message')
    await expect(box.tagName).toBe('TEXTAREA')
    await userEvent.type(box, 'Line one{Enter}Line two')
    await expect(box).toHaveValue('Line one\nLine two')
    await expect(args.onChange).toHaveBeenCalled()
  },
}

export const Appearances: Story = {
  render: (args) => (
    <div style={stack}>
      {(['outlined', 'filled', 'underlined', 'unstyled'] as const).map((appearance) => (
        <Textarea key={appearance} {...args} appearance={appearance} label={appearance} minRows={2} />
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div style={stack}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Textarea key={size} {...args} size={size} label={size} minRows={2} />
      ))}
    </div>
  ),
}

export const Rows: Story = {
  args: { minRows: 5 },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Message')).toHaveAttribute('rows', '5')
  },
}

export const AutoSize: Story = {
  args: { hasAutoSize: true, minRows: 2, maxRows: 5 },
  play: async ({ canvas, userEvent }) => {
    const box = canvas.getByLabelText('Message')
    const start = box.getBoundingClientRect().height
    await userEvent.type(box, 'one{Enter}two{Enter}three{Enter}four')
    const grown = box.getBoundingClientRect().height
    await expect(grown).toBeGreaterThan(start)
    // Past maxRows it stops growing and scrolls.
    await userEvent.type(box, '{Enter}five{Enter}six{Enter}seven{Enter}eight')
    const capped = box.getBoundingClientRect().height
    const line = parseFloat(getComputedStyle(box).lineHeight)
    await expect(capped).toBeLessThanOrEqual(line * 5 + 1)
    // And it shrinks again when text is removed.
    await userEvent.clear(box)
    await expect(box.getBoundingClientRect().height).toBeLessThan(grown)
  },
}

export const WithHelperText: Story = {
  args: { helperText: 'Markdown is supported.' },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Message')).toHaveAccessibleDescription('Markdown is supported.')
  },
}

export const Validation: Story = {
  args: { validationState: 'error', helperText: 'A message is required.', required: true },
  play: async ({ canvas }) => {
    const box = canvas.getByLabelText(/Message/)
    await expect(box).toHaveAttribute('aria-invalid', 'true')
    await expect(box).toBeRequired()
  },
}

export const MaxLength: Story = {
  args: { maxLength: 10 },
  play: async ({ canvas, userEvent }) => {
    const box = canvas.getByLabelText('Message')
    await userEvent.type(box, 'abcdefghijklmnop')
    await expect(box).toHaveValue('abcdefghij')
  },
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'Locked.' },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Message')).toBeDisabled()
  },
}

export const ReadOnly: Story = {
  args: { readOnly: true, defaultValue: 'Read only.' },
}

export const Controlled: Story = {
  render: function Render(args) {
    const [value, setValue] = useState('')
    return (
      <div style={stack}>
        <Textarea {...args} value={value} onChange={(e) => setValue(e.target.value)} hasAutoSize />
        <span>{value.length} characters</span>
      </div>
    )
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.type(canvas.getByLabelText('Message'), 'Hello')
    await expect(canvas.getByText('5 characters')).toBeVisible()
  },
}
