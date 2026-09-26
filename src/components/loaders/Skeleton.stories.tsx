import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Skeleton } from './Skeleton'

const meta = {
  title: 'Components/Loaders/Skeleton',
  component: Skeleton,
  // Definition of done: a11y must pass as an error, ahead of the global switch in preview.tsx.
  parameters: { a11y: { test: 'error' } },
  argTypes: { appearance: { control: 'inline-radio', options: ['circle', 'square', 'rounded'] } },
  args: { width: 240, height: 16 },
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const bone = canvasElement.querySelector('div > div')!
    await expect(bone).toHaveAttribute('aria-hidden', 'true')
    await expect(bone.getBoundingClientRect().width).toBe(240)
  },
}

export const Appearances: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
      <Skeleton {...args} appearance="circle" width={40} />
      <Skeleton {...args} appearance="square" width={120} height={40} />
      <Skeleton {...args} appearance="rounded" width={120} height={40} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    // The circle stays round even though the story args carry a height of 16.
    const circle = canvasElement.querySelector('[aria-hidden]')!.getBoundingClientRect()
    await expect([circle.width, circle.height]).toEqual([40, 40])
  },
}

export const Rows: Story = {
  args: { rows: 4, width: 320, height: 12, appearance: 'rounded' },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll('[aria-hidden] > div')).toHaveLength(4)
  },
}

export const FullWidth: Story = {
  args: { isFullWidth: true, width: undefined },
}

export const Animated: Story = {
  args: { hasAnimation: true, rows: 3, width: 320, appearance: 'rounded' },
}

/** How it is used: shapes of the content, with aria-busy on the region. */
export const CardPlaceholder: Story = {
  render: () => (
    <div aria-busy="true" aria-label="Loading profile" role="region" style={{ display: 'flex', gap: 'var(--space-3)', inlineSize: 320 }}>
      <Skeleton appearance="circle" width={40} hasAnimation />
      <div style={{ flex: 1, display: 'grid', gap: 'var(--space-2)' }}>
        <Skeleton appearance="rounded" height={14} width="50%" hasAnimation />
        <Skeleton appearance="rounded" rows={2} height={10} isFullWidth hasAnimation />
      </div>
    </div>
  ),
}
