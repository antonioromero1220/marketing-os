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

// src/decomposition.ts
var decomposition_exports = {};
__export(decomposition_exports, {
  DecompositionEventSchema: () => DecompositionEventSchema,
  calculateDecompositionProgress: () => calculateDecompositionProgress,
  createDecompositionStep: () => createDecompositionStep,
  decompositionStructuredOutput: () => decompositionStructuredOutput,
  getCurrentDecompositionStep: () => getCurrentDecompositionStep,
  isDecompositionComplete: () => isDecompositionComplete,
  transformBrandContext: () => transformBrandContext,
  updateDecompositionStep: () => updateDecompositionStep,
  validateDecompositionEvent: () => validateDecompositionEvent
});
module.exports = __toCommonJS(decomposition_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DecompositionEventSchema,
  calculateDecompositionProgress,
  createDecompositionStep,
  decompositionStructuredOutput,
  getCurrentDecompositionStep,
  isDecompositionComplete,
  transformBrandContext,
  updateDecompositionStep,
  validateDecompositionEvent
});
//# sourceMappingURL=decomposition.cjs.map