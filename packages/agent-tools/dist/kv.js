/* @growthub/agent-tools - Agent coordination utilities and KV lock management */

// src/kv.ts
import { z } from "zod";
import { validateKVLock } from "@growthub/compiler-core";
var KVLockMetadataSchema = z.object({
  lockedAt: z.string().datetime(),
  lockId: z.string().optional(),
  processId: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  expiresAt: z.string().datetime().optional()
});
var InMemoryKVStore = class {
  constructor() {
    this.store = /* @__PURE__ */ new Map();
  }
  async get(key) {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  }
  async set(key, value, options) {
    const existing = this.store.get(key);
    if (options?.condition === "nx" && existing && (!existing.expiresAt || Date.now() < existing.expiresAt)) {
      return false;
    }
    if (options?.condition === "xx" && (!existing || existing.expiresAt && Date.now() > existing.expiresAt)) {
      return false;
    }
    const entry = { value };
    if (options?.ttl) {
      entry.expiresAt = Date.now() + options.ttl * 1e3;
    }
    this.store.set(key, entry);
    return true;
  }
  async delete(key) {
    return this.store.delete(key);
  }
};
var DEFAULT_LOCK_TTL_SECONDS = 15 * 60;
var KVLockManager = class {
  constructor(kvStore, options = {}) {
    this.kv = kvStore || new InMemoryKVStore();
    this.defaultTTL = options.defaultTTL || DEFAULT_LOCK_TTL_SECONDS;
    this.keyPrefix = options.keyPrefix || "run";
  }
  /**
   * Generate KV lock key following the singleton pattern
   */
  makeKvLockKey(userId, threadId) {
    return `${this.keyPrefix}:${userId}:${threadId}`;
  }
  /**
   * Try to acquire a KV lock for a user/thread
   */
  async acquireKvLock(userId, threadId, options) {
    const kvKey = this.makeKvLockKey(userId, threadId);
    const ttl = options?.ttlSeconds ?? this.defaultTTL;
    try {
      const validationResult = validateKVLock({
        userId,
        threadId,
        lockKey: kvKey,
        ttl: ttl * 1e3,
        // Convert to ms for validation
        metadata: {
          runId: `${userId}-${threadId}`,
          lockAcquired: Date.now(),
          processId: process.pid?.toString(),
          expiresAt: new Date(Date.now() + ttl * 1e3).toISOString()
        }
      });
      if (!validationResult.success) {
        throw new Error(`KV lock validation failed: ${JSON.stringify(validationResult.errors)}`);
      }
      const lockMetadata = options?.metadata ?? {
        lockedAt: (/* @__PURE__ */ new Date()).toISOString(),
        lockId: `${userId}-${threadId}-${Date.now()}`,
        processId: process.pid?.toString(),
        expiresAt: new Date(Date.now() + ttl * 1e3).toISOString()
      };
      const lockSet = await this.kv.set(kvKey, lockMetadata, {
        ttl,
        condition: "nx"
        // Only set if not exists
      });
      if (!lockSet) {
        const activeMetadataRaw = await this.kv.get(kvKey);
        const activeLockMetadata = activeMetadataRaw || { lockedAt: "unknown" };
        return {
          success: false,
          activeLockMetadata,
          lockKey: kvKey
        };
      }
      return {
        success: true,
        lockKey: kvKey
      };
    } catch (error) {
      console.error(`Error acquiring KV lock for key ${kvKey}`, error);
      throw error;
    }
  }
  /**
   * Release the KV lock for a user/thread
   */
  async releaseKvLock(userId, threadId) {
    const kvKey = this.makeKvLockKey(userId, threadId);
    try {
      return await this.kv.delete(kvKey);
    } catch (error) {
      console.error(`Error releasing KV lock for key ${kvKey}`, error);
      throw error;
    }
  }
  /**
   * Check the lock status by returning stored metadata or null if unlocked
   */
  async checkKvLock(userId, threadId) {
    const kvKey = this.makeKvLockKey(userId, threadId);
    try {
      const data = await this.kv.get(kvKey);
      if (!data) return null;
      if (typeof data === "string") {
        try {
          return JSON.parse(data);
        } catch {
          return { lockedAt: "invalid data" };
        }
      }
      return data;
    } catch (error) {
      console.error(`Error checking KV lock for key ${kvKey}`, error);
      throw error;
    }
  }
  /**
   * Utility function to run code with automatic lock acquisition and release
   */
  async withKvLock(userId, threadId, operation, options) {
    const lockResult = await this.acquireKvLock(userId, threadId, options);
    if (!lockResult.success) {
      throw new Error(`Failed to acquire lock for user ${userId}, thread ${threadId}. Active lock: ${JSON.stringify(lockResult.activeLockMetadata)}`);
    }
    try {
      return await operation();
    } finally {
      await this.releaseKvLock(userId, threadId);
    }
  }
};
var defaultKVLockManager = new KVLockManager();
var makeKvLockKey = (userId, threadId) => defaultKVLockManager.makeKvLockKey(userId, threadId);
var acquireKvLock = (userId, threadId, options) => defaultKVLockManager.acquireKvLock(userId, threadId, options);
var releaseKvLock = (userId, threadId) => defaultKVLockManager.releaseKvLock(userId, threadId);
var checkKvLock = (userId, threadId) => defaultKVLockManager.checkKvLock(userId, threadId);
var withKvLock = (userId, threadId, operation, options) => defaultKVLockManager.withKvLock(userId, threadId, operation, options);
function validateKVLockMetadata(data) {
  try {
    const validatedData = KVLockMetadataSchema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
          code: err.code,
          severity: "error"
        }))
      };
    }
    return {
      success: false,
      errors: [{
        field: "metadata",
        message: "Unknown validation error",
        code: "UNKNOWN_ERROR",
        severity: "error"
      }]
    };
  }
}
export {
  DEFAULT_LOCK_TTL_SECONDS,
  InMemoryKVStore,
  KVLockManager,
  KVLockMetadataSchema,
  acquireKvLock,
  checkKvLock,
  defaultKVLockManager,
  makeKvLockKey,
  releaseKvLock,
  validateKVLockMetadata,
  withKvLock
};
//# sourceMappingURL=kv.js.map