import styles from './Button.module.css'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'sm' | 'md'

/**
 * Class names for anything that should look like a button, e.g. a router `<Link>`.
 * The UI package does not depend on a router, so apps style their own links with this.
 */
export function buttonClassName(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  extra?: string,
): string {
  return [styles.button, styles[variant], styles[size], extra].filter(Boolean).join(' ')
}
