import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn } from 'storybook/test'
import { Icon } from '@/lib/icon'
import { TextInput } from './TextInput'

const meta = {
  title: 'Components/Inputs/TextInput',
  component: TextInput,
  // Definition of done: a11y must pass as an error, ahead of the global switch in preview.tsx.
  parameters: { a11y: { test: 'error' } },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    appearance: { control: 'inline-radio', options: ['outlined', 'filled', 'underlined', 'unstyled'] },
    validationState: { control: 'inline-radio', options: ['default', 'success', 'error'] },
    prefix: { control: false },
    suffix: { control: false },
  },
  args: { label: 'Email', placeholder: 'you@example.com', onChange: fn() },
} satisfies Meta<typeof TextInput>

export default meta
type Story = StoryObj<typeof meta>

const stack = { display: 'grid', gap: 'var(--space-4)', justifyItems: 'start' }

export const Default: Story = {
  play: async ({ canvas, userEvent, args }) => {
    const input = canvas.getByLabelText('Email')
    await userEvent.type(input, 'user@zweihander.dev')
    await expect(input).toHaveValue('user@zweihander.dev')
    // onChange is the native event, as on a plain <input>.
    await expect(args.onChange).toHaveBeenCalled()
    await expect((args.onChange as ReturnType<typeof fn>).mock.calls[0][0]).toHaveProperty('target')
  },
}

export const LabelAssociation: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByText('Email'))
    await expect(canvas.getByLabelText('Email')).toHaveFocus()
  },
}

export const Appearances: Story = {
  render: (args) => (
    <div style={stack}>
      {(['outlined', 'filled', 'underlined', 'unstyled'] as const).map((appearance) => (
        <TextInput key={appearance} {...args} appearance={appearance} label={appearance} />
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div style={stack}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <TextInput key={size} {...args} size={size} label={size} />
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    const heights = ['sm', 'md', 'lg'].map(
      (n) => canvas.getByLabelText(n).parentElement!.getBoundingClientRect().height,
    )
    await expect(heights).toEqual([32, 40, 48])
  },
}

export const PrefixSuffix: Story = {
  render: (args) => (
    <div style={stack}>
      <TextInput {...args} label="Email" prefix={<Icon name="user" />} />
      <TextInput {...args} label="Website" placeholder="example.com" prefix="https://" />
      <TextInput {...args} label="Weight" placeholder="0" suffix="kg" />
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    // Pressing the prefix focuses the input, as the rest of the field does.
    await userEvent.click(canvas.getByText('https://'))
    await expect(canvas.getByLabelText('Website')).toHaveFocus()
  },
}

export const WithHelperText: Story = {
  args: { helperText: 'We only use this for account recovery.' },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Email')).toHaveAccessibleDescription('We only use this for account recovery.')
  },
}

export const Validation: Story = {
  render: (args) => (
    <div style={stack}>
      <TextInput {...args} label="Email" defaultValue="not-an-email" validationState="error" helperText="Enter a valid email address." />
      <TextInput {...args} label="Username" defaultValue="okami" validationState="success" helperText="That name is free." />
    </div>
  ),
  play: async ({ canvas }) => {
    const email = canvas.getByLabelText('Email')
    await expect(email).toHaveAttribute('aria-invalid', 'true')
    await expect(email).toHaveAccessibleDescription('Enter a valid email address.')
  },
}

export const Required: Story = {
  args: { required: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText(/Email/)).toBeRequired()
  },
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'locked@zweihander.dev' },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Email')).toBeDisabled()
  },
}

export const ReadOnly: Story = {
  args: { readOnly: true, defaultValue: 'fixed@zweihander.dev' },
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByLabelText('Email')
    await userEvent.type(input, 'x')
    await expect(input).toHaveValue('fixed@zweihander.dev')
  },
}

export const FullWidth: Story = {
  args: { isFullWidth: true },
  render: (args) => (
    <div style={{ inlineSize: '30rem' }}>
      <TextInput {...args} />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Email').parentElement!.getBoundingClientRect().width).toBe(480)
  },
}

export const Controlled: Story = {
  render: function Render(args) {
    const [value, setValue] = useState('')
    return (
      <div style={stack}>
        <TextInput {...args} value={value} onChange={(e) => setValue(e.target.value.toUpperCase())} />
        <span>Value: {value}</span>
      </div>
    )
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.type(canvas.getByLabelText('Email'), 'abc')
    await expect(canvas.getByText('Value: ABC')).toBeVisible()
  },
}
