import { createHash } from 'node:crypto'
import type { TokenHasher } from '../../domain/cryptography/token-hasher'

export class Sha256TokenHasher implements TokenHasher {
  hash(token: string): string {
    return createHash('sha256').update(token).digest('hex')
  }
}
