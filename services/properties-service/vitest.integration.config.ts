import { defineConfig } from 'vitest/config'

// Config separada: testes de integração sobem um Postgres real via Testcontainers
// (precisa de Docker rodando) — nunca misturados com a suíte unitária rápida.
export default defineConfig({
  test: {
    environment: 'node',
    globals: false,
    include: ['src/**/*.integration.test.ts'],
    testTimeout: 60_000,
    hookTimeout: 60_000,
  },
})
