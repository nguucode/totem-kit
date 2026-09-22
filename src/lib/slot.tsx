import {
  Children,
  cloneElement,
  forwardRef,
  type HTMLAttributes,
  type ReactElement,
  type Ref,
} from 'react'

type AnyProps = Record<string, unknown>
type Handler = (...args: unknown[]) => void

/** Points every ref it is given at the same node. */
function composeRefs<T>(...refs: (Ref<T> | undefined)[]): Ref<T> {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === 'function') ref(node)
      else if (ref) (ref as { current: T | null }).current = node
    }
  }
}

function mergeProps(slotProps: AnyProps, childProps: AnyProps): AnyProps {
  const merged: AnyProps = { ...slotProps }

  for (const key of Object.keys(childProps)) {
    const fromSlot = slotProps[key]
    const fromChild = childProps[key]

    if (/^on[A-Z]/.test(key)) {
      // Both run, the child's first, so a child that calls preventDefault
      // can be seen by the slot's handler.
      if (fromSlot && fromChild) {
        merged[key] = (...args: unknown[]) => {
          ;(fromChild as Handler)(...args)
          ;(fromSlot as Handler)(...args)
        }
      } else {
        merged[key] = fromChild ?? fromSlot
      }
    } else if (key === 'style') {
      merged.style = { ...(fromSlot as object), ...(fromChild as object) }
    } else if (key === 'className') {
      merged.className = [fromSlot, fromChild].filter(Boolean).join(' ')
    } else {
      // Anything else the child sets wins — it is the more specific one.
      merged[key] = fromChild
    }
  }

  return merged
}

export interface SlotProps extends HTMLAttributes<HTMLElement> {
  children?: React.ReactNode
}

/**
 * Renders its single child, merged with the props given to the slot. This is
 * what `asChild` is built on: it lets a component hand its styling and
 * behaviour to whatever element the caller supplies instead of rendering a
 * wrapper of its own.
 */
export const Slot = forwardRef<HTMLElement, SlotProps>(({ children, ...slotProps }, ref) => {
  const child = Children.only(children) as ReactElement<AnyProps>
  // React 19 carries ref in props rather than on the element.
  const childRef = (child.props as { ref?: Ref<unknown> }).ref
  return cloneElement(child, {
    ...mergeProps(slotProps as AnyProps, child.props),
    ref: composeRefs(ref, childRef),
  } as AnyProps)
})
Slot.displayName = 'Slot'
