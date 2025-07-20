/* @growthub/compiler-core - Core decomposition engine and orchestration logic */
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
  AuthValidationSchema: () => AuthValidationSchema,
  CSISchema: () => CSISchema,
  DecompositionEventSchema: () => DecompositionEventSchema,
  KVLockValidationSchema: () => KVLockValidationSchema,
  MessageMetadataSchema: () => MessageMetadataSchema,
  OrchestrationRequestSchema: () => OrchestrationRequestSchema,
  PACKAGE_INFO: () => PACKAGE_INFO,
  PreInitValidationSchema: () => PreInitValidationSchema,
  analyzeThreadState: () => analyzeThreadState,
  areDependenciesSatisfied: () => areDependenciesSatisfied,
  calculateDecompositionProgress: () => calculateDecompositionProgress,
  calculateOrchestrationProgress: () => calculateOrchestrationProgress,
  calculateStepProgress: () => calculateStepProgress,
  combineValidationResults: () => combineValidationResults,
  createCSI: () => createCSI,
  createCSIFromSteps: () => createCSIFromSteps,
  createContentGenerationSteps: () => createContentGenerationSteps,
  createDecompositionStep: () => createDecompositionStep,
  createOrchestrationError: () => createOrchestrationError,
  createOrchestrationStep: () => createOrchestrationStep,
  createStepMetadata: () => createStepMetadata,
  createValidationError: () => createValidationError,
  createVersionedMetadata: () => createVersionedMetadata,
  decompositionStructuredOutput: () => decompositionStructuredOutput,
  extractStatusFromMetadata: () => extractStatusFromMetadata,
  generateOrchestrationId: () => generateOrchestrationId,
  getCurrentDecompositionStep: () => getCurrentDecompositionStep,
  getNextExecutableSteps: () => getNextExecutableSteps,
  getOrchestrationStatus: () => getOrchestrationStatus,
  isCSIComplete: () => isCSIComplete,
  isDecompositionComplete: () => isDecompositionComplete,
  isOrchestrationComplete: () => isOrchestrationComplete,
  mergeCSIMetadata: () => mergeCSIMetadata,
  transformBrandContext: () => transformBrandContext,
  updateCSI: () => updateCSI,
  updateDecompositionStep: () => updateDecompositionStep,
  updateOrchestrationStep: () => updateOrchestrationStep,
  validateAuth: () => validateAuth,
  validateCSI: () => validateCSI,
  validateDecompositionEvent: () => validateDecompositionEvent,
  validateKVLock: () => validateKVLock,
  validateMessageMetadata: () => validateMessageMetadata,
  validateOrchestrationRequest: () => validateOrchestrationRequest,
  validatePreInit: () => validatePreInit,
  validatePrompt: () => validatePrompt,
  validateReferenceImages: () => validateReferenceImages,
  validateThreadId: () => validateThreadId,
  validateUserId: () => validateUserId
});
module.exports = __toCommonJS(src_exports);

