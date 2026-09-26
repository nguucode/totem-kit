import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn } from 'storybook/test'
import { Search } from './Search'

const meta = {
  title: 'Components/Inputs/Search',
  component: Search,
  // Definition of done: a11y must pass as an error, ahead of the global switch in preview.tsx.
  parameters: { a11y: { test: 'error' } },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    appearance: { control: 'inline-radio', options: ['outlined', 'filled', 'underlined', 'unstyled'] },
  },
  args: { onChange: fn() },
} satisfies Meta<typeof Search>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    const field = canvas.getByRole('searchbox', { name: 'Search' })
    await expect(field).toHaveAttribute('placeholder', 'Search')
    // No clear button until there is something to clear.
    await expect(canvas.queryByRole('button', { name: 'Clear search' })).toBeNull()
    await userEvent.type(field, 'badge')
    await expect(field).toHaveValue('badge')
  },
}

export const Clear: Story = {
  args: { defaultValue: 'tooltip' },
  play: async ({ canvas, userEvent, args }) => {
    const field = canvas.getByRole('searchbox')
    await userEvent.click(canvas.getByRole('button', { name: 'Clear search' }))
    await expect(field).toHaveValue('')
    // Focus returns to the field, and onChange hears about it.
    await expect(field).toHaveFocus()
    await expect(args.onChange).toHaveBeenCalled()
    await expect(canvas.queryByRole('button', { name: 'Clear search' })).toBeNull()
  },
}

export const EscapeClears: Story = {
  args: { defaultValue: 'modal' },
  play: async ({ canvas, userEvent }) => {
    const field = canvas.getByRole('searchbox')
    await userEvent.click(field)
    await userEvent.keyboard('{Escape}')
    await expect(field).toHaveValue('')
  },
}

export const Controlled: Story = {
  render: function Render(args) {
    const [q, setQ] = useState('card')
    return (
      <div style={{ display: 'grid', gap: 'var(--space-4)', justifyItems: 'start' }}>
        <Search {...args} value={q} onChange={(e) => setQ(e.target.value)} />
        <span>Query: “{q}”</span>
      </div>
    )
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Clear search' }))
    await expect(canvas.getByText('Query: “”')).toBeVisible()
    await userEvent.type(canvas.getByRole('searchbox'), 'tag')
    await expect(canvas.getByText('Query: “tag”')).toBeVisible()
  },
}

export const WithLabel: Story = {
  args: { label: 'Find a component' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('searchbox', { name: 'Find a component' })).toBeVisible()
  },
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--space-4)', justifyItems: 'start' }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Search key={size} {...args} size={size} aria-label={`Search ${size}`} defaultValue="query" />
      ))}
    </div>
  ),
}

export const FullWidth: Story = {
  args: { isFullWidth: true },
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'locked' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('searchbox')).toBeDisabled()
    await expect(canvas.queryByRole('button', { name: 'Clear search' })).toBeNull()
  },
}

export const ReadOnly: Story = {
  args: { readOnly: true, defaultValue: 'fixed' },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('button', { name: 'Clear search' })).toBeNull()
  },
}
