# @growthub/primitives

This package provides stateless helper functions and small utilities used throughout the Growthub Marketing OS. They are written in TypeScript with minimal dependencies so they can run in Node.js, browsers, and edge runtimes.

## Installation

```bash
npm install @growthub/primitives
```

## Usage Example

```ts
import { acquireLock, withRetries } from '@growthub/primitives';

await acquireLock('run:123');
const result = await withRetries(() => fetch('https://api.example.com'), {
  retries: 2,
});
```

## Available Primitives

- `acquireLock(key)` / `releaseLock(key)` – Distributed locking helpers using Supabase KV storage.
- `withLock(key, fn)` – Convenience wrapper that automatically releases the lock.
- `emitProgress(threadId, payload)` – Broadcast progress events.
- `withRetries(fn, options)` – Execute a function with exponential backoff.
- `chunkArray(items, size)` – Break an array into fixed-size chunks.

Each function is documented in the [Agent Primitives Playbook](../../docs/agent-primitives-playbook.md).

## Versioning

The primitives follow semantic versioning. Early releases are tagged `v1.x.x-alpha` until the API stabilizes. Breaking changes will increase the major version and be noted in the changelog.

## Contributing

1. Fork the repo and add new utilities under `src/`.
2. Write unit tests in the same directory using your preferred framework.
3. Update the docs with examples and use cases.
4. Submit a pull request describing the new primitive and its intended purpose.

All contributions must comply with the LAPD protocol, including reflection notes for any file marked as a living artifact. 