// src/decomposition.ts
var import_zod = require("zod");
var DecompositionEventSchema = import_zod.z.object({
  threadId: import_zod.z.string().uuid(),
  userId: import_zod.z.string().min(1),
  agentType: import_zod.z.enum(["CONTENT_GENERATION_AGENT", "TEXT_ANALYSIS_AGENT"]),
  prompt: import_zod.z.string().min(1),
  context: import_zod.z.object({
    brandKit: import_zod.z.object({
      id: import_zod.z.string(),
      brand_name: import_zod.z.string(),
      colors: import_zod.z.object({
        primary: import_zod.z.string().optional(),
        secondary: import_zod.z.string().optional(),
        accent: import_zod.z.string().optional(),
        neutral: import_zod.z.string().optional()
      }).optional(),
      messaging: import_zod.z.string().optional()
    }),
    referenceImages: import_zod.z.array(import_zod.z.object({
      url: import_zod.z.string(),
      type: import_zod.z.string(),
      description: import_zod.z.string()
    })).default([])
  })
});
var decompositionStructuredOutput = {
  type: "json_schema",
  json_schema: {
    name: "decomposition_event",
    strict: true,
    schema: {
      type: "object",
      properties: {
        threadId: { type: "string", format: "uuid" },
        userId: { type: "string", minLength: 1 },
        agentType: {
          type: "string",
          enum: ["CONTENT_GENERATION_AGENT", "TEXT_ANALYSIS_AGENT"]
        },
        prompt: { type: "string", minLength: 1 },
        context: {
          type: "object",
          properties: {
            brandKit: {
              type: "object",
              properties: {
                id: { type: "string" },
                brand_name: { type: "string" },
                colors: {
                  type: "object",
                  properties: {
                    primary: { type: "string" },
                    secondary: { type: "string" },
                    accent: { type: "string" },
                    neutral: { type: "string" }
                  },
                  required: ["primary", "secondary", "accent", "neutral"],
                  additionalProperties: false
                },
                messaging: { type: "string" }
              },
              required: ["id", "brand_name", "colors", "messaging"],
              additionalProperties: false
            },
            referenceImages: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  url: { type: "string" },
                  type: { type: "string" },
                  description: { type: "string" }
                },
                required: ["url", "type", "description"],
                additionalProperties: false
              }
            }
          },
          required: ["brandKit", "referenceImages"],
          additionalProperties: false
        }
      },
      required: ["threadId", "userId", "agentType", "prompt", "context"],
      additionalProperties: false
    }
  }
};
function transformBrandContext(context) {
  return {
    brand_name: context.brandKit.brand_name,
    colors: context.brandKit.colors ? Object.values(context.brandKit.colors).filter(Boolean) : [],
    messaging: context.brandKit.messaging || null,
    referenceImages: context.referenceImages
  };
}
function validateDecompositionEvent(data) {
  return DecompositionEventSchema.parse(data);
}
function createDecompositionStep(stepName, stepType, metadata) {
  return {
    stepName,
    stepType,
    status: "pending",
    metadata,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  };
}
function updateDecompositionStep(step, status, result, metadata) {
  return {
    ...step,
    status,
    result,
    metadata: { ...step.metadata, ...metadata },
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  };
}
function calculateDecompositionProgress(steps) {
  if (steps.length === 0) return 0;
  const completedSteps = steps.filter((step) => step.status === "completed").length;
  return Math.round(completedSteps / steps.length * 100);
}
function isDecompositionComplete(steps) {
  return steps.length > 0 && steps.every(
    (step) => step.status === "completed" || step.status === "failed"
  );
}
function getCurrentDecompositionStep(steps) {
  return steps.find((step) => step.status === "running") || steps.find((step) => step.status === "pending") || null;
}

