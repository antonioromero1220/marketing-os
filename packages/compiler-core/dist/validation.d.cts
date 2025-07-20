import { z } from 'zod';

/**
 * @growthub/compiler-core/validation
 * Pre-init validation patterns and utilities for AT-03 system
 */

declare const PreInitValidationSchema: z.ZodObject<{
    userId: z.ZodString;
    threadId: z.ZodString;
    runId: z.ZodOptional<z.ZodString>;
    prompt: z.ZodString;
    brandKitId: z.ZodString;
    agentType: z.ZodEnum<["CONTENT_GENERATION_AGENT", "TEXT_ANALYSIS_AGENT"]>;
    creativeCount: z.ZodDefault<z.ZodNumber>;
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
    executionPriority: z.ZodDefault<z.ZodEnum<["low", "normal", "high"]>>;
    maxRetries: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    threadId: string;
    userId: string;
    agentType: "CONTENT_GENERATION_AGENT" | "TEXT_ANALYSIS_AGENT";
    prompt: string;
    referenceImages: {
        type: string;
        url: string;
        description: string;
    }[];
    executionPriority: "low" | "normal" | "high";
    maxRetries: number;
    brandKitId: string;
    creativeCount: number;
    runId?: string | undefined;
}, {
    threadId: string;
    userId: string;
    agentType: "CONTENT_GENERATION_AGENT" | "TEXT_ANALYSIS_AGENT";
    prompt: string;
    brandKitId: string;
    referenceImages?: {
        type: string;
        url: string;
        description: string;
    }[] | undefined;
    executionPriority?: "low" | "normal" | "high" | undefined;
    maxRetries?: number | undefined;
    runId?: string | undefined;
    creativeCount?: number | undefined;
}>;
type PreInitValidation = z.infer<typeof PreInitValidationSchema>;
declare const KVLockValidationSchema: z.ZodObject<{
    userId: z.ZodString;
    threadId: z.ZodString;
    lockKey: z.ZodString;
    ttl: z.ZodDefault<z.ZodNumber>;
    metadata: z.ZodObject<{
        runId: z.ZodString;
        lockAcquired: z.ZodNumber;
        processId: z.ZodOptional<z.ZodString>;
        expiresAt: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        runId: string;
        lockAcquired: number;
        processId?: string | undefined;
        expiresAt?: string | undefined;
    }, {
        runId: string;
        lockAcquired: number;
        processId?: string | undefined;
        expiresAt?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    threadId: string;
    userId: string;
    metadata: {
        runId: string;
        lockAcquired: number;
        processId?: string | undefined;
        expiresAt?: string | undefined;
    };
    lockKey: string;
    ttl: number;
}, {
    threadId: string;
    userId: string;
    metadata: {
        runId: string;
        lockAcquired: number;
        processId?: string | undefined;
        expiresAt?: string | undefined;
    };
    lockKey: string;
    ttl?: number | undefined;
}>;
type KVLockValidation = z.infer<typeof KVLockValidationSchema>;
declare const AuthValidationSchema: z.ZodObject<{
    userId: z.ZodString;
    hasSession: z.ZodBoolean;
    hasToken: z.ZodBoolean;
    isAdmin: z.ZodDefault<z.ZodBoolean>;
    tokenLength: z.ZodOptional<z.ZodNumber>;
    sessionCookieFound: z.ZodDefault<z.ZodBoolean>;
    jwtValid: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    userId: string;
    hasSession: boolean;
    hasToken: boolean;
    isAdmin: boolean;
    sessionCookieFound: boolean;
    jwtValid: boolean;
    tokenLength?: number | undefined;
}, {
    userId: string;
    hasSession: boolean;
    hasToken: boolean;
    isAdmin?: boolean | undefined;
    tokenLength?: number | undefined;
    sessionCookieFound?: boolean | undefined;
    jwtValid?: boolean | undefined;
}>;
type AuthValidation = z.infer<typeof AuthValidationSchema>;
interface ValidationResult<T = any> {
    success: boolean;
    data?: T;
    errors?: ValidationError[];
    warnings?: string[];
    metadata?: {
        validatedAt: string;
        validationDuration: number;
        validator: string;
    };
}
interface ValidationError {
    field: string;
    message: string;
    code: string;
    severity: 'error' | 'warning' | 'info';
    context?: Record<string, any>;
}
/**
 * Validate pre-init request data
 */
declare function validatePreInit(data: unknown): ValidationResult<PreInitValidation>;
/**
 * Validate KV lock metadata
 */
declare function validateKVLock(data: unknown): ValidationResult<KVLockValidation>;
/**
 * Validate authentication state
 */
declare function validateAuth(data: unknown): ValidationResult<AuthValidation>;
/**
 * Validate thread ID format
 */
declare function validateThreadId(threadId: string): boolean;
/**
 * Validate user ID format
 */
declare function validateUserId(userId: string): boolean;
/**
 * Validate prompt content
 */
declare function validatePrompt(prompt: string): ValidationResult<string>;
/**
 * Validate reference images
 */
declare function validateReferenceImages(images: unknown[]): ValidationResult<Array<{
    url: string;
    type: string;
    description: string;
}>>;
/**
 * Create validation error
 */
declare function createValidationError(field: string, message: string, code: string, severity?: ValidationError['severity'], context?: Record<string, any>): ValidationError;
/**
 * Combine multiple validation results
 */
declare function combineValidationResults<T>(...results: ValidationResult<T>[]): ValidationResult<T[]>;

export { type AuthValidation, AuthValidationSchema, type KVLockValidation, KVLockValidationSchema, type PreInitValidation, PreInitValidationSchema, type ValidationError, type ValidationResult, combineValidationResults, createValidationError, validateAuth, validateKVLock, validatePreInit, validatePrompt, validateReferenceImages, validateThreadId, validateUserId };
