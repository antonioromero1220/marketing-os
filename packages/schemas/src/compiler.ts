/**
 * @growthub/schemas - Agent Compiler Schemas
 * 
 * Pure Zod schemas for the agent compiler system including validation, 
 * orchestration, and decomposition. These schemas are stateless and contain 
 * no business logic - perfect for OSS.
 */

import { z } from 'zod';
import { AgentTypeSchema, CSISchema } from './agent.js';
import { BrandContextSchema } from './brand.js';

// ============================================================================
// COMPILER CONTEXT SCHEMAS
// ============================================================================

export const CompilerContextSchema = z.object({
  userId: z.string().uuid(),
  threadId: z.string(),
  runId: z.string(),
  jwtToken: z.string(),
  timestamp: z.string().datetime(),
  brandKitId: z.string().uuid().optional(),
  agentType: AgentTypeSchema.optional(),
});

export type CompilerContext = z.infer<typeof CompilerContextSchema>;

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

export const ValidationResultSchema = z.object({
  success: z.boolean(),
  data: z.record(z.unknown()).optional(),
  errors: z.array(z.string()).optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const PreInitPayloadSchema = z.object({
  userId: z.string().uuid(),
  threadId: z.string(),
  runId: z.string(),
  prompt: z.string().min(1),
  agentType: AgentTypeSchema,
  creativeCount: z.number().min(1).max(10),
  brandKitId: z.string().uuid().optional(),
  referenceImages: z.array(z.object({
    url: z.string().url(),
    description: z.string().optional(),
    weight: z.number().min(0).max(1).default(1),
  })).optional(),
  settings: z.record(z.unknown()).optional(),
});

export type ValidationResult = z.infer<typeof ValidationResultSchema>;
export type PreInitPayload = z.infer<typeof PreInitPayloadSchema>;

// ============================================================================
// ORCHESTRATION SCHEMAS
// ============================================================================

export const OrchestrationEventSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['decomposition', 'execution', 'completion']),
  userId: z.string().uuid(),
  threadId: z.string(),
  runId: z.string(),
  agentType: AgentTypeSchema,
  payload: z.record(z.unknown()),
  metadata: z.object({
    kvLock: z.record(z.unknown()).optional(),
    brandContext: BrandContextSchema.optional(),
    executionPlan: z.record(z.unknown()).optional(),
  }).optional(),
  timestamp: z.string().datetime(),
  priority: z.enum(['low', 'normal', 'high']).default('normal'),
});

export const OrchestrationDecisionSchema = z.object({
  shouldDecompose: z.boolean(),
  executionPath: z.enum(['direct', 'decomposed', 'hybrid']),
  estimatedComplexity: z.number().min(1).max(10),
  resourceRequirements: z.array(z.string()),
  parallelizable: z.boolean(),
  dependencies: z.array(z.string()).optional(),
});

export type OrchestrationEvent = z.infer<typeof OrchestrationEventSchema>;
export type OrchestrationDecision = z.infer<typeof OrchestrationDecisionSchema>;

// ============================================================================
// DECOMPOSITION SCHEMAS
// ============================================================================

export const DecompositionStepSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  type: z.enum(['analysis', 'generation', 'validation', 'completion']),
  description: z.string(),
  dependencies: z.array(z.string()).default([]),
  estimatedDuration: z.number().positive(),
  priority: z.number().min(1).max(10).default(5),
  parallelizable: z.boolean().default(false),
  resources: z.array(z.string()).default([]),
  metadata: z.record(z.unknown()).optional(),
});

export const DecompositionPlanSchema = z.object({
  id: z.string().uuid(),
  agentType: AgentTypeSchema,
  steps: z.array(DecompositionStepSchema),
  context: z.object({
    brandKit: z.record(z.unknown()).optional(),
    assets: z.array(z.string()).optional(),
    sequencing: z.enum(['parallel', 'sequential']),
    userPrompt: z.string(),
    referenceImages: z.array(z.string()).optional(),
  }),
  metadata: z.object({
    totalSteps: z.number().positive(),
    estimatedDuration: z.number().positive(),
    complexity: z.number().min(1).max(10),
    resourceRequirements: z.array(z.string()),
  }),
  createdAt: z.string().datetime(),
});

export type DecompositionStep = z.infer<typeof DecompositionStepSchema>;
export type DecompositionPlan = z.infer<typeof DecompositionPlanSchema>;

// ============================================================================
// STATUS & ANALYSIS SCHEMAS
// ============================================================================

export const StatusMetadataSchema = z.object({
  executionStats: z.object({
    totalTasks: z.number().nonnegative(),
    completedTasks: z.number().nonnegative(),
    failedTasks: z.number().nonnegative(),
    averageExecutionTime: z.number().nonnegative().optional(),
  }).optional(),
  resourceUsage: z.object({
    memoryUsage: z.number().nonnegative().optional(),
    cpuUsage: z.number().nonnegative().optional(),
    networkCalls: z.number().nonnegative().optional(),
  }).optional(),
  lastUpdate: z.string().datetime(),
  debugInfo: z.record(z.unknown()).optional(),
});

