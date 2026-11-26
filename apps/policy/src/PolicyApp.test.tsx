import { on, type CurrentUser } from '@mfd/contracts'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import PolicyApp from './PolicyApp'

const user: CurrentUser = { name: 'Test Agent', role: 'agent' }

// Mount the remote the same way the shell does: under a parent route ending in /*.
function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/policies/*" element={<PolicyApp user={user} />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('PolicyApp', () => {
  it('lists policies and uses the user passed in by the shell', async () => {
    renderAt('/policies')
    expect(await screen.findByRole('link', { name: 'MT-1001' })).toHaveAttribute('href', '/policies/MT-1001')
    expect(screen.getByText(/Portfolio of Test Agent/)).toBeInTheDocument()
  })

  it('filters by search text', async () => {
    renderAt('/policies')
    await screen.findByRole('link', { name: 'TR-2001' })

    await userEvent.type(screen.getByLabelText('Search'), 'Aysel')

    await waitFor(() => expect(screen.queryByRole('link', { name: 'TR-2001' })).not.toBeInTheDocument())
    expect(screen.getByRole('link', { name: 'MT-1001' })).toBeInTheDocument()
  })

  it('filters by status', async () => {
    renderAt('/policies')
    await screen.findByRole('link', { name: 'MT-1001' })

    await userEvent.click(screen.getByRole('button', { name: 'Cancelled' }))

    await waitFor(() => expect(screen.queryByRole('link', { name: 'MT-1001' })).not.toBeInTheDocument())
    expect(screen.getByRole('link', { name: 'PR-3002' })).toBeInTheDocument()
  })

  it('shows a policy, links to the claims app by URL and announces the view', async () => {
    const viewed = vi.fn()
    const off = on('policy:viewed', viewed)

    renderAt('/policies/MT-1001')

    expect(await screen.findByRole('heading', { name: 'MT-1001' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Report a claim' })).toHaveAttribute('href', '/claims/new?policy=MT-1001')
    expect(viewed).toHaveBeenCalledWith({ policyNumber: 'MT-1001' })
    off()
  })

  it('does not offer a claim for a cancelled policy', async () => {
    renderAt('/policies/PR-3002')
    expect(await screen.findByRole('heading', { name: 'PR-3002' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Report a claim' })).not.toBeInTheDocument()
  })

  it('reports an unknown policy', async () => {
    renderAt('/policies/XX-0000')
    expect(await screen.findByText('Policy XX-0000 was not found')).toBeInTheDocument()
  })
})
