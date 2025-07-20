# Agent Primitives Playbook

This playbook describes how to coordinate multiple autonomous agents using the primitives shipped in the `@growthub/primitives` package. These primitives form the lowest level building blocks for Growthub's Marketing OS. Each example below assumes the LAPD protocol is in effect, meaning that files are protected by living artifact headers and any change requires reflection notes under `infra/meta`.

## Installation

```bash
npm install @growthub/primitives
```

## Lock Management

The lock helpers enforce concurrency control across the system. The recommended pattern is to scope locks by user and execution thread.

```ts
import { acquireLock, releaseLock, withLock } from '@growthub/primitives';

// direct usage
await acquireLock('run:123');
// ...do work...
await releaseLock('run:123');

// higher-level helper
await withLock('run:123', async () => {
  // This function executes only while the lock is held
});
```

Locks should be short‑lived. Agents must always release locks in a `finally` block to avoid deadlocks.

## Event Streaming

The event utilities allow agents to emit progress updates that other services can consume. This is typically done through Supabase real‑time channels or Inngest events.

```ts
import { emitProgress } from '@growthub/primitives';

await emitProgress('thread_abc123', { step: 'image_generation', progress: 0.5 });
```

Consumers can subscribe to these events to display real‑time UI updates or trigger additional workflows.

## Retry Helpers

Agents often need to retry external API calls or long‑running tasks. The primitive `withRetries` abstracts exponential backoff and error logging.

```ts
import { withRetries } from '@growthub/primitives';

const result = await withRetries(() => fetch(url), { retries: 3, delay: 1000 });
```

Use retries only for idempotent operations. Non‑idempotent actions should be coordinated through a durable queue.

## Example Flow

1. Acquire a lock for the thread.
2. Send progress updates while executing steps.
3. Retry failing steps with exponential backoff.
4. Release the lock once complete.

```ts
await withLock(`run:${userId}:${threadId}`, async () => {
  await emitProgress(threadId, { step: 'start' });
  const data = await withRetries(() => fetchData(), { retries: 2 });
  await emitProgress(threadId, { step: 'complete', data });
});
```

## Best Practices

- **Keep primitives stateless.** All stateful logic should live in higher‑level packages or services.
- **Document every lock key** in your reflection notes so future agents understand the concurrency model.
- **Prefer composition over inheritance** when building on these primitives.
- **Validate inputs** using the schemas from `@growthub/schemas` before invoking primitives.

## Additional References

- [`packages/primitives/src`](../packages/primitives/src) – Source code of all primitives
- [`docs/architecture.md`](./architecture.md) – How these primitives fit into the overall system
- [`infra/README.md`](../infra/README.md) – LAPD rules for modifying infrastructure code 