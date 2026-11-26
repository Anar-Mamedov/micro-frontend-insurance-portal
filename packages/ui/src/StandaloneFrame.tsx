import type { ReactNode } from 'react'
import styles from './StandaloneFrame.module.css'

export type StandaloneFrameProps = {
  appName: string
  children: ReactNode
}

/**
 * Page chrome for a remote running on its own (`pnpm dev` inside the remote's folder).
 * Teams develop and test their app without the shell; inside the shell this frame is never used.
 */
export function StandaloneFrame({ appName, children }: StandaloneFrameProps) {
  return (
    <div className={styles.frame}>
      <p className={styles.banner}>
        <strong>{appName} remote, standalone mode.</strong> The team develops and tests this app on its own; in
        production the shell loads it at runtime from <code>remoteEntry.js</code>.
      </p>
      <main className={styles.main}>{children}</main>
    </div>
  )
}
