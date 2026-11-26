import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// Tests run the app as plain React components, without the federation plugin.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
