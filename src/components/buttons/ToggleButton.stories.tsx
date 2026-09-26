import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn } from 'storybook/test'
import { Icon } from '@/lib/icon'
import { ToggleButton } from './ToggleButton'

const meta = {
  title: 'Components/Buttons/ToggleButton',
  component: ToggleButton,
  // Definition of done: a11y must pass as an error, ahead of the global switch in preview.tsx.
  parameters: { a11y: { test: 'error' } },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'accent', 'secondary', 'destructive'] },
    appearance: { control: 'inline-radio', options: ['contained', 'outlined', 'ghost'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'xl'] },
    startIcon: { control: false },
    endIcon: { control: false },
  },
  args: { children: 'Subscribe', onPressedChange: fn() },
} satisfies Meta<typeof ToggleButton>

export default meta
type Story = StoryObj<typeof meta>

const row = { display: 'flex', flexWrap: 'wrap' as const, gap: 'var(--space-3)', alignItems: 'center' }
const grid = { display: 'grid', gap: 'var(--space-3)' }

export const Default: Story = {
  play: async ({ canvas, userEvent, args }) => {
    const toggle = canvas.getByRole('button', { name: 'Subscribe' })
    await expect(toggle).toHaveAttribute('aria-pressed', 'false')
    await userEvent.click(toggle)
    await expect(toggle).toHaveAttribute('aria-pressed', 'true')
    await expect(args.onPressedChange).toHaveBeenLastCalledWith(true)
    // Space and Enter both toggle, like any button.
    await userEvent.keyboard(' ')
    await expect(toggle).toHaveAttribute('aria-pressed', 'false')
    await userEvent.keyboard('{Enter}')
    await expect(toggle).toHaveAttribute('aria-pressed', 'true')
    // The name does not change with the state; aria-pressed carries it.
    await expect(toggle).toHaveAccessibleName('Subscribe')
  },
}

/** Each pair: unpressed, then pressed. Unpressed is always neutral. */
export const Matrix: Story = {
  render: (args) => (
    <div style={grid}>
      {(['contained', 'outlined', 'ghost'] as const).map((appearance) => (
        <div key={appearance} style={row}>
          {(['primary', 'accent', 'secondary', 'destructive'] as const).flatMap((variant) => [
            <ToggleButton key={`${variant}-off`} {...args} variant={variant} appearance={appearance}>
              {variant}
            </ToggleButton>,
            <ToggleButton key={`${variant}-on`} {...args} variant={variant} appearance={appearance} defaultPressed>
              {variant}
            </ToggleButton>,
          ])}
        </div>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div style={row}>
      {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <ToggleButton key={size} {...args} size={size} defaultPressed>
          {size}
        </ToggleButton>
      ))}
    </div>
  ),
}

export const IconOnly: Story = {
  args: { isIconOnly: true, 'aria-label': 'Favourite', children: <Icon name="star" />, appearance: 'ghost' },
  play: async ({ canvas, userEvent }) => {
    const toggle = canvas.getByRole('button', { name: 'Favourite' })
    await userEvent.click(toggle)
    await expect(toggle).toHaveAttribute('aria-pressed', 'true')
  },
}

export const WithIcon: Story = {
  args: { startIcon: <Icon name="star" />, children: 'Star', appearance: 'outlined', defaultPressed: true },
}

/** Controlled: the parent owns the state. */
export const Controlled: Story = {
  render: function Render(args) {
    const [on, setOn] = useState(false)
    return (
      <div style={row}>
        <ToggleButton {...args} pressed={on} onPressedChange={setOn}>
          Bold
        </ToggleButton>
        <span>{on ? 'Bold on' : 'Bold off'}</span>
      </div>
    )
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Bold' }))
    await expect(canvas.getByText('Bold on')).toBeVisible()
  },
}

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Subscribe' })).toBeDisabled()
  },
}

export const Loading: Story = {
  args: { isLoading: true },
  play: async ({ canvas, userEvent, args }) => {
    const toggle = canvas.getByRole('button', { name: 'Subscribe' })
    await expect(toggle).toHaveAttribute('aria-busy', 'true')
    // Focusable while busy, but pressing it does nothing.
    await userEvent.tab()
    await expect(toggle).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await userEvent.keyboard(' ')
    await expect(args.onPressedChange).not.toHaveBeenCalled()
    await expect(toggle).toHaveAttribute('aria-pressed', 'false')
  },
}
