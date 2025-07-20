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

// src/csi.ts
var csi_exports = {};
__export(csi_exports, {
  CSISchema: () => CSISchema,
  MessageMetadataSchema: () => MessageMetadataSchema,
  analyzeThreadState: () => analyzeThreadState,
  calculateStepProgress: () => calculateStepProgress,
  createCSI: () => createCSI,
  createStepMetadata: () => createStepMetadata,
  createVersionedMetadata: () => createVersionedMetadata,
  extractStatusFromMetadata: () => extractStatusFromMetadata,
  isCSIComplete: () => isCSIComplete,
  mergeCSIMetadata: () => mergeCSIMetadata,
  updateCSI: () => updateCSI,
  validateCSI: () => validateCSI,
  validateMessageMetadata: () => validateMessageMetadata
});
module.exports = __toCommonJS(csi_exports);
var import_zod = require("zod");
var CSISchema = import_zod.z.object({
  completedSteps: import_zod.z.array(import_zod.z.string()).default([]),
  currentProgress: import_zod.z.number().min(0).max(100).default(0),
  totalSteps: import_zod.z.number().int().positive().default(4),
  currentStep: import_zod.z.string().default("pending"),
  metadata: import_zod.z.record(import_zod.z.any()).optional()
});
var MessageMetadataSchema = import_zod.z.object({
  type: import_zod.z.enum(["agent_step", "system_message", "user_message", "completion"]).default("agent_step"),
  step: import_zod.z.string().optional(),
  status: import_zod.z.enum(["pending", "running", "completed", "failed", "cancelled"]).default("pending"),
  progress: import_zod.z.number().min(0).max(100).default(0),
  agentType: import_zod.z.string().optional(),
  toolName: import_zod.z.string().optional(),
  timestamp: import_zod.z.string().datetime().default(() => (/* @__PURE__ */ new Date()).toISOString()),
  stepNumber: import_zod.z.number().int().positive().optional(),
  totalSteps: import_zod.z.number().int().positive().optional(),
  brandContext: import_zod.z.string().optional(),
  referenceImages: import_zod.z.number().int().min(0).optional(),
  generatedAssets: import_zod.z.array(import_zod.z.object({
    url: import_zod.z.string(),
    type: import_zod.z.string(),
    concept: import_zod.z.string().optional()
  })).default([]),
  executionStats: import_zod.z.object({
    apiCalls: import_zod.z.number().int().min(0).optional(),
    storageBytes: import_zod.z.number().int().min(0).optional(),
    executionTimeMs: import_zod.z.number().int().min(0).optional()
  }).optional(),
  statusVersion: import_zod.z.number().int().optional(),
  kvLockReleased: import_zod.z.boolean().optional(),
  emissionTimestamp: import_zod.z.string().datetime().optional()
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
//# sourceMappingURL=csi.cjs.map