import styles from './Spinner.module.css'

/** Loading indicator; the label is read by screen readers and shown next to the spinner. */
export function Spinner({ label = 'Loading…' }: { label?: string }) {
  return (
    <span className={styles.wrap} role="status">
      <span className={styles.spinner} aria-hidden="true" />
      <span className={styles.label}>{label}</span>
    </span>
  )
}
