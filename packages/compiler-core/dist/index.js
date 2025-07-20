/* @growthub/compiler-core - Core decomposition engine and orchestration logic */

// src/decomposition.ts
import { z } from "zod";
var DecompositionEventSchema = z.object({
  threadId: z.string().uuid(),
  userId: z.string().min(1),
  agentType: z.enum(["CONTENT_GENERATION_AGENT", "TEXT_ANALYSIS_AGENT"]),
  prompt: z.string().min(1),
  context: z.object({
    brandKit: z.object({
      id: z.string(),
      brand_name: z.string(),
      colors: z.object({
        primary: z.string().optional(),
        secondary: z.string().optional(),
        accent: z.string().optional(),
        neutral: z.string().optional()
      }).optional(),
      messaging: z.string().optional()
    }),
    referenceImages: z.array(z.object({
      url: z.string(),
      type: z.string(),
      description: z.string()
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
import { z as z2 } from "zod";
var OrchestrationRequestSchema = z2.object({
  threadId: z2.string().uuid(),
  userId: z2.string().min(1),
  agentType: z2.enum(["CONTENT_GENERATION_AGENT", "TEXT_ANALYSIS_AGENT"]),
  prompt: z2.string().min(1),
  brandContext: z2.object({
    brand_name: z2.string(),
    colors: z2.array(z2.string()).default([]),
    messaging: z2.string().nullable(),
    referenceImages: z2.array(z2.object({
      url: z2.string(),
      type: z2.string(),
      description: z2.string()
    })).default([])
  }),
  executionPriority: z2.enum(["low", "normal", "high"]).default("normal"),
  maxRetries: z2.number().int().min(0).max(3).default(1),
  metadata: z2.record(z2.any()).optional()
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
import { z as z3 } from "zod";
var CSISchema = z3.object({
  completedSteps: z3.array(z3.string()).default([]),
  currentProgress: z3.number().min(0).max(100).default(0),
  totalSteps: z3.number().int().positive().default(4),
  currentStep: z3.string().default("pending"),
  metadata: z3.record(z3.any()).optional()
});
var MessageMetadataSchema = z3.object({
  type: z3.enum(["agent_step", "system_message", "user_message", "completion"]).default("agent_step"),
  step: z3.string().optional(),
  status: z3.enum(["pending", "running", "completed", "failed", "cancelled"]).default("pending"),
  progress: z3.number().min(0).max(100).default(0),
  agentType: z3.string().optional(),
  toolName: z3.string().optional(),
  timestamp: z3.string().datetime().default(() => (/* @__PURE__ */ new Date()).toISOString()),
  stepNumber: z3.number().int().positive().optional(),
  totalSteps: z3.number().int().positive().optional(),
  brandContext: z3.string().optional(),
  referenceImages: z3.number().int().min(0).optional(),
  generatedAssets: z3.array(z3.object({
    url: z3.string(),
    type: z3.string(),
    concept: z3.string().optional()
  })).default([]),
  executionStats: z3.object({
    apiCalls: z3.number().int().min(0).optional(),
    storageBytes: z3.number().int().min(0).optional(),
    executionTimeMs: z3.number().int().min(0).optional()
  }).optional(),
  statusVersion: z3.number().int().optional(),
  kvLockReleased: z3.boolean().optional(),
  emissionTimestamp: z3.string().datetime().optional()
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
import { z as z4 } from "zod";
var PreInitValidationSchema = z4.object({
  userId: z4.string().uuid("Invalid user ID format"),
  threadId: z4.string().uuid("Invalid thread ID format"),
  runId: z4.string().uuid("Invalid run ID format").optional(),
  prompt: z4.string().min(1, "Prompt cannot be empty").max(2e3, "Prompt too long"),
  brandKitId: z4.string().uuid("Invalid brand kit ID"),
  agentType: z4.enum(["CONTENT_GENERATION_AGENT", "TEXT_ANALYSIS_AGENT"]),
  creativeCount: z4.number().int().min(1).max(10).default(1),
  referenceImages: z4.array(z4.object({
    url: z4.string().url("Invalid reference image URL"),
    type: z4.string().min(1),
    description: z4.string().min(1)
  })).max(5, "Too many reference images").default([]),
  executionPriority: z4.enum(["low", "normal", "high"]).default("normal"),
  maxRetries: z4.number().int().min(0).max(3).default(1)
});
var KVLockValidationSchema = z4.object({
  userId: z4.string().uuid(),
  threadId: z4.string().uuid(),
  lockKey: z4.string().min(1),
  ttl: z4.number().int().positive().default(9e5),
  // 15 minutes
  metadata: z4.object({
    runId: z4.string().uuid(),
    lockAcquired: z4.number().int().positive(),
    processId: z4.string().optional(),
    expiresAt: z4.string().datetime().optional()
  })
});
var AuthValidationSchema = z4.object({
  userId: z4.string().uuid(),
  hasSession: z4.boolean(),
  hasToken: z4.boolean(),
  isAdmin: z4.boolean().default(false),
  tokenLength: z4.number().int().positive().optional(),
  sessionCookieFound: z4.boolean().default(false),
  jwtValid: z4.boolean().default(false)
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
    if (error instanceof z4.ZodError) {
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
    if (error instanceof z4.ZodError) {
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
    if (error instanceof z4.ZodError) {
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
  return z4.string().uuid().safeParse(threadId).success;
}
function validateUserId(userId) {
  return z4.string().uuid().safeParse(userId).success;
}
function validatePrompt(prompt) {
  try {
    const validatedPrompt = z4.string().min(1, "Prompt cannot be empty").max(2e3, "Prompt exceeds maximum length").parse(prompt);
    return {
      success: true,
      data: validatedPrompt
    };
  } catch (error) {
    if (error instanceof z4.ZodError) {
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
    const schema = z4.array(z4.object({
      url: z4.string().url("Invalid image URL"),
      type: z4.string().min(1, "Image type required"),
      description: z4.string().min(1, "Image description required")
    })).max(5, "Maximum 5 reference images allowed");
    const validatedImages = schema.parse(images);
    return {
      success: true,
      data: validatedImages
    };
  } catch (error) {
    if (error instanceof z4.ZodError) {
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
export {
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
};
//# sourceMappingURL=index.js.map