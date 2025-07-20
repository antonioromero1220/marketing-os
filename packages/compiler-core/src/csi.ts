/**
 * @growthub/compiler-core/csi
 * Current Step Information (CSI) tracking and coordination utilities
 */

import { z } from 'zod'

// CSI Schema for validation
export const CSISchema = z.object({
  completedSteps: z.array(z.string()).default([]),
  currentProgress: z.number().min(0).max(100).default(0),
  totalSteps: z.number().int().positive().default(4),
  currentStep: z.string().default('pending'),
  metadata: z.record(z.any()).optional()
})

export type CSI = z.infer<typeof CSISchema>

// Thread Execution Status Types
export type ThreadExecutionStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'

// Message Metadata Schema for CSI tracking
export const MessageMetadataSchema = z.object({
  type: z.enum(['agent_step', 'system_message', 'user_message', 'completion']).default('agent_step'),
  step: z.string().optional(),
  status: z.enum(['pending', 'running', 'completed', 'failed', 'cancelled']).default('pending'),
  progress: z.number().min(0).max(100).default(0),
  agentType: z.string().optional(),
  toolName: z.string().optional(),
  timestamp: z.string().datetime().default(() => new Date().toISOString()),
  stepNumber: z.number().int().positive().optional(),
  totalSteps: z.number().int().positive().optional(),
  brandContext: z.string().optional(),
  referenceImages: z.number().int().min(0).optional(),
  generatedAssets: z.array(z.object({
    url: z.string(),
    type: z.string(),
    concept: z.string().optional()
  })).default([]),
  executionStats: z.object({
    apiCalls: z.number().int().min(0).optional(),
    storageBytes: z.number().int().min(0).optional(),
    executionTimeMs: z.number().int().min(0).optional()
  }).optional(),
  statusVersion: z.number().int().optional(),
  kvLockReleased: z.boolean().optional(),
  emissionTimestamp: z.string().datetime().optional()
})

export type MessageMetadata = z.infer<typeof MessageMetadataSchema>

/**
 * Create CSI with default values
 */
export function createCSI(
  currentStep: string = 'pending',
  totalSteps: number = 4,
  metadata?: Record<string, any>
): CSI {
  return {
    completedSteps: [],
    currentProgress: 0,
    totalSteps,
    currentStep,
    metadata: {
      createdAt: new Date().toISOString(),
      ...metadata
    }
  }
}

/**
 * Update CSI with new step completion
 */
export function updateCSI(
  csi: CSI,
  completedStep: string,
  newCurrentStep: string,
  metadata?: Record<string, any>
): CSI {
  const completedSteps = [...csi.completedSteps, completedStep]
  const progress = Math.round((completedSteps.length / csi.totalSteps) * 100)
  
  return {
    ...csi,
    completedSteps,
    currentProgress: progress,
    currentStep: newCurrentStep,
    metadata: {
      ...csi.metadata,
      ...metadata,
      updatedAt: new Date().toISOString()
    }
  }
}

/**
 * Check if CSI represents completed state
 */
export function isCSIComplete(csi: CSI): boolean {
  return csi.currentProgress >= 100 || 
         csi.completedSteps.length >= csi.totalSteps ||
         csi.currentStep === 'completed'
}

/**
 * Extract thread execution status from message metadata
 */
export function extractStatusFromMetadata(metadata: MessageMetadata | null): ThreadExecutionStatus {
  if (!metadata) return 'PENDING'

  // Enhanced completion detection for both final_completion and enhanced_completion
  if (metadata.status === 'completed' && (
    metadata.step === 'final_completion' ||
    metadata.step === 'enhanced_completion'
  )) {
    return 'COMPLETED'
  }
  
  if (metadata.status === 'failed' || metadata.status === 'cancelled') {
    return metadata.status.toUpperCase() as ThreadExecutionStatus
  }
  
  if (metadata.status === 'running') return 'RUNNING'
  
  return 'PENDING'
}

/**
 * Create step metadata for agent tasks
 */
