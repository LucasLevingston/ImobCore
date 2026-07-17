import { HttpResponse, http } from 'msw'

const BASE = process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? 'http://localhost:3004'

// properties-frontend não tem login próprio — só precisa do refresh silencioso
// que o apiClient dispara automaticamente em 401 (docs seção 05)
export const authHandlers = [
  http.post(`${BASE}/api/auth/refresh`, () => {
    return HttpResponse.json({ accessToken: 'mock.access.token' }, { status: 200 })
  }),
]
