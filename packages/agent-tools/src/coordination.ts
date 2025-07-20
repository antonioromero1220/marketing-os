/**
 * @growthub/agent-tools/coordination
 * Agent Coordination Utilities Combining KV Locks and Task Management
 * 
 * High-level coordination patterns that combine KV locking with agent task execution
 * for distributed agent orchestration with race condition prevention.
 */

import { z } from 'zod'
import type { CSI } from '@growthub/compiler-core'
import type { KVLockManager, KVLockMetadata, AcquireLockOptions } from './kv'
import type { AgentTaskExecutor, AgentTaskConfig, BaseAgentTaskRequest, AgentTaskResult } from './tasks'

// Coordination Request Schema
export const CoordinationRequestSchema = z.object({
  threadId: z.string().uuid(),
  userId: z.string().uuid(),
  agentType: z.enum(['CONTENT_GENERATION_AGENT', 'TEXT_ANALYSIS_AGENT']),
  operation: z.string().min(1),
  lockOptions: z.object({
    ttlSeconds: z.number().int().positive().optional(),
    keyPrefix: z.string().optional()
  }).optional(),
  metadata: z.record(z.any()).optional()
})

export type CoordinationRequest = z.infer<typeof CoordinationRequestSchema>

// Coordination Result
export interface CoordinationResult<T = any> {
  success: boolean
  result?: T
  error?: {
    message: string
    code: string
    type: 'LOCK_ACQUISITION_FAILED' | 'TASK_EXECUTION_FAILED' | 'VALIDATION_FAILED'
    details?: any
  }
  lockMetadata?: {
    lockKey: string
    lockAcquired: boolean
    lockReleased: boolean
    lockDuration?: number
  }
  executionMetadata?: {
    startTime: string
    endTime?: string
    duration?: number
    retryCount?: number
  }
}

// Orchestration Step Configuration
export interface OrchestrationStepConfig {
  stepId: string
  taskConfig: AgentTaskConfig
  lockKeyPrefix?: string
  dependencies?: string[]
  retryConfig?: {
    maxRetries: number
    backoffMs: number
  }
}

/**
 * Agent Coordination Manager
 * Combines KV locking with agent task execution for distributed coordination
 */
export class AgentCoordinationManager {
  private kvManager: KVLockManager
  private taskExecutor: AgentTaskExecutor

  constructor(kvManager: KVLockManager, taskExecutor: AgentTaskExecutor) {
    this.kvManager = kvManager
    this.taskExecutor = taskExecutor
  }

  /**
   * Execute a single agent task with automatic lock coordination
   */
  async executeTaskWithLock<T extends BaseAgentTaskRequest>(
    request: T,
    taskInput: Record<string, any>,
    taskConfig: AgentTaskConfig,
    lockOptions?: AcquireLockOptions
  ): Promise<CoordinationResult<AgentTaskResult>> {
    const startTime = new Date().toISOString()
    const lockKey = this.kvManager.makeKvLockKey(request.userId, request.threadId)
    let lockAcquired = false
    let lockReleased = false

    try {
      // Step 1: Acquire KV lock
      const lockResult = await this.kvManager.acquireKvLock(
        request.userId, 
        request.threadId, 
        lockOptions
      )

      if (!lockResult.success) {
        return {
          success: false,
          error: {
            message: `Failed to acquire lock for ${taskConfig.taskName}`,
            code: 'LOCK_ACQUISITION_FAILED',
            type: 'LOCK_ACQUISITION_FAILED',
            details: lockResult.activeLockMetadata
          },
          lockMetadata: {
            lockKey,
            lockAcquired: false,
            lockReleased: false
          }
        }
      }

      lockAcquired = true

      // Step 2: Execute agent task
      const taskResult = await this.taskExecutor.executeAgentTask(
        request,
        taskInput,
        taskConfig
      )

      // Step 3: Release lock
      lockReleased = await this.kvManager.releaseKvLock(request.userId, request.threadId)

      const endTime = new Date().toISOString()

      return {
        success: taskResult.success,
        result: taskResult,
        error: taskResult.success ? undefined : {
          message: taskResult.error?.message || 'Task execution failed',
          code: taskResult.error?.code || 'TASK_EXECUTION_FAILED',
          type: 'TASK_EXECUTION_FAILED',
          details: taskResult.error?.details
        },
        lockMetadata: {
          lockKey,
          lockAcquired,
          lockReleased,
          lockDuration: new Date(endTime).getTime() - new Date(startTime).getTime()
        },
        executionMetadata: {
          startTime,
          endTime,
          duration: new Date(endTime).getTime() - new Date(startTime).getTime()
        }
      }

    } catch (error) {
      // Ensure lock is released on error
      if (lockAcquired && !lockReleased) {
        try {
          await this.kvManager.releaseKvLock(request.userId, request.threadId)
          lockReleased = true
        } catch (releaseError) {
          console.error('Failed to release lock after error:', releaseError)
        }
      }

      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Unknown coordination error',
          code: 'COORDINATION_ERROR',
          type: 'TASK_EXECUTION_FAILED',
          details: error
        },
        lockMetadata: {
          lockKey,
          lockAcquired,
          lockReleased
        }
      }
    }
  }

  /**
   * Execute multiple tasks in sequence with proper coordination
   */
  async executeTaskSequence<T extends BaseAgentTaskRequest>(
    request: T,
    steps: Array<{
      taskInput: Record<string, any>
      taskConfig: AgentTaskConfig
      lockOptions?: AcquireLockOptions
    }>
  ): Promise<CoordinationResult<Array<AgentTaskResult>>> {
    const results: AgentTaskResult[] = []
    const errors: any[] = []
    let currentCSI: CSI = request.previousCSI || {
      completedSteps: [],
      currentProgress: 0,
      totalSteps: steps.length,
      currentStep: 'pending'
    }

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i]
      const stepRequest = {
        ...request,
        taskSequence: i + 1,
        previousCSI: currentCSI
      }

      const result = await this.executeTaskWithLock(
        stepRequest,
        step.taskInput,
        step.taskConfig,
        step.lockOptions
      )

      if (result.success && result.result) {
        results.push(result.result)
        currentCSI = result.result.updatedCSI
      } else {
        errors.push(result.error)
        break // Stop on first error
      }
    }

    return {
      success: errors.length === 0,
      result: results,
      error: errors.length > 0 ? errors[0] : undefined
    }
  }

  /**
   * Check if a coordination operation is already in progress
   */
  async isOperationInProgress(
    userId: string,
    threadId: string,
    operationPrefix?: string
  ): Promise<boolean> {
    const lockKey = operationPrefix 
      ? `${operationPrefix}:${userId}:${threadId}`
      : this.kvManager.makeKvLockKey(userId, threadId)
    
    try {
      const lockMetadata = await this.kvManager.checkKvLock(userId, threadId)
      return lockMetadata !== null
    } catch (error) {
      console.error('Error checking operation progress:', error)
      return false
    }
  }

  /**
   * Cancel an ongoing operation by releasing its lock
   */
  async cancelOperation(userId: string, threadId: string): Promise<boolean> {
    try {
      return await this.kvManager.releaseKvLock(userId, threadId)
    } catch (error) {
      console.error('Error cancelling operation:', error)
      return false
    }
  }
}

