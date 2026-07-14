import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http'
import { afterEach, describe, expect, it } from 'vitest'
import { pingUpstream } from './ping-upstream'

async function startServer(handler: (req: IncomingMessage, res: ServerResponse) => void) {
  const server: Server = createServer(handler)
  await new Promise<void>((resolve) => server.listen(0, resolve))
  const address = server.address()
  const port = typeof address === 'object' && address ? address.port : 0
  return { server, url: `http://127.0.0.1:${port}` }
}

describe('pingUpstream', () => {
  let server: Server | undefined

  afterEach(async () => {
    const current = server
    if (current) {
      await new Promise((resolve) => current.close(resolve))
      server = undefined
    }
  })

  it('should resolve true when the upstream responds 200 on /health', async () => {
    const started = await startServer((_req, res) => {
      res.writeHead(200)
      res.end()
    })
    server = started.server

    await expect(pingUpstream(started.url)).resolves.toBe(true)
  })

  it('should resolve false when the upstream responds with a non-2xx status', async () => {
    const started = await startServer((_req, res) => {
      res.writeHead(500)
      res.end()
    })
    server = started.server

    await expect(pingUpstream(started.url)).resolves.toBe(false)
  })

  it('should resolve false when the upstream is unreachable', async () => {
    await expect(pingUpstream('http://127.0.0.1:1')).resolves.toBe(false)
  })

  it('should accept a custom timeout and still resolve true for a fast upstream', async () => {
    const started = await startServer((_req, res) => {
      res.writeHead(200)
      res.end()
    })
    server = started.server

    await expect(pingUpstream(started.url, 5000)).resolves.toBe(true)
  })
})
