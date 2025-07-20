import { z } from 'zod';
import { KVLockManager, AcquireLockOptions } from './kv.js';
import { AgentTaskConfig, AgentTaskExecutor, BaseAgentTaskRequest, AgentTaskResult } from './tasks.js';
import '@growthub/compiler-core';

/**
 * @growthub/agent-tools/coordination
 * Agent Coordination Utilities Combining KV Locks and Task Management
 *
 * High-level coordination patterns that combine KV locking with agent task execution
 * for distributed agent orchestration with race condition prevention.
 */

declare const CoordinationRequestSchema: z.ZodObject<{
    threadId: z.ZodString;
    userId: z.ZodString;
    agentType: z.ZodEnum<["CONTENT_GENERATION_AGENT", "TEXT_ANALYSIS_AGENT"]>;
    operation: z.ZodString;
    lockOptions: z.ZodOptional<z.ZodObject<{
        ttlSeconds: z.ZodOptional<z.ZodNumber>;
        keyPrefix: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        ttlSeconds?: number | undefined;
        keyPrefix?: string | undefined;
    }, {
        ttlSeconds?: number | undefined;
        keyPrefix?: string | undefined;
    }>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    threadId: string;
    userId: string;
    agentType: "CONTENT_GENERATION_AGENT" | "TEXT_ANALYSIS_AGENT";
    operation: string;
    metadata?: Record<string, any> | undefined;
    lockOptions?: {
        ttlSeconds?: number | undefined;
        keyPrefix?: string | undefined;
    } | undefined;
}, {
    threadId: string;
    userId: string;
    agentType: "CONTENT_GENERATION_AGENT" | "TEXT_ANALYSIS_AGENT";
    operation: string;
    metadata?: Record<string, any> | undefined;
    lockOptions?: {
        ttlSeconds?: number | undefined;
        keyPrefix?: string | undefined;
    } | undefined;
}>;
type CoordinationRequest = z.infer<typeof CoordinationRequestSchema>;
interface CoordinationResult<T = any> {
    success: boolean;
    result?: T;
    error?: {
        message: string;
        code: string;
        type: 'LOCK_ACQUISITION_FAILED' | 'TASK_EXECUTION_FAILED' | 'VALIDATION_FAILED';
        details?: any;
    };
    lockMetadata?: {
        lockKey: string;
        lockAcquired: boolean;
        lockReleased: boolean;
        lockDuration?: number;
    };
    executionMetadata?: {
        startTime: string;
        endTime?: string;
        duration?: number;
        retryCount?: number;
    };
}
interface OrchestrationStepConfig {
    stepId: string;
    taskConfig: AgentTaskConfig;
    lockKeyPrefix?: string;
    dependencies?: string[];
    retryConfig?: {
        maxRetries: number;
        backoffMs: number;
    };
}
/**
 * Agent Coordination Manager
 * Combines KV locking with agent task execution for distributed coordination
 */
declare class AgentCoordinationManager {
    private kvManager;
    private taskExecutor;
    constructor(kvManager: KVLockManager, taskExecutor: AgentTaskExecutor);
    /**
     * Execute a single agent task with automatic lock coordination
     */
    executeTaskWithLock<T extends BaseAgentTaskRequest>(request: T, taskInput: Record<string, any>, taskConfig: AgentTaskConfig, lockOptions?: AcquireLockOptions): Promise<CoordinationResult<AgentTaskResult>>;
    /**
     * Execute multiple tasks in sequence with proper coordination
     */
    executeTaskSequence<T extends BaseAgentTaskRequest>(request: T, steps: Array<{
        taskInput: Record<string, any>;
        taskConfig: AgentTaskConfig;
        lockOptions?: AcquireLockOptions;
    }>): Promise<CoordinationResult<Array<AgentTaskResult>>>;
    /**
     * Check if a coordination operation is already in progress
     */
    isOperationInProgress(userId: string, threadId: string, operationPrefix?: string): Promise<boolean>;
    /**
     * Cancel an ongoing operation by releasing its lock
     */
    cancelOperation(userId: string, threadId: string): Promise<boolean>;
}
/**
 * Orchestration Manager
 * High-level orchestration patterns with dependency management
 */
declare class OrchestrationManager extends AgentCoordinationManager {
    /**
     * Execute orchestration steps with dependency resolution
     */
    executeOrchestration<T extends BaseAgentTaskRequest>(request: T, steps: OrchestrationStepConfig[], orchestrationData: Record<string, any>): Promise<CoordinationResult<Record<string, AgentTaskResult>>>;
}
/**
 * Validate coordination request
 */
declare function validateCoordinationRequest(data: unknown): {
    success: boolean;
    data?: CoordinationRequest;
    errors?: any[];
};
/**
 * Create coordination result
 */
declare function createCoordinationResult<T>(success: boolean, result?: T, error?: CoordinationResult['error']): CoordinationResult<T>;
/**
 * Coordination utilities
 */
declare const CoordinationUtils: {
    /**
     * Generate unique operation ID
     */
    generateOperationId: (userId: string, threadId: string, operation: string) => string;
    /**
     * Create lock key for specific operation
     */
    createOperationLockKey: (operation: string, userId: string, threadId: string) => string;
    /**
     * Check if error is retryable
     */
    isRetryableError: (error: CoordinationResult["error"]) => boolean;
};

export { AgentCoordinationManager, type CoordinationRequest, CoordinationRequestSchema, type CoordinationResult, CoordinationUtils, OrchestrationManager, type OrchestrationStepConfig, createCoordinationResult, validateCoordinationRequest };
