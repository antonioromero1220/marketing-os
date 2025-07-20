/* @growthub/compiler-core - Core decomposition engine and orchestration logic */

// src/csi.ts
import { z } from "zod";
var CSISchema = z.object({
  completedSteps: z.array(z.string()).default([]),
  currentProgress: z.number().min(0).max(100).default(0),
  totalSteps: z.number().int().positive().default(4),
  currentStep: z.string().default("pending"),
  metadata: z.record(z.any()).optional()
});
var MessageMetadataSchema = z.object({
  type: z.enum(["agent_step", "system_message", "user_message", "completion"]).default("agent_step"),
  step: z.string().optional(),
  status: z.enum(["pending", "running", "completed", "failed", "cancelled"]).default("pending"),
  progress: z.number().min(0).max(100).default(0),
  agentType: z.string().optional(),
  toolName: z.string().optional(),
  timestamp: z.string().datetime().default(() => (/* @__PURE__ */ new Date()).toISOString()),
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
export {
  CSISchema,
  MessageMetadataSchema,
  analyzeThreadState,
  calculateStepProgress,
  createCSI,
  createStepMetadata,
  createVersionedMetadata,
  extractStatusFromMetadata,
  isCSIComplete,
  mergeCSIMetadata,
  updateCSI,
  validateCSI,
  validateMessageMetadata
};
//# sourceMappingURL=csi.js.map