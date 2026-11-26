import type { CurrentUser } from '@mfd/contracts'
import type { ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import styles from './Layout.module.css'
import { Toasts } from './Toasts'
import { useClaimNotifications } from './useShellEvents'

const navClass = ({ isActive }: { isActive: boolean }) => (isActive ? `${styles.navLink} ${styles.active}` : styles.navLink)

export function Layout({ user, children }: { user: CurrentUser; children: ReactNode }) {
  const { pathname } = useLocation()
  const { unread, clearUnread, toasts, dismissToast } = useClaimNotifications(pathname)

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link to="/" className={styles.brand}>
            Insurance portal
          </Link>
          <nav aria-label="Main" className={styles.nav}>
            <NavLink to="/" end className={navClass}>
              Dashboard
            </NavLink>
            <NavLink to="/policies" className={navClass}>
              Policies
            </NavLink>
            <NavLink to="/claims" className={navClass} onClick={clearUnread}>
              Claims
              {unread > 0 && (
                <span className={styles.count} aria-label={`${unread} new`}>
                  {unread}
                </span>
              )}
            </NavLink>
          </nav>
          <span className={styles.user}>
            {user.name} <span className={styles.role}>{user.role}</span>
          </span>
        </div>
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        Shell (host) on port 5170. Policies and Claims are separate apps loaded at runtime with Module Federation.
      </footer>
      <Toasts toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}
