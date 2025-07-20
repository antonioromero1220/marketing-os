/* @growthub/compiler-core - Core decomposition engine and orchestration logic */

// src/validation.ts
import { z } from "zod";
var PreInitValidationSchema = z.object({
  userId: z.string().uuid("Invalid user ID format"),
  threadId: z.string().uuid("Invalid thread ID format"),
  runId: z.string().uuid("Invalid run ID format").optional(),
  prompt: z.string().min(1, "Prompt cannot be empty").max(2e3, "Prompt too long"),
  brandKitId: z.string().uuid("Invalid brand kit ID"),
  agentType: z.enum(["CONTENT_GENERATION_AGENT", "TEXT_ANALYSIS_AGENT"]),
  creativeCount: z.number().int().min(1).max(10).default(1),
  referenceImages: z.array(z.object({
    url: z.string().url("Invalid reference image URL"),
    type: z.string().min(1),
    description: z.string().min(1)
  })).max(5, "Too many reference images").default([]),
  executionPriority: z.enum(["low", "normal", "high"]).default("normal"),
  maxRetries: z.number().int().min(0).max(3).default(1)
});
var KVLockValidationSchema = z.object({
  userId: z.string().uuid(),
  threadId: z.string().uuid(),
  lockKey: z.string().min(1),
  ttl: z.number().int().positive().default(9e5),
  // 15 minutes
  metadata: z.object({
    runId: z.string().uuid(),
    lockAcquired: z.number().int().positive(),
    processId: z.string().optional(),
    expiresAt: z.string().datetime().optional()
  })
});
var AuthValidationSchema = z.object({
  userId: z.string().uuid(),
  hasSession: z.boolean(),
  hasToken: z.boolean(),
  isAdmin: z.boolean().default(false),
  tokenLength: z.number().int().positive().optional(),
  sessionCookieFound: z.boolean().default(false),
  jwtValid: z.boolean().default(false)
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
    if (error instanceof z.ZodError) {
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
    if (error instanceof z.ZodError) {
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
    if (error instanceof z.ZodError) {
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
  return z.string().uuid().safeParse(threadId).success;
}
function validateUserId(userId) {
  return z.string().uuid().safeParse(userId).success;
}
function validatePrompt(prompt) {
  try {
    const validatedPrompt = z.string().min(1, "Prompt cannot be empty").max(2e3, "Prompt exceeds maximum length").parse(prompt);
    return {
      success: true,
      data: validatedPrompt
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
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
    const schema = z.array(z.object({
      url: z.string().url("Invalid image URL"),
      type: z.string().min(1, "Image type required"),
      description: z.string().min(1, "Image description required")
    })).max(5, "Maximum 5 reference images allowed");
    const validatedImages = schema.parse(images);
    return {
      success: true,
      data: validatedImages
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
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
export {
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
};
//# sourceMappingURL=validation.js.map