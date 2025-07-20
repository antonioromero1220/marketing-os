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

// src/tasks.ts
var tasks_exports = {};
__export(tasks_exports, {
  AgentTaskBuilder: () => AgentTaskBuilder,
  AgentTaskConfigs: () => AgentTaskConfigs,
  AgentTaskExecutor: () => AgentTaskExecutor,
  BaseAgentTaskRequestSchema: () => BaseAgentTaskRequestSchema,
  createTaskHelpers: () => createTaskHelpers,
  handleAgentTaskError: () => handleAgentTaskError,
  validateAgentTaskRequest: () => validateAgentTaskRequest
});
module.exports = __toCommonJS(tasks_exports);
var import_zod = require("zod");
var BaseAgentTaskRequestSchema = import_zod.z.object({
  threadId: import_zod.z.string().uuid(),
  userId: import_zod.z.string().min(1),
  agentType: import_zod.z.enum(["CONTENT_GENERATION_AGENT", "TEXT_ANALYSIS_AGENT"]),
  taskSequence: import_zod.z.number().int().min(1),
  previousCSI: import_zod.z.object({
    completedSteps: import_zod.z.array(import_zod.z.string()).default([]),
    currentProgress: import_zod.z.number().default(0),
    totalSteps: import_zod.z.number().default(4),
    currentStep: import_zod.z.string().default("pending")
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
  if (error instanceof import_zod.z.ZodError) {
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
    if (error instanceof import_zod.z.ZodError) {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AgentTaskBuilder,
  AgentTaskConfigs,
  AgentTaskExecutor,
  BaseAgentTaskRequestSchema,
  createTaskHelpers,
  handleAgentTaskError,
  validateAgentTaskRequest
});
//# sourceMappingURL=tasks.cjs.map