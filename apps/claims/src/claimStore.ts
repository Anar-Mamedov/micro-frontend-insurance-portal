import type { Claim } from '@mfd/contracts'

/**
 * Fake claims backend kept in memory as an external store. Components read it with
 * useSyncExternalStore, so the list updates as soon as a claim is created.
 * In a real system this team would own a claims API; the shell never passes claim data in.
 */
let claims: Claim[] = [
  { id: 'CL-2026-0003', policyNumber: 'PR-3001', description: 'Water leak from the upstairs flat damaged the kitchen ceiling.', incidentDate: '2026-11-18', estimatedAmount: 1450, status: 'submitted', createdAt: '2026-11-19' },
  { id: 'CL-2026-0002', policyNumber: 'HL-4001', description: 'Outpatient knee MRI and two physiotherapy sessions.', incidentDate: '2026-10-30', estimatedAmount: 320, status: 'in_review', createdAt: '2026-11-02' },
  { id: 'CL-2026-0001', policyNumber: 'MT-1001', description: 'Rear bumper damaged while parked at a shopping centre.', incidentDate: '2026-09-12', estimatedAmount: 780, status: 'approved', createdAt: '2026-09-13' },
]
let nextNumber = 4

const listeners = new Set<() => void>()

export function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function getClaims(): Claim[] {
  return claims
}

export type NewClaimInput = {
  policyNumber: string
  incidentDate: string
  estimatedAmount: number
  description: string
}

const LATENCY_MS = import.meta.env.MODE === 'test' ? 0 : 500

export async function createClaim(input: NewClaimInput): Promise<Claim> {
  await new Promise(resolve => setTimeout(resolve, LATENCY_MS))
  const today = new Date().toISOString().slice(0, 10)
  const claim: Claim = {
    id: `CL-${today.slice(0, 4)}-${String(nextNumber++).padStart(4, '0')}`,
    policyNumber: input.policyNumber,
    description: input.description,
    incidentDate: input.incidentDate,
    estimatedAmount: input.estimatedAmount,
    status: 'submitted',
    createdAt: today,
  }
  claims = [claim, ...claims]
  listeners.forEach(listener => listener())
  return claim
}
