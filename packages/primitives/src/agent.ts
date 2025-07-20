/**
 * Agent utilities for the Growthub Marketing OS
 */

/**
 * Agent task status utilities
 */
export type AgentTaskStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

/**
 * Check if an agent task status indicates completion
 */
export function isTaskCompleted(status: AgentTaskStatus): boolean {
  return ['completed', 'failed', 'cancelled'].includes(status);
}

/**
 * Check if an agent task is currently active
 */
export function isTaskActive(status: AgentTaskStatus): boolean {
  return ['pending', 'running'].includes(status);
}

/**
 * Calculate task progress based on status
 */
export function getTaskProgress(status: AgentTaskStatus): number {
  const progressMap: Record<AgentTaskStatus, number> = {
    pending: 0,
    running: 50,
    completed: 100,
    failed: 100,
    cancelled: 0
  };
  
  return progressMap[status] ?? 0;
}

/**
 * Generate a unique run ID for agent tasks
 */
export function generateRunId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `run_${timestamp}_${random}`;
}

/**
 * Generate a unique thread ID
 */
export function generateThreadId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 8);
  return `thread_${timestamp}_${random}`;
}

/**
 * Parse agent context from a string
 */
export function parseAgentContext(contextStr: string): Record<string, unknown> {
  try {
    return JSON.parse(contextStr);
  } catch {
    return {};
  }
}

/**
 * Serialize agent context to string
 */
export function serializeAgentContext(context: Record<string, unknown>): string {
  try {
    return JSON.stringify(context, null, 2);
  } catch {
    return '{}';
  }
}

/**
 * Extract agent type from a run ID or context
 */
export function extractAgentType(input: string): string | null {
  // Try to extract from run ID pattern
  const runIdMatch = input.match(/agent_([A-Z_]+)/);
  if (runIdMatch) {
    return runIdMatch[1];
  }
  
  // Try to parse as JSON and extract agentType
  try {
    const parsed = JSON.parse(input);
    return parsed.agentType || null;
  } catch {
    return null;
  }
}

/**
 * Calculate estimated completion time based on task complexity
 */
export function estimateTaskDuration(taskType: string, complexity: 'low' | 'medium' | 'high'): number {
  const baseTimes: Record<string, number> = {
    'CONTENT_GENERATION_AGENT': 30000, // 30 seconds
    'IMAGE_GENERATION_AGENT': 60000,   // 60 seconds
    'EMAIL_MARKETING_AGENT': 45000,    // 45 seconds
    'SOCIAL_MEDIA_AGENT': 20000,       // 20 seconds
    'BRAND_ANALYSIS_AGENT': 90000,     // 90 seconds
    'SEO_OPTIMIZATION_AGENT': 120000,  // 2 minutes
  };

  const multipliers = {
    low: 0.7,
    medium: 1.0,
    high: 1.5
  };

  const baseTime = baseTimes[taskType] || 60000;
  const multiplier = multipliers[complexity];
  
  return Math.round(baseTime * multiplier);
}

/**
 * Format agent execution metadata for display
 */
export function formatExecutionMetadata(metadata: Record<string, unknown>): string {
  const entries = Object.entries(metadata)
    .filter(([key]) => !key.startsWith('_'))
    .map(([key, value]) => {
      const formattedKey = key.replace(/([A-Z])/g, ' $1').toLowerCase().trim();
      const formattedValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
      return `${formattedKey}: ${formattedValue}`;
    });
  
  return entries.join('\n');
} 