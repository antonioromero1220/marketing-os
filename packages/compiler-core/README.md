# @growthub/compiler-core

Core decomposition engine and orchestration logic for Growthub Marketing OS.

## Overview

This package contains the foundational AT-03 patterns extracted from the production Growthub system, providing:

- **Decomposition Engine**: Intelligent breakdown of user prompts into actionable tasks
- **Orchestration Patterns**: Coordination and execution flow management  
- **CSI Tracking**: Current Step Information for real-time progress monitoring
- **Pre-Init Validation**: Request validation and safety protocols

## Installation

```bash
npm install @growthub/compiler-core
```

## Quick Start

```typescript
import { 
  validateDecompositionEvent,
  createContentGenerationSteps,
  analyzeThreadState,
  validatePreInit 
} from '@growthub/compiler-core'

// Validate a decomposition request
const event = validateDecompositionEvent({
  threadId: 'uuid-here',
  userId: 'uuid-here', 
  agentType: 'CONTENT_GENERATION_AGENT',
  prompt: 'Create a Facebook ad for my brand',
  context: {
    brandKit: { /* brand data */ },
    referenceImages: []
  }
})

// Create orchestration steps
const steps = createContentGenerationSteps()

// Analyze thread state for UI coordination
const analysis = analyzeThreadState(realtimeMessages)
```

## Modules

### Decomposition (`/decomposition`)

Core decomposition engine for breaking down user prompts:

```typescript
import { 
  validateDecompositionEvent,
  transformBrandContext,
  createDecompositionStep 
} from '@growthub/compiler-core/decomposition'

const event = validateDecompositionEvent(requestData)
const brandContext = transformBrandContext(event.context)
const step = createDecompositionStep('analysis', 'analysis', { priority: 'high' })
```

### Orchestration (`/orchestration`)

Coordination patterns for agent execution:

```typescript
import { 
  createContentGenerationSteps,
  updateOrchestrationStep,
  calculateOrchestrationProgress 
} from '@growthub/compiler-core/orchestration'

const steps = createContentGenerationSteps()
const updatedStep = updateOrchestrationStep(step, 'running', 50, result)
const progress = calculateOrchestrationProgress(steps)
```

### CSI - Current Step Information (`/csi`)

Real-time progress tracking and thread coordination:

```typescript
import { 
  analyzeThreadState,
  extractStatusFromMetadata,
  createCSI 
} from '@growthub/compiler-core/csi'

const analysis = analyzeThreadState(messages)
const status = extractStatusFromMetadata(metadata)
const csi = createCSI('analysis_phase', 4)
```

### Validation (`/validation`)

Pre-init validation and safety protocols:

```typescript
import { 
  validatePreInit,
  validateKVLock,
  validateAuth 
} from '@growthub/compiler-core/validation'

const preInitResult = validatePreInit(requestData)
const lockResult = validateKVLock(kvMetadata)  
const authResult = validateAuth(authState)
```

## Architecture Patterns

### AT-03 Decomposition Flow

```
User Prompt → Validation → Decomposition → Orchestration → Execution
     ↓             ↓            ↓             ↓            ↓
   Schema      Pre-Init     Intelligence   Coordination   Results
  Validation   Guards       Analysis       & CSI         & Status
```

### CSI State Management

The CSI (Current Step Information) system provides real-time coordination:

- **Thread Analysis**: Analyze message streams for UI state
- **Progress Tracking**: Calculate completion percentages  
- **Status Extraction**: Extract execution status from metadata
- **State Transitions**: Manage pending → running → completed flows

### Orchestration Patterns

Dependency-aware step execution:

```typescript
const steps = [
  { stepId: 'analysis', dependencies: [] },
  { stepId: 'planning', dependencies: ['analysis'] }, 
  { stepId: 'execution', dependencies: ['analysis', 'planning'] }
]

const nextSteps = getNextExecutableSteps(steps) // Returns: ['analysis']
```

## TypeScript Support

Full TypeScript support with strict type definitions:

```typescript
import type { 
  DecompositionEvent,
  OrchestrationResult,
  CSI,
  ThreadExecutionStatus 
} from '@growthub/compiler-core'

function processDecomposition(event: DecompositionEvent): OrchestrationResult {
  // Full type safety and IntelliSense
}
```

## Error Handling

Comprehensive validation with detailed error reporting:

```typescript
const result = validatePreInit(data)

if (!result.success) {
  result.errors?.forEach(error => {
    console.log(`${error.field}: ${error.message} (${error.code})`)
  })
}
```

## Real-World Usage

This package powers the Growthub Marketing OS production system with:

- **Thousands of users** processing marketing content daily
- **Real-time coordination** across distributed serverless functions  
- **Intelligent decomposition** of complex marketing prompts
- **Production-grade validation** with comprehensive error handling

## Integration

Works seamlessly with other Growthub packages:

```typescript
// With @growthub/schemas for validation
import { BrandKitSchema } from '@growthub/schemas'
import { validateDecompositionEvent } from '@growthub/compiler-core'

// With @growthub/agent-tools for execution
import { executeAgentTask } from '@growthub/agent-tools'  
import { createContentGenerationSteps } from '@growthub/compiler-core'
```

## License

MIT © Growthub Team

---

**Part of [Growthub Marketing OS](https://github.com/growthub-os/marketing-os) - Open-core marketing automation platform** 