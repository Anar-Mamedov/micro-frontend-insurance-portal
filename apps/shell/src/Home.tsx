import { Badge, buttonClassName, Card, PageHeader } from '@mfd/ui'
import { Link } from 'react-router'
import styles from './Home.module.css'

export function Home({ recentPolicies }: { recentPolicies: string[] }) {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="This page belongs to the shell. Policies and Claims are separate applications, built and deployed by their own teams and loaded here at runtime."
      />
      <div className={styles.grid}>
        <Card title="Policies" actions={<Badge tone="info">remote: policy</Badge>}>
          <p className={styles.text}>
            Loaded from <code>{__REMOTE_ENTRIES__.policy}</code>
          </p>
          <Link to="/policies" className={buttonClassName('secondary')}>
            Open policies
          </Link>
        </Card>
        <Card title="Claims" actions={<Badge tone="info">remote: claims</Badge>}>
          <p className={styles.text}>
            Loaded from <code>{__REMOTE_ENTRIES__.claims}</code>
          </p>
          <Link to="/claims" className={buttonClassName('secondary')}>
            Open claims
          </Link>
        </Card>
        <Card title="Recently viewed policies">
          {recentPolicies.length === 0 ? (
            <p className={styles.text}>
              Open a policy and it shows up here. The policy remote announces it with the <code>policy:viewed</code> event;
              the shell never imports policy code.
            </p>
          ) : (
            <ul className={styles.recent}>
              {recentPolicies.map(number => (
                <li key={number}>
                  <Link to={`/policies/${encodeURIComponent(number)}`}>{number}</Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
      <Card title="Things to try">
        <ol className={styles.steps}>
          <li>
            Open a policy and choose <strong>Report a claim</strong>. The link is a plain URL into the claims app; after
            submitting, the shell shows a notification from the <code>claim:created</code> event.
          </li>
          <li>
            Stop the claims server and open <strong>Claims</strong>. The error boundary shows a message while the rest of the
            portal keeps working; start the server again and press <strong>Try again</strong>.
          </li>
          <li>
            Open the browser&apos;s network tab: React, React Router and the design system are downloaded once and shared
            by all three apps.
          </li>
        </ol>
      </Card>
    </>
  )
}
