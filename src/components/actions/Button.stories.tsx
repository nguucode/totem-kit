import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { Button } from './Button'

const meta = {
  title: 'Components/Actions/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'destructive', 'outline', 'ghost', 'link'],
    },
    size: { control: 'select', options: ['sm', 'md', 'lg', 'icon'] },
  },
  args: {
    children: 'Button',
    onClick: fn(),
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: { variant: 'primary' },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Button' }))
    await expect(args.onClick).toHaveBeenCalledOnce()
  },
}

export const Secondary: Story = {
  args: { variant: 'secondary' },
}

export const Destructive: Story = {
  args: { variant: 'destructive' },
}

export const Outline: Story = {
  args: { variant: 'outline' },
}

export const Ghost: Story = {
  args: { variant: 'ghost' },
}

export const Link: Story = {
  args: { variant: 'link' },
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
      <Button {...args} size="sm" />
      <Button {...args} size="md" />
      <Button {...args} size="lg" />
    </div>
  ),
}

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas }) => {
    // disabled:pointer-events-none means a real click never reaches the
    // button, so the meaningful assertion is the disabled state itself.
    await expect(canvas.getByRole('button', { name: 'Button' })).toBeDisabled()
  },
}

export const AsChild: Story = {
  args: {
    asChild: true,
    children: <a href="#totem">Button</a>,
  },
  play: async ({ canvas }) => {
    // asChild should merge the button styles onto the <a>, not render a <button>.
    const link = canvas.getByRole('link', { name: 'Button' })
    await expect(link).toHaveAttribute('href', '#totem')
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument()

    // Styling a link as a Button must not take away the hand the browser
    // gives every other link. Compared against a bare <a href> rather than
    // the literal 'pointer', so overriding --cursor-link keeps this honest.
    const bare = document.createElement('a')
    bare.href = '#'
    document.body.append(bare)
    await expect(getComputedStyle(link).cursor).toBe(getComputedStyle(bare).cursor)
    bare.remove()
  },
}
