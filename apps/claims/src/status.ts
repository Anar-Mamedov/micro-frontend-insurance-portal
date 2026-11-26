import type { ClaimStatus } from '@mfd/contracts'
import type { BadgeTone } from '@mfd/ui'

export const STATUS_LABELS: Record<ClaimStatus, string> = {
  submitted: 'Submitted',
  in_review: 'In review',
  approved: 'Approved',
  rejected: 'Rejected',
}

export const STATUS_TONES: Record<ClaimStatus, BadgeTone> = {
  submitted: 'info',
  in_review: 'warning',
  approved: 'success',
  rejected: 'danger',
}