/**
 * Orchestration Manager
 * High-level orchestration patterns with dependency management
 */
export class OrchestrationManager extends AgentCoordinationManager {
  
  /**
   * Execute orchestration steps with dependency resolution
   */
  async executeOrchestration<T extends BaseAgentTaskRequest>(
    request: T,
    steps: OrchestrationStepConfig[],
    orchestrationData: Record<string, any>
  ): Promise<CoordinationResult<Record<string, AgentTaskResult>>> {
    const results: Record<string, AgentTaskResult> = {}
    const completedSteps = new Set<string>()
    const pendingSteps = new Set(steps.map(s => s.stepId))

    while (pendingSteps.size > 0) {
      // Find steps with satisfied dependencies
      const executableSteps = steps.filter(step => 
        pendingSteps.has(step.stepId) &&
        (!step.dependencies || step.dependencies.every(dep => completedSteps.has(dep)))
      )

      if (executableSteps.length === 0) {
        // No executable steps - possible circular dependency
        return {
          success: false,
          error: {
            message: 'No executable steps found - possible circular dependency',
            code: 'ORCHESTRATION_DEADLOCK',
            type: 'TASK_EXECUTION_FAILED',
            details: { pendingSteps: Array.from(pendingSteps), completedSteps: Array.from(completedSteps) }
          }
        }
      }

      // Execute all executable steps
      for (const step of executableSteps) {
        const stepData = {
          ...orchestrationData,
          // Include results from dependency steps
          ...(step.dependencies?.reduce((acc, depId) => {
            acc[depId] = results[depId]
            return acc
          }, {} as Record<string, AgentTaskResult>) || {})
        }

        const result = await this.executeTaskWithLock(
          request,
          stepData,
          step.taskConfig,
          { 
            ttlSeconds: 900, // 15 minutes for orchestration steps
            metadata: {
              lockedAt: new Date().toISOString(),
              lockId: `orchestration-${step.stepId}-${Date.now()}`,
              processId: process.pid?.toString()
            }
          }
        )

        if (result.success && result.result) {
          results[step.stepId] = result.result
          completedSteps.add(step.stepId)
          pendingSteps.delete(step.stepId)
        } else {
          return {
            success: false,
            result: results,
            error: {
              message: `Orchestration step '${step.stepId}' failed`,
              code: 'ORCHESTRATION_STEP_FAILED',
              type: 'TASK_EXECUTION_FAILED',
              details: result.error
            }
          }
        }
      }
    }

    return {
      success: true,
      result: results
    }
  }
}

/**
 * Validate coordination request
 */
export function validateCoordinationRequest(data: unknown): { success: boolean; data?: CoordinationRequest; errors?: any[] } {
  try {
    const validatedData = CoordinationRequestSchema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.errors }
    }
    return { success: false, errors: [{ message: 'Unknown validation error' }] }
  }
}

/**
 * Create coordination result
 */
export function createCoordinationResult<T>(
  success: boolean,
  result?: T,
  error?: CoordinationResult['error']
): CoordinationResult<T> {
  return {
    success,
    result,
    error,
    executionMetadata: {
      startTime: new Date().toISOString(),
      duration: 0
    }
  }
}

/**
 * Coordination utilities
 */
export const CoordinationUtils = {
  /**
   * Generate unique operation ID
   */
  generateOperationId: (userId: string, threadId: string, operation: string): string => {
    return `${operation}:${userId.slice(0, 8)}:${threadId.slice(0, 8)}:${Date.now()}`
  },

  /**
   * Create lock key for specific operation
   */
  createOperationLockKey: (operation: string, userId: string, threadId: string): string => {
    return `${operation}:${userId}:${threadId}`
  },

  /**
   * Check if error is retryable
   */
  isRetryableError: (error: CoordinationResult['error']): boolean => {
    return error?.type === 'LOCK_ACQUISITION_FAILED' || 
           error?.code === 'NETWORK_ERROR' ||
           error?.code === 'TIMEOUT_ERROR'
  }
} 