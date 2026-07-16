import { randomUUID } from 'node:crypto'

// Reaproveita x-request-id do cliente se veio preenchido; senão gera um novo
// (gateway é o primeiro ponto de contato — seção 25 do docs/ARCHITECTURE.md)
export function resolveRequestId(incoming: string | string[] | undefined): string {
  const value = Array.isArray(incoming) ? incoming[0] : incoming
  return value && value.length > 0 ? value : randomUUID()
}
