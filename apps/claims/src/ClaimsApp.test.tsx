import { on, type CurrentUser } from '@mfd/contracts'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import ClaimsApp from './ClaimsApp'

const user: CurrentUser = { name: 'Test Agent', role: 'agent' }

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/claims/*" element={<ClaimsApp user={user} />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ClaimsApp', () => {
  it('lists claims with links back to the policy app', () => {
    renderAt('/claims')
    const row = screen.getByText('CL-2026-0001').closest('tr')!
    expect(within(row).getByRole('link', { name: 'MT-1001' })).toHaveAttribute('href', '/policies/MT-1001')
  })

  it('prefills the policy number from the URL', () => {
    renderAt('/claims/new?policy=MT-1002')
    expect(screen.getByLabelText('Policy number')).toHaveValue('MT-1002')
  })

  it('shows field errors and focuses the first invalid field', async () => {
    renderAt('/claims/new')
    await userEvent.click(screen.getByRole('button', { name: 'Submit claim' }))

    const policyField = screen.getByLabelText('Policy number')
    expect(policyField).toHaveAttribute('aria-invalid', 'true')
    expect(policyField).toHaveFocus()
    expect(screen.getByLabelText('What happened?')).toHaveAccessibleDescription(/at least 20 characters/)
  })

  it('submits a claim, emits claim:created and returns to the list', async () => {
    const created = vi.fn()
    const off = on('claim:created', created)
    renderAt('/claims/new?policy=MT-1002')

    await userEvent.type(screen.getByLabelText('Incident date'), '2026-11-01')
    await userEvent.type(screen.getByLabelText('Estimated amount (AZN)'), '640')
    await userEvent.type(screen.getByLabelText('What happened?'), 'Side mirror broken by a passing truck.')
    await userEvent.click(screen.getByRole('button', { name: 'Submit claim' }))

    const notice = await screen.findByText(/Claim CL-\d{4}-0004 submitted/)
    expect(notice).toBeInTheDocument()
    expect(created).toHaveBeenCalledWith({ claimId: expect.stringMatching(/^CL-\d{4}-0004$/), policyNumber: 'MT-1002' })
    off()
  })
})
