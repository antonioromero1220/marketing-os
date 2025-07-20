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

// src/index.ts
var src_exports = {};
__export(src_exports, {
  AgentCoordinationManager: () => AgentCoordinationManager,
  AgentTaskBuilder: () => AgentTaskBuilder,
  AgentTaskConfigs: () => AgentTaskConfigs,
  AgentTaskExecutor: () => AgentTaskExecutor,
  BaseAgentTaskRequestSchema: () => BaseAgentTaskRequestSchema,
  CoordinationRequestSchema: () => CoordinationRequestSchema,
  CoordinationUtils: () => CoordinationUtils,
  DEFAULT_LOCK_TTL_SECONDS: () => DEFAULT_LOCK_TTL_SECONDS,
  InMemoryKVStore: () => InMemoryKVStore,
  KVLockManager: () => KVLockManager,
  KVLockMetadataSchema: () => KVLockMetadataSchema,
  OrchestrationManager: () => OrchestrationManager,
  PACKAGE_INFO: () => PACKAGE_INFO,
  acquireKvLock: () => acquireKvLock,
  checkKvLock: () => checkKvLock,
  createCoordinationResult: () => createCoordinationResult,
  createTaskHelpers: () => createTaskHelpers,
  defaultKVLockManager: () => defaultKVLockManager,
  handleAgentTaskError: () => handleAgentTaskError,
  makeKvLockKey: () => makeKvLockKey,
  releaseKvLock: () => releaseKvLock,
  validateAgentTaskRequest: () => validateAgentTaskRequest,
  validateCoordinationRequest: () => validateCoordinationRequest,
  validateKVLockMetadata: () => validateKVLockMetadata,
  withKvLock: () => withKvLock
});
module.exports = __toCommonJS(src_exports);

