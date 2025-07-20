export { AcquireLockOptions, DEFAULT_LOCK_TTL_SECONDS, InMemoryKVStore, KVLockConfig, KVLockManager, KVLockMetadata, KVLockMetadataSchema, KVLockResult, KVStore, acquireKvLock, checkKvLock, defaultKVLockManager, makeKvLockKey, releaseKvLock, validateKVLockMetadata, withKvLock } from './kv.js';
export { AgentTaskBuilder, AgentTaskConfig, AgentTaskConfigs, AgentTaskExecutor, AgentTaskFunction, AgentTaskResult, BaseAgentTaskRequest, BaseAgentTaskRequestSchema, OpenAIClient, createTaskHelpers, handleAgentTaskError, validateAgentTaskRequest } from './tasks.js';
export { AgentCoordinationManager, CoordinationRequest, CoordinationRequestSchema, CoordinationResult, CoordinationUtils, OrchestrationManager, OrchestrationStepConfig, createCoordinationResult, validateCoordinationRequest } from './coordination.js';
import 'zod';
import '@growthub/compiler-core';

/**
 * @growthub/agent-tools
 * Agent coordination utilities and KV lock management for Growthub Marketing OS
 *
 * This package provides professional agent coordination patterns extracted from
 * the AT-03 production system, including KV locks, task management, and orchestration.
 */

declare const PACKAGE_INFO: {
    readonly name: "@growthub/agent-tools";
    readonly version: "1.0.0";
    readonly description: "Agent coordination utilities and KV lock management for Growthub Marketing OS";
    readonly patterns: readonly ["KV Lock Management", "Agent Task Coordination", "OpenAI Function Calling Abstractions", "Distributed Orchestration", "Race Condition Prevention"];
    readonly compliance: "AT-03 PROD STABLE";
};

export { PACKAGE_INFO };
