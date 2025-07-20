import { z } from 'zod';
import { ValidationResult } from '@growthub/compiler-core';

/**
 * @growthub/agent-tools/kv
 * KV Lock Management and Coordination Utilities
 *
 * Professional KV lock patterns extracted from the AT-03 production system.
 * Provides distributed locking for agent coordination with TTL-based cleanup.
 */

declare const KVLockMetadataSchema: z.ZodObject<{
    lockedAt: z.ZodString;
    lockId: z.ZodOptional<z.ZodString>;
    processId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    expiresAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    lockedAt: string;
    lockId?: string | undefined;
    processId?: string | undefined;
    metadata?: Record<string, any> | undefined;
    expiresAt?: string | undefined;
}, {
    lockedAt: string;
    lockId?: string | undefined;
    processId?: string | undefined;
    metadata?: Record<string, any> | undefined;
    expiresAt?: string | undefined;
}>;
type KVLockMetadata = z.infer<typeof KVLockMetadataSchema>;
interface KVStore {
    get(key: string): Promise<any>;
    set(key: string, value: any, options?: {
        ttl?: number;
        condition?: 'nx' | 'xx';
    }): Promise<boolean>;
    delete(key: string): Promise<boolean>;
}
declare class InMemoryKVStore implements KVStore {
    private store;
    get(key: string): Promise<any>;
    set(key: string, value: any, options?: {
        ttl?: number;
        condition?: 'nx' | 'xx';
    }): Promise<boolean>;
    delete(key: string): Promise<boolean>;
}
interface KVLockConfig {
    ttlSeconds?: number;
    metadata?: KVLockMetadata;
    keyPrefix?: string;
}
interface AcquireLockOptions {
    ttlSeconds?: number;
    metadata?: KVLockMetadata;
}
interface KVLockResult {
    success: boolean;
    activeLockMetadata?: KVLockMetadata;
    lockKey: string;
}
declare const DEFAULT_LOCK_TTL_SECONDS: number;
/**
 * KV Lock Manager Class
 * Provides distributed locking with automatic TTL cleanup and validation
 */
declare class KVLockManager {
    private kv;
    private defaultTTL;
    private keyPrefix;
    constructor(kvStore?: KVStore, options?: {
        defaultTTL?: number;
        keyPrefix?: string;
    });
    /**
     * Generate KV lock key following the singleton pattern
     */
    makeKvLockKey(userId: string, threadId: string): string;
    /**
     * Try to acquire a KV lock for a user/thread
     */
    acquireKvLock(userId: string, threadId: string, options?: AcquireLockOptions): Promise<KVLockResult>;
    /**
     * Release the KV lock for a user/thread
     */
    releaseKvLock(userId: string, threadId: string): Promise<boolean>;
    /**
     * Check the lock status by returning stored metadata or null if unlocked
     */
    checkKvLock(userId: string, threadId: string): Promise<KVLockMetadata | null>;
    /**
     * Utility function to run code with automatic lock acquisition and release
     */
    withKvLock<T>(userId: string, threadId: string, operation: () => Promise<T>, options?: AcquireLockOptions): Promise<T>;
}
declare const defaultKVLockManager: KVLockManager;
/**
 * Convenience functions using the default manager
 */
declare const makeKvLockKey: (userId: string, threadId: string) => string;
declare const acquireKvLock: (userId: string, threadId: string, options?: AcquireLockOptions) => Promise<KVLockResult>;
declare const releaseKvLock: (userId: string, threadId: string) => Promise<boolean>;
declare const checkKvLock: (userId: string, threadId: string) => Promise<{
    lockedAt: string;
    lockId?: string | undefined;
    processId?: string | undefined;
    metadata?: Record<string, any> | undefined;
    expiresAt?: string | undefined;
} | null>;
declare const withKvLock: <T>(userId: string, threadId: string, operation: () => Promise<T>, options?: AcquireLockOptions) => Promise<T>;
/**
 * Validate KV lock metadata using Zod
 */
declare function validateKVLockMetadata(data: unknown): ValidationResult<KVLockMetadata>;

export { type AcquireLockOptions, DEFAULT_LOCK_TTL_SECONDS, InMemoryKVStore, type KVLockConfig, KVLockManager, type KVLockMetadata, KVLockMetadataSchema, type KVLockResult, type KVStore, acquireKvLock, checkKvLock, defaultKVLockManager, makeKvLockKey, releaseKvLock, validateKVLockMetadata, withKvLock };
