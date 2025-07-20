/**
 * @growthub/schemas - Growthub Marketing OS Schemas
 * 
 * Pure Zod schemas and TypeScript types for the Growthub Marketing OS.
 * This package contains stateless validation schemas with no business logic,
 * making it perfect for open-source distribution.
 * 
 * @license MIT
 * @version 1.0.0
 */

// ============================================================================
// RE-EXPORTS
// ============================================================================

// Brand schemas
export * from './brand.js';

// Agent schemas
export * from './agent.js';

// Compiler schemas
export * from './compiler.js';

// ============================================================================
// UNIFIED SCHEMA COLLECTIONS
// ============================================================================

import { brandSchemas } from './brand.js';
import { agentSchemas } from './agent.js';
import { compilerSchemas } from './compiler.js';

export const schemas = {
  ...brandSchemas,
  ...agentSchemas,  
  ...compilerSchemas,
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

/**
 * Convert a Zod schema to JSON Schema format
 * Useful for API documentation and client code generation
 */
export function toJsonSchema<T extends z.ZodSchema>(schema: T) {
  return zodToJsonSchema(schema);
}

/**
 * Validate data against a schema and return typed result
 */
export function validate<T extends z.ZodSchema>(
  schema: T,
  data: unknown
): {
  success: boolean;
  data?: z.infer<T>;
  errors?: string[];
} {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }
  
  return {
    success: false,
    errors: result.error.errors.map(err => 
      `${err.path.join('.')}: ${err.message}`
    ),
  };
}

/**
 * Create a partial schema from an existing schema
 * Useful for update operations
 */
export function createPartialSchema<T extends z.ZodObject<any>>(schema: T) {
  return schema.partial();
}

/**
 * Create an omit schema from an existing schema
 * Useful for creation operations
 */
export function createOmitSchema<
  T extends z.ZodObject<any>,
  K extends keyof T['shape']
>(schema: T, keys: K[]) {
  const omitObject = {} as any;
  keys.forEach(key => {
    omitObject[key] = true;
  });
  return schema.omit(omitObject);
}

// ============================================================================
// COMMON VALIDATION PATTERNS
// ============================================================================

/**
 * Common UUID validation pattern
 */
export const uuidSchema = z.string().uuid();

/**
 * Common URL validation pattern
 */
export const urlSchema = z.string().url();

/**
 * Common email validation pattern
 */
export const emailSchema = z.string().email();

/**
 * Common timestamp validation pattern
 */
export const timestampSchema = z.string().datetime();

/**
 * Common hex color validation pattern
 */
export const hexColorSchema = z.string().regex(/^#[0-9A-F]{6}$/i);

/**
 * Common pagination parameters
 */
export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  orderBy: z.string().optional(),
  orderDirection: z.enum(['asc', 'desc']).default('desc'),
});

export type Pagination = z.infer<typeof paginationSchema>;

/**
 * Common response wrapper
 */
export const apiResponseSchema = <T extends z.ZodSchema>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.string().optional(),
    metadata: z.object({
      requestId: z.string().optional(),
      timestamp: timestampSchema,
      pagination: paginationSchema.optional(),
    }).optional(),
  });

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: {
    requestId?: string;
    timestamp: string;
    pagination?: Pagination;
  };
};

// ============================================================================
// VERSION INFO
// ============================================================================

export const SCHEMA_VERSION = '1.0.0';
export const COMPATIBLE_VERSIONS = ['1.0.0'];

/**
 * Check if a schema version is compatible with this package
 */
export function isCompatibleVersion(version: string): boolean {
  return COMPATIBLE_VERSIONS.includes(version);
}