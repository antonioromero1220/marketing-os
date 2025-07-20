/**
 * @growthub/schemas - Agent Task & Execution Schemas
 * 
 * Pure Zod schemas for agent task management, execution tracking, and metadata.
 * These schemas are stateless and contain no business logic - perfect for OSS.
 */

import { z } from 'zod';

// ============================================================================
// AGENT TYPE SCHEMAS
// ============================================================================

export const AgentTypeSchema = z.enum([
  'CONTENT_GENERATION_AGENT',
  'TEXT_ANALYSIS_AGENT',
  'IMAGE_ANALYSIS_AGENT',
  'SOCIAL_MEDIA_AGENT',
  'EMAIL_MARKETING_AGENT',
  'SEO_OPTIMIZATION_AGENT',
  'BRAND_ANALYSIS_AGENT',
  'COMPETITOR_ANALYSIS_AGENT',
]);

export type AgentType = z.infer<typeof AgentTypeSchema>;

// ============================================================================
// AGENT TASK SCHEMAS
// ============================================================================

export const AgentTaskStatusSchema = z.enum([
  'PENDING',
  'RUNNING', 
  'COMPLETED',
  'FAILED',
  'CANCELLED'
]);

export const AgentTaskTypeSchema = z.enum([
  'api_call',
  'image_generation',
  'text_generation',
  'analysis',
  'completion',
  'decomposition',
  'orchestration'
]);

export const AgentTaskSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid(),
  thread_id: z.string(),
  autopilot_chat_id: z.string().uuid().optional(),
  agent_job_id: z.string().uuid().optional(),
  task_name: z.string().min(1).max(100),
  task_type: AgentTaskTypeSchema,
  task_sequence: z.number().int().min(1),
  api_route: z.string().max(200).optional(),
  status: AgentTaskStatusSchema.default('PENDING'),
  started_at: z.string().datetime().optional(),
  completed_at: z.string().datetime().optional(),
  duration_ms: z.number().positive().optional(),
  task_input: z.record(z.unknown()).optional(),
  task_output: z.record(z.unknown()).optional(),
  error_details: z.record(z.unknown()).optional(),
  is_actively_running: z.boolean().default(false),
  rendering_metadata: z.record(z.unknown()).optional(),
  streaming_metadata: z.record(z.unknown()).optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export type AgentTask = z.infer<typeof AgentTaskSchema>;
export type AgentTaskStatus = z.infer<typeof AgentTaskStatusSchema>;
export type AgentTaskType = z.infer<typeof AgentTaskTypeSchema>;

// ============================================================================
// AGENT EXECUTION CONTEXT
// ============================================================================

export const CSISchema = z.object({
  completedSteps: z.array(z.string()),
  currentProgress: z.number().min(0).max(100),
  totalSteps: z.number().positive(),
  currentStep: z.string().optional(),
});

export const AgentContextSchema = z.object({
  userId: z.string().uuid(),
  threadId: z.string(),
  runId: z.string().optional(),
  agentType: AgentTypeSchema,
  taskSequence: z.number().int().min(1),
  previousCSI: CSISchema.optional(),
  brandContext: z.record(z.unknown()).optional(),
  executionMetadata: z.record(z.unknown()).optional(),
});

export type CSI = z.infer<typeof CSISchema>;
export type AgentContext = z.infer<typeof AgentContextSchema>;

// ============================================================================
// AGENT METADATA SCHEMAS
// ============================================================================

export const AgentStepMetadataSchema = z.object({
  step: z.string(),
  stepNumber: z.number().positive(),
  totalSteps: z.number().positive(),
  agentType: AgentTypeSchema,
  toolName: z.string(),
  status: z.enum(['pending', 'running', 'completed', 'failed']),
  progress: z.number().min(0).max(100),
  timestamp: z.string().datetime().optional(),
  executionTime: z.number().positive().optional(),
  assets: z.array(z.object({
    type: z.string(),
    url: z.string().url(),
    metadata: z.record(z.unknown()).optional(),
  })).optional(),
});

export const ThreadExecutionStatusSchema = z.object({
  threadId: z.string(),
  userId: z.string().uuid(),
  status: z.enum(['idle', 'running', 'completed', 'failed']),
  currentStep: z.string().optional(),
  totalSteps: z.number().positive().optional(),
  completedSteps: z.number().nonnegative().optional(),
  progress: z.number().min(0).max(100).optional(),
  startedAt: z.string().datetime().optional(),
  completedAt: z.string().datetime().optional(),
  error: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export type AgentStepMetadata = z.infer<typeof AgentStepMetadataSchema>;
export type ThreadExecutionStatus = z.infer<typeof ThreadExecutionStatusSchema>;

// ============================================================================
// AGENT TASK CREATION SCHEMAS
// ============================================================================

export const CreateAgentTaskSchema = AgentTaskSchema.omit({
  id: true,
  status: true,
  started_at: true,
  completed_at: true,
  duration_ms: true,
  task_output: true,
  error_details: true,
  is_actively_running: true,
  created_at: true,
  updated_at: true,
}).extend({
  task_name: z.string().min(1, 'Task name is required'),
  task_type: AgentTaskTypeSchema,
  task_sequence: z.number().int().min(1, 'Task sequence must be positive'),
  task_input: z.record(z.unknown()).optional(),
  rendering_metadata: z.record(z.unknown()).optional(),
  streaming_metadata: z.record(z.unknown()).optional(),
});

export const UpdateAgentTaskSchema = z.object({
  status: AgentTaskStatusSchema.optional(),
  task_output: z.record(z.unknown()).optional(),
  error_details: z.record(z.unknown()).optional(),
  rendering_metadata: z.record(z.unknown()).optional(),
  streaming_metadata: z.record(z.unknown()).optional(),
  is_actively_running: z.boolean().optional(),
  completed_at: z.string().datetime().optional(),
  duration_ms: z.number().positive().optional(),
});

export type CreateAgentTask = z.infer<typeof CreateAgentTaskSchema>;
export type UpdateAgentTask = z.infer<typeof UpdateAgentTaskSchema>;

// ============================================================================
// AGENT FUNCTION SCHEMAS
// ============================================================================

export const AgentFunctionDefinitionSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  parameters: z.object({
    type: z.literal('object'),
    properties: z.record(z.unknown()),
    required: z.array(z.string()),
  }),
});

export const AgentToolConfigSchema = z.object({
  taskName: z.string(),
  taskType: AgentTaskTypeSchema,
  apiRoute: z.string(),
  toolName: z.string(),
  progressPercent: z.number().min(0).max(100),
  functionDefinition: AgentFunctionDefinitionSchema,
  systemPrompt: z.string(),
  userPromptTemplate: z.function().args(z.record(z.unknown())).returns(z.string()),
});

export type AgentFunctionDefinition = z.infer<typeof AgentFunctionDefinitionSchema>;
export type AgentToolConfig = z.infer<typeof AgentToolConfigSchema>;

// ============================================================================
// EXPORTS
// ============================================================================

export const agentSchemas = {
  AgentTypeSchema,
  AgentTaskSchema,
  AgentTaskStatusSchema,
  AgentTaskTypeSchema,
  CSISchema,
  AgentContextSchema,
  AgentStepMetadataSchema,
  ThreadExecutionStatusSchema,
  CreateAgentTaskSchema,
  UpdateAgentTaskSchema,
  AgentFunctionDefinitionSchema,
  AgentToolConfigSchema,
} as const;