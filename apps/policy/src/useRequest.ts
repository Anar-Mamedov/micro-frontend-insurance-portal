import { useEffect, useState } from 'react'

export type RequestState<T> =
  | { status: 'loading'; data: T | undefined }
  | { status: 'success'; data: T }
  | { status: 'error'; data: T | undefined; error: string }

type Settled<T> =
  | { key: string; status: 'success'; data: T }
  | { key: string; status: 'error'; data: T | undefined; error: string }

/**
 * Runs `load` whenever `key` changes and aborts the previous request, so a slow old response can
 * never overwrite a newer one. "Loading" is derived during render (the last settled result belongs
 * to another key) instead of being set inside the effect, which avoids an extra render.
 * The previous data stays visible while the next request loads.
 *
 * A production app would use TanStack Query; this keeps the demo free of another shared dependency.
 */
export function useRequest<T>(key: string, load: (signal: AbortSignal) => Promise<T>): RequestState<T> {
  const [settled, setSettled] = useState<Settled<T> | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    load(controller.signal).then(
      data => {
        if (!controller.signal.aborted) setSettled({ key, status: 'success', data })
      },
      (error: unknown) => {
        if (controller.signal.aborted) return
        const message = error instanceof Error ? error.message : 'Unknown error'
        setSettled(prev => ({ key, status: 'error', data: prev?.data, error: message }))
      },
    )
    return () => controller.abort()
    // `load` is a new function on every render; `key` is what identifies the request.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  if (!settled || settled.key !== key) return { status: 'loading', data: settled?.data }
  if (settled.status === 'success') return { status: 'success', data: settled.data }
  return { status: 'error', data: settled.data, error: settled.error }
}
