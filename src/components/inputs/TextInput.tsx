import type { ComponentProps, ReactNode } from 'react'
import { Field } from '@base-ui/react/field'
import { cn } from '@/lib/utils'
import {
  InputField,
  boxClass,
  focusControl,
  inputStyles,
  type InputAppearance,
  type InputSize,
  type ValidationState,
} from './InputField'

export interface TextInputProps extends Omit<ComponentProps<'input'>, 'size' | 'prefix'> {
  label?: ReactNode
  /** Under the field; the error message when `validationState` is error. */
  helperText?: ReactNode
  validationState?: ValidationState
  size?: InputSize
  appearance?: InputAppearance
  /** Text or an icon before the value, e.g. `<Icon name="search" />` or "https://". */
  prefix?: ReactNode
  /** Text or an icon after the value, e.g. "kg". */
  suffix?: ReactNode
  isFullWidth?: boolean
}

export function TextInput({
  label,
  helperText,
  validationState,
  size = 'md',
  appearance = 'outlined',
  prefix,
  suffix,
  isFullWidth,
  required,
  disabled,
  name,
  className,
  ...props
}: TextInputProps) {
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
      <span className={boxClass(size, appearance)} onMouseDown={focusControl}>
        {prefix && <span className={inputStyles.affix}>{prefix}</span>}
        <Field.Control {...props} required={required} className={cn(inputStyles.control)} />
        {suffix && <span className={inputStyles.affix}>{suffix}</span>}
      </span>
    </InputField>
  )
}
