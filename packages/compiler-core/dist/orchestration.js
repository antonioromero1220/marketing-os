/* @growthub/compiler-core - Core decomposition engine and orchestration logic */

// src/orchestration.ts
import { z } from "zod";
var OrchestrationRequestSchema = z.object({
  threadId: z.string().uuid(),
  userId: z.string().min(1),
  agentType: z.enum(["CONTENT_GENERATION_AGENT", "TEXT_ANALYSIS_AGENT"]),
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
  executionPriority: z.enum(["low", "normal", "high"]).default("normal"),
  maxRetries: z.number().int().min(0).max(3).default(1),
  metadata: z.record(z.any()).optional()
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
export {
  OrchestrationRequestSchema,
  areDependenciesSatisfied,
  calculateOrchestrationProgress,
  createCSIFromSteps,
  createContentGenerationSteps,
  createOrchestrationError,
  createOrchestrationStep,
  generateOrchestrationId,
  getNextExecutableSteps,
  getOrchestrationStatus,
  isOrchestrationComplete,
  updateOrchestrationStep,
  validateOrchestrationRequest
};
//# sourceMappingURL=orchestration.js.map