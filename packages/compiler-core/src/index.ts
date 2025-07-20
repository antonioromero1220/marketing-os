/**
 * @growthub/compiler-core
 * Core decomposition engine and orchestration logic for Growthub Marketing OS
 * 
 * This package contains the core AT-03 patterns extracted from the production
 * Growthub system for decomposition, orchestration, CSI tracking, and validation.
 */

// Re-export all decomposition utilities
export * from './decomposition'
export type {
  DecompositionEvent,
  DecompositionResult,
  DecompositionStep,
  BrandContext
} from './decomposition'

// Re-export all orchestration utilities  
export * from './orchestration'
export type {
  OrchestrationRequest,
  OrchestrationResult,
  OrchestrationStep
} from './orchestration'

// Re-export all CSI utilities
export * from './csi'
export type {
  CSI,
  MessageMetadata,
  ThreadExecutionStatus,
  ThreadAnalysis
} from './csi'

// Re-export all validation utilities
export * from './validation'
export type {
  PreInitValidation,
  KVLockValidation,
  AuthValidation,
  ValidationResult,
  ValidationError
} from './validation'

// Package metadata
export const PACKAGE_INFO = {
  name: '@growthub/compiler-core',
  version: '1.0.0',
  description: 'Core decomposition engine and orchestration logic for Growthub Marketing OS',
  patterns: [
    'AT-03 Decomposition Engine',
    'CSI Coordination',
    'Pre-Init Validation',
    'Orchestration Patterns',
    'Thread State Management'
  ],
  compliance: 'AT-03 PROD STABLE'
} as const 