// Usado por GET /health/ready — verifica se um service upstream está de pé,
// sem derrubar a resposta do gateway se ele demorar (timeout curto)
export async function pingUpstream(baseUrl: string, timeoutMs = 2000): Promise<boolean> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(`${baseUrl}/health`, { signal: controller.signal })
    return response.ok
  } catch {
    return false
  } finally {
    clearTimeout(timeout)
  }
}
