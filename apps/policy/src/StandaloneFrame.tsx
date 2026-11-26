import type { ReactNode } from 'react'
import styles from './StandaloneFrame.module.css'

/** Only used when the remote runs on its own (`pnpm dev` in this folder), never inside the shell. */
export function StandaloneFrame({ children }: { children: ReactNode }) {
  return (
    <div className={styles.frame}>
      <p className={styles.banner}>
        <strong>Policy remote, standalone mode.</strong> The team develops and tests this app on its own; in production
        the shell loads it at runtime from <code>remoteEntry.js</code>.
      </p>
      <main className={styles.main}>{children}</main>
    </div>
  )
}
