import { useEffect } from 'react'
import { Link } from 'react-router'
import styles from './Layout.module.css'
import type { Toast } from './useShellEvents'

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 6000)
    return () => clearTimeout(timer)
  }, [toast.id, onDismiss])

  return (
    <div className={styles.toast}>
      <span>{toast.message}</span>
      <Link to="/claims" onClick={() => onDismiss(toast.id)}>
        View
      </Link>
      <button type="button" className={styles.toastClose} aria-label="Dismiss" onClick={() => onDismiss(toast.id)}>
        ×
      </button>
    </div>
  )
}

export function Toasts({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
  return (
    <div className={styles.toasts} role="status" aria-live="polite">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  )
}
