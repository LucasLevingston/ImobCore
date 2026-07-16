import { defineConfig } from 'orval'

// Spec buscada direto no auth-service (não pelo api-gateway) — geração de
// código roda em dev-time, sem sessão/token; o api-gateway prefixaria tudo
// com /api de qualquer forma. Em runtime real, orval-mutator.ts é quem
// sempre passa pelo gateway (docs seção 04a) — nunca este arquivo.
export default defineConfig({
  auth: {
    input: {
      target: process.env.AUTH_SERVICE_OPENAPI_URL ?? 'http://localhost:3001/docs/json',
    },
    output: {
      mode: 'tags-split',
      target: 'src/generated/api/auth.ts',
      client: 'react-query',
      formatter: 'prettier',
      override: {
        mutator: {
          path: './src/lib/orval-mutator.ts',
          name: 'orvalMutator',
        },
        query: {
          useQuery: true,
        },
      },
    },
  },
})
