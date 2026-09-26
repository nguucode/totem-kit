import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn } from 'storybook/test'
import { RadioGroup } from './Radio'

const plans = [
  { value: 'free', label: 'Free', helperText: 'One project, community support.' },
  { value: 'pro', label: 'Pro', helperText: 'Unlimited projects.' },
  { value: 'team', label: 'Team', helperText: 'Pro, plus shared billing.' },
]

const meta = {
  title: 'Components/Controls/Radio',
  component: RadioGroup,
  // Definition of done: a11y must pass as an error, ahead of the global switch in preview.tsx.
  parameters: { a11y: { test: 'error' } },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'neutral'] },
    orientation: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
    validationState: { control: 'inline-radio', options: ['default', 'success', 'error'] },
  },
  args: { label: 'Plan', options: plans, onValueChange: fn() },
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas, userEvent, args }) => {
    const group = canvas.getByRole('radiogroup', { name: 'Plan' })
    await expect(group).toBeVisible()
    await userEvent.click(canvas.getByRole('radio', { name: 'Pro' }))
    await expect(canvas.getByRole('radio', { name: 'Pro' })).toBeChecked()
    await expect(args.onValueChange).toHaveBeenLastCalledWith('pro')
    // Arrow keys move the selection within the group.
    await userEvent.keyboard('{ArrowDown}')
    await expect(canvas.getByRole('radio', { name: 'Team' })).toBeChecked()
    await expect(canvas.getByRole('radio', { name: 'Team' })).toHaveFocus()
    // One tab stop for the whole group: Tab leaves it.
    await userEvent.tab()
    await expect(canvas.getByRole('radio', { name: 'Free' })).not.toHaveFocus()
  },
}

export const OptionHelperText: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('radio', { name: 'Pro' })).toHaveAccessibleDescription('Unlimited projects.')
  },
}

export const GroupHelperText: Story = {
  args: { helperText: 'You can change plans at any time.' },
  play: async ({ canvas }) => {
    // Plain help describes the group once, not every option again.
    await expect(canvas.getByRole('radiogroup')).toHaveAccessibleDescription('You can change plans at any time.')
    await expect(canvas.getByRole('radio', { name: 'Pro' })).toHaveAccessibleDescription('Unlimited projects.')
  },
}

export const ReadOnly: Story = {
  args: { readOnly: true, defaultValue: 'pro' },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('radio', { name: 'Team' }))
    await expect(canvas.getByRole('radio', { name: 'Pro' })).toBeChecked()
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'free' },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('radio', { name: 'Team' }))
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--space-12)' }}>
      {(['neutral', 'primary', 'secondary'] as const).map((variant) => (
        <RadioGroup key={variant} {...args} label={variant} variant={variant} defaultValue="pro" />
      ))}
    </div>
  ),
}

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
    label: 'Size',
    options: [
      { value: 's', label: 'Small' },
      { value: 'm', label: 'Medium' },
      { value: 'l', label: 'Large' },
    ],
    defaultValue: 'm',
  },
}

export const Validation: Story = {
  args: { validationState: 'error', helperText: 'Choose a plan to continue.', required: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('radio', { name: 'Free' })).toHaveAttribute('aria-invalid', 'true')
    await expect(canvas.getByText('Choose a plan to continue.')).toBeVisible()
    // The error message reaches each radio, so whichever has focus says it.
    await expect(canvas.getByRole('radio', { name: 'Free' })).toHaveAccessibleDescription(/Choose a plan to continue\./)
    // Only the group message is in the error colour, not each option's help.
    const colour = (t: string) => getComputedStyle(canvas.getByText(t)).color
    await expect(colour('Unlimited projects.')).not.toBe(colour('Choose a plan to continue.'))
  },
}

export const DisabledOption: Story = {
  args: { options: plans.map((p) => (p.value === 'team' ? { ...p, disabled: true } : p)), defaultValue: 'pro' },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('radio', { name: 'Pro' }))
    // Arrow keys skip the disabled option.
    await userEvent.keyboard('{ArrowDown}')
    await expect(canvas.getByRole('radio', { name: 'Team' })).not.toBeChecked()
  },
}

export const Controlled: Story = {
  render: function Render(args) {
    const [plan, setPlan] = useState('free')
    return (
      <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
        <RadioGroup {...args} value={plan} onValueChange={setPlan} />
        <span>Selected: {plan}</span>
      </div>
    )
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('radio', { name: 'Team' }))
    await expect(canvas.getByText('Selected: team')).toBeVisible()
  },
}

export const InAForm: Story = {
  render: (args) => (
    <form aria-label="Signup">
      <RadioGroup {...args} name="plan" defaultValue="pro" />
    </form>
  ),
  play: async ({ canvasElement }) => {
    await expect(new FormData(canvasElement.querySelector('form')!).get('plan')).toBe('pro')
  },
}
