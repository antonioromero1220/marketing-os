/**
 * General utilities for the Growthub Marketing OS
 */
/**
 * Sleep for a specified number of milliseconds
 */
declare function sleep(ms: number): Promise<void>;
/**
 * Retry a function with exponential backoff
 */
declare function retryWithBackoff<T>(fn: () => Promise<T>, maxRetries?: number, baseDelay?: number): Promise<T>;
/**
 * Debounce a function
 */
declare function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(func: T, wait: number): (...args: Parameters<T>) => void;
/**
 * Throttle a function
 */
declare function throttle<T extends (...args: Parameters<T>) => ReturnType<T>>(func: T, limit: number): (...args: Parameters<T>) => void;
/**
 * Deep clone an object
 */
declare function deepClone<T>(obj: T): T;
/**
 * Check if two objects are deeply equal
 */
declare function deepEqual(a: unknown, b: unknown): boolean;
/**
 * Convert camelCase to snake_case
 */
declare function camelToSnake(str: string): string;
/**
 * Convert snake_case to camelCase
 */
declare function snakeToCamel(str: string): string;
/**
 * Format bytes to human readable string
 */
declare function formatBytes(bytes: number, decimals?: number): string;
/**
 * Generate a random string of specified length
 */
declare function randomString(length?: number): string;
/**
 * Truncate text to specified length with ellipsis
 */
declare function truncateText(text: string, maxLength: number): string;
/**
 * Check if code is running in browser environment
 */
declare function isBrowser(): boolean;
/**
 * Check if code is running in Node.js environment
 */
declare function isNode(): boolean;

export { camelToSnake, debounce, deepClone, deepEqual, formatBytes, isBrowser, isNode, randomString, retryWithBackoff, sleep, snakeToCamel, throttle, truncateText };
