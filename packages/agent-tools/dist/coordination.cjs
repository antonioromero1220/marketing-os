/* @growthub/agent-tools - Agent coordination utilities and KV lock management */
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/coordination.ts
var coordination_exports = {};
__export(coordination_exports, {
  AgentCoordinationManager: () => AgentCoordinationManager,
  CoordinationRequestSchema: () => CoordinationRequestSchema,
  CoordinationUtils: () => CoordinationUtils,
  OrchestrationManager: () => OrchestrationManager,
  createCoordinationResult: () => createCoordinationResult,
  validateCoordinationRequest: () => validateCoordinationRequest
});
module.exports = __toCommonJS(coordination_exports);
var import_zod = require("zod");
var CoordinationRequestSchema = import_zod.z.object({
  threadId: import_zod.z.string().uuid(),
  userId: import_zod.z.string().uuid(),
  agentType: import_zod.z.enum(["CONTENT_GENERATION_AGENT", "TEXT_ANALYSIS_AGENT"]),
  operation: import_zod.z.string().min(1),
  lockOptions: import_zod.z.object({
    ttlSeconds: import_zod.z.number().int().positive().optional(),
    keyPrefix: import_zod.z.string().optional()
  }).optional(),
  metadata: import_zod.z.record(import_zod.z.any()).optional()
});
var AgentCoordinationManager = class {
  constructor(kvManager, taskExecutor) {
    this.kvManager = kvManager;
    this.taskExecutor = taskExecutor;
  }
  /**
   * Execute a single agent task with automatic lock coordination
   */
  async executeTaskWithLock(request, taskInput, taskConfig, lockOptions) {
    const startTime = (/* @__PURE__ */ new Date()).toISOString();
    const lockKey = this.kvManager.makeKvLockKey(request.userId, request.threadId);
    let lockAcquired = false;
    let lockReleased = false;
    try {
      const lockResult = await this.kvManager.acquireKvLock(
        request.userId,
        request.threadId,
        lockOptions
      );
      if (!lockResult.success) {
        return {
          success: false,
          error: {
            message: `Failed to acquire lock for ${taskConfig.taskName}`,
            code: "LOCK_ACQUISITION_FAILED",
            type: "LOCK_ACQUISITION_FAILED",
            details: lockResult.activeLockMetadata
          },
          lockMetadata: {
            lockKey,
            lockAcquired: false,
            lockReleased: false
          }
        };
      }
      lockAcquired = true;
      const taskResult = await this.taskExecutor.executeAgentTask(
        request,
        taskInput,
        taskConfig
      );
      lockReleased = await this.kvManager.releaseKvLock(request.userId, request.threadId);
      const endTime = (/* @__PURE__ */ new Date()).toISOString();
      return {
        success: taskResult.success,
        result: taskResult,
        error: taskResult.success ? void 0 : {
          message: taskResult.error?.message || "Task execution failed",
          code: taskResult.error?.code || "TASK_EXECUTION_FAILED",
          type: "TASK_EXECUTION_FAILED",
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
      };
    } catch (error) {
      if (lockAcquired && !lockReleased) {
        try {
          await this.kvManager.releaseKvLock(request.userId, request.threadId);
          lockReleased = true;
        } catch (releaseError) {
          console.error("Failed to release lock after error:", releaseError);
        }
      }
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : "Unknown coordination error",
          code: "COORDINATION_ERROR",
          type: "TASK_EXECUTION_FAILED",
          details: error
        },
        lockMetadata: {
          lockKey,
          lockAcquired,
          lockReleased
        }
      };
    }
  }
  /**
   * Execute multiple tasks in sequence with proper coordination
   */
  async executeTaskSequence(request, steps) {
    const results = [];
    const errors = [];
    let currentCSI = request.previousCSI || {
      completedSteps: [],
      currentProgress: 0,
      totalSteps: steps.length,
      currentStep: "pending"
    };
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const stepRequest = {
        ...request,
        taskSequence: i + 1,
        previousCSI: currentCSI
      };
      const result = await this.executeTaskWithLock(
        stepRequest,
        step.taskInput,
        step.taskConfig,
        step.lockOptions
      );
      if (result.success && result.result) {
        results.push(result.result);
        currentCSI = result.result.updatedCSI;
      } else {
        errors.push(result.error);
        break;
      }
    }
    return {
      success: errors.length === 0,
      result: results,
      error: errors.length > 0 ? errors[0] : void 0
    };
  }
  /**
   * Check if a coordination operation is already in progress
   */
  async isOperationInProgress(userId, threadId, operationPrefix) {
    const lockKey = operationPrefix ? `${operationPrefix}:${userId}:${threadId}` : this.kvManager.makeKvLockKey(userId, threadId);
    try {
      const lockMetadata = await this.kvManager.checkKvLock(userId, threadId);
      return lockMetadata !== null;
    } catch (error) {
      console.error("Error checking operation progress:", error);
      return false;
    }
  }
  /**
   * Cancel an ongoing operation by releasing its lock
   */
  async cancelOperation(userId, threadId) {
    try {
      return await this.kvManager.releaseKvLock(userId, threadId);
    } catch (error) {
      console.error("Error cancelling operation:", error);
      return false;
    }
  }
};
var OrchestrationManager = class extends AgentCoordinationManager {
  /**
   * Execute orchestration steps with dependency resolution
   */
  async executeOrchestration(request, steps, orchestrationData) {
    const results = {};
    const completedSteps = /* @__PURE__ */ new Set();
    const pendingSteps = new Set(steps.map((s) => s.stepId));
    while (pendingSteps.size > 0) {
      const executableSteps = steps.filter(
        (step) => pendingSteps.has(step.stepId) && (!step.dependencies || step.dependencies.every((dep) => completedSteps.has(dep)))
      );
      if (executableSteps.length === 0) {
        return {
          success: false,
          error: {
            message: "No executable steps found - possible circular dependency",
            code: "ORCHESTRATION_DEADLOCK",
            type: "TASK_EXECUTION_FAILED",
            details: { pendingSteps: Array.from(pendingSteps), completedSteps: Array.from(completedSteps) }
          }
        };
      }
      for (const step of executableSteps) {
        const stepData = {
          ...orchestrationData,
          // Include results from dependency steps
          ...step.dependencies?.reduce((acc, depId) => {
            acc[depId] = results[depId];
            return acc;
          }, {}) || {}
        };
        const result = await this.executeTaskWithLock(
          request,
          stepData,
          step.taskConfig,
          {
            ttlSeconds: 900,
            // 15 minutes for orchestration steps
            metadata: {
              lockedAt: (/* @__PURE__ */ new Date()).toISOString(),
              lockId: `orchestration-${step.stepId}-${Date.now()}`,
              processId: process.pid?.toString()
            }
          }
        );
        if (result.success && result.result) {
          results[step.stepId] = result.result;
          completedSteps.add(step.stepId);
          pendingSteps.delete(step.stepId);
        } else {
          return {
            success: false,
            result: results,
            error: {
              message: `Orchestration step '${step.stepId}' failed`,
              code: "ORCHESTRATION_STEP_FAILED",
              type: "TASK_EXECUTION_FAILED",
              details: result.error
            }
          };
        }
      }
    }
    return {
      success: true,
      result: results
    };
  }
};
function validateCoordinationRequest(data) {
  try {
    const validatedData = CoordinationRequestSchema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof import_zod.z.ZodError) {
      return { success: false, errors: error.errors };
    }
    return { success: false, errors: [{ message: "Unknown validation error" }] };
  }
}
function createCoordinationResult(success, result, error) {
  return {
    success,
    result,
    error,
    executionMetadata: {
      startTime: (/* @__PURE__ */ new Date()).toISOString(),
      duration: 0
    }
  };
}
var CoordinationUtils = {
  /**
   * Generate unique operation ID
   */
  generateOperationId: (userId, threadId, operation) => {
    return `${operation}:${userId.slice(0, 8)}:${threadId.slice(0, 8)}:${Date.now()}`;
  },
  /**
   * Create lock key for specific operation
   */
  createOperationLockKey: (operation, userId, threadId) => {
    return `${operation}:${userId}:${threadId}`;
  },
  /**
   * Check if error is retryable
   */
  isRetryableError: (error) => {
    return error?.type === "LOCK_ACQUISITION_FAILED" || error?.code === "NETWORK_ERROR" || error?.code === "TIMEOUT_ERROR";
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AgentCoordinationManager,
  CoordinationRequestSchema,
  CoordinationUtils,
  OrchestrationManager,
  createCoordinationResult,
  validateCoordinationRequest
});
//# sourceMappingURL=coordination.cjs.map