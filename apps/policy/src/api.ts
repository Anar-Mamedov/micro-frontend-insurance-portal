import type { Policy, PolicyStatus } from '@mfd/contracts'

/**
 * Fake policy API with network latency. In a real system this team would own a backend;
 * the point is that the policy app fetches its own data and the shell never passes it in.
 */
const POLICIES: Policy[] = [
  { number: 'MT-1001', holder: 'Aysel Məmmədova', product: 'motor', status: 'active', premium: 642.5, currency: 'AZN', startDate: '2026-03-01', endDate: '2027-02-28', vehiclePlate: '10-AB-123' },
  { number: 'MT-1002', holder: 'Rauf Əliyev', product: 'motor', status: 'active', premium: 518, currency: 'AZN', startDate: '2026-06-15', endDate: '2027-06-14', vehiclePlate: '90-RA-404' },
  { number: 'MT-1003', holder: 'Elvin Quliyev', product: 'motor', status: 'expired', premium: 477.2, currency: 'AZN', startDate: '2025-01-10', endDate: '2026-01-09', vehiclePlate: '77-EQ-018' },
  { number: 'TR-2001', holder: 'Nigar Hüseynova', product: 'travel', status: 'active', premium: 38, currency: 'AZN', startDate: '2026-11-20', endDate: '2026-12-05' },
  { number: 'TR-2002', holder: 'Leyla Həsənova', product: 'travel', status: 'expired', premium: 52.4, currency: 'AZN', startDate: '2026-07-01', endDate: '2026-07-21' },
  { number: 'PR-3001', holder: 'Murad İsmayılov', product: 'property', status: 'active', premium: 215, currency: 'AZN', startDate: '2026-02-01', endDate: '2027-01-31' },
  { number: 'PR-3002', holder: 'Günay Rzayeva', product: 'property', status: 'cancelled', premium: 189.9, currency: 'AZN', startDate: '2026-04-12', endDate: '2027-04-11' },
  { number: 'HL-4001', holder: 'Tural Abbasov', product: 'health', status: 'active', premium: 1240, currency: 'AZN', startDate: '2026-01-01', endDate: '2026-12-31' },
  { number: 'HL-4002', holder: 'Səbinə Kərimova', product: 'health', status: 'active', premium: 980, currency: 'AZN', startDate: '2026-09-01', endDate: '2027-08-31' },
  { number: 'MT-1004', holder: 'Orxan Babayev', product: 'motor', status: 'cancelled', premium: 590, currency: 'AZN', startDate: '2026-05-05', endDate: '2027-05-04', vehiclePlate: '99-OB-777' },
]

const LATENCY_MS = import.meta.env.MODE === 'test' ? 0 : 350

function delay(signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason)
      return
    }
    const id = setTimeout(resolve, LATENCY_MS)
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(id)
        reject(signal.reason)
      },
      { once: true },
    )
  })
}

export type PolicyFilter = {
  query: string
  status: PolicyStatus | 'all'
}

export async function listPolicies({ query, status }: PolicyFilter, signal?: AbortSignal): Promise<Policy[]> {
  await delay(signal)
  const q = query.trim().toLocaleLowerCase()
  return POLICIES.filter(p => status === 'all' || p.status === status).filter(p => {
    if (!q) return true
    return [p.number, p.holder, p.vehiclePlate ?? ''].some(field => field.toLocaleLowerCase().includes(q))
  })
}

export async function getPolicy(number: string, signal?: AbortSignal): Promise<Policy | null> {
  await delay(signal)
  return POLICIES.find(p => p.number === number) ?? null
}
