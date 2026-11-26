/** Domain types shared by the policy and claims micro-frontends. Each one still owns its own data. */

export type ProductType = 'motor' | 'travel' | 'property' | 'health'
export type PolicyStatus = 'active' | 'expired' | 'cancelled'

export type Policy = {
  number: string
  holder: string
  product: ProductType
  status: PolicyStatus
  premium: number
  currency: 'AZN'
  startDate: string
  endDate: string
  vehiclePlate?: string
}

export type ClaimStatus = 'submitted' | 'in_review' | 'approved' | 'rejected'

export type Claim = {
  id: string
  policyNumber: string
  description: string
  incidentDate: string
  estimatedAmount: number
  status: ClaimStatus
  createdAt: string
}

export const PRODUCT_LABELS: Record<ProductType, string> = {
  motor: 'Motor (CASCO)',
  travel: 'Travel',
  property: 'Property',
  health: 'Health',
}
