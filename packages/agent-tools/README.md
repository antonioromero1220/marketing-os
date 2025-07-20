# @growthub/agent-tools

Agent coordination utilities and KV lock management for Growthub Marketing OS.

## Overview

This package provides professional agent coordination patterns extracted from the AT-03 production system:

- **KV Lock Management**: Distributed locking with TTL-based cleanup
- **Agent Task Coordination**: OpenAI function calling abstractions
- **Orchestration Patterns**: Multi-step agent workflows with dependency management
- **Race Condition Prevention**: Singleton execution guarantees

## Installation

```bash
npm install @growthub/agent-tools
```

## Quick Start

```typescript
import { 
  KVLockManager,
  AgentTaskExecutor, 
  AgentCoordinationManager,
  AgentTaskConfigs 
} from '@growthub/agent-tools'

// Set up coordination
const kvManager = new KVLockManager()
const taskExecutor = new AgentTaskExecutor(openaiClient)
const coordinator = new AgentCoordinationManager(kvManager, taskExecutor)

// Execute task with automatic locking
const result = await coordinator.executeTaskWithLock(
  request,
  taskInput,
  AgentTaskConfigs.INTENT_ANALYSIS
)
```

## Modules

### KV Lock Management (`/kv`)

Distributed locking for agent coordination:

```typescript
import { 
  KVLockManager,
  withKvLock,
  acquireKvLock 
} from '@growthub/agent-tools/kv'

// Basic lock operations
const kvManager = new KVLockManager()
const result = await kvManager.acquireKvLock('userId', 'threadId')

// Automatic lock management
await withKvLock('userId', 'threadId', async () => {
  // Your protected code here
})
```

### Agent Tasks (`/tasks`)

OpenAI function calling abstractions:

```typescript
import { 
  AgentTaskExecutor,
  AgentTaskBuilder,
  AgentTaskConfigs 
} from '@growthub/agent-tools/tasks'

// Use predefined configs
const result = await executor.executeAgentTask(
  request,
  { prompt: 'Create ads for my brand' },
  AgentTaskConfigs.INTENT_ANALYSIS
)

// Build custom tasks
const customTask = AgentTaskBuilder
  .create('my_analysis')
  .type('analysis')
  .systemPrompt('Analyze user input...')
  .userPrompt(data => `Analyze: ${data.input}`)
  .function({
    name: 'analyze',
    description: 'Analyzes input',
    parameters: { /* schema */ }
  })
  .progress(50)
  .build()
```

### Coordination (`/coordination`)

High-level coordination combining locks and tasks:

```typescript
import { 
  AgentCoordinationManager,
  OrchestrationManager 
} from '@growthub/agent-tools/coordination'

// Single task with lock
const result = await coordinator.executeTaskWithLock(
  request,
  taskInput,
  taskConfig
)

// Multi-step orchestration
const orchestrator = new OrchestrationManager(kvManager, taskExecutor)
const results = await orchestrator.executeOrchestration(
  request,
  orchestrationSteps,
  orchestrationData
)
```

## Architecture Patterns

### KV Lock Patterns

```
User Request → Lock Acquisition → Task Execution → Lock Release
     ↓              ↓                   ↓              ↓
   Thread ID    Singleton Key      Protected Code   Cleanup
              run:userId:threadId
```

**Key Features:**
- TTL-based automatic cleanup (15min default)
- Race condition prevention 
- Conditional locking with 'nx' (not exists) semantics
- Lock metadata for debugging and monitoring

### Agent Task Flow

```
Request → Validation → OpenAI Call → Result Parsing → CSI Update
   ↓          ↓           ↓             ↓              ↓
Schema    Zod Schema   Function     JSON Parse    Progress
Check      Validation   Calling     & Validate     Tracking
```

**Supported Task Types:**
- `analysis` - Intent, brand, complexity analysis
- `image_generation` - Visual content creation
- `text_generation` - Copy and content generation  
- `completion` - Final result compilation

### Coordination Patterns

The coordination layer combines KV locks with agent tasks for distributed execution:

```typescript
// Automatic lock + task execution
const result = await coordinator.executeTaskWithLock(
  request,
  taskInput,
  taskConfig,
  { ttlSeconds: 600 } // 10 minute lock
)

// Multi-step with dependencies
const steps = [
  { stepId: 'intent', taskConfig: IntentAnalysisConfig },
  { stepId: 'brand', taskConfig: BrandAnalysisConfig, dependencies: ['intent'] },
  { stepId: 'execution', taskConfig: ExecutionConfig, dependencies: ['intent', 'brand'] }
]
```

## Predefined Configurations

Ready-to-use configurations for common marketing AI tasks:

### Intent Analysis
```typescript
AgentTaskConfigs.INTENT_ANALYSIS
// Analyzes user prompts to determine asset count and types
// Progress: 25% | Tool: o3_mini_intent_analyzer
```

### Brand Analysis  
```typescript
AgentTaskConfigs.BRAND_ANALYSIS
// Assesses brand asset completeness and strength
// Progress: 50% | Tool: o3_mini_brand_analyzer
```

### Complexity Assessment
```typescript
AgentTaskConfigs.COMPLEXITY_ASSESSMENT
// Evaluates task complexity and resource requirements
// Progress: 75% | Tool: o3_mini_complexity_analyzer
```

## Error Handling

Comprehensive error handling with typed error responses:

```typescript
const result = await coordinator.executeTaskWithLock(...)

if (!result.success) {
  switch (result.error?.type) {
    case 'LOCK_ACQUISITION_FAILED':
      // Handle lock contention
      break
    case 'TASK_EXECUTION_FAILED':
      // Handle OpenAI or validation errors
      break
    case 'VALIDATION_FAILED':
      // Handle schema validation errors
      break
  }
}
```

## Production Usage

This package powers the Growthub Marketing OS production system:

- **Concurrent Users**: Handles thousands of simultaneous agent executions
- **Lock Coordination**: Prevents race conditions in distributed serverless functions
- **OpenAI Integration**: Processes millions of function calls monthly
- **Fault Tolerance**: Automatic recovery from transient failures

## Integration Examples

### Next.js API Route
```typescript
import { AgentCoordinationManager } from '@growthub/agent-tools'

export async function POST(req: Request) {
  const coordinator = new AgentCoordinationManager(kvManager, taskExecutor)
  
  const result = await coordinator.executeTaskWithLock(
    await req.json(),
    taskInput,
    AgentTaskConfigs.INTENT_ANALYSIS
  )
  
  return Response.json(result)
}
```

### Inngest Function
```typescript
import { withKvLock } from '@growthub/agent-tools/kv'

export const processContent = inngest.createFunction(
  { id: 'process-content' },
  { event: 'content/process' },
  async ({ event }) => {
    return await withKvLock(
      event.data.userId,
      event.data.threadId,
      async () => {
        // Protected content processing
      }
    )
  }
)
```

## TypeScript Support

Full TypeScript support with strict type definitions:

```typescript
import type { 
  AgentTaskResult,
  CoordinationResult,
  KVLockMetadata 
} from '@growthub/agent-tools'

function processResult(result: CoordinationResult<AgentTaskResult>) {
  // Full type safety and IntelliSense
}
```

## License

MIT © Growthub Team

---

**Part of [Growthub Marketing OS](https://github.com/growthub-os/marketing-os) - Open-core marketing automation platform** 