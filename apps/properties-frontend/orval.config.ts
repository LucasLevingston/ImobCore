import { defineConfig } from 'orval'

// Spec buscada direto no properties-service (não pelo api-gateway) — geração
// de código roda em dev-time, sem sessão/token; o api-gateway prefixaria
// tudo com /api de qualquer forma. Em runtime real, orval-mutator.ts é quem
// sempre passa pelo gateway (docs seção 04a) — nunca este arquivo.
export default defineConfig({
  properties: {
    input: {
      target: process.env.PROPERTIES_SERVICE_OPENAPI_URL ?? 'http://localhost:3002/docs/json',
    },
    output: {
      mode: 'tags-split',
      target: 'src/generated/api/properties.ts',
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
