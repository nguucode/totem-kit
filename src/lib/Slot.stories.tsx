import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { useRef, useState } from 'react'
import { Slot } from './slot'

// Not a design-system page — these exercise the prop-merging rules that
// `asChild` depends on, where a mistake is silent rather than visible.
const meta = {
  title: 'Internal/Slot',
  tags: ['!autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const MergesClassAndStyle: Story = {
  name: 'Merges class and style',
  render: () => (
    <Slot className="slot-class" style={{ color: 'rgb(255, 0, 0)', padding: '4px' }}>
      <a href="#x" className="child-class" style={{ color: 'rgb(0, 128, 0)' }}>
        link
      </a>
    </Slot>
  ),
  play: async ({ canvas }) => {
    const el = canvas.getByRole('link')
    // Both classes survive; the child wins per style key, the rest merge.
    await expect(el).toHaveClass('slot-class', 'child-class')
    await expect(el).toHaveStyle({ color: 'rgb(0, 128, 0)', padding: '4px' })
    // The child keeps its own props.
    await expect(el).toHaveAttribute('href', '#x')
  },
}

export const RunsBothHandlers: Story = {
  name: 'Runs both handlers',
  render: function Render() {
    const [log, setLog] = useState<string[]>([])
    return (
      <div>
        <Slot onClick={() => setLog((l) => [...l, 'slot'])}>
          <button type="button" onClick={() => setLog((l) => [...l, 'child'])}>
            click me
          </button>
        </Slot>
        <p data-testid="log">{log.join(',')}</p>
      </div>
    )
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button'))
    // Child first, so a child that calls preventDefault is visible to the slot.
    await expect(canvas.getByTestId('log')).toHaveTextContent('child,slot')
  },
}

export const ComposesRefs: Story = {
  name: 'Composes refs',
  render: function Render() {
    const slotRef = useRef<HTMLElement>(null)
    const childRef = useRef<HTMLButtonElement>(null)
    const [seen, setSeen] = useState('')
    return (
      <div>
        <Slot ref={slotRef}>
          <button type="button" ref={childRef} onClick={() => setSeen(`${slotRef.current?.tagName}/${childRef.current?.tagName}`)}>
            check refs
          </button>
        </Slot>
        <p data-testid="seen">{seen}</p>
      </div>
    )
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button'))
    // Both the slot's ref and the child's own ref must point at the node.
    await expect(canvas.getByTestId('seen')).toHaveTextContent('BUTTON/BUTTON')
  },
}

export const CallsHandlerOnce: Story = {
  name: 'Calls a lone handler once',
  render: function Render() {
    const onClick = fn()
    ;(globalThis as Record<string, unknown>).__slotOnClick = onClick
    return (
      <Slot onClick={onClick}>
        <button type="button">only the slot has a handler</button>
      </Slot>
    )
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button'))
    const onClick = (globalThis as Record<string, unknown>).__slotOnClick as ReturnType<typeof fn>
    await expect(onClick).toHaveBeenCalledOnce()
  },
}
