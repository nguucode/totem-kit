import { useCallback, useRef, type ReactNode, type Ref } from 'react'
import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox'
import { Icon } from '@/lib/icon'
import { cn } from '@/lib/utils'
import { ChoiceField, choiceStyles, type ValidationState } from './ChoiceField'
import styles from './Checkbox.module.css'

export interface CheckboxProps {
  ref?: Ref<HTMLElement>
  checked?: boolean
  defaultChecked?: boolean
  /** The spec's `onChange`. Base UI's event details are dropped. */
  onCheckedChange?: (checked: boolean) => void
  /** Neither checked nor unchecked: a "select all" with some selected. */
  isIndeterminate?: boolean
  label?: ReactNode
  helperText?: ReactNode
  name?: string
  /** Submitted when checked; "on" by default. */
  value?: string
  /** Colour of the checked box. */
  variant?: 'primary' | 'secondary' | 'neutral'
  disabled?: boolean
  required?: boolean
  readOnly?: boolean
  autoFocus?: boolean
  validationState?: ValidationState
  id?: string
  className?: string
  'aria-label'?: string
}

export function Checkbox({
  ref,
  autoFocus,
  label,
  helperText,
  name,
  variant = 'neutral',
  isIndeterminate,
  disabled,
  required,
  validationState,
  className,
  onCheckedChange,
  ...props
}: CheckboxProps) {
  // The root is a focusable <span>, and React only honours autoFocus on form
  // elements, so it is done by hand — once, on mount, not on every render.
  const focused = useRef(false)
  const setRef = useCallback(
    (node: HTMLElement | null) => {
      if (node && autoFocus && !focused.current) {
        focused.current = true
        node.focus()
      }
      if (typeof ref === 'function') ref(node)
      else if (ref) ref.current = node
    },
    [autoFocus, ref],
  )
  return (
    <ChoiceField
      label={label}
      helperText={helperText}
      validationState={validationState}
      required={required}
      disabled={disabled}
      name={name}
      className={className}
    >
      <BaseCheckbox.Root
        {...props}
        ref={setRef}
        indeterminate={isIndeterminate}
        required={required}
        onCheckedChange={onCheckedChange && ((next) => onCheckedChange(next))}
        className={cn(choiceStyles.control, styles.box, styles[variant])}
      >
        <BaseCheckbox.Indicator
          className={styles.indicator}
          render={(indicatorProps, state) => (
            <span {...indicatorProps}>
              <Icon name={state.indeterminate ? 'minus' : 'check'} />
            </span>
          )}
        />
      </BaseCheckbox.Root>
    </ChoiceField>
  )
}
