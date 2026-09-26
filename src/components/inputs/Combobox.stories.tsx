import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn, screen, waitFor } from 'storybook/test'
import { Combobox } from './Combobox'

const members = [
  { value: 'miya', label: 'Miya Burns' },
  { value: 'marlone', label: 'Marlone Thompson' },
  { value: 'phoenix', label: 'Phoenix Hickman' },
  { value: 'angelica', label: 'Angelica Mathews', disabled: true },
  { value: 'candice', label: 'Candice Wu' },
]

const meta = {
  title: 'Components/Inputs/Combobox',
  component: Combobox,
  // Definition of done: a11y must pass as an error, ahead of the global switch in preview.tsx.
  parameters: { a11y: { test: 'error' } },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    appearance: { control: 'inline-radio', options: ['outlined', 'filled', 'underlined', 'unstyled'] },
    validationState: { control: 'inline-radio', options: ['default', 'success', 'error'] },
  },
  args: { label: 'Team member', placeholder: 'Type a name', options: members, onValueChange: fn() },
} satisfies Meta<typeof Combobox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas, userEvent, args }) => {
    const input = canvas.getByRole('combobox', { name: 'Team member' })
    await userEvent.type(input, 'thom')
    // Only matching options remain; the match is marked.
    const option = await screen.findByRole('option', { name: 'Marlone Thompson' })
    await expect(screen.queryByRole('option', { name: 'Miya Burns' })).toBeNull()
    await expect(option.querySelector('mark')).toHaveTextContent('Thom')
    // The first match is highlighted, so Enter picks it.
    await userEvent.keyboard('{Enter}')
    await expect(args.onValueChange).toHaveBeenLastCalledWith('marlone')
    await waitFor(() => expect(input).toHaveValue('Marlone Thompson'))
  },
}

/** The chosen option keeps its check while the user types again. */
export const KeepsSelection: Story = {
  args: { defaultValue: 'phoenix' },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Show options' }))
    const chosen = await screen.findByRole('option', { name: 'Phoenix Hickman' })
    await expect(chosen).toHaveAttribute('aria-selected', 'true')
    // Nothing is marked: the input holds a chosen label, not a query.
    await expect(screen.queryAllByRole('option').some((o) => o.querySelector('mark'))).toBe(false)
  },
}

export const Empty: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.type(canvas.getByRole('combobox'), 'zzz')
    // The popup fades in over 100ms, so the message exists before it is
    // visible: wait for visibility, not presence.
    await waitFor(() => expect(screen.getByText('No matches')).toBeVisible(), { timeout: 3000 })
  },
}

export const Clear: Story = {
  args: { defaultValue: 'phoenix' },
  play: async ({ canvas, userEvent, args }) => {
    const input = canvas.getByRole('combobox')
    await expect(input).toHaveValue('Phoenix Hickman')
    await userEvent.click(canvas.getByRole('button', { name: 'Clear selection' }))
    await expect(input).toHaveValue('')
    await expect(args.onValueChange).toHaveBeenLastCalledWith(null)
  },
}

export const NotClearable: Story = {
  args: { isClearable: false, defaultValue: 'miya' },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('button', { name: 'Clear selection' })).toBeNull()
  },
}

export const OpenButton: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Show options' }))
    await expect(await screen.findAllByRole('option')).toHaveLength(5)
  },
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--space-4)', justifyItems: 'start' }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Combobox key={size} {...args} size={size} label={size} defaultValue="marlone" />
      ))}
    </div>
  ),
}

export const Appearances: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--space-4)', justifyItems: 'start' }}>
      {(['outlined', 'filled', 'underlined', 'unstyled'] as const).map((appearance) => (
        <Combobox key={appearance} {...args} appearance={appearance} label={appearance} />
      ))}
    </div>
  ),
}

export const Validation: Story = {
  args: { validationState: 'error', helperText: 'Choose someone to assign.', required: true },
  play: async ({ canvas }) => {
    const input = canvas.getByRole('combobox', { name: /Team member/ })
    await expect(input).toHaveAttribute('aria-invalid', 'true')
    await expect(input).toHaveAccessibleDescription('Choose someone to assign.')
  },
}

export const Loading: Story = {
  args: { isLoading: true, options: [] },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('combobox'))
    await waitFor(() => expect(screen.getByText('Loading…')).toBeVisible(), { timeout: 3000 })
  },
}

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('combobox')).toBeDisabled()
  },
}

export const Controlled: Story = {
  render: function Render(args) {
    const [who, setWho] = useState<string | null>(null)
    return (
      <div style={{ display: 'grid', gap: 'var(--space-4)', justifyItems: 'start' }}>
        <Combobox {...args} value={who} onValueChange={setWho} />
        <span>Assigned: {who ?? 'nobody'}</span>
      </div>
    )
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.type(canvas.getByRole('combobox'), 'candi')
    await userEvent.keyboard('{Enter}')
    await expect(canvas.getByText('Assigned: candice')).toBeVisible()
  },
}

export const InAForm: Story = {
  render: (args) => (
    <form aria-label="Assign">
      <Combobox {...args} name="assignee" defaultValue="miya" />
    </form>
  ),
  play: async ({ canvasElement }) => {
    await expect(new FormData(canvasElement.querySelector('form')!).get('assignee')).toBe('miya')
  },
}
