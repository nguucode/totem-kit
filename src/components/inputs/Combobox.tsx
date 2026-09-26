import { useState, type ReactNode, type Ref } from 'react'
import { Combobox as BaseCombobox } from '@base-ui/react/combobox'
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
import styles from './Combobox.module.css'

/** Labels are strings here: they are what is typed, matched and shown in the input. */
export type ComboboxOption = string | { value: string; label: string; disabled?: boolean }
type Item = { value: string; label: string; disabled?: boolean }

export interface ComboboxProps {
  ref?: Ref<HTMLInputElement>
  options: ComboboxOption[]
  value?: string | null
  defaultValue?: string | null
  /** The spec's `onChange`. `null` when cleared. */
  onValueChange?: (value: string | null) => void
  placeholder?: string
  label?: ReactNode
  helperText?: ReactNode
  validationState?: ValidationState
  size?: InputSize
  appearance?: InputAppearance
  isFullWidth?: boolean
  /** Options are still arriving: a spinner, and "Loading…" in the list. */
  isLoading?: boolean
  /** Show a button that clears the selection. */
  isClearable?: boolean
  /** Shown in the list when nothing matches. */
  emptyText?: string
  name?: string
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  autoFocus?: boolean
  id?: string
  className?: string
  'aria-label'?: string
}

/** The first case-insensitive match of the query, marked. */
function Highlight({ text, query }: { text: string; query: string }) {
  const at = query ? text.toLowerCase().indexOf(query.toLowerCase()) : -1
  if (at < 0) return <>{text}</>
  return (
    <>
      {text.slice(0, at)}
      <mark className={styles.match}>{text.slice(at, at + query.length)}</mark>
      {text.slice(at + query.length)}
    </>
  )
}

export function Combobox({
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
  isClearable = true,
  emptyText = 'No matches',
  name,
  disabled,
  readOnly,
  required,
  autoFocus,
  id,
  className,
  'aria-label': ariaLabel,
}: ComboboxProps) {
  const items: Item[] = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o))
  const find = (v: string | null | undefined) => (v == null ? v : (items.find((i) => i.value === v) ?? null))
  // Only for highlighting the typed text in each option; Base UI owns the
  // input's value and the filtering.
  const [query, setQuery] = useState('')

  return (
    <InputField
      label={label}
      helperText={helperText}
      validationState={validationState}
      required={required}
      disabled={disabled}
      name={name}
      isFullWidth={isFullWidth}
      className={className}
    >
      <BaseCombobox.Root
        items={items}
        value={find(value)}
        defaultValue={find(defaultValue)}
        onValueChange={onValueChange && ((next) => onValueChange((next as Item | null)?.value ?? null))}
        // Highlight only what was typed. When an option is chosen the input
        // takes its label, which is not a query to mark in other options.
        onInputValueChange={(next, details) => setQuery(details.reason === 'input-change' ? next : '')}
        // items are rebuilt each render, so compare by value, not identity,
        // or the selection loses its check on the next keystroke.
        isItemEqualToValue={(a: Item, b: Item) => a.value === b.value}
        readOnly={readOnly}
        required={required}
        autoHighlight
      >
        <BaseCombobox.InputGroup className={cn(boxClass(size, appearance), styles.group)}>
          <BaseCombobox.Input
            ref={ref}
            id={id}
            placeholder={placeholder}
            autoFocus={autoFocus}
            aria-label={ariaLabel}
            aria-busy={isLoading || undefined}
            className={s.control}
          />
          {isLoading && <span className={cn(s.icon, s.spinner)} aria-hidden="true" />}
          {isClearable && !readOnly && (
            <BaseCombobox.Clear className={s.iconButton} aria-label="Clear selection">
              <Icon name="close" />
            </BaseCombobox.Clear>
          )}
          <BaseCombobox.Trigger
            className={s.iconButton}
            // Field labels every control in it with the field's label; this
            // button is not the field, so it keeps its own name rather than
            // being a second "Team member".
            render={(props) => <button {...props} aria-labelledby={undefined} aria-label="Show options" />}
          >
            <Icon name="chevron-down" />
          </BaseCombobox.Trigger>
        </BaseCombobox.InputGroup>
        <BaseCombobox.Portal>
          <BaseCombobox.Positioner className={s.positioner} sideOffset={4}>
            <BaseCombobox.Popup className={s.popup}>
              {isLoading ? (
                <BaseCombobox.Status className={s.status}>Loading…</BaseCombobox.Status>
              ) : (
                <BaseCombobox.Empty className={s.empty}>{emptyText}</BaseCombobox.Empty>
              )}
              <BaseCombobox.List>
                {(item: Item) => (
                  <BaseCombobox.Item key={item.value} value={item} disabled={item.disabled} className={s.option}>
                    <span>
                      <Highlight text={item.label} query={query} />
                    </span>
                    <BaseCombobox.ItemIndicator className={s.check}>
                      <Icon name="check" />
                    </BaseCombobox.ItemIndicator>
                  </BaseCombobox.Item>
                )}
              </BaseCombobox.List>
            </BaseCombobox.Popup>
          </BaseCombobox.Positioner>
        </BaseCombobox.Portal>
      </BaseCombobox.Root>
    </InputField>
  )
}
