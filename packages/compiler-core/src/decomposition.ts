/**
 * @growthub/compiler-core/decomposition
 * Core decomposition engine patterns and utilities
 */

import { z } from 'zod'
import type { BrandKitSchema } from '@growthub/schemas'

// 2025 Real-Time CSI Schema for Decomposition Events
export const DecompositionEventSchema = z.object({
  threadId: z.string().uuid(),
  userId: z.string().min(1),
  agentType: z.enum(['CONTENT_GENERATION_AGENT', 'TEXT_ANALYSIS_AGENT']),
  prompt: z.string().min(1),
  context: z.object({
    brandKit: z.object({
      id: z.string(),
      brand_name: z.string(),
      colors: z.object({
        primary: z.string().optional(),
        secondary: z.string().optional(),
        accent: z.string().optional(),
        neutral: z.string().optional(),
      }).optional(),
      messaging: z.string().optional(),
    }),
    referenceImages: z.array(z.object({
      url: z.string(),
      type: z.string(),
      description: z.string()
    })).default([]),
  }),
})

export type DecompositionEvent = z.infer<typeof DecompositionEventSchema>

// OpenAI Structured Output Schema for Decomposition Validation
export const decompositionStructuredOutput = {
  type: "json_schema" as const,
  json_schema: {
    name: "decomposition_event",
    strict: true,
    schema: {
      type: "object",
      properties: {
        threadId: { type: "string", format: "uuid" },
        userId: { type: "string", minLength: 1 },
        agentType: { 
          type: "string", 
          enum: ["CONTENT_GENERATION_AGENT", "TEXT_ANALYSIS_AGENT"] 
        },
        prompt: { type: "string", minLength: 1 },
        context: {
          type: "object",
          properties: {
            brandKit: {
              type: "object",
              properties: {
                id: { type: "string" },
                brand_name: { type: "string" },
                colors: {
                  type: "object",
                  properties: {
                    primary: { type: "string" },
                    secondary: { type: "string" },
                    accent: { type: "string" },
                    neutral: { type: "string" }
                  },
                  required: ["primary", "secondary", "accent", "neutral"],
                  additionalProperties: false
                },
                messaging: { type: "string" }
              },
              required: ["id", "brand_name", "colors", "messaging"],
              additionalProperties: false
            },
            referenceImages: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  url: { type: "string" },
                  type: { type: "string" },
                  description: { type: "string" }
                },
                required: ["url", "type", "description"],
                additionalProperties: false
              }
            }
          },
          required: ["brandKit", "referenceImages"],
          additionalProperties: false
        }
      },
      required: ["threadId", "userId", "agentType", "prompt", "context"],
      additionalProperties: false
    }
  }
}

// Decomposition Result Types
export interface DecompositionResult {
  threadId: string
  userId: string
  agentType: 'CONTENT_GENERATION_AGENT' | 'TEXT_ANALYSIS_AGENT'
  steps: DecompositionStep[]
  metadata: {
    startedAt: string
    completedAt?: string
    duration?: number
    status: 'pending' | 'running' | 'completed' | 'failed'
  }
}

export interface DecompositionStep {
  stepName: string
  stepType: 'analysis' | 'planning' | 'coordination' | 'execution'
  status: 'pending' | 'running' | 'completed' | 'failed'
  result?: any
  metadata?: Record<string, any>
  timestamp: string
}

// Brand Context Transformer
export interface BrandContext {
  brand_name: string
  colors: string[]
  messaging: string | null
  referenceImages: Array<{
    url: string
    type: string
    description: string
  }>
}

/**
 * Transform context from DecompositionEvent to BrandContext format
 */
export function transformBrandContext(context: DecompositionEvent['context']): BrandContext {
  return {
    brand_name: context.brandKit.brand_name,
    colors: context.brandKit.colors 
      ? Object.values(context.brandKit.colors).filter(Boolean) as string[]
      : [],
    messaging: context.brandKit.messaging || null,
    referenceImages: context.referenceImages,
  }
}

/**
 * Validate decomposition event data with Zod
 */
export function validateDecompositionEvent(data: unknown): DecompositionEvent {
  return DecompositionEventSchema.parse(data)
}

/**
 * Create decomposition step metadata
 */
export function createDecompositionStep(
  stepName: string,
  stepType: DecompositionStep['stepType'],
  metadata?: Record<string, any>
): DecompositionStep {
  return {
    stepName,
    stepType,
    status: 'pending',
    metadata,
    timestamp: new Date().toISOString()
  }
}

/**
 * Update decomposition step status
 */
export function updateDecompositionStep(
  step: DecompositionStep,
  status: DecompositionStep['status'],
  result?: any,
  metadata?: Record<string, any>
): DecompositionStep {
  return {
    ...step,
    status,
    result,
    metadata: { ...step.metadata, ...metadata },
    timestamp: new Date().toISOString()
  }
}

/**
 * Calculate decomposition progress percentage
 */
export function calculateDecompositionProgress(steps: DecompositionStep[]): number {
  if (steps.length === 0) return 0
  
  const completedSteps = steps.filter(step => step.status === 'completed').length
  return Math.round((completedSteps / steps.length) * 100)
}

/**
 * Check if decomposition is complete
 */
export function isDecompositionComplete(steps: DecompositionStep[]): boolean {
  return steps.length > 0 && steps.every(step => 
    step.status === 'completed' || step.status === 'failed'
  )
}

/**
 * Get current decomposition step
 */
export function getCurrentDecompositionStep(steps: DecompositionStep[]): DecompositionStep | null {
  return steps.find(step => step.status === 'running') || 
         steps.find(step => step.status === 'pending') ||
         null
} 