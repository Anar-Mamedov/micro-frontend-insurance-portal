import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// Tests render the shell without the federation plugin; remote loaders are replaced by fakes.
const stub = new URL('./src/test/remoteStub.tsx', import.meta.url).pathname

export default defineConfig({
  plugins: [react()],
  define: {
    __REMOTE_ENTRIES__: JSON.stringify({ policy: 'test://policy', claims: 'test://claims' }),
  },
  resolve: {
    alias: {
      'policy/PolicyApp': stub,
      'claims/ClaimsApp': stub,
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
