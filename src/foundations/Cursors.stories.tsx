import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Button } from '@/components/actions/Button'
import { TextInput } from '@/components/inputs/TextInput'
import docs from './docs.module.css'

const TOKENS = [
  {
    token: '--cursor-button',
    value: 'default',
    usage: 'Button, and anything that acts on the current page',
    note: "Matches the browser's own convention: an interactive element that doesn't navigate keeps the regular arrow, not a hand.",
    demo: <Button>Button</Button>,
  },
  {
    token: '--cursor-link',
    value: 'pointer',
    usage: 'A Button rendered as a real link',
    note: 'asChild can turn a Button into an <a href>, which navigates — so it keeps the hand the browser gives every other link. variant="link" does not: that is still a <button>, and only looks like a link.',
    demo: (
      <Button asChild>
        <a href="#cursors">Link</a>
      </Button>
    ),
  },
  {
    token: '--cursor-disabled',
    value: 'not-allowed',
    usage: 'A disabled control that stays hoverable',
    note: 'TextInput uses this. Button does not — its disabled state is pointer-events: none, so it is never hovered and a cursor there would be dead CSS.',
    demo: <TextInput aria-label="Disabled" placeholder="Disabled" disabled style={{ width: '9rem' }} />,
  },
] as const

function CursorTokens() {
  return (
    <div className={docs.stackWide} style={{ gap: 'var(--space-4)' }}>
      {TOKENS.map(({ token, value, usage, note, demo }) => (
        <div
          key={token}
          className={docs.card}
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            {/* Real components rather than a styled div, so what you hover is
                what ships — a div with cursor set on it would demonstrate the
                token but not that any component actually reads it. */}
            <div style={{ width: '9rem', flexShrink: 0 }}>{demo}</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-body)' }}>
                {token}
              </span>
              <span className={docs.caption}>{value}</span>
            </div>
          </div>
          <p className={docs.note}>
            <strong style={{ color: 'var(--foreground)', fontWeight: 500 }}>{usage}.</strong> {note}
          </p>
        </div>
      ))}
    </div>
  )
}

// Narrative and prose live in Cursors.mdx, which supersedes this file's
// autodocs page — this story exists to be embedded there via <Canvas>.
const meta = {
  title: 'Foundations/Cursors',
  render: () => <CursorTokens />,
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Tokens: Story = {
  play: async ({ canvas }) => {
    const cursor = (el: Element) => getComputedStyle(el).cursor
    // The three cases have to stay distinct, and the button/link split is the
    // whole point of the page — assert it rather than describing it in prose.
    await expect(cursor(canvas.getByRole('button', { name: 'Button' }))).toBe('default')
    await expect(cursor(canvas.getByRole('link', { name: 'Link' }))).toBe('pointer')
    await expect(cursor(canvas.getByRole('textbox', { name: 'Disabled' }))).toBe('not-allowed')
  },
}
