import type { ReactNode } from 'react'
import styles from './Notice.module.css'

export type NoticeTone = 'info' | 'success' | 'warning' | 'danger'

export type NoticeProps = {
  tone?: NoticeTone
  title: ReactNode
  children?: ReactNode
  action?: ReactNode
}

/** Inline message for errors, empty states and confirmations. Danger notices are announced. */
export function Notice({ tone = 'info', title, children, action }: NoticeProps) {
  return (
    <div className={`${styles.notice} ${styles[tone]}`} role={tone === 'danger' ? 'alert' : 'status'}>
      <div className={styles.text}>
        <p className={styles.title}>{title}</p>
        {children && <div className={styles.body}>{children}</div>}
      </div>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  )
}
