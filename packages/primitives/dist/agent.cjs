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

// src/agent.ts
var agent_exports = {};
__export(agent_exports, {
  estimateTaskDuration: () => estimateTaskDuration,
  extractAgentType: () => extractAgentType,
  formatExecutionMetadata: () => formatExecutionMetadata,
  generateRunId: () => generateRunId,
  generateThreadId: () => generateThreadId,
  getTaskProgress: () => getTaskProgress,
  isTaskActive: () => isTaskActive,
  isTaskCompleted: () => isTaskCompleted,
  parseAgentContext: () => parseAgentContext,
  serializeAgentContext: () => serializeAgentContext
});
module.exports = __toCommonJS(agent_exports);
function isTaskCompleted(status) {
  return ["completed", "failed", "cancelled"].includes(status);
}
function isTaskActive(status) {
  return ["pending", "running"].includes(status);
}
function getTaskProgress(status) {
  const progressMap = {
    pending: 0,
    running: 50,
    completed: 100,
    failed: 100,
    cancelled: 0
  };
  return progressMap[status] ?? 0;
}
function generateRunId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `run_${timestamp}_${random}`;
}
function generateThreadId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 8);
  return `thread_${timestamp}_${random}`;
}
function parseAgentContext(contextStr) {
  try {
    return JSON.parse(contextStr);
  } catch {
    return {};
  }
}
function serializeAgentContext(context) {
  try {
    return JSON.stringify(context, null, 2);
  } catch {
    return "{}";
  }
}
function extractAgentType(input) {
  const runIdMatch = input.match(/agent_([A-Z_]+)/);
  if (runIdMatch) {
    return runIdMatch[1];
  }
  try {
    const parsed = JSON.parse(input);
    return parsed.agentType || null;
  } catch {
    return null;
  }
}
function estimateTaskDuration(taskType, complexity) {
  const baseTimes = {
    "CONTENT_GENERATION_AGENT": 3e4,
    // 30 seconds
    "IMAGE_GENERATION_AGENT": 6e4,
    // 60 seconds
    "EMAIL_MARKETING_AGENT": 45e3,
    // 45 seconds
    "SOCIAL_MEDIA_AGENT": 2e4,
    // 20 seconds
    "BRAND_ANALYSIS_AGENT": 9e4,
    // 90 seconds
    "SEO_OPTIMIZATION_AGENT": 12e4
    // 2 minutes
  };
  const multipliers = {
    low: 0.7,
    medium: 1,
    high: 1.5
  };
  const baseTime = baseTimes[taskType] || 6e4;
  const multiplier = multipliers[complexity];
  return Math.round(baseTime * multiplier);
}
function formatExecutionMetadata(metadata) {
  const entries = Object.entries(metadata).filter(([key]) => !key.startsWith("_")).map(([key, value]) => {
    const formattedKey = key.replace(/([A-Z])/g, " $1").toLowerCase().trim();
    const formattedValue = typeof value === "object" ? JSON.stringify(value) : String(value);
    return `${formattedKey}: ${formattedValue}`;
  });
  return entries.join("\n");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  estimateTaskDuration,
  extractAgentType,
  formatExecutionMetadata,
  generateRunId,
  generateThreadId,
  getTaskProgress,
  isTaskActive,
  isTaskCompleted,
  parseAgentContext,
  serializeAgentContext
});
//# sourceMappingURL=agent.cjs.map