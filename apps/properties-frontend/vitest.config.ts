import path from 'node:path'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/**/index.ts',
        'src/app/**',
        'src/mocks/**',
        'src/test-utils/**',
        'src/types/**',
        // importa um módulo virtual do webpack Module Federation (authFrontend/Header)
        // — não resolvível pelo Vite/Vitest, só testável via dev server real
        'src/components/federation/RemoteHeader.tsx',
        // stub usado só via webpack alias na compilação SERVER (next.config.js) —
        // nunca importado em código normal, não há o que testar
        'src/components/federation/remote-header-server-stub.tsx',
      ],
      thresholds: {
        lines: 95,
        functions: 95,
        branches: 95,
        statements: 95,
      },
    },
  },
})
