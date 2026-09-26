import type { ReactNode, Ref } from 'react'
import { Select as BaseSelect } from '@base-ui/react/select'
import { Icon } from '@/lib/icon'
import { cn } from '@/lib/utils'
import {
  InputField,
  boxClass,
  inputStyles as s,
  type InputAppearance,
  type InputSize,
  type ValidationState,
} from './InputField'

export type SelectOption = string | { value: string; label: ReactNode; disabled?: boolean }

/** Strings are their own label; objects carry one. */
export function normalizeOptions(options: SelectOption[]) {
  return options.map((o) => (typeof o === 'string' ? { value: o, label: o as ReactNode } : o))
}

export interface SelectProps {
  ref?: Ref<HTMLButtonElement>
  options: SelectOption[]
  value?: string | null
  defaultValue?: string | null
  /** The spec's `onChange`. `null` when nothing is selected. */
  onValueChange?: (value: string | null) => void
  placeholder?: string
  label?: ReactNode
  helperText?: ReactNode
  validationState?: ValidationState
  size?: InputSize
  appearance?: InputAppearance
  isFullWidth?: boolean
  /** Options are still arriving: a spinner replaces the chevron. */
  isLoading?: boolean
  name?: string
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  autoFocus?: boolean
  id?: string
  className?: string
  'aria-label'?: string
}

export function Select({
  ref,
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder,
  label,
  helperText,
  validationState,
  size = 'md',
  appearance = 'outlined',
  isFullWidth,
  isLoading,
  name,
  disabled,
  readOnly,
  required,
  autoFocus,
  id,
  className,
  'aria-label': ariaLabel,
}: SelectProps) {
  const items = normalizeOptions(options)
  return (
    <InputField
      label={label}
      helperText={helperText}
      validationState={validationState}
      required={required}
      disabled={disabled}
      name={name}
      isFullWidth={isFullWidth}
      hasButtonControl
      className={className}
    >
      <BaseSelect.Root
        items={items}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange && ((next) => onValueChange(next as string | null))}
        readOnly={readOnly}
        required={required}
      >
        <BaseSelect.Trigger
          ref={ref}
          id={id}
          autoFocus={autoFocus}
          aria-label={ariaLabel}
          aria-busy={isLoading || undefined}
          className={cn(boxClass(size, appearance), s.trigger)}
        >
          <BaseSelect.Value className={s.value} placeholder={placeholder} />
          {isLoading ? (
            <span className={cn(s.icon, s.spinner)} aria-hidden="true" />
          ) : (
            <BaseSelect.Icon className={s.icon}>
              <Icon name="chevron-down" />
            </BaseSelect.Icon>
          )}
        </BaseSelect.Trigger>
        <BaseSelect.Portal>
          {/* Opens below the field like a list, rather than laid over it
              with the selected option aligned to the trigger. */}
          <BaseSelect.Positioner className={s.positioner} sideOffset={4} alignItemWithTrigger={false}>
            <BaseSelect.Popup className={s.popup}>
              <BaseSelect.List>
                {items.map((item) => (
                  <BaseSelect.Item key={item.value} value={item.value} disabled={item.disabled} className={s.option}>
                    <BaseSelect.ItemText>{item.label}</BaseSelect.ItemText>
                    <BaseSelect.ItemIndicator className={s.check}>
                      <Icon name="check" />
                    </BaseSelect.ItemIndicator>
                  </BaseSelect.Item>
                ))}
              </BaseSelect.List>
            </BaseSelect.Popup>
          </BaseSelect.Positioner>
        </BaseSelect.Portal>
      </BaseSelect.Root>
    </InputField>
  )
}
