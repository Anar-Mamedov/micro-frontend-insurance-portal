import { federation } from '@module-federation/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { localOrigin, PORTS, sharedDependencies } from '../../tooling/federation'

const port = PORTS.policy

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'policy',
      // The file the shell loads at runtime. It lists what this app exposes and which shared
      // dependencies it needs; the actual code stays in hashed chunks next to it.
      filename: 'remoteEntry.js',
      exposes: {
        './PolicyApp': './src/PolicyApp.tsx',
      },
      shared: sharedDependencies,
      // mf-manifest.json describes exposes and shared deps; useful for tooling and runtime discovery.
      manifest: true,
      // Types travel through @mfd/contracts instead of downloaded type archives.
      dts: false,
    }),
  ],
  server: {
    port,
    strictPort: true,
    // Absolute origin so assets requested by the shell (another origin) resolve back to this server.
    origin: localOrigin(port),
  },
  preview: {
    port,
    strictPort: true,
  },
  build: {
    target: 'esnext',
  },
})
