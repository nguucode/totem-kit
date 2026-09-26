import {
  useCallback,
  useLayoutEffect,
  useRef,
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
} from 'react'
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
import styles from './Textarea.module.css'

export interface TextareaProps extends Omit<ComponentProps<'textarea'>, 'size'> {
  label?: ReactNode
  helperText?: ReactNode
  validationState?: ValidationState
  size?: InputSize
  appearance?: InputAppearance
  isFullWidth?: boolean
  /** Which way the user can drag to resize. Ignored with `hasAutoSize`. */
  resize?: 'none' | 'both' | 'vertical' | 'horizontal'
  /** Grow and shrink with the content, between `minRows` and `maxRows`. */
  hasAutoSize?: boolean
  /** The starting height, in lines. */
  minRows?: number
  /** The most it grows to before scrolling, in lines. */
  maxRows?: number
}

export function Textarea({
  label,
  helperText,
  validationState,
  size = 'md',
  appearance = 'outlined',
  isFullWidth,
  resize = 'vertical',
  hasAutoSize = false,
  minRows = 3,
  maxRows,
  required,
  disabled,
  name,
  className,
  onInput,
  ref,
  style,
  ...props
}: TextareaProps) {
  const inner = useRef<HTMLTextAreaElement | null>(null)
  const fit = useCallback(() => {
    const el = inner.current
    if (!el || !hasAutoSize) return
    // Collapse first so a shrinking value can shrink the box; max-block-size
    // (from maxRows) caps the result and the rest scrolls.
    el.style.blockSize = 'auto'
    el.style.blockSize = `${el.scrollHeight}px`
  }, [hasAutoSize])
  // Controlled values change without an input event; fit to those too.
  useLayoutEffect(fit, [fit, props.value])

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
      <span className={cn(boxClass(size, appearance), styles.multiline, styles[`pad-${size}`])} onMouseDown={focusControl}>
        <Field.Control
          render={
            <textarea
              rows={minRows}
              ref={(node) => {
                inner.current = node
                if (typeof ref === 'function') ref(node)
                else if (ref) ref.current = node
              }}
            />
          }
          {...(props as ComponentProps<typeof Field.Control>)}
          required={required}
          onInput={(event) => {
            fit()
            onInput?.(event as unknown as Parameters<NonNullable<TextareaProps["onInput"]>>[0])
          }}
          className={cn(inputStyles.control, styles.textarea)}
          style={
            {
              ...style,
              resize: hasAutoSize ? 'none' : resize,
              ...(maxRows && { maxBlockSize: `calc(${maxRows} * 1lh)` }),
            } as CSSProperties
          }
        />
      </span>
    </InputField>
  )
}
