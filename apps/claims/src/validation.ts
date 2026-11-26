export type ClaimFormValues = {
  policyNumber: string
  incidentDate: string
  estimatedAmount: string
  description: string
}

export type ClaimFormErrors = Partial<Record<keyof ClaimFormValues, string>>

const POLICY_NUMBER = /^(MT|TR|PR|HL)-\d{4}$/

/**
 * Client-side checks for a fast, accessible form. The claims API validates again; the browser is
 * never the final authority (and whether the policy exists and is active is the API's decision).
 */
export function validateClaim(values: ClaimFormValues, today: string): ClaimFormErrors {
  const errors: ClaimFormErrors = {}

  if (!POLICY_NUMBER.test(values.policyNumber.trim().toUpperCase())) {
    errors.policyNumber = 'Use the policy number format MT-1001.'
  }

  if (!values.incidentDate) {
    errors.incidentDate = 'Enter the date of the incident.'
  } else if (values.incidentDate > today) {
    errors.incidentDate = 'The incident date cannot be in the future.'
  }

  const amount = Number(values.estimatedAmount)
  if (!values.estimatedAmount || !Number.isFinite(amount) || amount <= 0) {
    errors.estimatedAmount = 'Enter an estimated amount greater than zero.'
  } else if (amount > 1_000_000) {
    errors.estimatedAmount = 'Amounts above 1 000 000 AZN are handled by phone.'
  }

  if (values.description.trim().length < 20) {
    errors.description = 'Describe what happened in at least 20 characters.'
  }

  return errors
}
