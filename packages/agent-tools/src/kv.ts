/**
 * @growthub/agent-tools/kv
 * KV Lock Management and Coordination Utilities
 * 
 * Professional KV lock patterns extracted from the AT-03 production system.
 * Provides distributed locking for agent coordination with TTL-based cleanup.
 */

import { z } from 'zod'
import type { ValidationResult } from '@growthub/compiler-core'
import { validateKVLock } from '@growthub/compiler-core'

// KV Lock Metadata Schema
export const KVLockMetadataSchema = z.object({
  lockedAt: z.string().datetime(),
  lockId: z.string().optional(),
  processId: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  expiresAt: z.string().datetime().optional(),
})

export type KVLockMetadata = z.infer<typeof KVLockMetadataSchema>

// KV Store Interface
export interface KVStore {
  get(key: string): Promise<any>
  set(key: string, value: any, options?: { ttl?: number; condition?: 'nx' | 'xx' }): Promise<boolean>
  delete(key: string): Promise<boolean>
}

// In-Memory KV Store Implementation
export class InMemoryKVStore implements KVStore {
  private store = new Map<string, { value: any; expiresAt?: number }>()
  
  async get(key: string): Promise<any> {
    const entry = this.store.get(key)
    if (!entry) return null
    
    // Check if expired
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.store.delete(key)
      return null
    }
    
    return entry.value
  }
  
  async set(key: string, value: any, options?: { ttl?: number; condition?: 'nx' | 'xx' }): Promise<boolean> {
    const existing = this.store.get(key)
    
    // Handle conditional sets
    if (options?.condition === 'nx' && existing && (!existing.expiresAt || Date.now() < existing.expiresAt)) {
      return false // Key exists and not expired
    }
    if (options?.condition === 'xx' && (!existing || (existing.expiresAt && Date.now() > existing.expiresAt))) {
      return false // Key doesn't exist or expired
    }
    
    const entry: { value: any; expiresAt?: number } = { value }
    if (options?.ttl) {
      entry.expiresAt = Date.now() + (options.ttl * 1000)
    }
    
    this.store.set(key, entry)
    return true
  }
  
  async delete(key: string): Promise<boolean> {
    return this.store.delete(key)
  }
}

// Lock Configuration
export interface KVLockConfig {
  ttlSeconds?: number
  metadata?: KVLockMetadata
  keyPrefix?: string
}

export interface AcquireLockOptions {
  ttlSeconds?: number
  metadata?: KVLockMetadata
}

export interface KVLockResult {
  success: boolean
  activeLockMetadata?: KVLockMetadata
  lockKey: string
}

// Default Configuration
export const DEFAULT_LOCK_TTL_SECONDS = 15 * 60 // 15 minutes

/**
 * KV Lock Manager Class
 * Provides distributed locking with automatic TTL cleanup and validation
 */
export class KVLockManager {
  private kv: KVStore
  private defaultTTL: number
  private keyPrefix: string

  constructor(
    kvStore?: KVStore, 
    options: { defaultTTL?: number; keyPrefix?: string } = {}
  ) {
    this.kv = kvStore || new InMemoryKVStore()
    this.defaultTTL = options.defaultTTL || DEFAULT_LOCK_TTL_SECONDS
    this.keyPrefix = options.keyPrefix || 'run'
  }

  /**
   * Generate KV lock key following the singleton pattern
   */
  makeKvLockKey(userId: string, threadId: string): string {
    return `${this.keyPrefix}:${userId}:${threadId}`
  }

