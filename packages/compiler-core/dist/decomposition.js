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
export {
  DecompositionEventSchema,
  calculateDecompositionProgress,
  createDecompositionStep,
  decompositionStructuredOutput,
  getCurrentDecompositionStep,
  isDecompositionComplete,
  transformBrandContext,
  updateDecompositionStep,
  validateDecompositionEvent
};
//# sourceMappingURL=decomposition.js.map