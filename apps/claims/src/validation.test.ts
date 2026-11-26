import { describe, expect, it } from 'vitest'
import { validateClaim, type ClaimFormValues } from './validation'

const TODAY = '2026-11-26'
const valid: ClaimFormValues = {
  policyNumber: 'MT-1001',
  incidentDate: '2026-11-20',
  estimatedAmount: '850',
  description: 'Front door dented by another car in a car park.',
}

describe('validateClaim', () => {
  it('accepts a complete claim', () => {
    expect(validateClaim(valid, TODAY)).toEqual({})
  })

  it('accepts a lower-case policy number with spaces around it', () => {
    expect(validateClaim({ ...valid, policyNumber: ' mt-1001 ' }, TODAY)).toEqual({})
  })

  it('rejects a malformed policy number', () => {
    expect(validateClaim({ ...valid, policyNumber: 'MT1001' }, TODAY).policyNumber).toBeDefined()
  })

  it('rejects an incident in the future', () => {
    expect(validateClaim({ ...valid, incidentDate: '2026-11-27' }, TODAY).incidentDate).toMatch(/future/)
  })

  it.each(['', '0', '-5', 'abc'])('rejects the amount %j', amount => {
    expect(validateClaim({ ...valid, estimatedAmount: amount }, TODAY).estimatedAmount).toBeDefined()
  })

  it('requires a meaningful description', () => {
    expect(validateClaim({ ...valid, description: 'Broken' }, TODAY).description).toBeDefined()
  })
})
