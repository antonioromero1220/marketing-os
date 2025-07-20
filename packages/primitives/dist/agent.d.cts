/**
 * Agent utilities for the Growthub Marketing OS
 */
/**
 * Agent task status utilities
 */
type AgentTaskStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
/**
 * Check if an agent task status indicates completion
 */
declare function isTaskCompleted(status: AgentTaskStatus): boolean;
/**
 * Check if an agent task is currently active
 */
declare function isTaskActive(status: AgentTaskStatus): boolean;
/**
 * Calculate task progress based on status
 */
declare function getTaskProgress(status: AgentTaskStatus): number;
/**
 * Generate a unique run ID for agent tasks
 */
declare function generateRunId(): string;
/**
 * Generate a unique thread ID
 */
declare function generateThreadId(): string;
/**
 * Parse agent context from a string
 */
declare function parseAgentContext(contextStr: string): Record<string, unknown>;
/**
 * Serialize agent context to string
 */
declare function serializeAgentContext(context: Record<string, unknown>): string;
/**
 * Extract agent type from a run ID or context
 */
declare function extractAgentType(input: string): string | null;
/**
 * Calculate estimated completion time based on task complexity
 */
declare function estimateTaskDuration(taskType: string, complexity: 'low' | 'medium' | 'high'): number;
/**
 * Format agent execution metadata for display
 */
declare function formatExecutionMetadata(metadata: Record<string, unknown>): string;

export { type AgentTaskStatus, estimateTaskDuration, extractAgentType, formatExecutionMetadata, generateRunId, generateThreadId, getTaskProgress, isTaskActive, isTaskCompleted, parseAgentContext, serializeAgentContext };
