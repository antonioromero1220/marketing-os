/**
 * @growthub/compiler-core/orchestration
 * Core orchestration patterns for agent coordination and execution
 */

import { z } from 'zod'
import type { DecompositionEvent, DecompositionStep, BrandContext } from './decomposition'

// Orchestration Request Schema
export const OrchestrationRequestSchema = z.object({
  threadId: z.string().uuid(),
  userId: z.string().min(1),
  agentType: z.enum(['CONTENT_GENERATION_AGENT', 'TEXT_ANALYSIS_AGENT']),
  prompt: z.string().min(1),
  brandContext: z.object({
    brand_name: z.string(),
    colors: z.array(z.string()).default([]),
    messaging: z.string().nullable(),
    referenceImages: z.array(z.object({
      url: z.string(),
      type: z.string(), 
      description: z.string()
    })).default([])
  }),
  executionPriority: z.enum(['low', 'normal', 'high']).default('normal'),
  maxRetries: z.number().int().min(0).max(3).default(1),
  metadata: z.record(z.any()).optional()
})

export type OrchestrationRequest = z.infer<typeof OrchestrationRequestSchema>

// Orchestration Result Types
export interface OrchestrationResult {
  success: boolean
  threadId: string
  userId: string
  agentType: string
  orchestrationId: string
  steps: OrchestrationStep[]
  metadata: {
    startedAt: string
    completedAt?: string
    duration?: number
    status: 'pending' | 'running' | 'completed' | 'failed'
    retryCount: number
  }
  error?: {
    message: string
    code: string
    details?: any
  }
}

export interface OrchestrationStep {
  stepId: string
  stepName: string
  stepType: 'decomposition' | 'analysis' | 'execution' | 'coordination' | 'completion'
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped'
  progress: number
  result?: any
  metadata?: {
    startedAt?: string
    completedAt?: string
    duration?: number
    retryCount?: number
    [key: string]: any
  }
  dependencies?: string[]
  error?: {
    message: string
    code: string
    retry?: boolean
  }
}

// CSI (Current Step Information) Types
export interface CSI {
  completedSteps: string[]
  currentProgress: number
  totalSteps: number
  currentStep: string
  metadata?: Record<string, any>
}

/**
 * Create orchestration step with metadata
 */
export function createOrchestrationStep(
  stepId: string,
  stepName: string,
  stepType: OrchestrationStep['stepType'],
  dependencies: string[] = []
): OrchestrationStep {
  return {
    stepId,
    stepName,
    stepType,
    status: 'pending',
    progress: 0,
    dependencies,
    metadata: {
      startedAt: new Date().toISOString(),
      retryCount: 0
    }
  }
}

/**
 * Update orchestration step status and progress
 */
export function updateOrchestrationStep(
  step: OrchestrationStep,
  status: OrchestrationStep['status'],
  progress: number,
  result?: any,
  metadata?: Record<string, any>
): OrchestrationStep {
  const updatedStep = {
    ...step,
    status,
    progress,
    result,
    metadata: {
      ...step.metadata,
      ...metadata,
    }
  }

  if (status === 'completed' || status === 'failed') {
    updatedStep.metadata!.completedAt = new Date().toISOString()
    
    if (step.metadata?.startedAt) {
      const duration = Date.now() - new Date(step.metadata.startedAt).getTime()
      updatedStep.metadata!.duration = duration
    }
  }

  return updatedStep
}

/**
 * Check if step dependencies are satisfied
 */
export function areDependenciesSatisfied(
  step: OrchestrationStep,
  allSteps: OrchestrationStep[]
): boolean {
  if (!step.dependencies || step.dependencies.length === 0) {
    return true
  }

  return step.dependencies.every(depId => {
    const depStep = allSteps.find(s => s.stepId === depId)
    return depStep?.status === 'completed'
  })
}

/**
 * Get next executable steps based on dependencies
 */
export function getNextExecutableSteps(steps: OrchestrationStep[]): OrchestrationStep[] {
  return steps.filter(step => 
    step.status === 'pending' && areDependenciesSatisfied(step, steps)
  )
}

/**
 * Calculate overall orchestration progress
 */
export function calculateOrchestrationProgress(steps: OrchestrationStep[]): number {
  if (steps.length === 0) return 0

  const totalProgress = steps.reduce((sum, step) => sum + step.progress, 0)
  return Math.round(totalProgress / steps.length)
}

/**
 * Check if orchestration is complete
 */
export function isOrchestrationComplete(steps: OrchestrationStep[]): boolean {
  return steps.length > 0 && steps.every(step => 
    step.status === 'completed' || step.status === 'failed' || step.status === 'skipped'
  )
}

/**
 * Get orchestration status based on steps
 */
export function getOrchestrationStatus(steps: OrchestrationStep[]): 'pending' | 'running' | 'completed' | 'failed' {
  if (steps.length === 0) return 'pending'
  
  const hasRunning = steps.some(step => step.status === 'running')
  if (hasRunning) return 'running'
  
  const hasFailed = steps.some(step => step.status === 'failed')
  if (hasFailed) return 'failed'
  
  const allComplete = steps.every(step => 
    step.status === 'completed' || step.status === 'skipped'
  )
  if (allComplete) return 'completed'
  
  return 'pending'
}

/**
 * Create CSI from orchestration steps
 */
export function createCSIFromSteps(steps: OrchestrationStep[]): CSI {
  const completedSteps = steps
    .filter(step => step.status === 'completed')
    .map(step => step.stepName)
  
  const currentStep = steps.find(step => step.status === 'running')
  const progress = calculateOrchestrationProgress(steps)

  return {
    completedSteps,
    currentProgress: progress,
    totalSteps: steps.length,
    currentStep: currentStep?.stepName || 'pending',
    metadata: {
      timestamp: new Date().toISOString(),
      stepsStatus: steps.map(step => ({
        stepName: step.stepName,
        status: step.status,
        progress: step.progress
      }))
    }
  }
}

/**
 * Validate orchestration request
 */
export function validateOrchestrationRequest(data: unknown): OrchestrationRequest {
  return OrchestrationRequestSchema.parse(data)
}

/**
 * Generate unique orchestration ID
 */
export function generateOrchestrationId(userId: string, threadId: string): string {
  const timestamp = Date.now()
  return `orch_${userId.slice(0, 8)}_${threadId.slice(0, 8)}_${timestamp}`
}

/**
 * Create standard orchestration steps for content generation
 */
export function createContentGenerationSteps(): OrchestrationStep[] {
  return [
    createOrchestrationStep('intent_analysis', 'Intent Analysis', 'analysis'),
    createOrchestrationStep('brand_analysis', 'Brand Analysis', 'analysis', ['intent_analysis']),
    createOrchestrationStep('complexity_assessment', 'Complexity Assessment', 'analysis', ['intent_analysis', 'brand_analysis']),
    createOrchestrationStep('execution_planning', 'Execution Planning', 'coordination', ['complexity_assessment']),
    createOrchestrationStep('content_generation', 'Content Generation', 'execution', ['execution_planning']),
    createOrchestrationStep('finalization', 'Finalization', 'completion', ['content_generation'])
  ]
}

/**
 * Create error for orchestration step
 */
export function createOrchestrationError(
  message: string,
  code: string,
  retry: boolean = false,
  details?: any
): OrchestrationStep['error'] {
  return {
    message,
    code,
    retry,
    ...(details && { details })
  }
} 