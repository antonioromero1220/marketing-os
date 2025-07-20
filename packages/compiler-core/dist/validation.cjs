/* @growthub/compiler-core - Core decomposition engine and orchestration logic */
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/validation.ts
var validation_exports = {};
__export(validation_exports, {
  AuthValidationSchema: () => AuthValidationSchema,
  KVLockValidationSchema: () => KVLockValidationSchema,
  PreInitValidationSchema: () => PreInitValidationSchema,
  combineValidationResults: () => combineValidationResults,
  createValidationError: () => createValidationError,
  validateAuth: () => validateAuth,
  validateKVLock: () => validateKVLock,
  validatePreInit: () => validatePreInit,
  validatePrompt: () => validatePrompt,
  validateReferenceImages: () => validateReferenceImages,
  validateThreadId: () => validateThreadId,
  validateUserId: () => validateUserId
});
module.exports = __toCommonJS(validation_exports);
var import_zod = require("zod");
var PreInitValidationSchema = import_zod.z.object({
  userId: import_zod.z.string().uuid("Invalid user ID format"),
  threadId: import_zod.z.string().uuid("Invalid thread ID format"),
  runId: import_zod.z.string().uuid("Invalid run ID format").optional(),
  prompt: import_zod.z.string().min(1, "Prompt cannot be empty").max(2e3, "Prompt too long"),
  brandKitId: import_zod.z.string().uuid("Invalid brand kit ID"),
  agentType: import_zod.z.enum(["CONTENT_GENERATION_AGENT", "TEXT_ANALYSIS_AGENT"]),
  creativeCount: import_zod.z.number().int().min(1).max(10).default(1),
  referenceImages: import_zod.z.array(import_zod.z.object({
    url: import_zod.z.string().url("Invalid reference image URL"),
    type: import_zod.z.string().min(1),
    description: import_zod.z.string().min(1)
  })).max(5, "Too many reference images").default([]),
  executionPriority: import_zod.z.enum(["low", "normal", "high"]).default("normal"),
  maxRetries: import_zod.z.number().int().min(0).max(3).default(1)
});
var KVLockValidationSchema = import_zod.z.object({
  userId: import_zod.z.string().uuid(),
  threadId: import_zod.z.string().uuid(),
  lockKey: import_zod.z.string().min(1),
  ttl: import_zod.z.number().int().positive().default(9e5),
  // 15 minutes
  metadata: import_zod.z.object({
    runId: import_zod.z.string().uuid(),
    lockAcquired: import_zod.z.number().int().positive(),
    processId: import_zod.z.string().optional(),
    expiresAt: import_zod.z.string().datetime().optional()
  })
});
var AuthValidationSchema = import_zod.z.object({
  userId: import_zod.z.string().uuid(),
  hasSession: import_zod.z.boolean(),
  hasToken: import_zod.z.boolean(),
  isAdmin: import_zod.z.boolean().default(false),
  tokenLength: import_zod.z.number().int().positive().optional(),
  sessionCookieFound: import_zod.z.boolean().default(false),
  jwtValid: import_zod.z.boolean().default(false)
});
function validatePreInit(data) {
  const startTime = performance.now();
  try {
    const validatedData = PreInitValidationSchema.parse(data);
    const duration = performance.now() - startTime;
    return {
      success: true,
      data: validatedData,
      metadata: {
        validatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        validationDuration: Math.round(duration),
        validator: "PreInitValidationSchema"
      }
    };
  } catch (error) {
    const duration = performance.now() - startTime;
    if (error instanceof import_zod.z.ZodError) {
      return {
        success: false,
        errors: error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
          code: err.code,
          severity: "error"
        })),
        metadata: {
          validatedAt: (/* @__PURE__ */ new Date()).toISOString(),
          validationDuration: Math.round(duration),
          validator: "PreInitValidationSchema"
        }
      };
    }
    return {
      success: false,
      errors: [{
        field: "unknown",
        message: "Unknown validation error",
        code: "UNKNOWN_ERROR",
        severity: "error"
      }]
    };
  }
}
function validateKVLock(data) {
  const startTime = performance.now();
  try {
    const validatedData = KVLockValidationSchema.parse(data);
    const duration = performance.now() - startTime;
    return {
      success: true,
      data: validatedData,
      metadata: {
        validatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        validationDuration: Math.round(duration),
        validator: "KVLockValidationSchema"
      }
    };
  } catch (error) {
    const duration = performance.now() - startTime;
    if (error instanceof import_zod.z.ZodError) {
      return {
        success: false,
        errors: error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
          code: err.code,
          severity: "error"
        })),
        metadata: {
          validatedAt: (/* @__PURE__ */ new Date()).toISOString(),
          validationDuration: Math.round(duration),
          validator: "KVLockValidationSchema"
        }
      };
    }
    return {
      success: false,
      errors: [{
        field: "unknown",
        message: "KV lock validation failed",
        code: "KV_VALIDATION_ERROR",
        severity: "error"
      }]
    };
  }
}
function validateAuth(data) {
  const startTime = performance.now();
  try {
    const validatedData = AuthValidationSchema.parse(data);
    const duration = performance.now() - startTime;
    const warnings = [];
    if (!validatedData.hasSession && !validatedData.hasToken) {
      warnings.push("No session or token found - authentication may be invalid");
    }
    if (validatedData.hasToken && !validatedData.jwtValid) {
      warnings.push("Token present but JWT validation failed");
    }
    return {
      success: true,
      data: validatedData,
      warnings: warnings.length > 0 ? warnings : void 0,
      metadata: {
        validatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        validationDuration: Math.round(duration),
        validator: "AuthValidationSchema"
      }
    };
  } catch (error) {
    const duration = performance.now() - startTime;
    if (error instanceof import_zod.z.ZodError) {
      return {
        success: false,
        errors: error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
          code: err.code,
          severity: "error"
        })),
        metadata: {
          validatedAt: (/* @__PURE__ */ new Date()).toISOString(),
          validationDuration: Math.round(duration),
          validator: "AuthValidationSchema"
        }
      };
    }
    return {
      success: false,
      errors: [{
        field: "auth",
        message: "Authentication validation failed",
        code: "AUTH_VALIDATION_ERROR",
        severity: "error"
      }]
    };
  }
}
function validateThreadId(threadId) {
  return import_zod.z.string().uuid().safeParse(threadId).success;
}
function validateUserId(userId) {
  return import_zod.z.string().uuid().safeParse(userId).success;
}
function validatePrompt(prompt) {
  try {
    const validatedPrompt = import_zod.z.string().min(1, "Prompt cannot be empty").max(2e3, "Prompt exceeds maximum length").parse(prompt);
    return {
      success: true,
      data: validatedPrompt
    };
  } catch (error) {
    if (error instanceof import_zod.z.ZodError) {
      return {
        success: false,
        errors: error.errors.map((err) => ({
          field: "prompt",
          message: err.message,
          code: err.code,
          severity: "error"
        }))
      };
    }
    return {
      success: false,
      errors: [{
        field: "prompt",
        message: "Invalid prompt format",
        code: "PROMPT_VALIDATION_ERROR",
        severity: "error"
      }]
    };
  }
}
function validateReferenceImages(images) {
  try {
    const schema = import_zod.z.array(import_zod.z.object({
      url: import_zod.z.string().url("Invalid image URL"),
      type: import_zod.z.string().min(1, "Image type required"),
      description: import_zod.z.string().min(1, "Image description required")
    })).max(5, "Maximum 5 reference images allowed");
    const validatedImages = schema.parse(images);
    return {
      success: true,
      data: validatedImages
    };
  } catch (error) {
    if (error instanceof import_zod.z.ZodError) {
      return {
        success: false,
        errors: error.errors.map((err) => ({
          field: `referenceImages.${err.path.join(".")}`,
          message: err.message,
          code: err.code,
          severity: "error"
        }))
      };
    }
    return {
      success: false,
      errors: [{
        field: "referenceImages",
        message: "Reference images validation failed",
        code: "IMAGES_VALIDATION_ERROR",
        severity: "error"
      }]
    };
  }
}
function createValidationError(field, message, code, severity = "error", context) {
  return {
    field,
    message,
    code,
    severity,
    context
  };
}
function combineValidationResults(...results) {
  const allErrors = [];
  const allWarnings = [];
  const allData = [];
  let allSuccessful = true;
  for (const result of results) {
    if (!result.success) {
      allSuccessful = false;
      if (result.errors) {
        allErrors.push(...result.errors);
      }
    } else if (result.data !== void 0) {
      allData.push(result.data);
    }
    if (result.warnings) {
      allWarnings.push(...result.warnings);
    }
  }
  return {
    success: allSuccessful,
    data: allSuccessful ? allData : void 0,
    errors: allErrors.length > 0 ? allErrors : void 0,
    warnings: allWarnings.length > 0 ? allWarnings : void 0,
    metadata: {
      validatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      validationDuration: 0,
      validator: "combined"
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AuthValidationSchema,
  KVLockValidationSchema,
  PreInitValidationSchema,
  combineValidationResults,
  createValidationError,
  validateAuth,
  validateKVLock,
  validatePreInit,
  validatePrompt,
  validateReferenceImages,
  validateThreadId,
  validateUserId
});
//# sourceMappingURL=validation.cjs.map