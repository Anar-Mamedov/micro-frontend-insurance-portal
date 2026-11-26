import { Badge, buttonClassName, Card, formatDate, formatMoney, Notice, PageHeader } from '@mfd/ui'
import { useSyncExternalStore } from 'react'
import { Link, useLocation } from 'react-router'
import styles from './ClaimsApp.module.css'
import { getClaims, subscribe } from './claimStore'
import { STATUS_LABELS, STATUS_TONES } from './status'

export function ClaimList() {
  const claims = useSyncExternalStore(subscribe, getClaims)
  const location = useLocation()
  const createdId = (location.state as { createdId?: string } | null)?.createdId

  return (
    <>
      <PageHeader
        title="Claims"
        description="Claims are a separate remote owned by the claims team, built and deployed on their own."
        actions={
          <Link to="new" className={buttonClassName('primary')}>
            Report a claim
          </Link>
        }
      />
      {createdId && (
        <Notice tone="success" title={`Claim ${createdId} submitted`}>
          The shell was notified through the claim:created event.
        </Notice>
      )}
      <Card>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Claim</th>
                <th scope="col">Policy</th>
                <th scope="col">Incident</th>
                <th scope="col" className={styles.num}>
                  Estimate
                </th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {claims.map(claim => (
                <tr key={claim.id} className={claim.id === createdId ? styles.highlight : undefined}>
                  <td className={styles.mono}>{claim.id}</td>
                  <td>
                    {/* Link back into the policy app: again only a URL, no import. */}
                    <Link to={`/policies/${encodeURIComponent(claim.policyNumber)}`} className={styles.mono}>
                      {claim.policyNumber}
                    </Link>
                  </td>
                  <td>{formatDate(claim.incidentDate)}</td>
                  <td className={styles.num}>{formatMoney(claim.estimatedAmount)}</td>
                  <td>
                    <Badge tone={STATUS_TONES[claim.status]}>{STATUS_LABELS[claim.status]}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  )
}
