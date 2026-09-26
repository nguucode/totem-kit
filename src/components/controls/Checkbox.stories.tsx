import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn } from 'storybook/test'
import { Checkbox } from './Checkbox'

const meta = {
  title: 'Components/Controls/Checkbox',
  component: Checkbox,
  // Definition of done: a11y must pass as an error, ahead of the global switch in preview.tsx.
  parameters: { a11y: { test: 'error' } },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'neutral'] },
    validationState: { control: 'inline-radio', options: ['default', 'success', 'error'] },
  },
  args: { label: 'Remember me', onCheckedChange: fn() },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

const stack = { display: 'grid', gap: 'var(--space-4)', justifyItems: 'start' }

export const Default: Story = {
  play: async ({ canvas, userEvent, args }) => {
    const box = canvas.getByRole('checkbox', { name: 'Remember me' })
    await expect(box).not.toBeChecked()
    await userEvent.click(box)
    await expect(box).toBeChecked()
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(true)
    await userEvent.click(canvas.getByText('Remember me'))
    await expect(box).not.toBeChecked()
    await userEvent.keyboard(' ')
    await expect(box).toBeChecked()
  },
}

export const Variants: Story = {
  render: (args) => (
    <div style={stack}>
      {(['neutral', 'primary', 'secondary'] as const).map((variant) => (
        <div key={variant} style={{ display: 'flex', gap: 'var(--space-6)' }}>
          <Checkbox {...args} variant={variant} label={`${variant}, off`} />
          <Checkbox {...args} variant={variant} label={`${variant}, on`} defaultChecked />
          <Checkbox {...args} variant={variant} label={`${variant}, mixed`} isIndeterminate />
        </div>
      ))}
    </div>
  ),
}

export const WithHelperText: Story = {
  args: { helperText: 'Save my login details for next time.' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('checkbox')).toHaveAccessibleDescription('Save my login details for next time.')
  },
}

export const Indeterminate: Story = {
  args: { isIndeterminate: true, label: 'Select all' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('checkbox')).toHaveAttribute('aria-checked', 'mixed')
  },
}

/** The usual job of indeterminate: a parent that reflects its children. */
export const SelectAll: Story = {
  render: function Render(args) {
    const [items, setItems] = useState({ Email: true, SMS: false, Push: false })
    const values = Object.values(items)
    const all = values.every(Boolean)
    const some = values.some(Boolean)
    return (
      <div style={stack}>
        <Checkbox
          {...args}
          label="All channels"
          checked={all}
          isIndeterminate={some && !all}
          onCheckedChange={(on) => setItems({ Email: on, SMS: on, Push: on })}
        />
        <div style={{ ...stack, paddingInlineStart: 'var(--space-6)' }}>
          {Object.entries(items).map(([name, on]) => (
            <Checkbox
              key={name}
              label={name}
              checked={on}
              onCheckedChange={(next) => setItems({ ...items, [name]: next })}
            />
          ))}
        </div>
      </div>
    )
  },
  play: async ({ canvas, userEvent }) => {
    const parent = canvas.getByRole('checkbox', { name: 'All channels' })
    await expect(parent).toHaveAttribute('aria-checked', 'mixed')
    await userEvent.click(parent)
    await expect(canvas.getByRole('checkbox', { name: 'Push' })).toBeChecked()
    await expect(parent).toHaveAttribute('aria-checked', 'true')
  },
}

export const Validation: Story = {
  render: (args) => (
    <div style={stack}>
      <Checkbox {...args} label="I accept the terms" validationState="error" helperText="Accept the terms to continue." required />
      <Checkbox {...args} label="Newsletter" validationState="success" helperText="Subscribed." defaultChecked />
    </div>
  ),
  play: async ({ canvas }) => {
    const terms = canvas.getByRole('checkbox', { name: /I accept the terms/ })
    await expect(terms).toHaveAttribute('aria-invalid', 'true')
    await expect(terms).toHaveAccessibleDescription('Accept the terms to continue.')
  },
}

export const Disabled: Story = {
  render: (args) => (
    <div style={stack}>
      <Checkbox {...args} label="Off, disabled" disabled />
      <Checkbox {...args} label="On, disabled" disabled defaultChecked />
    </div>
  ),
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Off, disabled' }))
    await expect(args.onCheckedChange).not.toHaveBeenCalled()
  },
}

export const ReadOnly: Story = {
  args: { readOnly: true, defaultChecked: true },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('checkbox'))
    await expect(canvas.getByRole('checkbox')).toBeChecked()
    await expect(args.onCheckedChange).not.toHaveBeenCalled()
  },
}

export const AutoFocus: Story = {
  args: { autoFocus: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('checkbox')).toHaveFocus()
  },
}

export const InAForm: Story = {
  render: (args) => (
    <form aria-label="Login">
      <Checkbox {...args} name="remember" value="yes" defaultChecked />
    </form>
  ),
  play: async ({ canvasElement }) => {
    await expect(new FormData(canvasElement.querySelector('form')!).get('remember')).toBe('yes')
  },
}
