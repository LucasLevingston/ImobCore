import '@testing-library/jest-dom/vitest'

// Vitest 4 moved `Assertion`/`AsymmetricMatchersContaining` from a local interface
// in `'vitest'` to `'@vitest/expect'` — `'vitest'` now only re-exports them
// (`export { Assertion } from '@vitest/expect'`). TypeScript's `declare module`
// augmentation can't merge into a re-export, only into the module that originally
// declares the interface — so @testing-library/jest-dom@6.9.1's own `declare
// module 'vitest' { interface Assertion ... }` (in its /vitest entrypoint) is now
// silently a no-op. Augments the real target directly instead.
// `/matchers` is an `export =` namespace (matchersStandalone), not a named export —
// default-import the namespace itself, then reference its nested type.
import type MatchersStandalone from '@testing-library/jest-dom/matchers'

declare module '@vitest/expect' {
  interface Assertion<T = unknown> extends MatchersStandalone.TestingLibraryMatchers<unknown, T> {}
  interface AsymmetricMatchersContaining
    extends MatchersStandalone.TestingLibraryMatchers<unknown, unknown> {}
}
