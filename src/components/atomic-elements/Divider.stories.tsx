import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Divider } from './Divider'

const meta = {
  title: 'Components/Atomic Elements/Divider',
  component: Divider,
  // Definition of done: a11y must pass as an error, ahead of the global switch in preview.tsx.
  parameters: { a11y: { test: 'error' } },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    appearance: { control: 'inline-radio', options: ['solid', 'dashed'] },
  },
  decorators: [
    (Story, { args }) =>
      args.orientation === 'vertical' ? (
        <div style={{ display: 'flex', gap: 'var(--space-4)', height: 'var(--space-12)' }}>
          <span>Left</span>
          <Story />
          <span>Right</span>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
          <span>Above</span>
          <Story />
          <span>Below</span>
        </div>
      ),
  ],
} satisfies Meta<typeof Divider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    const divider = canvas.getByRole('separator')
    // Horizontal is the implicit orientation of <hr>; saying it again is noise.
    await expect(divider).not.toHaveAttribute('aria-orientation')
    await expect(getComputedStyle(divider).borderTopWidth).toBe('1px')
  },
}

export const Vertical: Story = {
  args: { orientation: 'vertical' },
  play: async ({ canvas }) => {
    const divider = canvas.getByRole('separator')
    await expect(divider).toHaveAttribute('aria-orientation', 'vertical')
    await expect(divider.getBoundingClientRect().height).toBeGreaterThan(0)
  },
}

export const Sizes: Story = {
  render: (args) => (
    <>
      <Divider {...args} size="sm" />
      <Divider {...args} size="md" />
      <Divider {...args} size="lg" />
    </>
  ),
  play: async ({ canvas }) => {
    const widths = canvas.getAllByRole('separator').map((d) => getComputedStyle(d).borderTopWidth)
    await expect(widths).toEqual(['1px', '2px', '4px'])
  },
}

export const VerticalSizes: Story = {
  ...Sizes,
  args: { orientation: 'vertical' },
  play: async ({ canvas }) => {
    const dividers = canvas.getAllByRole('separator')
    await expect(dividers.map((d) => getComputedStyle(d).borderLeftWidth)).toEqual(['1px', '2px', '4px'])
    // The box is only as wide as its line.
    await expect(dividers.map((d) => d.getBoundingClientRect().width)).toEqual([1, 2, 4])
  },
}

export const Dashed: Story = {
  args: { appearance: 'dashed', size: 'md' },
  play: async ({ canvas }) => {
    await expect(getComputedStyle(canvas.getByRole('separator')).borderTopStyle).toBe('dashed')
  },
}

export const Inset: Story = {
  args: { inset: true },
  play: async ({ canvas }) => {
    const divider = canvas.getByRole('separator')
    const parent = divider.parentElement!.getBoundingClientRect()
    await expect(divider.getBoundingClientRect().width).toBeLessThan(parent.width)
  },
}

export const VerticalDashed: Story = {
  args: { orientation: 'vertical', appearance: 'dashed', size: 'md' },
  play: async ({ canvas }) => {
    await expect(getComputedStyle(canvas.getByRole('separator')).borderLeftStyle).toBe('dashed')
  },
}

export const VerticalInset: Story = {
  args: { orientation: 'vertical', inset: true },
  play: async ({ canvas }) => {
    const divider = canvas.getByRole('separator')
    const row = divider.parentElement!.getBoundingClientRect()
    await expect(divider.getBoundingClientRect().height).toBeLessThan(row.height)
  },
}
