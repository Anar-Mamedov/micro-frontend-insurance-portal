import { PRODUCT_LABELS, type PolicyStatus } from '@mfd/contracts'
import { Badge, Card, formatDate, formatMoney, Notice, PageHeader, Spinner, TextField } from '@mfd/ui'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { listPolicies } from './api'
import styles from './PolicyApp.module.css'
import { STATUS_LABELS, STATUS_TONES } from './status'
import { useRequest } from './useRequest'

const STATUS_FILTERS: Array<{ value: PolicyStatus | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'expired', label: 'Expired' },
  { value: 'cancelled', label: 'Cancelled' },
]

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(id)
  }, [value, delayMs])
  return debounced
}

export function PolicyList({ userName }: { userName: string }) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<PolicyStatus | 'all'>('all')
  const debouncedQuery = useDebouncedValue(query.trim(), 250)

  const request = useRequest(`${status}|${debouncedQuery}`, signal =>
    listPolicies({ query: debouncedQuery, status }, signal),
  )
  const policies = request.data ?? []

  return (
    <>
      <PageHeader
        title="Policies"
        description={`Portfolio of ${userName}. This screen is a separately built and deployed remote owned by the policy team.`}
      />
      <Card>
        <div className={styles.filters}>
          <div className={styles.search}>
            <TextField
              label="Search"
              type="search"
              placeholder="Policy number, holder or plate"
              value={query}
              onChange={event => setQuery(event.target.value)}
            />
          </div>
          <div className={styles.segment} role="group" aria-label="Filter by status">
            {STATUS_FILTERS.map(filter => (
              <button
                key={filter.value}
                type="button"
                aria-pressed={status === filter.value}
                onClick={() => setStatus(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {request.status === 'error' && (
          <Notice tone="danger" title="Policies could not be loaded">
            {request.error}
          </Notice>
        )}
        {request.status === 'loading' && policies.length === 0 && <Spinner label="Loading policies…" />}
        {request.status === 'success' && policies.length === 0 && (
          <Notice title="No policies match these filters">Try another name, number or plate.</Notice>
        )}

        {policies.length > 0 && (
          <div className={styles.tableWrap}>
            <table className={styles.table} aria-busy={request.status === 'loading'}>
              <thead>
                <tr>
                  <th scope="col">Policy</th>
                  <th scope="col">Holder</th>
                  <th scope="col">Product</th>
                  <th scope="col" className={styles.num}>
                    Premium
                  </th>
                  <th scope="col">Ends</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {policies.map(policy => (
                  <tr key={policy.number}>
                    <td>
                      <Link to={policy.number} className={styles.mono}>
                        {policy.number}
                      </Link>
                    </td>
                    <td>{policy.holder}</td>
                    <td>{PRODUCT_LABELS[policy.product]}</td>
                    <td className={styles.num}>{formatMoney(policy.premium)}</td>
                    <td>{formatDate(policy.endDate)}</td>
                    <td>
                      <Badge tone={STATUS_TONES[policy.status]}>{STATUS_LABELS[policy.status]}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  )
}
