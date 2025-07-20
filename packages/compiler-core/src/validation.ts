/**
 * @growthub/compiler-core/validation
 * Pre-init validation patterns and utilities for AT-03 system
 */

import { z } from 'zod'
import type { DecompositionEvent } from './decomposition'
import type { OrchestrationRequest } from './orchestration'
import type { CSI, MessageMetadata } from './csi'

// Pre-Init Validation Schema
export const PreInitValidationSchema = z.object({
  userId: z.string().uuid('Invalid user ID format'),
  threadId: z.string().uuid('Invalid thread ID format'),
  runId: z.string().uuid('Invalid run ID format').optional(),
  prompt: z.string().min(1, 'Prompt cannot be empty').max(2000, 'Prompt too long'),
  brandKitId: z.string().uuid('Invalid brand kit ID'),
  agentType: z.enum(['CONTENT_GENERATION_AGENT', 'TEXT_ANALYSIS_AGENT']),
  creativeCount: z.number().int().min(1).max(10).default(1),
  referenceImages: z.array(z.object({
    url: z.string().url('Invalid reference image URL'),
    type: z.string().min(1),
    description: z.string().min(1)
  })).max(5, 'Too many reference images').default([]),
  executionPriority: z.enum(['low', 'normal', 'high']).default('normal'),
  maxRetries: z.number().int().min(0).max(3).default(1)
})

export type PreInitValidation = z.infer<typeof PreInitValidationSchema>

// KV Lock Validation Schema  
export const KVLockValidationSchema = z.object({
  userId: z.string().uuid(),
  threadId: z.string().uuid(),
  lockKey: z.string().min(1),
  ttl: z.number().int().positive().default(900000), // 15 minutes
  metadata: z.object({
    runId: z.string().uuid(),
    lockAcquired: z.number().int().positive(),
    processId: z.string().optional(),
    expiresAt: z.string().datetime().optional()
  })
})

export type KVLockValidation = z.infer<typeof KVLockValidationSchema>

// Authentication Validation Schema
export const AuthValidationSchema = z.object({
  userId: z.string().uuid(),
  hasSession: z.boolean(),
  hasToken: z.boolean(),
  isAdmin: z.boolean().default(false),
  tokenLength: z.number().int().positive().optional(),
  sessionCookieFound: z.boolean().default(false),
  jwtValid: z.boolean().default(false)
})

export type AuthValidation = z.infer<typeof AuthValidationSchema>

// Validation Result Types
export interface ValidationResult<T = any> {
  success: boolean
  data?: T
  errors?: ValidationError[]
  warnings?: string[]
  metadata?: {
    validatedAt: string
    validationDuration: number
    validator: string
  }
}

export interface ValidationError {
  field: string
  message: string
  code: string
  severity: 'error' | 'warning' | 'info'
  context?: Record<string, any>
}

/**
 * Validate pre-init request data
 */
export function validatePreInit(data: unknown): ValidationResult<PreInitValidation> {
  const startTime = performance.now()
  
  try {
    const validatedData = PreInitValidationSchema.parse(data)
    const duration = performance.now() - startTime
    
    return {
      success: true,
      data: validatedData,
      metadata: {
        validatedAt: new Date().toISOString(),
        validationDuration: Math.round(duration),
        validator: 'PreInitValidationSchema'
      }
    }
  } catch (error) {
    const duration = performance.now() - startTime
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
          severity: 'error' as const
        })),
        metadata: {
          validatedAt: new Date().toISOString(),
          validationDuration: Math.round(duration),
          validator: 'PreInitValidationSchema'
        }
      }
    }
    
    return {
      success: false,
      errors: [{
        field: 'unknown',
        message: 'Unknown validation error',
        code: 'UNKNOWN_ERROR',
        severity: 'error'
      }]
    }
  }
}

/**
 * Validate KV lock metadata
 */
export function validateKVLock(data: unknown): ValidationResult<KVLockValidation> {
  const startTime = performance.now()
  
  try {
    const validatedData = KVLockValidationSchema.parse(data)
    const duration = performance.now() - startTime
    
    return {
      success: true,
      data: validatedData,
      metadata: {
        validatedAt: new Date().toISOString(),
        validationDuration: Math.round(duration),
        validator: 'KVLockValidationSchema'
      }
    }
  } catch (error) {
    const duration = performance.now() - startTime
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
          severity: 'error' as const
        })),
        metadata: {
          validatedAt: new Date().toISOString(),
          validationDuration: Math.round(duration),
          validator: 'KVLockValidationSchema'
        }
      }
    }
    
    return {
      success: false,
      errors: [{
        field: 'unknown',
        message: 'KV lock validation failed',
        code: 'KV_VALIDATION_ERROR',
        severity: 'error'
      }]
    }
  }
}

