import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { TextInput } from './TextInput'

const meta = {
  title: 'Molecules/Inputs/TextInput',
  component: TextInput,
  tags: ['autodocs'],
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
  },
} satisfies Meta<typeof TextInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByLabelText('Email')
    await userEvent.type(input, 'totem@kit.dev')
    await expect(input).toHaveValue('totem@kit.dev')
  },
}

export const LabelAssociation: Story = {
  // Radix Label.Root focuses the input it's `htmlFor` when clicked.
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByText('Email'))
    await expect(canvas.getByLabelText('Email')).toHaveFocus()
  },
}

export const WithHelperText: Story = {
  args: { helperText: 'We only use this for account recovery.' },
}

export const WithError: Story = {
  args: { error: 'Enter a valid email address.', defaultValue: 'not-an-email' },
  play: async ({ canvas }) => {
    const input = canvas.getByLabelText('Email')
    await expect(input).toHaveAttribute('aria-invalid', 'true')
    await expect(input).toHaveAccessibleDescription('Enter a valid email address.')
  },
}

export const Required: Story = {
  args: { required: true },
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'locked@totem.dev' },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Email')).toBeDisabled()
  },
}