// src/orchestration.ts
var import_zod2 = require("zod");
var OrchestrationRequestSchema = import_zod2.z.object({
  threadId: import_zod2.z.string().uuid(),
  userId: import_zod2.z.string().min(1),
  agentType: import_zod2.z.enum(["CONTENT_GENERATION_AGENT", "TEXT_ANALYSIS_AGENT"]),
  prompt: import_zod2.z.string().min(1),
  brandContext: import_zod2.z.object({
    brand_name: import_zod2.z.string(),
    colors: import_zod2.z.array(import_zod2.z.string()).default([]),
    messaging: import_zod2.z.string().nullable(),
    referenceImages: import_zod2.z.array(import_zod2.z.object({
      url: import_zod2.z.string(),
      type: import_zod2.z.string(),
      description: import_zod2.z.string()
    })).default([])
  }),
  executionPriority: import_zod2.z.enum(["low", "normal", "high"]).default("normal"),
  maxRetries: import_zod2.z.number().int().min(0).max(3).default(1),
  metadata: import_zod2.z.record(import_zod2.z.any()).optional()
});
function createOrchestrationStep(stepId, stepName, stepType, dependencies = []) {
  return {
    stepId,
    stepName,
    stepType,
    status: "pending",
    progress: 0,
    dependencies,
    metadata: {
      startedAt: (/* @__PURE__ */ new Date()).toISOString(),
      retryCount: 0
    }
  };
}
function updateOrchestrationStep(step, status, progress, result, metadata) {
  const updatedStep = {
    ...step,
    status,
    progress,
    result,
    metadata: {
      ...step.metadata,
      ...metadata
    }
  };
  if (status === "completed" || status === "failed") {
    updatedStep.metadata.completedAt = (/* @__PURE__ */ new Date()).toISOString();
    if (step.metadata?.startedAt) {
      const duration = Date.now() - new Date(step.metadata.startedAt).getTime();
      updatedStep.metadata.duration = duration;
    }
  }
  return updatedStep;
}
function areDependenciesSatisfied(step, allSteps) {
  if (!step.dependencies || step.dependencies.length === 0) {
    return true;
  }
  return step.dependencies.every((depId) => {
    const depStep = allSteps.find((s) => s.stepId === depId);
    return depStep?.status === "completed";
  });
}
function getNextExecutableSteps(steps) {
  return steps.filter(
    (step) => step.status === "pending" && areDependenciesSatisfied(step, steps)
  );
}
function calculateOrchestrationProgress(steps) {
  if (steps.length === 0) return 0;
  const totalProgress = steps.reduce((sum, step) => sum + step.progress, 0);
  return Math.round(totalProgress / steps.length);
}
function isOrchestrationComplete(steps) {
  return steps.length > 0 && steps.every(
    (step) => step.status === "completed" || step.status === "failed" || step.status === "skipped"
  );
}
function getOrchestrationStatus(steps) {
  if (steps.length === 0) return "pending";
  const hasRunning = steps.some((step) => step.status === "running");
  if (hasRunning) return "running";
  const hasFailed = steps.some((step) => step.status === "failed");
  if (hasFailed) return "failed";
  const allComplete = steps.every(
    (step) => step.status === "completed" || step.status === "skipped"
  );
  if (allComplete) return "completed";
  return "pending";
}
function createCSIFromSteps(steps) {
  const completedSteps = steps.filter((step) => step.status === "completed").map((step) => step.stepName);
  const currentStep = steps.find((step) => step.status === "running");
  const progress = calculateOrchestrationProgress(steps);
  return {
    completedSteps,
    currentProgress: progress,
    totalSteps: steps.length,
    currentStep: currentStep?.stepName || "pending",
    metadata: {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      stepsStatus: steps.map((step) => ({
        stepName: step.stepName,
        status: step.status,
        progress: step.progress
      }))
    }
  };
}
function validateOrchestrationRequest(data) {
  return OrchestrationRequestSchema.parse(data);
}
function generateOrchestrationId(userId, threadId) {
  const timestamp = Date.now();
  return `orch_${userId.slice(0, 8)}_${threadId.slice(0, 8)}_${timestamp}`;
}
function createContentGenerationSteps() {
  return [
    createOrchestrationStep("intent_analysis", "Intent Analysis", "analysis"),
    createOrchestrationStep("brand_analysis", "Brand Analysis", "analysis", ["intent_analysis"]),
    createOrchestrationStep("complexity_assessment", "Complexity Assessment", "analysis", ["intent_analysis", "brand_analysis"]),
    createOrchestrationStep("execution_planning", "Execution Planning", "coordination", ["complexity_assessment"]),
    createOrchestrationStep("content_generation", "Content Generation", "execution", ["execution_planning"]),
    createOrchestrationStep("finalization", "Finalization", "completion", ["content_generation"])
  ];
}
function createOrchestrationError(message, code, retry = false, details) {
  return {
    message,
    code,
    retry,
    ...details && { details }
  };
}

