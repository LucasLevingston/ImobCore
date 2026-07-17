// Guard reutilizável (docs/ARCHITECTURE.md seção 05a) — lógica pura, sem
// dependência de next/server, pra ser testável isoladamente e reaproveitável
// por qualquer boundary futuro (middleware hoje, client-side guard depois).

export function hasSessionCookie(cookieValue: string | undefined | null): boolean {
  return Boolean(cookieValue)
}
