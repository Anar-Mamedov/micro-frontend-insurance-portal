import type { RemoteAppProps } from '@mfd/contracts'
import { Notice } from '@mfd/ui'
import { Route, Routes } from 'react-router'
import styles from './PolicyApp.module.css'
import { PolicyDetail } from './PolicyDetail'
import { PolicyList } from './PolicyList'

/**
 * The module this remote exposes as `policy/PolicyApp`.
 *
 * The shell mounts it under `/policies/*`; the routes below are relative to that, so the shell
 * owns the top-level URL space and this team owns everything inside it.
 */
export default function PolicyApp({ user }: RemoteAppProps) {
  return (
    <div className={styles.root} data-remote="policy">
      <Routes>
        <Route index element={<PolicyList userName={user.name} />} />
        <Route path=":policyNumber" element={<PolicyDetail />} />
        <Route path="*" element={<Notice tone="warning" title="This page does not exist in the policy app" />} />
      </Routes>
    </div>
  )
}
