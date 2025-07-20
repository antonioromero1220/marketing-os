/**
 * Validation utilities for the Growthub Marketing OS
 */

import { z } from 'zod';
import type { 
  BrandKitSchema, 
  AgentTaskSchema, 
  CompilerContextSchema 
} from '@growthub/schemas';

// Generic validation result type
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: string[];
  metadata?: Record<string, unknown>;
}

/**
 * Generic validation function that works with any Zod schema
 */
export function validateWithSchema<T extends z.ZodSchema>(
  schema: T,
  data: unknown
): ValidationResult<z.infer<T>> {
  try {
    const result = schema.safeParse(data);
    
    if (result.success) {
      return {
        success: true,
        data: result.data
      };
    } else {
      return {
        success: false,
        errors: result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      };
    }
  } catch (error) {
    return {
      success: false,
      errors: [error instanceof Error ? error.message : 'Unknown validation error']
    };
  }
}

/**
 * Sanitize user input for safe processing
 */
export function sanitizeUserInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove basic HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .substring(0, 5000); // Limit length
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate hex color format
 */
export function isValidHexColor(color: string): boolean {
  const hexRegex = /^#[0-9A-F]{6}$/i;
  return hexRegex.test(color);
}

/**
 * Validate UUID format
 */
export function isValidUuid(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
} 