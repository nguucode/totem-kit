import { useId, type ReactNode, type Ref } from 'react'
import { Field } from '@base-ui/react/field'
import { Fieldset } from '@base-ui/react/fieldset'
import { Radio } from '@base-ui/react/radio'
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group'
import { cn } from '@/lib/utils'
import { choiceStyles, type ValidationState } from './ChoiceField'
import styles from './Radio.module.css'

export interface RadioOption {
  value: string
  label: ReactNode
  helperText?: ReactNode
  disabled?: boolean
}

export interface RadioGroupProps {
  ref?: Ref<HTMLDivElement>
  options: RadioOption[]
  /** The group's legend. */
  label?: ReactNode
  /** Under the whole group; the error message when `validationState` is error. */
  helperText?: ReactNode
  value?: string
  defaultValue?: string
  /** The spec's `onChange`. Base UI's event details are dropped. */
  onValueChange?: (value: string) => void
  name?: string
  /** Colour of the selected radio. */
  variant?: 'primary' | 'secondary' | 'neutral'
  orientation?: 'vertical' | 'horizontal'
  disabled?: boolean
  required?: boolean
  readOnly?: boolean
  validationState?: ValidationState
  className?: string
  'aria-label'?: string
}

/**
 * A set of radios, one of which is selected. A radio is meaningless alone —
 * arrow keys move within its group — so the component is the group, with
 * the radios as flat `options`.
 */
export function RadioGroup({
  ref,
  options,
  label,
  helperText,
  name,
  variant = 'neutral',
  orientation = 'vertical',
  disabled,
  required,
  validationState = 'default',
  className,
  onValueChange,
  ...props
}: RadioGroupProps) {
  // Plain help describes the group once. An error message goes through Field,
  // which puts it on every radio: whichever one has focus, the reader hears
  // what is wrong.
  const helperId = useId()
  const isError = validationState === 'error'
  return (
    <Field.Root
      name={name}
      disabled={disabled}
      invalid={isError}
      className={cn(choiceStyles.field, choiceStyles[validationState], styles.field, className)}
    >
      <Fieldset.Root
        render={
          <BaseRadioGroup
            {...props}
            ref={ref}
            aria-describedby={helperText && !isError ? helperId : undefined}
            required={required}
            onValueChange={onValueChange && ((next) => onValueChange(next as string))}
          />
        }
        className={cn(styles.group, styles[orientation])}
      >
        {label && (
          <Fieldset.Legend className={styles.legend}>
            {label}
            {required && (
              <span aria-hidden="true" className={choiceStyles.required}>
                *
              </span>
            )}
          </Fieldset.Legend>
        )}
        {options.map((option) => (
          <Field.Item key={option.value} disabled={option.disabled} className={styles.item}>
            <Field.Label className={choiceStyles.label}>
              <Radio.Root
                value={option.value}
                className={cn(choiceStyles.control, styles.radio, styles[variant])}
              >
                <Radio.Indicator className={styles.dot} />
              </Radio.Root>
              {option.label}
            </Field.Label>
            {option.helperText && (
              <Field.Description className={cn(choiceStyles.helper, styles.optionHelper)}>
                {option.helperText}
              </Field.Description>
            )}
          </Field.Item>
        ))}
      </Fieldset.Root>
      {helperText &&
        (isError ? (
          <Field.Description className={cn(choiceStyles.helper, styles.groupHelper)}>
            {helperText}
          </Field.Description>
        ) : (
          <p id={helperId} className={cn(choiceStyles.helper, styles.groupHelper)}>
            {helperText}
          </p>
        ))}
    </Field.Root>
  )
}
