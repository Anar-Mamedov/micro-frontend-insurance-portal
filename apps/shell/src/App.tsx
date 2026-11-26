import type { CurrentUser } from '@mfd/contracts'
import { Notice } from '@mfd/ui'
import { Route, Routes } from 'react-router'
import { Home } from './Home'
import { Layout } from './Layout'
import { RemoteModule } from './RemoteModule'
import { remotes } from './remotes'
import { useRecentlyViewedPolicies } from './useShellEvents'

export type AppProps = {
  user: CurrentUser
  /** Injected so tests can replace the real federated imports. */
  remoteRegistry?: typeof remotes
}

/**
 * The shell owns the top-level URL space and hands each prefix to one remote. Everything below
 * `/policies/*` belongs to the policy team, everything below `/claims/*` to the claims team.
 */
export function App({ user, remoteRegistry = remotes }: AppProps) {
  const recentPolicies = useRecentlyViewedPolicies()

  return (
    <Layout user={user}>
      <Routes>
        <Route index element={<Home recentPolicies={recentPolicies} />} />
        {/*
          The keys matter: both routes render <RemoteModule> in the same place, so without them React
          would reuse the same instance (and its loaded module) when navigating from one remote to the other.
        */}
        <Route path="/policies/*" element={<RemoteModule key="policy" {...remoteRegistry.policy} user={user} />} />
        <Route path="/claims/*" element={<RemoteModule key="claims" {...remoteRegistry.claims} user={user} />} />
        <Route path="*" element={<Notice tone="warning" title="Page not found" />} />
      </Routes>
    </Layout>
  )
}
