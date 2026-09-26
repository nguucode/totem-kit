import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn, waitFor } from 'storybook/test'
import { Accordion } from './Accordion'

const faq = [
  {
    value: 'install',
    title: 'How do I install it?',
    content: 'Copy a component with the shadcn CLI, or install the npm package and import it.',
  },
  {
    value: 'theme',
    title: 'Can I change the colours?',
    content: 'Wrap a subtree in Theme and pick an accent and a gray; every component follows.',
  },
  {
    value: 'dark',
    title: 'Does it support dark mode?',
    content: 'Yes. Add the dark class to any element and everything inside switches.',
  },
]

const meta = {
  title: 'Components/Data Display/Accordion',
  component: Accordion,
  // Definition of done: a11y must pass as an error, ahead of the global switch in preview.tsx.
  parameters: { a11y: { test: 'error' } },
  argTypes: {
    appearance: { control: 'inline-radio', options: ['outlined', 'flush'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    headingLevel: { control: 'inline-radio', options: [2, 3, 4, 5, 6] },
  },
  args: { items: faq, onValueChange: fn() },
  decorators: [(Story) => <div style={{ maxInlineSize: '32rem' }}>{Story()}</div>],
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas, userEvent, args }) => {
    const install = canvas.getByRole('button', { name: 'How do I install it?' })
    await expect(install).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(install)
    await expect(install).toHaveAttribute('aria-expanded', 'true')
    await expect(canvas.getByText(/Copy a component/)).toBeVisible()
    await expect(args.onValueChange).toHaveBeenLastCalledWith(['install'])
    // Single mode: opening another closes the first.
    await userEvent.click(canvas.getByRole('button', { name: 'Can I change the colours?' }))
    await expect(install).toHaveAttribute('aria-expanded', 'false')
    // Each trigger is a tab stop; Enter and Space toggle.
    await userEvent.tab()
    await expect(canvas.getByRole('button', { name: 'Does it support dark mode?' })).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await expect(canvas.getByRole('button', { name: 'Does it support dark mode?' })).toHaveAttribute('aria-expanded', 'true')
    await userEvent.keyboard(' ')
    await expect(canvas.getByRole('button', { name: 'Does it support dark mode?' })).toHaveAttribute('aria-expanded', 'false')
  },
}

export const Headings: Story = {
  args: { headingLevel: 2 },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('heading', { level: 2 })).toHaveLength(3)
  },
}

export const Multiple: Story = {
  args: { multiple: true, defaultValue: ['install'] },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Can I change the colours?' }))
    await expect(canvas.getByRole('button', { name: 'How do I install it?' })).toHaveAttribute('aria-expanded', 'true')
    await expect(canvas.getByRole('button', { name: 'Can I change the colours?' })).toHaveAttribute('aria-expanded', 'true')
  },
}

export const Flush: Story = {
  args: { appearance: 'flush', defaultValue: ['theme'] },
}

export const Small: Story = {
  args: { size: 'sm', defaultValue: ['install'] },
}

export const DisabledItem: Story = {
  args: { items: faq.map((i) => (i.value === 'dark' ? { ...i, disabled: true } : i)) },
  play: async ({ canvas, userEvent }) => {
    const dark = canvas.getByRole('button', { name: 'Does it support dark mode?' })
    await userEvent.click(dark)
    await expect(dark).toHaveAttribute('aria-expanded', 'false')
  },
}

/** Collapsed panels stay in the DOM, so find-in-page can reach them. */
export const FindInPage: Story = {
  play: async ({ canvasElement }) => {
    const panel = [...canvasElement.querySelectorAll('[hidden]')].find((el) =>
      el.textContent?.includes('Copy a component'),
    )
    await expect(panel).toHaveAttribute('hidden', 'until-found')
  },
}

export const Controlled: Story = {
  render: function Render(args) {
    const [open, setOpen] = useState<string[]>([])
    return (
      <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
        <Accordion {...args} value={open} onValueChange={setOpen} />
        <span>Open: {open.join(', ') || 'none'}</span>
      </div>
    )
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Can I change the colours?' }))
    await waitFor(() => expect(canvas.getByText('Open: theme')).toBeVisible())
  },
}