// src/csi.ts
var import_zod3 = require("zod");
var CSISchema = import_zod3.z.object({
  completedSteps: import_zod3.z.array(import_zod3.z.string()).default([]),
  currentProgress: import_zod3.z.number().min(0).max(100).default(0),
  totalSteps: import_zod3.z.number().int().positive().default(4),
  currentStep: import_zod3.z.string().default("pending"),
  metadata: import_zod3.z.record(import_zod3.z.any()).optional()
});
var MessageMetadataSchema = import_zod3.z.object({
  type: import_zod3.z.enum(["agent_step", "system_message", "user_message", "completion"]).default("agent_step"),
  step: import_zod3.z.string().optional(),
  status: import_zod3.z.enum(["pending", "running", "completed", "failed", "cancelled"]).default("pending"),
  progress: import_zod3.z.number().min(0).max(100).default(0),
  agentType: import_zod3.z.string().optional(),
  toolName: import_zod3.z.string().optional(),
  timestamp: import_zod3.z.string().datetime().default(() => (/* @__PURE__ */ new Date()).toISOString()),
  stepNumber: import_zod3.z.number().int().positive().optional(),
  totalSteps: import_zod3.z.number().int().positive().optional(),
  brandContext: import_zod3.z.string().optional(),
  referenceImages: import_zod3.z.number().int().min(0).optional(),
  generatedAssets: import_zod3.z.array(import_zod3.z.object({
    url: import_zod3.z.string(),
    type: import_zod3.z.string(),
    concept: import_zod3.z.string().optional()
  })).default([]),
  executionStats: import_zod3.z.object({
    apiCalls: import_zod3.z.number().int().min(0).optional(),
    storageBytes: import_zod3.z.number().int().min(0).optional(),
    executionTimeMs: import_zod3.z.number().int().min(0).optional()
  }).optional(),
  statusVersion: import_zod3.z.number().int().optional(),
  kvLockReleased: import_zod3.z.boolean().optional(),
  emissionTimestamp: import_zod3.z.string().datetime().optional()
});
function createCSI(currentStep = "pending", totalSteps = 4, metadata) {
  return {
    completedSteps: [],
    currentProgress: 0,
    totalSteps,
    currentStep,
    metadata: {
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      ...metadata
    }
  };
}
function updateCSI(csi, completedStep, newCurrentStep, metadata) {
  const completedSteps = [...csi.completedSteps, completedStep];
  const progress = Math.round(completedSteps.length / csi.totalSteps * 100);
  return {
    ...csi,
    completedSteps,
    currentProgress: progress,
    currentStep: newCurrentStep,
    metadata: {
      ...csi.metadata,
      ...metadata,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    }
  };
}
function isCSIComplete(csi) {
  return csi.currentProgress >= 100 || csi.completedSteps.length >= csi.totalSteps || csi.currentStep === "completed";
}
function extractStatusFromMetadata(metadata) {
  if (!metadata) return "PENDING";
  if (metadata.status === "completed" && (metadata.step === "final_completion" || metadata.step === "enhanced_completion")) {
    return "COMPLETED";
  }
  if (metadata.status === "failed" || metadata.status === "cancelled") {
    return metadata.status.toUpperCase();
  }
  if (metadata.status === "running") return "RUNNING";
  return "PENDING";
}
function createStepMetadata(stepName, agentType, stepNumber, totalSteps, toolName, additionalMetadata = {}) {
  return {
    type: "agent_step",
    step: stepName,
    status: "pending",
    progress: Math.round(stepNumber / totalSteps * 100),
    agentType,
    toolName,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    stepNumber,
    totalSteps,
    generatedAssets: [],
    ...additionalMetadata
  };
}
function analyzeThreadState(threadMessages) {
  const hasRunningSteps = threadMessages.some(
    (msg) => msg.status === "running" || msg.status === "pending"
  );
  const hasFinalCompletion = threadMessages.some(
    (msg) => (msg.step === "final_completion" || msg.step === "enhanced_completion") && msg.status === "completed"
  );
  const progressValues = threadMessages.map((msg) => msg.progress || 0).filter((progress) => progress > 0);
  const currentProgress = progressValues.length > 0 ? Math.max(...progressValues) : 0;
  const completedSteps = threadMessages.filter(
    (msg) => msg.status === "completed"
  ).length;
  const totalStepsValues = threadMessages.map((msg) => msg.totalSteps).filter(Boolean);
  const totalSteps = totalStepsValues.length > 0 ? Math.max(...totalStepsValues) : 4;
  let executionStatus = "PENDING";
  if (hasFinalCompletion) {
    executionStatus = "COMPLETED";
  } else if (hasRunningSteps) {
    executionStatus = "RUNNING";
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
  };
}
function createVersionedMetadata(step, status, progress, additionalData = {}) {
  return {
    type: "agent_step",
    step,
    status,
    progress,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    statusVersion: Date.now(),
    emissionTimestamp: (/* @__PURE__ */ new Date()).toISOString(),
    generatedAssets: [],
    ...additionalData
  };
}
function validateCSI(data) {
  return CSISchema.parse(data);
}
function validateMessageMetadata(data) {
  return MessageMetadataSchema.parse(data);
}
function mergeCSIMetadata(existing, updates) {
  return {
    ...existing,
    ...updates,
    completedSteps: updates.completedSteps || existing.completedSteps,
    metadata: {
      ...existing.metadata,
      ...updates.metadata,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    }
  };
}
function calculateStepProgress(stepNumber, totalSteps, isCompleted = false) {
  if (isCompleted) {
    return Math.round(stepNumber / totalSteps * 100);
  }
  return Math.round((stepNumber - 0.1) / totalSteps * 100);
}

