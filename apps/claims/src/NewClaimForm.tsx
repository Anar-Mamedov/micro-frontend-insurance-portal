import { emit } from '@mfd/contracts'
import { Button, buttonClassName, Card, Notice, PageHeader, TextAreaField, TextField } from '@mfd/ui'
import { useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import styles from './ClaimsApp.module.css'
import { createClaim } from './claimStore'
import { validateClaim, type ClaimFormErrors, type ClaimFormValues } from './validation'

const today = () => new Date().toISOString().slice(0, 10)

export function NewClaimForm() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const formRef = useRef<HTMLFormElement>(null)

  // The policy app links here with ?policy=MT-1001: the URL is the whole contract between them.
  const [values, setValues] = useState<ClaimFormValues>(() => ({
    policyNumber: searchParams.get('policy') ?? '',
    incidentDate: '',
    estimatedAmount: '',
    description: '',
  }))
  const [errors, setErrors] = useState<ClaimFormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const update = (field: keyof ClaimFormValues) => (event: { target: { value: string } }) =>
    setValues(prev => ({ ...prev, [field]: event.target.value }))

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const found = validateClaim(values, today())
    setErrors(found)
    const firstInvalid = Object.keys(found)[0]
    if (firstInvalid) {
      // Move focus to the first invalid field so keyboard and screen-reader users land on the problem.
      // Look it up by name: the aria-invalid attributes are not in the DOM until React re-renders.
      const field = formRef.current?.elements.namedItem(firstInvalid)
      if (field instanceof HTMLElement) field.focus()
      return
    }

    setSubmitting(true)
    setSubmitError(null)
    try {
      const claim = await createClaim({
        policyNumber: values.policyNumber.trim().toUpperCase(),
        incidentDate: values.incidentDate,
        estimatedAmount: Number(values.estimatedAmount),
        description: values.description.trim(),
      })
      // Tell whoever is listening (the shell shows a notification). The claims app does not know who that is.
      emit('claim:created', { claimId: claim.id, policyNumber: claim.policyNumber })
      navigate('..', { relative: 'path', state: { createdId: claim.id } })
    } catch {
      setSubmitError('The claim could not be submitted. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <>
      <PageHeader
        title="Report a claim"
        description="First notice of loss. The claims team contacts the policy holder within one working day."
      />
      <Card>
        <form ref={formRef} className={styles.form} onSubmit={handleSubmit} noValidate>
          {submitError && <Notice tone="danger" title={submitError} />}
          <div className={styles.row}>
            <TextField
              label="Policy number"
              name="policyNumber"
              value={values.policyNumber}
              onChange={update('policyNumber')}
              error={errors.policyNumber}
              autoComplete="off"
              placeholder="MT-1001"
            />
            <TextField
              label="Incident date"
              name="incidentDate"
              type="date"
              max={today()}
              value={values.incidentDate}
              onChange={update('incidentDate')}
              error={errors.incidentDate}
            />
            <TextField
              label="Estimated amount (AZN)"
              name="estimatedAmount"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={values.estimatedAmount}
              onChange={update('estimatedAmount')}
              error={errors.estimatedAmount}
            />
          </div>
          <TextAreaField
            label="What happened?"
            name="description"
            value={values.description}
            onChange={update('description')}
            error={errors.description}
            hint="Where and how it happened, and what was damaged."
          />
          <div className={styles.actions}>
            <Link to=".." relative="path" className={buttonClassName('secondary')}>
              Cancel
            </Link>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit claim'}
            </Button>
          </div>
        </form>
      </Card>
    </>
  )
}
