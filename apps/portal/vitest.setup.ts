process.env.NEXT_PUBLIC_API_GATEWAY_URL ??= 'http://localhost:3004'
process.env.NEXT_PUBLIC_AUTH_FRONTEND_URL ??= 'http://localhost:3000'
process.env.NEXT_PUBLIC_PROPERTIES_FRONTEND_URL ??= 'http://localhost:3003'

import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { server } from './src/mocks/server'

// jsdom não implementa Pointer Events — mesmo racional do packages/ui
if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = () => false
}
if (!Element.prototype.setPointerCapture) {
  Element.prototype.setPointerCapture = () => {}
}
if (!Element.prototype.releasePointerCapture) {
  Element.prototype.releasePointerCapture = () => {}
}
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {}
}

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => {
  server.resetHandlers()
  cleanup()
  window.localStorage.clear()
  document.documentElement.classList.remove('dark')
})
afterAll(() => server.close())
