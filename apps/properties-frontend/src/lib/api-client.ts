import { useAuthStore } from '../stores/auth-store'
import { env } from './env'

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
  skipAuth?: boolean
  skipRefreshRetry?: boolean
}

async function tryRefresh(): Promise<boolean> {
  try {
    const response = await fetch(`${env.NEXT_PUBLIC_API_GATEWAY_URL}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    })

    if (!response.ok) {
      useAuthStore.getState().clear()
      return false
    }

    const data = (await response.json()) as { accessToken: string }
    useAuthStore.getState().setAccessToken(data.accessToken)
    return true
  } catch {
    useAuthStore.getState().clear()
    return false
  }
}

async function parseErrorMessage(response: Response): Promise<string> {
  const body = (await response.json().catch(() => null)) as { message?: string } | null
  return body?.message ?? 'Erro desconhecido.'
}

// Camada única de acesso HTTP — nunca fetch direto em componente/hook (DIP).
// Sempre fala com o api-gateway, nunca com properties-service direto (docs seção 04a).
async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, skipAuth, skipRefreshRetry, headers, ...rest } = options
  const accessToken = useAuthStore.getState().accessToken

  const response = await fetch(`${env.NEXT_PUBLIC_API_GATEWAY_URL}${path}`, {
    ...rest,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && !skipAuth ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  })

  if (response.status === 401 && !skipAuth && !skipRefreshRetry) {
    const refreshed = await tryRefresh()
    if (refreshed) {
      return request<T>(path, { ...options, skipRefreshRetry: true })
    }
  }

  if (!response.ok) {
    throw new ApiError(await parseErrorMessage(response), response.status)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'POST', body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PUT', body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'DELETE' }),
}
