import { apiClient } from './api-client'

// Client gerado pelo Orval a partir da spec do auth-service chama esta
// função — reaproveita o apiClient existente (token em memória, refresh
// automático em 401) em vez de duplicar essa lógica. A spec é buscada direto
// do service em dev-time só pra gerar código; em runtime toda chamada segue
// a regra do projeto (docs seção 04a) e passa pelo api-gateway — daí o
// prefixo /api aqui, que a spec crua (paths do service) não tem.
// url já vem com querystring embutida (o código gerado monta isso antes de
// chamar); body vem serializado (JSON.stringify) pelo código gerado — refaz
// o parse aqui porque apiClient serializa de novo internamente.
export function orvalMutator<T>(url: string, options?: RequestInit): Promise<T> {
  const path = `/api${url}`
  const method = options?.method ?? 'GET'
  const body: unknown = options?.body ? JSON.parse(options.body as string) : undefined

  switch (method) {
    case 'GET':
      return apiClient.get<T>(path)
    case 'POST':
      return apiClient.post<T>(path, body)
    case 'PUT':
      return apiClient.put<T>(path, body)
    case 'DELETE':
      return apiClient.delete<T>(path)
    default:
      throw new Error(`Método não suportado: ${method}`)
  }
}
