import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import type { CSSProperties } from 'react'
import docs from './docs.module.css'

/** A type role is a size, a line height and a weight together. */
const role = (name: string, weight: number): CSSProperties => ({
  fontSize: `var(--text-${name})`,
  lineHeight: `var(--leading-${name})`,
  fontWeight: weight,
})

const HEADINGS = [
  { token: 'heading-2xl', px: '32 / 36' },
  { token: 'heading-xl', px: '28 / 32' },
  { token: 'heading-lg', px: '24 / 28' },
  { token: 'heading-md', px: '20 / 24' },
  { token: 'heading-sm', px: '16 / 20' },
  { token: 'heading-xs', px: '14 / 20' },
  { token: 'heading-2xs', px: '12 / 16' },
] as const

const BODY = [
  { token: 'body-lg', px: '16 / 24' },
  { token: 'body', px: '14 / 20' },
  { token: 'body-sm', px: '12 / 16' },
] as const

function Row({ token, px, weight }: { token: string; px: string; weight: number }) {
  return (
    <div
      className={docs.rowBaseline}
      style={{ borderBottom: '1px solid var(--border)', padding: 'var(--space-2) 0' }}
    >
      <span className={docs.caption} style={{ width: '10rem', flexShrink: 0 }}>
        --text-{token}
      </span>
      <span style={{ flex: 1, ...role(token, weight) }}>Totem Kit</span>
      <span className={docs.caption} style={{ width: '7rem', textAlign: 'right' }}>
        {px}
      </span>
    </div>
  )
}

const WEIGHTS = [
  { value: 400, name: 'regular' },
  { value: 500, name: 'medium' },
  { value: 600, name: 'semibold' },
  { value: 700, name: 'bold' },
] as const

// Narrative and prose live in Typography.mdx.
const meta = {
  title: 'Foundations/Typography',
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Headings: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {HEADINGS.map((h) => (
        <Row key={h.token} {...h} weight={700} />
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    const el = canvas.getAllByText('Totem Kit')[0]
    // A heading role carries its weight, not just its size.
    await expect(getComputedStyle(el).fontWeight).toBe('700')
    await expect(Number.parseFloat(getComputedStyle(el).fontSize)).toBe(32)
  },
}

export const Body: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {BODY.map((b) => (
        <Row key={b.token} {...b} weight={400} />
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    const el = canvas.getAllByText('Totem Kit')[1]
    // body is 14px, one step down from the 16px many interfaces start at.
    await expect(Number.parseFloat(getComputedStyle(el).fontSize)).toBe(14)
  },
}

export const Weights: Story = {
  render: () => (
    <div className={docs.stack}>
      {WEIGHTS.map(({ value, name }) => (
        <div key={value} className={docs.rowBaseline}>
          <span className={docs.caption} style={{ width: '8rem', flexShrink: 0 }}>
            {value}
          </span>
          <span style={{ ...role('body-lg', value) }}>Totem Kit</span>
          <span className={docs.caption}>{name}</span>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    const bold = canvas.getAllByText('Totem Kit').at(-1)!
    await expect(getComputedStyle(bold).fontWeight).toBe('700')
  },
}

export const Families: Story = {
  render: () => (
    <div className={docs.stackWide}>
      <div className={docs.stack}>
        <span className={docs.caption}>--font-sans</span>
        <span style={{ ...role('heading-md', 700), fontFamily: 'var(--font-sans)' }}>
          Totem Kit — system-ui 0123
        </span>
      </div>
      <div className={docs.stack}>
        <span className={docs.caption}>--font-mono</span>
        <span style={{ ...role('heading-md', 700), fontFamily: 'var(--font-mono)' }}>
          Totem Kit — ui-monospace 0123
        </span>
      </div>
    </div>
  ),
  play: async ({ canvas }) => {
    const sans = canvas.getByText(/system-ui/)
    await expect(getComputedStyle(sans).fontFamily).toContain('system-ui')
  },
}