// src/validation.ts
var import_zod4 = require("zod");
var PreInitValidationSchema = import_zod4.z.object({
  userId: import_zod4.z.string().uuid("Invalid user ID format"),
  threadId: import_zod4.z.string().uuid("Invalid thread ID format"),
  runId: import_zod4.z.string().uuid("Invalid run ID format").optional(),
  prompt: import_zod4.z.string().min(1, "Prompt cannot be empty").max(2e3, "Prompt too long"),
  brandKitId: import_zod4.z.string().uuid("Invalid brand kit ID"),
  agentType: import_zod4.z.enum(["CONTENT_GENERATION_AGENT", "TEXT_ANALYSIS_AGENT"]),
  creativeCount: import_zod4.z.number().int().min(1).max(10).default(1),
  referenceImages: import_zod4.z.array(import_zod4.z.object({
    url: import_zod4.z.string().url("Invalid reference image URL"),
    type: import_zod4.z.string().min(1),
    description: import_zod4.z.string().min(1)
  })).max(5, "Too many reference images").default([]),
  executionPriority: import_zod4.z.enum(["low", "normal", "high"]).default("normal"),
  maxRetries: import_zod4.z.number().int().min(0).max(3).default(1)
});
var KVLockValidationSchema = import_zod4.z.object({
  userId: import_zod4.z.string().uuid(),
  threadId: import_zod4.z.string().uuid(),
  lockKey: import_zod4.z.string().min(1),
  ttl: import_zod4.z.number().int().positive().default(9e5),
  // 15 minutes
  metadata: import_zod4.z.object({
    runId: import_zod4.z.string().uuid(),
    lockAcquired: import_zod4.z.number().int().positive(),
    processId: import_zod4.z.string().optional(),
    expiresAt: import_zod4.z.string().datetime().optional()
  })
});
var AuthValidationSchema = import_zod4.z.object({
  userId: import_zod4.z.string().uuid(),
  hasSession: import_zod4.z.boolean(),
  hasToken: import_zod4.z.boolean(),
  isAdmin: import_zod4.z.boolean().default(false),
  tokenLength: import_zod4.z.number().int().positive().optional(),
  sessionCookieFound: import_zod4.z.boolean().default(false),
  jwtValid: import_zod4.z.boolean().default(false)
});
function validatePreInit(data) {
  const startTime = performance.now();
  try {
    const validatedData = PreInitValidationSchema.parse(data);
    const duration = performance.now() - startTime;
    return {
      success: true,
      data: validatedData,
      metadata: {
        validatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        validationDuration: Math.round(duration),
        validator: "PreInitValidationSchema"
      }
    };
  } catch (error) {
    const duration = performance.now() - startTime;
    if (error instanceof import_zod4.z.ZodError) {
      return {
        success: false,
        errors: error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
          code: err.code,
          severity: "error"
        })),
        metadata: {
          validatedAt: (/* @__PURE__ */ new Date()).toISOString(),
          validationDuration: Math.round(duration),
          validator: "PreInitValidationSchema"
        }
      };
    }
    return {
      success: false,
      errors: [{
        field: "unknown",
        message: "Unknown validation error",
        code: "UNKNOWN_ERROR",
        severity: "error"
      }]
    };
  }
}
function validateKVLock(data) {
  const startTime = performance.now();
  try {
    const validatedData = KVLockValidationSchema.parse(data);
    const duration = performance.now() - startTime;
    return {
      success: true,
      data: validatedData,
      metadata: {
        validatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        validationDuration: Math.round(duration),
        validator: "KVLockValidationSchema"
      }
    };
  } catch (error) {
    const duration = performance.now() - startTime;
    if (error instanceof import_zod4.z.ZodError) {
      return {
        success: false,
        errors: error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
          code: err.code,
          severity: "error"
        })),
        metadata: {
          validatedAt: (/* @__PURE__ */ new Date()).toISOString(),
          validationDuration: Math.round(duration),
          validator: "KVLockValidationSchema"
        }
      };
    }
    return {
      success: false,
      errors: [{
        field: "unknown",
        message: "KV lock validation failed",
        code: "KV_VALIDATION_ERROR",
        severity: "error"
      }]
    };
  }
}
function validateAuth(data) {
  const startTime = performance.now();
  try {
    const validatedData = AuthValidationSchema.parse(data);
    const duration = performance.now() - startTime;
    const warnings = [];
    if (!validatedData.hasSession && !validatedData.hasToken) {
      warnings.push("No session or token found - authentication may be invalid");
    }
    if (validatedData.hasToken && !validatedData.jwtValid) {
      warnings.push("Token present but JWT validation failed");
    }
    return {
      success: true,
      data: validatedData,
      warnings: warnings.length > 0 ? warnings : void 0,
      metadata: {
        validatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        validationDuration: Math.round(duration),
        validator: "AuthValidationSchema"
      }
    };
  } catch (error) {
    const duration = performance.now() - startTime;
    if (error instanceof import_zod4.z.ZodError) {
      return {
        success: false,
        errors: error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
          code: err.code,
          severity: "error"
        })),
        metadata: {
          validatedAt: (/* @__PURE__ */ new Date()).toISOString(),
          validationDuration: Math.round(duration),
          validator: "AuthValidationSchema"
        }
      };
    }
    return {
      success: false,
      errors: [{
        field: "auth",
        message: "Authentication validation failed",
        code: "AUTH_VALIDATION_ERROR",
        severity: "error"
      }]
    };
  }
}
function validateThreadId(threadId) {
  return import_zod4.z.string().uuid().safeParse(threadId).success;
}
function validateUserId(userId) {
  return import_zod4.z.string().uuid().safeParse(userId).success;
}
function validatePrompt(prompt) {
  try {
    const validatedPrompt = import_zod4.z.string().min(1, "Prompt cannot be empty").max(2e3, "Prompt exceeds maximum length").parse(prompt);
    return {
      success: true,
      data: validatedPrompt
    };
  } catch (error) {
    if (error instanceof import_zod4.z.ZodError) {
      return {
        success: false,
        errors: error.errors.map((err) => ({
          field: "prompt",
          message: err.message,
          code: err.code,
          severity: "error"
        }))
      };
    }
    return {
      success: false,
      errors: [{
        field: "prompt",
        message: "Invalid prompt format",
        code: "PROMPT_VALIDATION_ERROR",
        severity: "error"
      }]
    };
  }
}
function validateReferenceImages(images) {
  try {
    const schema = import_zod4.z.array(import_zod4.z.object({
      url: import_zod4.z.string().url("Invalid image URL"),
      type: import_zod4.z.string().min(1, "Image type required"),
      description: import_zod4.z.string().min(1, "Image description required")
    })).max(5, "Maximum 5 reference images allowed");
    const validatedImages = schema.parse(images);
    return {
      success: true,
      data: validatedImages
    };
  } catch (error) {
    if (error instanceof import_zod4.z.ZodError) {
      return {
        success: false,
        errors: error.errors.map((err) => ({
          field: `referenceImages.${err.path.join(".")}`,
          message: err.message,
          code: err.code,
          severity: "error"
        }))
      };
    }
    return {
      success: false,
      errors: [{
        field: "referenceImages",
        message: "Reference images validation failed",
        code: "IMAGES_VALIDATION_ERROR",
        severity: "error"
      }]
    };
  }
}
function createValidationError(field, message, code, severity = "error", context) {
  return {
    field,
    message,
    code,
    severity,
    context
  };
}
function combineValidationResults(...results) {
  const allErrors = [];
  const allWarnings = [];
  const allData = [];
  let allSuccessful = true;
  for (const result of results) {
    if (!result.success) {
      allSuccessful = false;
      if (result.errors) {
        allErrors.push(...result.errors);
      }
    } else if (result.data !== void 0) {
      allData.push(result.data);
    }
    if (result.warnings) {
      allWarnings.push(...result.warnings);
    }
  }
  return {
    success: allSuccessful,
    data: allSuccessful ? allData : void 0,
    errors: allErrors.length > 0 ? allErrors : void 0,
    warnings: allWarnings.length > 0 ? allWarnings : void 0,
    metadata: {
      validatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      validationDuration: 0,
      validator: "combined"
    }
  };
}

