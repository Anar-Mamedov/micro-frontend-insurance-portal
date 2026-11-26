import { useId, type ComponentProps, type ReactNode } from 'react'
import styles from './Field.module.css'

type FieldChrome = {
  label: string
  hint?: ReactNode
  error?: string
}

function useFieldIds(hint: unknown, error: unknown) {
  const id = useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined
  return { id, hintId, errorId, describedBy }
}

function FieldFrame({
  id,
  label,
  hint,
  hintId,
  error,
  errorId,
  children,
}: FieldChrome & { id: string; hintId: string; errorId: string; children: ReactNode }) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      {children}
      {hint && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  )
}

export type TextFieldProps = Omit<ComponentProps<'input'>, 'id'> & FieldChrome

/** Labelled input; errors and hints are linked with aria-describedby so screen readers read them. */
export function TextField({ label, hint, error, className, ...rest }: TextFieldProps) {
  const ids = useFieldIds(hint, error)
  return (
    <FieldFrame label={label} hint={hint} error={error} {...ids}>
      <input
        id={ids.id}
        className={[styles.control, className].filter(Boolean).join(' ')}
        aria-invalid={error ? true : undefined}
        aria-describedby={ids.describedBy}
        {...rest}
      />
    </FieldFrame>
  )
}

export type TextAreaFieldProps = Omit<ComponentProps<'textarea'>, 'id'> & FieldChrome

export function TextAreaField({ label, hint, error, className, rows = 4, ...rest }: TextAreaFieldProps) {
  const ids = useFieldIds(hint, error)
  return (
    <FieldFrame label={label} hint={hint} error={error} {...ids}>
      <textarea
        id={ids.id}
        rows={rows}
        className={[styles.control, styles.textarea, className].filter(Boolean).join(' ')}
        aria-invalid={error ? true : undefined}
        aria-describedby={ids.describedBy}
        {...rest}
      />
    </FieldFrame>
  )
}
