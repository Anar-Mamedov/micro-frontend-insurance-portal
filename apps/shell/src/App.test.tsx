import { emit, type CurrentUser, type RemoteAppProps } from '@mfd/contracts'
import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentType } from 'react'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { App } from './App'
import type { RemoteLoader } from './RemoteModule'

const user: CurrentUser = { name: 'Test Agent', role: 'agent' }

function FakePolicyApp({ user }: RemoteAppProps) {
  return <p>Policy remote for {user.name}</p>
}

function FakeClaimsApp() {
  return <p>Claims remote</p>
}

const ok = (component: ComponentType<RemoteAppProps>): RemoteLoader => () => Promise.resolve({ default: component })

// Remotes suspend with use(), so React 19 needs the initial render inside an awaited act().
async function renderApp(
  path: string,
  registry = {
    policy: { name: 'Policies', load: ok(FakePolicyApp) },
    claims: { name: 'Claims', load: ok(FakeClaimsApp) },
  },
) {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={[path]}>
        <App user={user} remoteRegistry={registry} />
      </MemoryRouter>,
    )
  })
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('App (shell)', () => {
  it('mounts the matching remote and passes it the current user', async () => {
    await renderApp('/policies')
    expect(await screen.findByText('Policy remote for Test Agent')).toBeInTheDocument()
  })

  it('swaps the remote when navigating from one app to another', async () => {
    await renderApp('/policies')
    await screen.findByText('Policy remote for Test Agent')

    await act(async () => {
      await userEvent.click(screen.getByRole('link', { name: /Claims/ }))
    })

    expect(await screen.findByText('Claims remote')).toBeInTheDocument()
    expect(screen.queryByText('Policy remote for Test Agent')).not.toBeInTheDocument()
  })

  it('keeps the portal usable when a remote fails to load, and recovers on retry', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const load = vi
      .fn<RemoteLoader>()
      .mockRejectedValueOnce(new Error('Failed to fetch remoteEntry.js'))
      .mockResolvedValueOnce({ default: FakeClaimsApp })

    await renderApp('/claims', { policy: { name: 'Policies', load: ok(FakePolicyApp) }, claims: { name: 'Claims', load } })

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('Claims is temporarily unavailable')
    expect(alert).toHaveTextContent('Failed to fetch remoteEntry.js')
    // The shell itself is still there.
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument()

    // The retry suspends again, so it also has to run inside an awaited act().
    await act(async () => {
      await userEvent.click(within(alert).getByRole('button', { name: 'Try again' }))
    })

    expect(await screen.findByText('Claims remote')).toBeInTheDocument()
    expect(load).toHaveBeenCalledTimes(2)
  })

  it('catches errors thrown while a remote renders', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    function BrokenRemote(): never {
      throw new Error('Bug inside the policy app')
    }

    await renderApp('/policies', { policy: { name: 'Policies', load: ok(BrokenRemote) }, claims: { name: 'Claims', load: ok(FakeClaimsApp) } })

    expect(await screen.findByRole('alert')).toHaveTextContent('Bug inside the policy app')
  })

  it('shows a toast and a badge when the claims remote emits claim:created', async () => {
    await renderApp('/policies')
    await screen.findByText('Policy remote for Test Agent')

    act(() => emit('claim:created', { claimId: 'CL-2026-0099', policyNumber: 'MT-1001' }))

    expect(screen.getByText('Claim CL-2026-0099 was submitted for policy MT-1001.')).toBeInTheDocument()
    const claimsLink = screen.getByRole('link', { name: /Claims/ })
    expect(within(claimsLink).getByLabelText('1 new')).toBeInTheDocument()

    await userEvent.click(claimsLink)
    expect(within(screen.getByRole('link', { name: /Claims/ })).queryByLabelText('1 new')).not.toBeInTheDocument()
  })

  it('lists policies announced with policy:viewed on the dashboard', async () => {
    await renderApp('/')
    act(() => emit('policy:viewed', { policyNumber: 'TR-2001' }))
    expect(screen.getByRole('link', { name: 'TR-2001' })).toHaveAttribute('href', '/policies/TR-2001')
  })
})