// src/kv.ts
var import_zod = require("zod");
var import_compiler_core = require("@growthub/compiler-core");
var KVLockMetadataSchema = import_zod.z.object({
  lockedAt: import_zod.z.string().datetime(),
  lockId: import_zod.z.string().optional(),
  processId: import_zod.z.string().optional(),
  metadata: import_zod.z.record(import_zod.z.any()).optional(),
  expiresAt: import_zod.z.string().datetime().optional()
});
var InMemoryKVStore = class {
  constructor() {
    this.store = /* @__PURE__ */ new Map();
  }
  async get(key) {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  }
  async set(key, value, options) {
    const existing = this.store.get(key);
    if (options?.condition === "nx" && existing && (!existing.expiresAt || Date.now() < existing.expiresAt)) {
      return false;
    }
    if (options?.condition === "xx" && (!existing || existing.expiresAt && Date.now() > existing.expiresAt)) {
      return false;
    }
    const entry = { value };
    if (options?.ttl) {
      entry.expiresAt = Date.now() + options.ttl * 1e3;
    }
    this.store.set(key, entry);
    return true;
  }
  async delete(key) {
    return this.store.delete(key);
  }
};
var DEFAULT_LOCK_TTL_SECONDS = 15 * 60;
var KVLockManager = class {
  constructor(kvStore, options = {}) {
    this.kv = kvStore || new InMemoryKVStore();
    this.defaultTTL = options.defaultTTL || DEFAULT_LOCK_TTL_SECONDS;
    this.keyPrefix = options.keyPrefix || "run";
  }
  /**
   * Generate KV lock key following the singleton pattern
   */
  makeKvLockKey(userId, threadId) {
    return `${this.keyPrefix}:${userId}:${threadId}`;
  }
  /**
   * Try to acquire a KV lock for a user/thread
   */
  async acquireKvLock(userId, threadId, options) {
    const kvKey = this.makeKvLockKey(userId, threadId);
    const ttl = options?.ttlSeconds ?? this.defaultTTL;
    try {
      const validationResult = (0, import_compiler_core.validateKVLock)({
        userId,
        threadId,
        lockKey: kvKey,
        ttl: ttl * 1e3,
        // Convert to ms for validation
        metadata: {
          runId: `${userId}-${threadId}`,
          lockAcquired: Date.now(),
          processId: process.pid?.toString(),
          expiresAt: new Date(Date.now() + ttl * 1e3).toISOString()
        }
      });
      if (!validationResult.success) {
        throw new Error(`KV lock validation failed: ${JSON.stringify(validationResult.errors)}`);
      }
      const lockMetadata = options?.metadata ?? {
        lockedAt: (/* @__PURE__ */ new Date()).toISOString(),
        lockId: `${userId}-${threadId}-${Date.now()}`,
        processId: process.pid?.toString(),
        expiresAt: new Date(Date.now() + ttl * 1e3).toISOString()
      };
      const lockSet = await this.kv.set(kvKey, lockMetadata, {
        ttl,
        condition: "nx"
        // Only set if not exists
      });
      if (!lockSet) {
        const activeMetadataRaw = await this.kv.get(kvKey);
        const activeLockMetadata = activeMetadataRaw || { lockedAt: "unknown" };
        return {
          success: false,
          activeLockMetadata,
          lockKey: kvKey
        };
      }
      return {
        success: true,
        lockKey: kvKey
      };
    } catch (error) {
      console.error(`Error acquiring KV lock for key ${kvKey}`, error);
      throw error;
    }
  }
  /**
   * Release the KV lock for a user/thread
   */
  async releaseKvLock(userId, threadId) {
    const kvKey = this.makeKvLockKey(userId, threadId);
    try {
      return await this.kv.delete(kvKey);
    } catch (error) {
      console.error(`Error releasing KV lock for key ${kvKey}`, error);
      throw error;
    }
  }
  /**
   * Check the lock status by returning stored metadata or null if unlocked
   */
  async checkKvLock(userId, threadId) {
    const kvKey = this.makeKvLockKey(userId, threadId);
    try {
      const data = await this.kv.get(kvKey);
      if (!data) return null;
      if (typeof data === "string") {
        try {
          return JSON.parse(data);
        } catch {
          return { lockedAt: "invalid data" };
        }
      }
      return data;
    } catch (error) {
      console.error(`Error checking KV lock for key ${kvKey}`, error);
      throw error;
    }
  }
  /**
   * Utility function to run code with automatic lock acquisition and release
   */
  async withKvLock(userId, threadId, operation, options) {
    const lockResult = await this.acquireKvLock(userId, threadId, options);
    if (!lockResult.success) {
      throw new Error(`Failed to acquire lock for user ${userId}, thread ${threadId}. Active lock: ${JSON.stringify(lockResult.activeLockMetadata)}`);
    }
    try {
      return await operation();
    } finally {
      await this.releaseKvLock(userId, threadId);
    }
  }
};
var defaultKVLockManager = new KVLockManager();
var makeKvLockKey = (userId, threadId) => defaultKVLockManager.makeKvLockKey(userId, threadId);
var acquireKvLock = (userId, threadId, options) => defaultKVLockManager.acquireKvLock(userId, threadId, options);
var releaseKvLock = (userId, threadId) => defaultKVLockManager.releaseKvLock(userId, threadId);
var checkKvLock = (userId, threadId) => defaultKVLockManager.checkKvLock(userId, threadId);
var withKvLock = (userId, threadId, operation, options) => defaultKVLockManager.withKvLock(userId, threadId, operation, options);
function validateKVLockMetadata(data) {
  try {
    const validatedData = KVLockMetadataSchema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof import_zod.z.ZodError) {
      return {
        success: false,
        errors: error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
          code: err.code,
          severity: "error"
        }))
      };
    }
    return {
      success: false,
      errors: [{
        field: "metadata",
        message: "Unknown validation error",
        code: "UNKNOWN_ERROR",
        severity: "error"
      }]
    };
  }
}

