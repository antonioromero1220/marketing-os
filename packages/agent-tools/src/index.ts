/**
 * @growthub/agent-tools
 * Agent coordination utilities and KV lock management for Growthub Marketing OS
 * 
 * This package provides professional agent coordination patterns extracted from
 * the AT-03 production system, including KV locks, task management, and orchestration.
 */

// Re-export all KV utilities
export * from './kv'
export type {
  KVLockMetadata,
  KVStore,
  KVLockConfig,
  AcquireLockOptions,
  KVLockResult
} from './kv'

// Re-export all task utilities  
export * from './tasks'
export type {
  BaseAgentTaskRequest,
  AgentTaskFunction,
  AgentTaskResult,
  AgentTaskConfig,
  OpenAIClient
} from './tasks'

// Re-export all coordination utilities
export * from './coordination'
export type {
  CoordinationRequest,
  CoordinationResult,
  OrchestrationStepConfig
} from './coordination'

// Package metadata
export const PACKAGE_INFO = {
  name: '@growthub/agent-tools',
  version: '1.0.0',
  description: 'Agent coordination utilities and KV lock management for Growthub Marketing OS',
  patterns: [
    'KV Lock Management',
    'Agent Task Coordination', 
    'OpenAI Function Calling Abstractions',
    'Distributed Orchestration',
    'Race Condition Prevention'
  ],
  compliance: 'AT-03 PROD STABLE'
} as const 