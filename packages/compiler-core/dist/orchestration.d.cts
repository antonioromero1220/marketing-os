import { z } from 'zod';

/**
 * @growthub/compiler-core/orchestration
 * Core orchestration patterns for agent coordination and execution
 */

declare const OrchestrationRequestSchema: z.ZodObject<{
    threadId: z.ZodString;
    userId: z.ZodString;
    agentType: z.ZodEnum<["CONTENT_GENERATION_AGENT", "TEXT_ANALYSIS_AGENT"]>;
    prompt: z.ZodString;
    brandContext: z.ZodObject<{
        brand_name: z.ZodString;
        colors: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        messaging: z.ZodNullable<z.ZodString>;
        referenceImages: z.ZodDefault<z.ZodArray<z.ZodObject<{
            url: z.ZodString;
            type: z.ZodString;
            description: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            type: string;
            url: string;
            description: string;
        }, {
            type: string;
            url: string;
            description: string;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        brand_name: string;
        colors: string[];
        messaging: string | null;
        referenceImages: {
            type: string;
            url: string;
            description: string;
        }[];
    }, {
        brand_name: string;
        messaging: string | null;
        colors?: string[] | undefined;
        referenceImages?: {
            type: string;
            url: string;
            description: string;
        }[] | undefined;
    }>;
    executionPriority: z.ZodDefault<z.ZodEnum<["low", "normal", "high"]>>;
    maxRetries: z.ZodDefault<z.ZodNumber>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    threadId: string;
    userId: string;
    agentType: "CONTENT_GENERATION_AGENT" | "TEXT_ANALYSIS_AGENT";
    prompt: string;
    brandContext: {
        brand_name: string;
        colors: string[];
        messaging: string | null;
        referenceImages: {
            type: string;
            url: string;
            description: string;
        }[];
    };
    executionPriority: "low" | "normal" | "high";
    maxRetries: number;
    metadata?: Record<string, any> | undefined;
}, {
    threadId: string;
    userId: string;
    agentType: "CONTENT_GENERATION_AGENT" | "TEXT_ANALYSIS_AGENT";
    prompt: string;
    brandContext: {
        brand_name: string;
        messaging: string | null;
        colors?: string[] | undefined;
        referenceImages?: {
            type: string;
            url: string;
            description: string;
        }[] | undefined;
    };
    executionPriority?: "low" | "normal" | "high" | undefined;
    maxRetries?: number | undefined;
    metadata?: Record<string, any> | undefined;
}>;
type OrchestrationRequest = z.infer<typeof OrchestrationRequestSchema>;
interface OrchestrationResult {
    success: boolean;
    threadId: string;
    userId: string;
    agentType: string;
    orchestrationId: string;
    steps: OrchestrationStep[];
    metadata: {
        startedAt: string;
        completedAt?: string;
        duration?: number;
        status: 'pending' | 'running' | 'completed' | 'failed';
        retryCount: number;
    };
    error?: {
        message: string;
        code: string;
        details?: any;
    };
}
interface OrchestrationStep {
    stepId: string;
    stepName: string;
    stepType: 'decomposition' | 'analysis' | 'execution' | 'coordination' | 'completion';
    status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
    progress: number;
    result?: any;
    metadata?: {
        startedAt?: string;
        completedAt?: string;
        duration?: number;
        retryCount?: number;
        [key: string]: any;
    };
    dependencies?: string[];
    error?: {
        message: string;
        code: string;
        retry?: boolean;
    };
}
interface CSI {
    completedSteps: string[];
    currentProgress: number;
    totalSteps: number;
    currentStep: string;
    metadata?: Record<string, any>;
}
/**
 * Create orchestration step with metadata
 */
declare function createOrchestrationStep(stepId: string, stepName: string, stepType: OrchestrationStep['stepType'], dependencies?: string[]): OrchestrationStep;
/**
 * Update orchestration step status and progress
 */
declare function updateOrchestrationStep(step: OrchestrationStep, status: OrchestrationStep['status'], progress: number, result?: any, metadata?: Record<string, any>): OrchestrationStep;
/**
 * Check if step dependencies are satisfied
 */
declare function areDependenciesSatisfied(step: OrchestrationStep, allSteps: OrchestrationStep[]): boolean;
/**
 * Get next executable steps based on dependencies
 */
declare function getNextExecutableSteps(steps: OrchestrationStep[]): OrchestrationStep[];
/**
 * Calculate overall orchestration progress
 */
declare function calculateOrchestrationProgress(steps: OrchestrationStep[]): number;
/**
 * Check if orchestration is complete
 */
declare function isOrchestrationComplete(steps: OrchestrationStep[]): boolean;
/**
 * Get orchestration status based on steps
 */
declare function getOrchestrationStatus(steps: OrchestrationStep[]): 'pending' | 'running' | 'completed' | 'failed';
/**
 * Create CSI from orchestration steps
 */
declare function createCSIFromSteps(steps: OrchestrationStep[]): CSI;
/**
 * Validate orchestration request
 */
declare function validateOrchestrationRequest(data: unknown): OrchestrationRequest;
/**
 * Generate unique orchestration ID
 */
declare function generateOrchestrationId(userId: string, threadId: string): string;
/**
 * Create standard orchestration steps for content generation
 */
declare function createContentGenerationSteps(): OrchestrationStep[];
/**
 * Create error for orchestration step
 */
declare function createOrchestrationError(message: string, code: string, retry?: boolean, details?: any): OrchestrationStep['error'];

export { type CSI, type OrchestrationRequest, OrchestrationRequestSchema, type OrchestrationResult, type OrchestrationStep, areDependenciesSatisfied, calculateOrchestrationProgress, createCSIFromSteps, createContentGenerationSteps, createOrchestrationError, createOrchestrationStep, generateOrchestrationId, getNextExecutableSteps, getOrchestrationStatus, isOrchestrationComplete, updateOrchestrationStep, validateOrchestrationRequest };
