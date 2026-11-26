import type { RemoteAppProps } from '@mfd/contracts'
import { Button, Notice, Spinner } from '@mfd/ui'
import { Suspense, use, useState, type ComponentType } from 'react'
import { ErrorBoundary } from './ErrorBoundary'
import styles from './RemoteModule.module.css'
import { withTimeout } from './withTimeout'

type LoadedRemote = { default: ComponentType<RemoteAppProps> }
export type RemoteLoader = () => Promise<LoadedRemote>

type RemoteModuleProps = RemoteAppProps & {
  /** Human-readable name used in loading and error messages. */
  name: string
  load: RemoteLoader
  timeoutMs?: number
}

function startLoading(load: RemoteLoader, name: string, timeoutMs: number): Promise<LoadedRemote> {
  const promise = withTimeout(load(), timeoutMs, `${name} did not respond within ${timeoutMs / 1000} seconds.`)
  // The rejection is handled by use() and the error boundary; this only silences "unhandled rejection".
  promise.catch(() => {})
  return promise
}

function RemoteContent({ module, ...props }: RemoteAppProps & { module: Promise<LoadedRemote> }) {
  // Suspends until the remote is loaded; a rejected promise is thrown to the error boundary.
  const { default: Remote } = use(module)
  return <Remote {...props} />
}

/**
 * Mounts one remote app and isolates its failures from the rest of the shell:
 * - Suspense shows a loading state while remoteEntry.js and the module are fetched;
 * - a timeout turns a hanging remote into an error instead of an endless spinner;
 * - the error boundary catches both a failed load (remote server down, network error) and runtime
 *   errors thrown by the remote's own components, so one broken remote never blanks the page;
 * - "Try again" starts a new load and remounts the boundary with a new key.
 *
 * The load promise lives in state so it is created once per attempt, not on every render.
 */
export function RemoteModule({ name, load, timeoutMs = 8000, ...props }: RemoteModuleProps) {
  const [request, setRequest] = useState(() => ({ attempt: 0, module: startLoading(load, name, timeoutMs) }))

  const retry = () => {
    const module = startLoading(load, name, timeoutMs)
    setRequest(prev => ({ attempt: prev.attempt + 1, module }))
  }

  return (
    <ErrorBoundary
      key={request.attempt}
      onError={error => {
        // The place to report to monitoring, tagged with the remote that failed.
        console.error(`[shell] remote "${name}" failed`, error)
      }}
      fallback={error => (
        <Notice
          tone="danger"
          title={`${name} is temporarily unavailable`}
          action={
            <Button variant="secondary" onClick={retry}>
              Try again
            </Button>
          }
        >
          <p>The rest of the portal keeps working. Please try again in a moment.</p>
          <details className={styles.details}>
            <summary>Technical details</summary>
            <code>{error.message}</code>
          </details>
        </Notice>
      )}
    >
      <Suspense fallback={<Spinner label={`Loading ${name}…`} />}>
        <RemoteContent module={request.module} {...props} />
      </Suspense>
    </ErrorBoundary>
  )
}
