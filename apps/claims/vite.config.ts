import { federation } from '@module-federation/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { localOrigin, PORTS, sharedDependencies } from '../../tooling/federation'

const port = PORTS.claims

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'claims',
      filename: 'remoteEntry.js',
      exposes: {
        './ClaimsApp': './src/ClaimsApp.tsx',
      },
      shared: sharedDependencies,
      manifest: true,
      dts: false,
    }),
  ],
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
})
