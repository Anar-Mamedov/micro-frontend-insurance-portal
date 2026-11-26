import type { PolicyStatus } from '@mfd/contracts'
import type { BadgeTone } from '@mfd/ui'

export const STATUS_LABELS: Record<PolicyStatus, string> = {
  active: 'Active',
  expired: 'Expired',
  cancelled: 'Cancelled',
}

export const STATUS_TONES: Record<PolicyStatus, BadgeTone> = {
  active: 'success',
  expired: 'neutral',
  cancelled: 'danger',
}
