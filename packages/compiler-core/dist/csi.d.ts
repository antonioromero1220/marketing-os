import { z } from 'zod';

/**
 * @growthub/compiler-core/csi
 * Current Step Information (CSI) tracking and coordination utilities
 */

declare const CSISchema: z.ZodObject<{
    completedSteps: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    currentProgress: z.ZodDefault<z.ZodNumber>;
    totalSteps: z.ZodDefault<z.ZodNumber>;
    currentStep: z.ZodDefault<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    completedSteps: string[];
    currentProgress: number;
    totalSteps: number;
    currentStep: string;
    metadata?: Record<string, any> | undefined;
}, {
    metadata?: Record<string, any> | undefined;
    completedSteps?: string[] | undefined;
    currentProgress?: number | undefined;
    totalSteps?: number | undefined;
    currentStep?: string | undefined;
}>;
type CSI = z.infer<typeof CSISchema>;
type ThreadExecutionStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
declare const MessageMetadataSchema: z.ZodObject<{
    type: z.ZodDefault<z.ZodEnum<["agent_step", "system_message", "user_message", "completion"]>>;
    step: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodEnum<["pending", "running", "completed", "failed", "cancelled"]>>;
    progress: z.ZodDefault<z.ZodNumber>;
    agentType: z.ZodOptional<z.ZodString>;
    toolName: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodDefault<z.ZodString>;
    stepNumber: z.ZodOptional<z.ZodNumber>;
    totalSteps: z.ZodOptional<z.ZodNumber>;
    brandContext: z.ZodOptional<z.ZodString>;
    referenceImages: z.ZodOptional<z.ZodNumber>;
    generatedAssets: z.ZodDefault<z.ZodArray<z.ZodObject<{
        url: z.ZodString;
        type: z.ZodString;
        concept: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: string;
        url: string;
        concept?: string | undefined;
    }, {
        type: string;
        url: string;
        concept?: string | undefined;
    }>, "many">>;
    executionStats: z.ZodOptional<z.ZodObject<{
        apiCalls: z.ZodOptional<z.ZodNumber>;
        storageBytes: z.ZodOptional<z.ZodNumber>;
        executionTimeMs: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        apiCalls?: number | undefined;
        storageBytes?: number | undefined;
        executionTimeMs?: number | undefined;
    }, {
        apiCalls?: number | undefined;
        storageBytes?: number | undefined;
        executionTimeMs?: number | undefined;
    }>>;
    statusVersion: z.ZodOptional<z.ZodNumber>;
    kvLockReleased: z.ZodOptional<z.ZodBoolean>;
    emissionTimestamp: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "pending" | "running" | "completed" | "failed" | "cancelled";
    type: "completion" | "agent_step" | "system_message" | "user_message";
    timestamp: string;
    progress: number;
    generatedAssets: {
        type: string;
        url: string;
        concept?: string | undefined;
    }[];
    agentType?: string | undefined;
    referenceImages?: number | undefined;
    brandContext?: string | undefined;
    totalSteps?: number | undefined;
    step?: string | undefined;
    toolName?: string | undefined;
    stepNumber?: number | undefined;
    executionStats?: {
        apiCalls?: number | undefined;
        storageBytes?: number | undefined;
        executionTimeMs?: number | undefined;
    } | undefined;
    statusVersion?: number | undefined;
    kvLockReleased?: boolean | undefined;
    emissionTimestamp?: string | undefined;
}, {
    agentType?: string | undefined;
    status?: "pending" | "running" | "completed" | "failed" | "cancelled" | undefined;
    type?: "completion" | "agent_step" | "system_message" | "user_message" | undefined;
    referenceImages?: number | undefined;
    brandContext?: string | undefined;
    timestamp?: string | undefined;
    totalSteps?: number | undefined;
    step?: string | undefined;
    progress?: number | undefined;
    toolName?: string | undefined;
    stepNumber?: number | undefined;
    generatedAssets?: {
        type: string;
        url: string;
        concept?: string | undefined;
    }[] | undefined;
    executionStats?: {
        apiCalls?: number | undefined;
        storageBytes?: number | undefined;
        executionTimeMs?: number | undefined;
    } | undefined;
    statusVersion?: number | undefined;
    kvLockReleased?: boolean | undefined;
    emissionTimestamp?: string | undefined;
}>;
type MessageMetadata = z.infer<typeof MessageMetadataSchema>;
/**
 * Create CSI with default values
 */
declare function createCSI(currentStep?: string, totalSteps?: number, metadata?: Record<string, any>): CSI;
/**
 * Update CSI with new step completion
 */
declare function updateCSI(csi: CSI, completedStep: string, newCurrentStep: string, metadata?: Record<string, any>): CSI;
/**
 * Check if CSI represents completed state
 */
declare function isCSIComplete(csi: CSI): boolean;
/**
 * Extract thread execution status from message metadata
 */
declare function extractStatusFromMetadata(metadata: MessageMetadata | null): ThreadExecutionStatus;
/**
 * Create step metadata for agent tasks
 */
declare function createStepMetadata(stepName: string, agentType: string, stepNumber: number, totalSteps: number, toolName: string, additionalMetadata?: Partial<MessageMetadata>): MessageMetadata;
/**
 * Analyze thread state from real-time messages
 */
interface ThreadAnalysis {
    hasRunningSteps: boolean;
    hasFinalCompletion: boolean;
    shouldSwitchToHistorical: boolean;
    shouldEnableRealtime: boolean;
    executionStatus: ThreadExecutionStatus;
    currentProgress: number;
    completedSteps: number;
    totalSteps: number;
}
declare function analyzeThreadState(threadMessages: Array<{
    step?: string;
    status?: string;
    progress?: number;
    stepNumber?: number;
    totalSteps?: number;
}>): ThreadAnalysis;
/**
 * Create message metadata with status versioning
 */
declare function createVersionedMetadata(step: string, status: MessageMetadata['status'], progress: number, additionalData?: Partial<MessageMetadata>): MessageMetadata;
/**
 * Validate CSI data
 */
declare function validateCSI(data: unknown): CSI;
/**
 * Validate message metadata
 */
declare function validateMessageMetadata(data: unknown): MessageMetadata;
/**
 * Merge CSI metadata safely
 */
declare function mergeCSIMetadata(existing: CSI, updates: Partial<CSI>): CSI;
/**
 * Calculate step progress based on sequence
 */
declare function calculateStepProgress(stepNumber: number, totalSteps: number, isCompleted?: boolean): number;

export { type CSI, CSISchema, type MessageMetadata, MessageMetadataSchema, type ThreadAnalysis, type ThreadExecutionStatus, analyzeThreadState, calculateStepProgress, createCSI, createStepMetadata, createVersionedMetadata, extractStatusFromMetadata, isCSIComplete, mergeCSIMetadata, updateCSI, validateCSI, validateMessageMetadata };
