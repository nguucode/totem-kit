import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { Icon } from '@/lib/icon'
import { Button } from './Button'

const meta = {
  title: 'Components/Buttons/Button',
  component: Button,
  // Definition of done: a11y must pass as an error, ahead of the global switch in preview.tsx.
  parameters: { a11y: { test: 'error' } },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'accent', 'secondary', 'destructive'] },
    appearance: { control: 'inline-radio', options: ['contained', 'outlined', 'ghost'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'xl'] },
    startIcon: { control: false },
    endIcon: { control: false },
    render: { control: false },
  },
  args: { children: 'Button', onClick: fn() },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

const row = { display: 'flex', flexWrap: 'wrap' as const, gap: 'var(--space-3)', alignItems: 'center' }
const grid = { display: 'grid', gap: 'var(--space-3)' }

export const Default: Story = {
  play: async ({ canvas, userEvent, args }) => {
    const button = canvas.getByRole('button', { name: 'Button' })
    await expect(button).toHaveAttribute('type', 'button')
    await userEvent.click(button)
    await userEvent.keyboard('{Enter}')
    await userEvent.keyboard(' ')
    await expect(args.onClick).toHaveBeenCalledTimes(3)
  },
}

export const Matrix: Story = {
  render: (args) => (
    <div style={grid}>
      {(['contained', 'outlined', 'ghost'] as const).map((appearance) => (
        <div key={appearance} style={row}>
          {(['primary', 'accent', 'secondary', 'destructive'] as const).map((variant) => (
            <Button key={variant} {...args} variant={variant} appearance={appearance}>
              {variant}
            </Button>
          ))}
        </div>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div style={row}>
      {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Button key={size} {...args} size={size}>
          {size}
        </Button>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    const heights = ['sm', 'md', 'lg', 'xl'].map(
      (n) => canvas.getByRole('button', { name: n }).getBoundingClientRect().height,
    )
    await expect(heights).toEqual([32, 40, 48, 56])
  },
}

export const WithIcons: Story = {
  args: { startIcon: <Icon name="plus" />, endIcon: <Icon name="chevron-down" />, children: 'Add product' },
  play: async ({ canvas }) => {
    // Icons are decoration; the name is the label alone.
    await expect(canvas.getByRole('button')).toHaveAccessibleName('Add product')
  },
}

export const IconOnly: Story = {
  args: { isIconOnly: true, 'aria-label': 'Close', children: <Icon name="close" /> },
  render: (args) => (
    <div style={row}>
      {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Button key={size} {...args} size={size} appearance="ghost" />
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    const [sm] = canvas.getAllByRole('button', { name: 'Close' })
    const box = sm.getBoundingClientRect()
    await expect(box.width).toBe(box.height)
  },
}

export const Loading: Story = {
  args: { isLoading: true, children: 'Save' },
  play: async ({ canvas, userEvent, args }) => {
    const button = canvas.getByRole('button', { name: 'Save' })
    await expect(button).toHaveAttribute('aria-busy', 'true')
    await expect(button).toHaveAttribute('aria-disabled', 'true')
    // Still in the tab order, so focus is not dropped mid-submit...
    await userEvent.tab()
    await expect(button).toHaveFocus()
    // ...but it does not act.
    await userEvent.keyboard('{Enter}')
    await expect(args.onClick).not.toHaveBeenCalled()
  },
}

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Button' })).toBeDisabled()
  },
}

export const Href: Story = {
  args: { href: '#zweihander', children: 'Documentation' },
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: 'Documentation' })
    await expect(link).toHaveAttribute('href', '#zweihander')
    await expect(link).not.toHaveAttribute('type')
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

export const DisabledHref: Story = {
  args: { href: '#zweihander', disabled: true, children: 'Documentation' },
  play: async ({ canvasElement }) => {
    // No href is what actually stops an <a> navigating.
    const a = canvasElement.querySelector('a')!
    await expect(a).not.toHaveAttribute('href')
    await expect(a).toHaveAttribute('aria-disabled', 'true')
  },
}

/** A router's Link, or any element: props and styles merge onto it. */
export const Render: Story = {
  args: { render: <a href="#settings" />, children: 'Settings', variant: 'secondary' },
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: 'Settings' })
    // The render element's own href survives.
    await expect(link).toHaveAttribute('href', '#settings')
    await expect(link).not.toHaveAttribute('role')
  },
}

export const FullWidth: Story = {
  args: { isFullWidth: true },
  render: (args) => (
    <div style={{ inlineSize: '20rem' }}>
      <Button {...args} />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button').getBoundingClientRect().width).toBe(320)
  },
}
