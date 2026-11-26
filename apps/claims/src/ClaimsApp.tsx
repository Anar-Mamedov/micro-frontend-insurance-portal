import type { RemoteAppProps } from '@mfd/contracts'
import { Notice } from '@mfd/ui'
import { Route, Routes } from 'react-router'
import { ClaimList } from './ClaimList'
import styles from './ClaimsApp.module.css'
import { NewClaimForm } from './NewClaimForm'

/**
 * The module this remote exposes as `claims/ClaimsApp`, mounted by the shell under `/claims/*`.
 */
export default function ClaimsApp({ user }: RemoteAppProps) {
  return (
    <div className={styles.root} data-remote="claims">
      <Routes>
        <Route index element={<ClaimList />} />
        <Route path="new" element={<NewClaimForm />} />
        <Route path="*" element={<Notice tone="warning" title="This page does not exist in the claims app" />} />
      </Routes>
      <p className={styles.footnote}>Signed in as {user.name}. Authentication is handled by the shell.</p>
    </div>
  )
}
