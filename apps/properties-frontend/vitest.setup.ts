process.env.NEXT_PUBLIC_API_GATEWAY_URL ??= 'http://localhost:3004'
process.env.NEXT_PUBLIC_AUTH_FRONTEND_URL ??= 'http://localhost:3000'

import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { server } from './src/mocks/server'
import { resetToasts } from './src/test-utils/resetToasts'

// jsdom não implementa Pointer Events — mesmo racional do packages/ui
if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = () => false
}
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {}
}

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => {
  server.resetHandlers()
  resetToasts()
  cleanup()
})
afterAll(() => server.close())