export function createStepMetadata(
  stepName: string,
  agentType: string,
  stepNumber: number,
  totalSteps: number,
  toolName: string,
  additionalMetadata: Partial<MessageMetadata> = {}
): MessageMetadata {
  return {
    type: 'agent_step',
    step: stepName,
    status: 'pending',
    progress: Math.round((stepNumber / totalSteps) * 100),
    agentType,
    toolName,
    timestamp: new Date().toISOString(),
    stepNumber,
    totalSteps,
    generatedAssets: [],
    ...additionalMetadata
  }
}

/**
 * Analyze thread state from real-time messages
 */
export interface ThreadAnalysis {
  hasRunningSteps: boolean
  hasFinalCompletion: boolean
  shouldSwitchToHistorical: boolean
  shouldEnableRealtime: boolean
  executionStatus: ThreadExecutionStatus
  currentProgress: number
  completedSteps: number
  totalSteps: number
}

export function analyzeThreadState(threadMessages: Array<{ 
  step?: string
  status?: string
  progress?: number
  stepNumber?: number
  totalSteps?: number
}>): ThreadAnalysis {
  // Check for running steps
  const hasRunningSteps = threadMessages.some(msg => 
    msg.status === 'running' || msg.status === 'pending'
  )

  // Enhanced completion detection
  const hasFinalCompletion = threadMessages.some(msg =>
    (msg.step === 'final_completion' || msg.step === 'enhanced_completion') &&
    msg.status === 'completed'
  )

  // Calculate progress
  const progressValues = threadMessages
    .map(msg => msg.progress || 0)
    .filter(progress => progress > 0)
  
  const currentProgress = progressValues.length > 0 
    ? Math.max(...progressValues)
    : 0

  // Count completed steps
  const completedSteps = threadMessages.filter(msg => 
    msg.status === 'completed'
  ).length

  // Get total steps
  const totalStepsValues = threadMessages
    .map(msg => msg.totalSteps)
    .filter(Boolean) as number[]
  
  const totalSteps = totalStepsValues.length > 0
    ? Math.max(...totalStepsValues)
    : 4

  // Determine execution status
  let executionStatus: ThreadExecutionStatus = 'PENDING'
  if (hasFinalCompletion) {
    executionStatus = 'COMPLETED'
  } else if (hasRunningSteps) {
    executionStatus = 'RUNNING'
  }

  return {
    hasRunningSteps,
    hasFinalCompletion,
    shouldSwitchToHistorical: hasFinalCompletion,
    shouldEnableRealtime: !hasFinalCompletion,
    executionStatus,
    currentProgress,
    completedSteps,
    totalSteps
  }
}

/**
 * Create message metadata with status versioning
 */
export function createVersionedMetadata(
  step: string,
  status: MessageMetadata['status'],
  progress: number,
  additionalData: Partial<MessageMetadata> = {}
): MessageMetadata {
  return {
    type: 'agent_step',
    step,
    status,
    progress,
    timestamp: new Date().toISOString(),
    statusVersion: Date.now(),
    emissionTimestamp: new Date().toISOString(),
    generatedAssets: [],
    ...additionalData
  }
}

/**
 * Validate CSI data
 */
export function validateCSI(data: unknown): CSI {
  return CSISchema.parse(data)
}

/**
 * Validate message metadata
 */
export function validateMessageMetadata(data: unknown): MessageMetadata {
  return MessageMetadataSchema.parse(data)
}

/**
 * Merge CSI metadata safely
 */
export function mergeCSIMetadata(
  existing: CSI,
  updates: Partial<CSI>
): CSI {
  return {
    ...existing,
    ...updates,
    completedSteps: updates.completedSteps || existing.completedSteps,
    metadata: {
      ...existing.metadata,
      ...updates.metadata,
      updatedAt: new Date().toISOString()
    }
  }
}

/**
 * Calculate step progress based on sequence
 */
export function calculateStepProgress(
  stepNumber: number,
  totalSteps: number,
  isCompleted: boolean = false
): number {
  if (isCompleted) {
    return Math.round((stepNumber / totalSteps) * 100)
  }
  
  // If running, show progress slightly less than complete
  return Math.round(((stepNumber - 0.1) / totalSteps) * 100)
} 