  /**
   * Try to acquire a KV lock for a user/thread
   */
  async acquireKvLock(
    userId: string,
    threadId: string,
    options?: AcquireLockOptions
  ): Promise<KVLockResult> {
    const kvKey = this.makeKvLockKey(userId, threadId)
    const ttl = options?.ttlSeconds ?? this.defaultTTL
    
    try {
      // Validate input data
      const validationResult = validateKVLock({
        userId,
        threadId,
        lockKey: kvKey,
        ttl: ttl * 1000, // Convert to ms for validation
        metadata: {
          runId: `${userId}-${threadId}`,
          lockAcquired: Date.now(),
          processId: process.pid?.toString(),
          expiresAt: new Date(Date.now() + ttl * 1000).toISOString()
        }
      })

      if (!validationResult.success) {
        throw new Error(`KV lock validation failed: ${JSON.stringify(validationResult.errors)}`)
      }

      const lockMetadata: KVLockMetadata = options?.metadata ?? {
        lockedAt: new Date().toISOString(),
        lockId: `${userId}-${threadId}-${Date.now()}`,
        processId: process.pid?.toString(),
        expiresAt: new Date(Date.now() + ttl * 1000).toISOString(),
      }
      
      const lockSet = await this.kv.set(kvKey, lockMetadata, {
        ttl,
        condition: 'nx', // Only set if not exists
      })
      
      if (!lockSet) {
        const activeMetadataRaw = await this.kv.get(kvKey)
        const activeLockMetadata = activeMetadataRaw || { lockedAt: 'unknown' }
        return { 
          success: false, 
          activeLockMetadata,
          lockKey: kvKey 
        }
      }
      
      return { 
        success: true,
        lockKey: kvKey
      }
    } catch (error) {
      console.error(`Error acquiring KV lock for key ${kvKey}`, error)
      throw error
    }
  }

  /**
   * Release the KV lock for a user/thread
   */
  async releaseKvLock(userId: string, threadId: string): Promise<boolean> {
    const kvKey = this.makeKvLockKey(userId, threadId)
    
    try {
      return await this.kv.delete(kvKey)
    } catch (error) {
      console.error(`Error releasing KV lock for key ${kvKey}`, error)
      throw error
    }
  }

  /**
   * Check the lock status by returning stored metadata or null if unlocked
   */
  async checkKvLock(
    userId: string,
    threadId: string
  ): Promise<KVLockMetadata | null> {
    const kvKey = this.makeKvLockKey(userId, threadId)
    
    try {
      const data = await this.kv.get(kvKey)
      if (!data) return null
      
      if (typeof data === 'string') {
        try {
          return JSON.parse(data)
        } catch {
          return { lockedAt: 'invalid data' } as KVLockMetadata
        }
      }
      
      return data as KVLockMetadata
    } catch (error) {
      console.error(`Error checking KV lock for key ${kvKey}`, error)
      throw error
    }
  }

  /**
   * Utility function to run code with automatic lock acquisition and release
   */
  async withKvLock<T>(
    userId: string,
    threadId: string,
    operation: () => Promise<T>,
    options?: AcquireLockOptions
  ): Promise<T> {
    const lockResult = await this.acquireKvLock(userId, threadId, options)
    
    if (!lockResult.success) {
      throw new Error(`Failed to acquire lock for user ${userId}, thread ${threadId}. Active lock: ${JSON.stringify(lockResult.activeLockMetadata)}`)
    }
    
    try {
      return await operation()
    } finally {
      await this.releaseKvLock(userId, threadId)
    }
  }
}

// Singleton instance for backward compatibility
export const defaultKVLockManager = new KVLockManager()

/**
 * Convenience functions using the default manager
 */
export const makeKvLockKey = (userId: string, threadId: string) => 
  defaultKVLockManager.makeKvLockKey(userId, threadId)

export const acquireKvLock = (userId: string, threadId: string, options?: AcquireLockOptions) => 
  defaultKVLockManager.acquireKvLock(userId, threadId, options)

export const releaseKvLock = (userId: string, threadId: string) => 
  defaultKVLockManager.releaseKvLock(userId, threadId)

export const checkKvLock = (userId: string, threadId: string) => 
  defaultKVLockManager.checkKvLock(userId, threadId)

export const withKvLock = <T>(
  userId: string, 
  threadId: string, 
  operation: () => Promise<T>, 
  options?: AcquireLockOptions
) => defaultKVLockManager.withKvLock(userId, threadId, operation, options)

/**
 * Validate KV lock metadata using Zod
 */
export function validateKVLockMetadata(data: unknown): ValidationResult<KVLockMetadata> {
  try {
    const validatedData = KVLockMetadataSchema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
          severity: 'error' as const
        }))
      }
    }
    return {
      success: false,
      errors: [{
        field: 'metadata',
        message: 'Unknown validation error',
        code: 'UNKNOWN_ERROR',
        severity: 'error'
      }]
    }
  }
} 