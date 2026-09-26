import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn } from 'storybook/test'
import { Switch } from './Switch'

const meta = {
  title: 'Components/Controls/Switch',
  component: Switch,
  // Definition of done: a11y must pass as an error, ahead of the global switch in preview.tsx.
  parameters: { a11y: { test: 'error' } },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'inline-radio', options: ['primary', 'accent', 'secondary', 'destructive'] },
    validationState: { control: 'inline-radio', options: ['default', 'success', 'error'] },
  },
  args: { label: 'Email notifications', onCheckedChange: fn() },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

const stack = { display: 'grid', gap: 'var(--space-4)', justifyItems: 'start' }

export const Default: Story = {
  play: async ({ canvas, userEvent, args }) => {
    const control = canvas.getByRole('switch', { name: 'Email notifications' })
    await expect(control).toHaveAttribute('aria-checked', 'false')
    await userEvent.click(control)
    await expect(control).toHaveAttribute('aria-checked', 'true')
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(true)
    // Clicking the label toggles it too.
    await userEvent.click(canvas.getByText('Email notifications'))
    await expect(control).toHaveAttribute('aria-checked', 'false')
    // Space toggles from the keyboard.
    await userEvent.keyboard(' ')
    await expect(control).toHaveAttribute('aria-checked', 'true')
  },
}

export const Variants: Story = {
  render: (args) => (
    <div style={stack}>
      {(['primary', 'accent', 'secondary', 'destructive'] as const).map((variant) => (
        <Switch key={variant} {...args} variant={variant} label={variant} defaultChecked />
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div style={stack}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Switch key={size} {...args} size={size} label={size} defaultChecked />
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    const widths = ['sm', 'md', 'lg'].map(
      (n) => canvas.getByRole('switch', { name: n }).getBoundingClientRect().width,
    )
    await expect(widths).toEqual([28, 36, 44])
  },
}

export const WithHelperText: Story = {
  args: { helperText: 'A summary once a day, never more.' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('switch')).toHaveAccessibleDescription('A summary once a day, never more.')
  },
}

export const Validation: Story = {
  render: (args) => (
    <div style={stack}>
      <Switch {...args} label="Accept the terms" validationState="error" helperText="Required to continue." required />
      <Switch {...args} label="Backups" validationState="success" helperText="Backups are on." defaultChecked />
    </div>
  ),
  play: async ({ canvas }) => {
    const terms = canvas.getByRole('switch', { name: /Accept the terms/ })
    await expect(terms).toHaveAttribute('aria-invalid', 'true')
    await expect(terms).toHaveAccessibleDescription('Required to continue.')
  },
}

export const Disabled: Story = {
  render: (args) => (
    <div style={stack}>
      <Switch {...args} label="Off, disabled" disabled />
      <Switch {...args} label="On, disabled" disabled defaultChecked />
    </div>
  ),
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('switch', { name: 'Off, disabled' }))
    await expect(args.onCheckedChange).not.toHaveBeenCalled()
  },
}

export const ReadOnly: Story = {
  args: { readOnly: true, defaultChecked: true },
  play: async ({ canvas, userEvent, args }) => {
    const control = canvas.getByRole('switch')
    await userEvent.click(control)
    await expect(control).toHaveAttribute('aria-checked', 'true')
    await expect(args.onCheckedChange).not.toHaveBeenCalled()
  },
}

export const Controlled: Story = {
  render: function Render(args) {
    const [on, setOn] = useState(true)
    return (
      <div style={stack}>
        <Switch {...args} checked={on} onCheckedChange={setOn} />
        <span>{on ? 'Notifications on' : 'Notifications off'}</span>
      </div>
    )
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('switch'))
    await expect(canvas.getByText('Notifications off')).toBeVisible()
  },
}

/** Submits "on" under its name when on, like a native checkbox. */
export const InAForm: Story = {
  render: (args) => (
    <form aria-label="Settings">
      <Switch {...args} name="notify" defaultChecked />
    </form>
  ),
  play: async ({ canvasElement }) => {
    const data = new FormData(canvasElement.querySelector('form')!)
    await expect(data.get('notify')).toBe('on')
  },
}
