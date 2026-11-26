import { on } from '@mfd/contracts'
import { useCallback, useEffect, useRef, useState } from 'react'

export type Toast = { id: string; message: string }

/**
 * Listens to claim:created from the claims remote. The shell shows a toast and, unless the user is
 * already looking at claims, increments the badge on the Claims navigation item.
 */
export function useClaimNotifications(pathname: string) {
  const [unread, setUnread] = useState(0)
  const [toasts, setToasts] = useState<Toast[]>([])
  const onClaimsPage = useRef(false)

  useEffect(() => {
    onClaimsPage.current = pathname.startsWith('/claims')
  }, [pathname])

  useEffect(
    () =>
      on('claim:created', ({ claimId, policyNumber }) => {
        if (!onClaimsPage.current) setUnread(n => n + 1)
        setToasts(list => [...list, { id: claimId, message: `Claim ${claimId} was submitted for policy ${policyNumber}.` }])
      }),
    [],
  )

  const clearUnread = useCallback(() => setUnread(0), [])
  // Stable identity: each toast's auto-dismiss timer depends on it and must not restart on every render.
  const dismissToast = useCallback((id: string) => setToasts(list => list.filter(toast => toast.id !== id)), [])

  return { unread, clearUnread, toasts, dismissToast }
}

/** Keeps the last five policies the policy remote reported through policy:viewed. */
export function useRecentlyViewedPolicies(): string[] {
  const [recent, setRecent] = useState<string[]>([])

  useEffect(
    () =>
      on('policy:viewed', ({ policyNumber }) => {
        setRecent(list => [policyNumber, ...list.filter(n => n !== policyNumber)].slice(0, 5))
      }),
    [],
  )

  return recent
}
