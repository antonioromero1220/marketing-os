import { z } from 'zod';

/**
 * Validation utilities for the Growthub Marketing OS
 */

interface ValidationResult<T> {
    success: boolean;
    data?: T;
    errors?: string[];
    metadata?: Record<string, unknown>;
}
/**
 * Generic validation function that works with any Zod schema
 */
declare function validateWithSchema<T extends z.ZodSchema>(schema: T, data: unknown): ValidationResult<z.infer<T>>;
/**
 * Sanitize user input for safe processing
 */
declare function sanitizeUserInput(input: string): string;
/**
 * Validate email format
 */
declare function isValidEmail(email: string): boolean;
/**
 * Validate URL format
 */
declare function isValidUrl(url: string): boolean;
/**
 * Validate hex color format
 */
declare function isValidHexColor(color: string): boolean;
/**
 * Validate UUID format
 */
declare function isValidUuid(uuid: string): boolean;

export { type ValidationResult, isValidEmail, isValidHexColor, isValidUrl, isValidUuid, sanitizeUserInput, validateWithSchema };
