import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn } from 'storybook/test'
import { Icon } from '@/lib/icon'
import { Tag } from './Tag'

const portrait =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#c7d2fe"/><circle cx="32" cy="26" r="12" fill="#6366f1"/><rect x="12" y="42" width="40" height="30" rx="20" fill="#6366f1"/></svg>',
  )

const meta = {
  title: 'Components/Atomic Elements/Tag',
  component: Tag,
  // Definition of done: a11y must pass as an error, ahead of the global switch in preview.tsx.
  parameters: { a11y: { test: 'error' } },
  args: { text: 'Account verified' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    appearance: { control: 'inline-radio', options: ['subtle', 'outlined', 'solid'] },
    variant: { control: 'inline-radio', options: ['info', 'success', 'warning', 'danger'] },
    startIcon: { control: false },
  },
} satisfies Meta<typeof Tag>

export default meta
type Story = StoryObj<typeof meta>

const grid = { display: 'grid', gap: 'var(--space-3)', justifyItems: 'start' }
const row = { display: 'flex', flexWrap: 'wrap' as const, gap: 'var(--space-2)', alignItems: 'center' }
const variants = ['info', 'success', 'warning', 'danger'] as const

export const Default: Story = {}

export const Matrix: Story = {
  render: (args) => (
    <div style={grid}>
      {(['subtle', 'outlined', 'solid'] as const).map((appearance) => (
        <div key={appearance} style={row}>
          {variants.map((variant) => (
            <Tag key={variant} {...args} appearance={appearance} variant={variant} text={variant} />
          ))}
        </div>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div style={row}>
      <Tag {...args} size="sm" startIcon={<Icon name="success" />} hasRemoveButton />
      <Tag {...args} size="md" startIcon={<Icon name="success" />} hasRemoveButton />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [sm, md] = [...canvasElement.querySelectorAll('span[class*="tag"]')].map(
      (t) => t.getBoundingClientRect().height,
    )
    await expect([sm, md]).toEqual([20, 24])
  },
}

export const WithIcon: Story = {
  args: { startIcon: <Icon name="success" />, variant: 'success' },
}

export const WithAvatar: Story = {
  args: { text: 'Mary Thompson', startAvatar: portrait, hasRemoveButton: true },
}

export const Rounded: Story = {
  args: { isRounded: true, appearance: 'outlined' },
}

export const Removable: Story = {
  args: { hasRemoveButton: true, onRemove: fn() },
  play: async ({ canvas, args, userEvent }) => {
    const remove = canvas.getByRole('button', { name: 'Remove Account verified' })
    await userEvent.click(remove)
    await expect(args.onRemove).toHaveBeenCalledTimes(1)
    // Reachable and operable by keyboard alone.
    await userEvent.tab()
    await userEvent.tab({ shift: true })
    await expect(remove).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await userEvent.keyboard(' ')
    await expect(args.onRemove).toHaveBeenCalledTimes(3)
  },
}

/** Removing a tag is the parent's job: onRemove reports, the list updates. */
export const RemovableList: Story = {
  render: function Render(args) {
    const [tags, setTags] = useState(['Design', 'Research', 'Engineering'])
    return (
      <div style={row}>
        {tags.map((t) => (
          <Tag
            key={t}
            {...args}
            text={t}
            hasRemoveButton
            onRemove={() => setTags((all) => all.filter((x) => x !== t))}
          />
        ))}
      </div>
    )
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Remove Research' }))
    await expect(canvas.queryByText('Research')).toBeNull()
    await expect(canvas.getAllByRole('button')).toHaveLength(2)
  },
}

export const Truncated: Story = {
  args: { text: 'A tag whose text is far longer than the space it has been given' },
  render: (args) => (
    <div style={{ inlineSize: '12rem' }}>
      <Tag {...args} />
    </div>
  ),
}
