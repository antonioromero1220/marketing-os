export { BrandContext, DecompositionEvent, DecompositionEventSchema, DecompositionResult, DecompositionStep, calculateDecompositionProgress, createDecompositionStep, decompositionStructuredOutput, getCurrentDecompositionStep, isDecompositionComplete, transformBrandContext, updateDecompositionStep, validateDecompositionEvent } from './decomposition.cjs';
export { OrchestrationRequest, OrchestrationRequestSchema, OrchestrationResult, OrchestrationStep, areDependenciesSatisfied, calculateOrchestrationProgress, createCSIFromSteps, createContentGenerationSteps, createOrchestrationError, createOrchestrationStep, generateOrchestrationId, getNextExecutableSteps, getOrchestrationStatus, isOrchestrationComplete, updateOrchestrationStep, validateOrchestrationRequest } from './orchestration.cjs';
export { CSI, CSISchema, MessageMetadata, MessageMetadataSchema, ThreadAnalysis, ThreadExecutionStatus, analyzeThreadState, calculateStepProgress, createCSI, createStepMetadata, createVersionedMetadata, extractStatusFromMetadata, isCSIComplete, mergeCSIMetadata, updateCSI, validateCSI, validateMessageMetadata } from './csi.cjs';
export { AuthValidation, AuthValidationSchema, KVLockValidation, KVLockValidationSchema, PreInitValidation, PreInitValidationSchema, ValidationError, ValidationResult, combineValidationResults, createValidationError, validateAuth, validateKVLock, validatePreInit, validatePrompt, validateReferenceImages, validateThreadId, validateUserId } from './validation.cjs';
import 'zod';

/**
 * @growthub/compiler-core
 * Core decomposition engine and orchestration logic for Growthub Marketing OS
 *
 * This package contains the core AT-03 patterns extracted from the production
 * Growthub system for decomposition, orchestration, CSI tracking, and validation.
 */

declare const PACKAGE_INFO: {
    readonly name: "@growthub/compiler-core";
    readonly version: "1.0.0";
    readonly description: "Core decomposition engine and orchestration logic for Growthub Marketing OS";
    readonly patterns: readonly ["AT-03 Decomposition Engine", "CSI Coordination", "Pre-Init Validation", "Orchestration Patterns", "Thread State Management"];
    readonly compliance: "AT-03 PROD STABLE";
};

export { PACKAGE_INFO };