// src/index.ts
var PACKAGE_INFO = {
  name: "@growthub/compiler-core",
  version: "1.0.0",
  description: "Core decomposition engine and orchestration logic for Growthub Marketing OS",
  patterns: [
    "AT-03 Decomposition Engine",
    "CSI Coordination",
    "Pre-Init Validation",
    "Orchestration Patterns",
    "Thread State Management"
  ],
  compliance: "AT-03 PROD STABLE"
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AuthValidationSchema,
  CSISchema,
  DecompositionEventSchema,
  KVLockValidationSchema,
  MessageMetadataSchema,
  OrchestrationRequestSchema,
  PACKAGE_INFO,
  PreInitValidationSchema,
  analyzeThreadState,
  areDependenciesSatisfied,
  calculateDecompositionProgress,
  calculateOrchestrationProgress,
  calculateStepProgress,
  combineValidationResults,
  createCSI,
  createCSIFromSteps,
  createContentGenerationSteps,
  createDecompositionStep,
  createOrchestrationError,
  createOrchestrationStep,
  createStepMetadata,
  createValidationError,
  createVersionedMetadata,
  decompositionStructuredOutput,
  extractStatusFromMetadata,
  generateOrchestrationId,
  getCurrentDecompositionStep,
  getNextExecutableSteps,
  getOrchestrationStatus,
  isCSIComplete,
  isDecompositionComplete,
  isOrchestrationComplete,
  mergeCSIMetadata,
  transformBrandContext,
  updateCSI,
  updateDecompositionStep,
  updateOrchestrationStep,
  validateAuth,
  validateCSI,
  validateDecompositionEvent,
  validateKVLock,
  validateMessageMetadata,
  validateOrchestrationRequest,
  validatePreInit,
  validatePrompt,
  validateReferenceImages,
  validateThreadId,
  validateUserId
});
//# sourceMappingURL=index.cjs.map