/**
 * Validate authentication state
 */
export function validateAuth(data: unknown): ValidationResult<AuthValidation> {
  const startTime = performance.now()
  
  try {
    const validatedData = AuthValidationSchema.parse(data)
    const duration = performance.now() - startTime
    
    const warnings: string[] = []
    
    // Add warnings for suspicious auth states
    if (!validatedData.hasSession && !validatedData.hasToken) {
      warnings.push('No session or token found - authentication may be invalid')
    }
    
    if (validatedData.hasToken && !validatedData.jwtValid) {
      warnings.push('Token present but JWT validation failed')
    }
    
    return {
      success: true,
      data: validatedData,
      warnings: warnings.length > 0 ? warnings : undefined,
      metadata: {
        validatedAt: new Date().toISOString(),
        validationDuration: Math.round(duration),
        validator: 'AuthValidationSchema'
      }
    }
  } catch (error) {
    const duration = performance.now() - startTime
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
          severity: 'error' as const
        })),
        metadata: {
          validatedAt: new Date().toISOString(),
          validationDuration: Math.round(duration),
          validator: 'AuthValidationSchema'
        }
      }
    }
    
    return {
      success: false,
      errors: [{
        field: 'auth',
        message: 'Authentication validation failed',
        code: 'AUTH_VALIDATION_ERROR',
        severity: 'error'
      }]
    }
  }
}

/**
 * Validate thread ID format
 */
export function validateThreadId(threadId: string): boolean {
  return z.string().uuid().safeParse(threadId).success
}

/**
 * Validate user ID format
 */
export function validateUserId(userId: string): boolean {
  return z.string().uuid().safeParse(userId).success
}

/**
 * Validate prompt content
 */
export function validatePrompt(prompt: string): ValidationResult<string> {
  try {
    const validatedPrompt = z.string()
      .min(1, 'Prompt cannot be empty')
      .max(2000, 'Prompt exceeds maximum length')
      .parse(prompt)
    
    return {
      success: true,
      data: validatedPrompt
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => ({
          field: 'prompt',
          message: err.message,
          code: err.code,
          severity: 'error' as const
        }))
      }
    }
    
    return {
      success: false,
      errors: [{
        field: 'prompt',
        message: 'Invalid prompt format',
        code: 'PROMPT_VALIDATION_ERROR',
        severity: 'error'
      }]
    }
  }
}

/**
 * Validate reference images
 */
export function validateReferenceImages(images: unknown[]): ValidationResult<Array<{ url: string; type: string; description: string }>> {
  try {
    const schema = z.array(z.object({
      url: z.string().url('Invalid image URL'),
      type: z.string().min(1, 'Image type required'),
      description: z.string().min(1, 'Image description required')
    })).max(5, 'Maximum 5 reference images allowed')
    
    const validatedImages = schema.parse(images)
    
    return {
      success: true,
      data: validatedImages
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => ({
          field: `referenceImages.${err.path.join('.')}`,
          message: err.message,
          code: err.code,
          severity: 'error' as const
        }))
      }
    }
    
    return {
      success: false,
      errors: [{
        field: 'referenceImages',
        message: 'Reference images validation failed',
        code: 'IMAGES_VALIDATION_ERROR',
        severity: 'error'
      }]
    }
  }
}

/**
 * Create validation error
 */
export function createValidationError(
  field: string,
  message: string,
  code: string,
  severity: ValidationError['severity'] = 'error',
  context?: Record<string, any>
): ValidationError {
  return {
    field,
    message,
    code,
    severity,
    context
  }
}

/**
 * Combine multiple validation results
 */
export function combineValidationResults<T>(
  ...results: ValidationResult<T>[]
): ValidationResult<T[]> {
  const allErrors: ValidationError[] = []
  const allWarnings: string[] = []
  const allData: T[] = []
  
  let allSuccessful = true
  
  for (const result of results) {
    if (!result.success) {
      allSuccessful = false
      if (result.errors) {
        allErrors.push(...result.errors)
      }
    } else if (result.data !== undefined) {
      allData.push(result.data)
    }
    
    if (result.warnings) {
      allWarnings.push(...result.warnings)
    }
  }
  
  return {
    success: allSuccessful,
    data: allSuccessful ? allData : undefined,
    errors: allErrors.length > 0 ? allErrors : undefined,
    warnings: allWarnings.length > 0 ? allWarnings : undefined,
    metadata: {
      validatedAt: new Date().toISOString(),
      validationDuration: 0,
      validator: 'combined'
    }
  }
} 