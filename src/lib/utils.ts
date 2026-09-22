import { type ClassValue, clsx } from 'clsx'

/**
 * Joins class names, dropping falsy ones. Class names come from CSS Modules,
 * so there is nothing to deduplicate — the last rule in the stylesheet wins
 * by ordinary cascade rather than by class order.
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}
