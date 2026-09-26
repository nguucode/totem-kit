import type { ReactNode, Ref } from 'react'
import { NumberField } from '@base-ui/react/number-field'
import { Icon } from '@/lib/icon'
import { cn } from '@/lib/utils'
import {
  InputField,
  boxClass,
  inputStyles,
  type InputAppearance,
  type InputSize,
  type ValidationState,
} from './InputField'
import styles from './NumberInput.module.css'

export interface NumberInputProps {
  ref?: Ref<HTMLInputElement>
  value?: number | null
  defaultValue?: number
  /** The spec's `onChange`. `null` when the field is emptied. */
  onValueChange?: (value: number | null) => void
  min?: number
  max?: number
  step?: number
  /** Decimal places shown and accepted. */
  precision?: number
  label?: ReactNode
  helperText?: ReactNode
  validationState?: ValidationState
  size?: InputSize
  appearance?: InputAppearance
  isFullWidth?: boolean
  name?: string
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  id?: string
  className?: string
  'aria-label'?: string
}

export function NumberInput({
  ref,
  label,
  helperText,
  validationState,
  size = 'md',
  appearance = 'outlined',
  isFullWidth,
  precision,
  name,
  placeholder,
  disabled,
  required,
  className,
  onValueChange,
  id,
  'aria-label': ariaLabel,
  ...props
}: NumberInputProps) {
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
      <NumberField.Root
        {...props}
        id={id}
        required={required}
        format={
          precision === undefined
            ? undefined
            : { minimumFractionDigits: precision, maximumFractionDigits: precision }
        }
        onValueChange={onValueChange && ((next) => onValueChange(next))}
      >
        <NumberField.Group className={cn(boxClass(size, appearance), styles.group, styles[size])}>
          <NumberField.Input
            ref={ref}
            placeholder={placeholder}
            aria-label={ariaLabel}
            className={cn(inputStyles.control, styles.input)}
          />
          {/* Base UI names these "Decrease" and "Increase" for assistive tech. */}
          <NumberField.Decrement className={styles.step}>
            <Icon name="minus" />
          </NumberField.Decrement>
          <NumberField.Increment className={styles.step}>
            <Icon name="plus" />
          </NumberField.Increment>
        </NumberField.Group>
      </NumberField.Root>
    </InputField>
  )
}
