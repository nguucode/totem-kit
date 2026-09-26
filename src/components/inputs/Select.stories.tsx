import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn, screen, waitFor } from 'storybook/test'
import { Select } from './Select'

const members = [
  { value: 'miya', label: 'Miya Burns' },
  { value: 'marlone', label: 'Marlone Thompson' },
  { value: 'phoenix', label: 'Phoenix Hickman' },
  { value: 'angelica', label: 'Angelica Mathews', disabled: true },
  { value: 'candice', label: 'Candice Wu' },
]

const meta = {
  title: 'Components/Inputs/Select',
  component: Select,
  // Definition of done: a11y must pass as an error, ahead of the global switch in preview.tsx.
  parameters: { a11y: { test: 'error' } },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    appearance: { control: 'inline-radio', options: ['outlined', 'filled', 'underlined', 'unstyled'] },
    validationState: { control: 'inline-radio', options: ['default', 'success', 'error'] },
  },
  args: { label: 'Team member', placeholder: 'Choose someone', options: members, onValueChange: fn() },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas, userEvent, args }) => {
    const trigger = canvas.getByRole('combobox', { name: 'Team member' })
    await expect(trigger).toHaveTextContent('Choose someone')
    await userEvent.click(trigger)
    // The list renders in a portal at the end of <body>.
    await userEvent.click(await screen.findByRole('option', { name: 'Phoenix Hickman' }))
    await expect(args.onValueChange).toHaveBeenLastCalledWith('phoenix')
    await waitFor(() => expect(trigger).toHaveTextContent('Phoenix Hickman'))
  },
}

export const Keyboard: Story = {
  play: async ({ canvas, userEvent, args }) => {
    const trigger = canvas.getByRole('combobox', { name: 'Team member' })
    await userEvent.tab()
    await expect(trigger).toHaveFocus()
    await userEvent.keyboard('{ArrowDown}')
    await screen.findByRole('listbox')
    // Arrow down past the first option, skip the disabled one, Enter selects.
    await userEvent.keyboard('{ArrowDown}{Enter}')
    await waitFor(() => expect(args.onValueChange).toHaveBeenCalled())
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
    await expect(trigger).toHaveFocus()
  },
}

export const Strings: Story = {
  args: { label: 'Size', placeholder: 'Pick a size', options: ['Small', 'Medium', 'Large'], defaultValue: 'Medium' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('combobox', { name: 'Size' })).toHaveTextContent('Medium')
  },
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--space-4)', justifyItems: 'start' }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Select key={size} {...args} size={size} label={size} />
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    const heights = ['sm', 'md', 'lg'].map((n) => canvas.getByRole('combobox', { name: n }).getBoundingClientRect().height)
    await expect(heights).toEqual([32, 40, 48])
  },
}

export const Appearances: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--space-4)', justifyItems: 'start' }}>
      {(['outlined', 'filled', 'underlined', 'unstyled'] as const).map((appearance) => (
        <Select key={appearance} {...args} appearance={appearance} label={appearance} defaultValue="marlone" />
      ))}
    </div>
  ),
}

export const Validation: Story = {
  args: { validationState: 'error', helperText: 'Choose someone to assign.', required: true },
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('combobox', { name: /Team member/ })
    await expect(trigger).toHaveAttribute('aria-invalid', 'true')
    await expect(trigger).toHaveAccessibleDescription('Choose someone to assign.')
  },
}

export const Loading: Story = {
  args: { isLoading: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('combobox')).toHaveAttribute('aria-busy', 'true')
  },
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'miya' },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('combobox'))
    await expect(screen.queryByRole('listbox')).toBeNull()
  },
}

export const ReadOnly: Story = {
  args: { readOnly: true, defaultValue: 'miya' },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('combobox'))
    await expect(screen.queryByRole('listbox')).toBeNull()
  },
}

export const Controlled: Story = {
  render: function Render(args) {
    const [who, setWho] = useState<string | null>('miya')
    return (
      <div style={{ display: 'grid', gap: 'var(--space-4)', justifyItems: 'start' }}>
        <Select {...args} value={who} onValueChange={setWho} />
        <span>Assigned: {who ?? 'nobody'}</span>
      </div>
    )
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('combobox'))
    await userEvent.click(await screen.findByRole('option', { name: 'Candice Wu' }))
    await expect(canvas.getByText('Assigned: candice')).toBeVisible()
  },
}

export const InAForm: Story = {
  render: (args) => (
    <form aria-label="Assign">
      <Select {...args} name="assignee" defaultValue="marlone" />
    </form>
  ),
  play: async ({ canvasElement }) => {
    await expect(new FormData(canvasElement.querySelector('form')!).get('assignee')).toBe('marlone')
  },
}
