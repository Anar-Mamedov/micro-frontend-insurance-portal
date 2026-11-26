import type { RemoteLoader } from './RemoteModule'

/**
 * Every remote the shell can mount. The `import()` calls are rewritten by the federation plugin:
 * at runtime they fetch the remote's remoteEntry.js, negotiate shared dependencies and then load
 * the exposed module. Nothing from the remotes is in the shell's own bundle.
 */
export const remotes = {
  policy: {
    name: 'Policies',
    load: (() => import('policy/PolicyApp')) satisfies RemoteLoader,
  },
  claims: {
    name: 'Claims',
    load: (() => import('claims/ClaimsApp')) satisfies RemoteLoader,
  },
}