export const CompilerThreadExecutionStatusSchema = z.object({
  threadId: z.string(),
  userId: z.string().uuid(),
  status: z.enum(['idle', 'running', 'completed', 'failed', 'cancelled']),
  executionPhase: z.enum(['init', 'decomposition', 'execution', 'completion']).optional(),
  currentStep: z.string().optional(),
  totalSteps: z.number().positive().optional(),
  completedSteps: z.number().nonnegative().optional(),
  progress: z.number().min(0).max(100).optional(),
  runningMessages: z.number().nonnegative().optional(),
  shouldEnableRealtime: z.boolean(),
  shouldSwitchToHistorical: z.boolean(),
  metadata: StatusMetadataSchema.optional(),
  startedAt: z.string().datetime().optional(),
  completedAt: z.string().datetime().optional(),
  error: z.string().optional(),
});

export const ThreadAnalysisResultSchema = z.object({
  executionStatus: CompilerThreadExecutionStatusSchema,
  runningMessages: z.number().nonnegative(),
  shouldEnableRealtime: z.boolean(),
  shouldSwitchToHistorical: z.boolean(),
  metadata: StatusMetadataSchema.optional(),
});

export type StatusMetadata = z.infer<typeof StatusMetadataSchema>;
export type CompilerThreadExecutionStatus = z.infer<typeof CompilerThreadExecutionStatusSchema>;
export type ThreadAnalysisResult = z.infer<typeof ThreadAnalysisResultSchema>;

// ============================================================================
// KV LOCK SCHEMAS
// ============================================================================

export const KVLockMetadataSchema = z.object({
  lockId: z.string(),
  userId: z.string().uuid(),
  threadId: z.string(),
  lockKey: z.string(),
  acquiredAt: z.string().datetime(),
  expiresAt: z.string().datetime(),
  ttlSeconds: z.number().positive(),
  metadata: z.record(z.unknown()).optional(),
});

export type KVLockMetadata = z.infer<typeof KVLockMetadataSchema>;

// ============================================================================
// CONFIGURATION SCHEMAS
// ============================================================================

export const CompilerConfigSchema = z.object({
  environment: z.enum(['development', 'staging', 'production']),
  enableLogging: z.boolean().default(true),
  enableFailsafe: z.boolean().default(true),
  maxConcurrentJobs: z.number().positive().default(10),
  preInit: z.object({
    skipKvLock: z.boolean().default(false),
    lockTtlSeconds: z.number().positive().default(900),
    validateBrandKit: z.boolean().default(true),
  }).optional(),
  orchestration: z.object({
    enableDecomposition: z.boolean().default(true),
    decompositionThreshold: z.object({
      minComplexity: z.number().min(1).max(10).default(3),
      maxSteps: z.number().positive().default(15),
    }),
  }).optional(),
  database: z.object({
    connectionPool: z.object({
      maxConnections: z.number().positive().default(50),
    }).optional(),
    caching: z.object({
      enabled: z.boolean().default(true),
      ttlSeconds: z.number().positive().default(300),
    }).optional(),
  }).optional(),
  streaming: z.object({
    enabled: z.boolean().default(true),
    batchSize: z.number().positive().default(10),
    flushIntervalMs: z.number().positive().default(1000),
  }).optional(),
});

export type CompilerConfig = z.infer<typeof CompilerConfigSchema>;

// ============================================================================
// ERROR SCHEMAS
// ============================================================================

export const CompilerErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.record(z.unknown()).optional(),
  timestamp: z.string().datetime(),
  context: CompilerContextSchema.optional(),
});

export const ValidationErrorSchema = CompilerErrorSchema.extend({
  code: z.literal('VALIDATION_ERROR'),
  field: z.string().optional(),
  expectedType: z.string().optional(),
});

export const LockErrorSchema = CompilerErrorSchema.extend({
  code: z.literal('LOCK_ERROR'),
  lockKey: z.string(),
  lockHolder: z.string().optional(),
});

export const OrchestrationErrorSchema = CompilerErrorSchema.extend({
  code: z.literal('ORCHESTRATION_ERROR'),
  phase: z.enum(['init', 'decomposition', 'execution', 'completion']),
  stepId: z.string().optional(),
});

export type CompilerError = z.infer<typeof CompilerErrorSchema>;
export type ValidationError = z.infer<typeof ValidationErrorSchema>;
export type LockError = z.infer<typeof LockErrorSchema>;
export type OrchestrationError = z.infer<typeof OrchestrationErrorSchema>;

// ============================================================================
// EXPORTS
// ============================================================================

export const compilerSchemas = {
  CompilerContextSchema,
  ValidationResultSchema,
  PreInitPayloadSchema,
  OrchestrationEventSchema,
  OrchestrationDecisionSchema,
  DecompositionStepSchema,
  DecompositionPlanSchema,
  StatusMetadataSchema,
  CompilerThreadExecutionStatusSchema,
  ThreadAnalysisResultSchema,
  KVLockMetadataSchema,
  CompilerConfigSchema,
  CompilerErrorSchema,
  ValidationErrorSchema,
  LockErrorSchema,
  OrchestrationErrorSchema,
} as const;