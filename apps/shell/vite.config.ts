import { federation } from '@module-federation/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { localOrigin, PORTS, sharedDependencies } from '../../tooling/federation.ts'

const port = PORTS.shell

export default defineConfig(({ mode }) => {
  // Remote URLs differ per environment (local, test, production). They come from the environment
  // (.env files or CI variables) and fall back to the local dev servers.
  const env = loadEnv(mode, import.meta.dirname, '')
  const remoteEntries = {
    policy: env.POLICY_REMOTE_ENTRY || `${localOrigin(PORTS.policy)}/remoteEntry.js`,
    claims: env.CLAIMS_REMOTE_ENTRY || `${localOrigin(PORTS.claims)}/remoteEntry.js`,
  }

  return {
    plugins: [
      react(),
      federation({
        name: 'shell',
        remotes: {
          policy: { type: 'module', name: 'policy', entry: remoteEntries.policy },
          claims: { type: 'module', name: 'claims', entry: remoteEntries.claims },
        },
        shared: sharedDependencies,
        dts: false,
      }),
    ],
    define: {
      // Shown on the dashboard so it is obvious where each remote comes from.
      __REMOTE_ENTRIES__: JSON.stringify(remoteEntries),
    },
    server: {
      port,
      strictPort: true,
      origin: localOrigin(port),
    },
    preview: {
      port,
      strictPort: true,
    },
    build: {
      target: 'esnext',
    },
  }
})
