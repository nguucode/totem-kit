import type { ReactNode, Ref } from 'react'
import { Accordion as BaseAccordion } from '@base-ui/react/accordion'
import { Icon } from '@/lib/icon'
import { cn } from '@/lib/utils'
import styles from './Accordion.module.css'

export interface AccordionItem {
  value: string
  title: ReactNode
  content: ReactNode
  disabled?: boolean
}

export interface AccordionProps {
  ref?: Ref<HTMLDivElement>
  items: AccordionItem[]
  /** Controlled: the values of the open items. */
  value?: string[]
  defaultValue?: string[]
  /** Base UI's event details are dropped. */
  onValueChange?: (value: string[]) => void
  /** Allow more than one item open at once. */
  multiple?: boolean
  appearance?: 'outlined' | 'flush'
  size?: 'sm' | 'md'
  /** The heading element each trigger sits in. Match it to the page's outline. */
  headingLevel?: 2 | 3 | 4 | 5 | 6
  disabled?: boolean
  className?: string
}

export function Accordion({
  items,
  onValueChange,
  appearance = 'outlined',
  size = 'md',
  headingLevel = 3,
  className,
  ...props
}: AccordionProps) {
  const Heading = `h${headingLevel}` as const
  return (
    <BaseAccordion.Root
      {...props}
      onValueChange={onValueChange && ((next) => onValueChange(next as string[]))}
      // Collapsed panels stay in the DOM as hidden="until-found", so the
      // browser's find-in-page can reach text inside them and open them.
      hiddenUntilFound
      className={cn(styles.accordion, styles[appearance], styles[size], className)}
    >
      {items.map((item) => (
        <BaseAccordion.Item key={item.value} value={item.value} disabled={item.disabled} className={styles.item}>
          <BaseAccordion.Header render={<Heading />} className={styles.header}>
            <BaseAccordion.Trigger className={styles.trigger}>
              <span className={styles.title}>{item.title}</span>
              <Icon name="chevron-down" className={styles.chevron} />
            </BaseAccordion.Trigger>
          </BaseAccordion.Header>
          <BaseAccordion.Panel className={styles.panel}>
            <div className={styles.content}>{item.content}</div>
          </BaseAccordion.Panel>
        </BaseAccordion.Item>
      ))}
    </BaseAccordion.Root>
  )
}
