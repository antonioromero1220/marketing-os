// src/agent.ts
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
export {
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
};
//# sourceMappingURL=agent.js.map