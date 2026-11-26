import { emit, PRODUCT_LABELS } from '@mfd/contracts'
import { Badge, buttonClassName, Card, formatDate, formatMoney, Notice, PageHeader, Spinner } from '@mfd/ui'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router'
import { getPolicy } from './api'
import styles from './PolicyApp.module.css'
import { STATUS_LABELS, STATUS_TONES } from './status'
import { useRequest } from './useRequest'

export function PolicyDetail() {
  const { policyNumber = '' } = useParams()
  const request = useRequest(policyNumber, signal => getPolicy(policyNumber, signal))
  const policy = request.status === 'success' ? request.data : null

  // Tell the rest of the page what the user is looking at (the shell shows it as "recently viewed").
  useEffect(() => {
    if (policy) emit('policy:viewed', { policyNumber: policy.number })
  }, [policy])

  const back = (
    <Link to=".." relative="path" className={buttonClassName('secondary')}>
      Back to policies
    </Link>
  )

  if (request.status === 'loading') return <Spinner label="Loading policy…" />
  if (request.status === 'error') {
    return (
      <Notice tone="danger" title="Policy could not be loaded" action={back}>
        {request.error}
      </Notice>
    )
  }
  if (!policy) {
    return <Notice tone="warning" title={`Policy ${policyNumber} was not found`} action={back} />
  }

  return (
    <>
      <PageHeader
        title={<span className={styles.mono}>{policy.number}</span>}
        description={`${PRODUCT_LABELS[policy.product]} policy of ${policy.holder}`}
        actions={
          <>
            {back}
            {policy.status === 'active' && (
              // A plain URL is the contract with the claims app: no import, no shared state.
              <Link
                to={`/claims/new?policy=${encodeURIComponent(policy.number)}`}
                className={buttonClassName('primary')}
              >
                Report a claim
              </Link>
            )}
          </>
        }
      />
      <Card title="Policy details" actions={<Badge tone={STATUS_TONES[policy.status]}>{STATUS_LABELS[policy.status]}</Badge>}>
        <dl className={styles.details}>
          <dt>Holder</dt>
          <dd>{policy.holder}</dd>
          <dt>Product</dt>
          <dd>{PRODUCT_LABELS[policy.product]}</dd>
          {policy.vehiclePlate && (
            <>
              <dt>Vehicle plate</dt>
              <dd className={styles.mono}>{policy.vehiclePlate}</dd>
            </>
          )}
          <dt>Annual premium</dt>
          <dd>{formatMoney(policy.premium)}</dd>
          <dt>Coverage</dt>
          <dd>
            {formatDate(policy.startDate)} – {formatDate(policy.endDate)}
          </dd>
        </dl>
      </Card>
    </>
  )
}
