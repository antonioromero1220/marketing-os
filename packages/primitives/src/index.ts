/**
 * @growthub/primitives - Growthub Marketing OS Primitives
 * 
 * Stateless utility functions and primitives for the Growthub Marketing OS.
 * These utilities contain no business logic and are perfect for open-source distribution.
 * 
 * @license MIT
 * @version 1.0.0
 */

// Re-export all utilities
export * from './validation';
export * from './brand';
export * from './agent';
export * from './utils';

// Version info
export const PRIMITIVES_VERSION = '1.0.0';

// Package metadata
export const packageInfo = {
  name: '@growthub/primitives',
  version: PRIMITIVES_VERSION,
  description: 'Stateless utility functions and primitives for the Growthub Marketing OS',
  license: 'MIT'
} as const; 