// src/tasks.ts
var import_zod2 = require("zod");
var BaseAgentTaskRequestSchema = import_zod2.z.object({
  threadId: import_zod2.z.string().uuid(),
  userId: import_zod2.z.string().min(1),
  agentType: import_zod2.z.enum(["CONTENT_GENERATION_AGENT", "TEXT_ANALYSIS_AGENT"]),
  taskSequence: import_zod2.z.number().int().min(1),
  previousCSI: import_zod2.z.object({
    completedSteps: import_zod2.z.array(import_zod2.z.string()).default([]),
    currentProgress: import_zod2.z.number().default(0),
    totalSteps: import_zod2.z.number().default(4),
    currentStep: import_zod2.z.string().default("pending")
  }).optional()
});
var AgentTaskExecutor = class {
  constructor(openaiClient, options = {}) {
    this.openaiClient = openaiClient;
    this.defaultModel = options.defaultModel || "gpt-4o-mini";
    this.defaultTemperature = options.defaultTemperature || 0.3;
  }
  /**
   * Execute an agent task with OpenAI function calling
   */
  async executeAgentTask(request, taskInput, config) {
    try {
      const validatedRequest = BaseAgentTaskRequestSchema.parse(request);
      const modelConfig = config.modelConfig || {};
      const response = await this.openaiClient.chat.completions.create({
        model: modelConfig.model || this.defaultModel,
        messages: [
          {
            role: "system",
            content: config.systemPrompt
          },
          {
            role: "user",
            content: config.userPromptTemplate(taskInput)
          }
        ],
        tools: [{ type: "function", function: config.functionDefinition }],
        tool_choice: { type: "function", function: { name: config.functionDefinition.name } },
        temperature: modelConfig.temperature ?? this.defaultTemperature,
        ...modelConfig.maxTokens && { max_tokens: modelConfig.maxTokens },
        ...modelConfig.topP && { top_p: modelConfig.topP }
      });
      const toolCall = response.choices[0].message.tool_calls?.[0];
      if (!toolCall) {
        throw new Error("No function call returned from OpenAI");
      }
      const result = JSON.parse(toolCall.function.arguments || "{}");
      const previousCSI = validatedRequest.previousCSI || {
        completedSteps: [],
        currentProgress: 0,
        totalSteps: 4,
        currentStep: "pending"
      };
      const updatedCSI = {
        completedSteps: [...previousCSI.completedSteps, config.taskName],
        currentProgress: config.progressPercent,
        totalSteps: previousCSI.totalSteps,
        currentStep: config.taskName,
        metadata: {
          lastUpdated: (/* @__PURE__ */ new Date()).toISOString(),
          taskName: config.taskName,
          taskType: config.taskType
        }
      };
      return {
        success: true,
        stepResult: { step: config.taskName, ...result },
        updatedCSI
      };
    } catch (error) {
      console.error(`[${config.taskName}] Failed:`, error);
      return {
        success: false,
        stepResult: { step: config.taskName },
        updatedCSI: request.previousCSI || {
          completedSteps: [],
          currentProgress: 0,
          totalSteps: 4,
          currentStep: "failed"
        },
        error: {
          message: error instanceof Error ? error.message : "Unknown error",
          code: "TASK_EXECUTION_FAILED",
          details: error
        }
      };
    }
  }
};
var AgentTaskConfigs = {
  INTENT_ANALYSIS: {
    taskName: "intent_analysis",
    taskType: "analysis",
    apiRoute: "/api/v2/decomposition/intent-analysis",
    toolName: "o3_mini_intent_analyzer",
    systemPrompt: "Analyze user prompts for content generation tasks. Use causal reasoning to determine intent, asset count, and types.",
    userPromptTemplate: (data) => `Analyze: "${data.prompt}" for ${data.brandContext?.brand_name || "brand"} (${data.brandContext?.referenceImages?.length || 0} ref images)`,
    functionDefinition: {
      name: "analyze_intent",
      description: "Analyzes user prompt for asset generation intent",
      parameters: {
        type: "object",
        properties: {
          analysis: { type: "string" },
          conclusion: { type: "string" },
          confidence: { type: "number" },
          inferred_assets: { type: "integer" },
          asset_types: { type: "array", items: { type: "string" } },
          reasoning_steps: { type: "array", items: { type: "string" } }
        },
        required: ["analysis", "conclusion", "confidence", "inferred_assets"]
      }
    },
    progressPercent: 25
  },
  BRAND_ANALYSIS: {
    taskName: "brand_analysis",
    taskType: "analysis",
    apiRoute: "/api/v2/decomposition/brand-analysis",
    toolName: "o3_mini_brand_analyzer",
    systemPrompt: "Analyze brand assets for content generation readiness. Assess completeness, consistency, and strength.",
    userPromptTemplate: (data) => `Analyze brand: ${data.brandContext?.brand_name || "Unknown"}
Colors: ${data.brandContext?.colors ? JSON.stringify(data.brandContext.colors) : "None"}
Messaging: ${data.brandContext?.messaging || "None"}
Reference Images: ${data.brandContext?.referenceImages?.length || 0}`,
    functionDefinition: {
      name: "analyze_brand",
      description: "Analyzes brand assets and context for content generation readiness",
      parameters: {
        type: "object",
        properties: {
          analysis: { type: "string" },
          conclusion: { type: "string" },
          confidence: { type: "number" },
          brand_strength: { type: "string", enum: ["weak", "moderate", "strong", "excellent"] },
          brand_consistency_score: { type: "number" },
          recommendations: { type: "array", items: { type: "string" } }
        },
        required: ["analysis", "conclusion", "confidence", "brand_strength"]
      }
    },
    progressPercent: 50
  },
  COMPLEXITY_ASSESSMENT: {
    taskName: "complexity_assessment",
    taskType: "analysis",
    apiRoute: "/api/v2/decomposition/complexity-assessment",
    toolName: "o3_mini_complexity_analyzer",
    systemPrompt: "Assess complexity for content generation tasks. Consider assets, brand strength, and execution requirements.",
    userPromptTemplate: (data) => `Assess complexity:
Prompt: "${data.prompt || ""}"
Brand: ${data.brandContext?.brand_name || "Unknown"} (${data.brandStrength || "Unknown"})
Assets: ${data.inferredAssets || 1}
References: ${data.brandContext?.referenceImages?.length || 0}`,
    functionDefinition: {
      name: "assess_complexity",
      description: "Assesses task complexity for content generation execution",
      parameters: {
        type: "object",
        properties: {
          analysis: { type: "string" },
          conclusion: { type: "string" },
          confidence: { type: "number" },
          complexity_level: { type: "string", enum: ["simple", "moderate", "complex", "expert"] },
          complexity_score: { type: "number" },
          estimated_duration_ms: { type: "integer" },
          resource_requirements: { type: "array", items: { type: "string" } },
          optimization_suggestions: { type: "array", items: { type: "string" } }
        },
        required: ["analysis", "conclusion", "confidence", "complexity_level", "complexity_score"]
      }
    },
    progressPercent: 75
  }
};
var AgentTaskBuilder = class _AgentTaskBuilder {
  constructor() {
    this.config = {};
  }
  static create(taskName) {
    return new _AgentTaskBuilder().name(taskName);
  }
  name(taskName) {
    this.config.taskName = taskName;
    return this;
  }
  type(taskType) {
    this.config.taskType = taskType;
    return this;
  }
  route(apiRoute) {
    this.config.apiRoute = apiRoute;
    return this;
  }
  tool(toolName) {
    this.config.toolName = toolName;
    return this;
  }
  systemPrompt(prompt) {
    this.config.systemPrompt = prompt;
    return this;
  }
  userPrompt(template) {
    this.config.userPromptTemplate = template;
    return this;
  }
  function(definition) {
    this.config.functionDefinition = definition;
    return this;
  }
  progress(percent) {
    this.config.progressPercent = percent;
    return this;
  }
  model(config) {
    this.config.modelConfig = config;
    return this;
  }
  build() {
    const required = [
      "taskName",
      "taskType",
      "toolName",
      "systemPrompt",
      "userPromptTemplate",
      "functionDefinition",
      "progressPercent"
    ];
    for (const field of required) {
      if (!this.config[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
    return this.config;
  }
};
function handleAgentTaskError(error, taskName) {
  console.error(`[${taskName}] Failed:`, error);
  if (error instanceof import_zod2.z.ZodError) {
    return {
      success: false,
      error: "Invalid request data",
      details: error.errors
    };
  }
  return {
    success: false,
    error: `${taskName} failed`,
    message: error instanceof Error ? error.message : "Unknown error"
  };
}
function validateAgentTaskRequest(data) {
  try {
    const validatedData = BaseAgentTaskRequestSchema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof import_zod2.z.ZodError) {
      return { success: false, errors: error.errors };
    }
    return { success: false, errors: [{ message: "Unknown validation error" }] };
  }
}
var createTaskHelpers = (executor) => ({
  createIntentAnalysisTask: (request) => executor.executeAgentTask(request, { prompt: request.prompt, brandContext: request.brandContext }, AgentTaskConfigs.INTENT_ANALYSIS),
  createBrandAnalysisTask: (request) => executor.executeAgentTask(request, { brandContext: request.brandContext }, AgentTaskConfigs.BRAND_ANALYSIS),
  createComplexityAssessmentTask: (request) => executor.executeAgentTask(request, {
    prompt: request.prompt,
    brandContext: request.brandContext,
    inferredAssets: request.inferredAssets,
    brandStrength: request.brandStrength
  }, AgentTaskConfigs.COMPLEXITY_ASSESSMENT)
});

// src/coordination.ts
var import_zod3 = require("zod");
var CoordinationRequestSchema = import_zod3.z.object({
  threadId: import_zod3.z.string().uuid(),
  userId: import_zod3.z.string().uuid(),
  agentType: import_zod3.z.enum(["CONTENT_GENERATION_AGENT", "TEXT_ANALYSIS_AGENT"]),
  operation: import_zod3.z.string().min(1),
  lockOptions: import_zod3.z.object({
    ttlSeconds: import_zod3.z.number().int().positive().optional(),
    keyPrefix: import_zod3.z.string().optional()
  }).optional(),
  metadata: import_zod3.z.record(import_zod3.z.any()).optional()
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
    if (error instanceof import_zod3.z.ZodError) {
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

// src/index.ts
var PACKAGE_INFO = {
  name: "@growthub/agent-tools",
  version: "1.0.0",
  description: "Agent coordination utilities and KV lock management for Growthub Marketing OS",
  patterns: [
    "KV Lock Management",
    "Agent Task Coordination",
    "OpenAI Function Calling Abstractions",
    "Distributed Orchestration",
    "Race Condition Prevention"
  ],
  compliance: "AT-03 PROD STABLE"
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AgentCoordinationManager,
  AgentTaskBuilder,
  AgentTaskConfigs,
  AgentTaskExecutor,
  BaseAgentTaskRequestSchema,
  CoordinationRequestSchema,
  CoordinationUtils,
  DEFAULT_LOCK_TTL_SECONDS,
  InMemoryKVStore,
  KVLockManager,
  KVLockMetadataSchema,
  OrchestrationManager,
  PACKAGE_INFO,
  acquireKvLock,
  checkKvLock,
  createCoordinationResult,
  createTaskHelpers,
  defaultKVLockManager,
  handleAgentTaskError,
  makeKvLockKey,
  releaseKvLock,
  validateAgentTaskRequest,
  validateCoordinationRequest,
  validateKVLockMetadata,
  withKvLock
});
//# sourceMappingURL=index.cjs.map