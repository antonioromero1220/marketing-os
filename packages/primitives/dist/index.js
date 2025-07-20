// src/validation.ts
function validateWithSchema(schema, data) {
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
        errors: result.error.errors.map((err) => `${err.path.join(".")}: ${err.message}`)
      };
    }
  } catch (error) {
    return {
      success: false,
      errors: [error instanceof Error ? error.message : "Unknown validation error"]
    };
  }
}
function sanitizeUserInput(input) {
  return input.trim().replace(/[<>]/g, "").replace(/javascript:/gi, "").substring(0, 5e3);
}
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
function isValidHexColor(color) {
  const hexRegex = /^#[0-9A-F]{6}$/i;
  return hexRegex.test(color);
}
function isValidUuid(uuid) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

// src/brand.ts
function parseHexColor(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}
function generateColorPalette(baseColor, count = 5) {
  const rgb = parseHexColor(baseColor);
  if (!rgb) return [baseColor];
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const palette = [];
  for (let i = 0; i < count; i++) {
    const lightness = Math.max(10, Math.min(90, hsl.l + (i - Math.floor(count / 2)) * 20));
    const newHsl = { ...hsl, l: lightness };
    palette.push(hslToHex(newHsl.h, newHsl.s, newHsl.l));
  }
  return palette;
}
function hslToHex(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;
  const hue2rgb = (p2, q2, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p2 + (q2 - p2) * 6 * t;
    if (t < 1 / 2) return q2;
    if (t < 2 / 3) return p2 + (q2 - p2) * (2 / 3 - t) * 6;
    return p2;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
  const g = Math.round(hue2rgb(p, q, h) * 255);
  const b = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}
function analyzeBrandVoice(text) {
  const patterns = {
    professional: /\b(solution|expertise|quality|professional|business|enterprise)\b/gi,
    casual: /\b(hey|cool|awesome|great|nice|fun)\b/gi,
    friendly: /\b(welcome|hello|thanks|please|happy|enjoy)\b/gi,
    authoritative: /\b(proven|leader|best|expert|trusted|reliable)\b/gi,
    playful: /\b(amazing|fantastic|exciting|fun|creative|innovative)\b/gi,
    luxurious: /\b(premium|exclusive|elegant|sophisticated|luxury|finest)\b/gi
  };
  let maxScore = 0;
  let dominantTone = "professional";
  Object.entries(patterns).forEach(([tone, pattern]) => {
    const matches = text.match(pattern);
    const score = matches ? matches.length : 0;
    if (score > maxScore) {
      maxScore = score;
      dominantTone = tone;
    }
  });
  const totalWords = text.split(/\s+/).length;
  const confidence = Math.min(1, maxScore / Math.max(1, totalWords * 0.1));
  return {
    tone: dominantTone,
    confidence
  };
}

// src/agent.ts
function isTaskCompleted(status) {
  return ["completed", "failed", "cancelled"].includes(status);
}
function isTaskActive(status) {
  return ["pending", "running"].includes(status);
}
function getTaskProgress(status) {
  const progressMap = {
    pending: 0,
    running: 50,
    completed: 100,
    failed: 100,
    cancelled: 0
  };
  return progressMap[status] ?? 0;
}
function generateRunId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `run_${timestamp}_${random}`;
}
function generateThreadId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 8);
  return `thread_${timestamp}_${random}`;
}
function parseAgentContext(contextStr) {
  try {
    return JSON.parse(contextStr);
  } catch {
    return {};
  }
}
function serializeAgentContext(context) {
  try {
    return JSON.stringify(context, null, 2);
  } catch {
    return "{}";
  }
}
function extractAgentType(input) {
  const runIdMatch = input.match(/agent_([A-Z_]+)/);
  if (runIdMatch) {
    return runIdMatch[1];
  }
  try {
    const parsed = JSON.parse(input);
    return parsed.agentType || null;
  } catch {
    return null;
  }
}
function estimateTaskDuration(taskType, complexity) {
  const baseTimes = {
    "CONTENT_GENERATION_AGENT": 3e4,
    // 30 seconds
    "IMAGE_GENERATION_AGENT": 6e4,
    // 60 seconds
    "EMAIL_MARKETING_AGENT": 45e3,
    // 45 seconds
    "SOCIAL_MEDIA_AGENT": 2e4,
    // 20 seconds
    "BRAND_ANALYSIS_AGENT": 9e4,
    // 90 seconds
    "SEO_OPTIMIZATION_AGENT": 12e4
    // 2 minutes
  };
  const multipliers = {
    low: 0.7,
    medium: 1,
    high: 1.5
  };
  const baseTime = baseTimes[taskType] || 6e4;
  const multiplier = multipliers[complexity];
  return Math.round(baseTime * multiplier);
}
function formatExecutionMetadata(metadata) {
  const entries = Object.entries(metadata).filter(([key]) => !key.startsWith("_")).map(([key, value]) => {
    const formattedKey = key.replace(/([A-Z])/g, " $1").toLowerCase().trim();
    const formattedValue = typeof value === "object" ? JSON.stringify(value) : String(value);
    return `${formattedKey}: ${formattedValue}`;
  });
  return entries.join("\n");
}

// src/utils.ts
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1e3) {
  let lastError = null;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt === maxRetries) {
        throw lastError;
      }
      const delay = baseDelay * Math.pow(2, attempt);
      await sleep(delay);
    }
  }
  throw lastError;
}
function debounce(func, wait) {
  let timeout = null;
  return (...args) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}
function throttle(func, limit) {
  let inThrottle = false;
  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
function deepClone(obj) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item));
  }
  if (typeof obj === "object") {
    const cloned = {};
    Object.keys(obj).forEach((key) => {
      cloned[key] = deepClone(obj[key]);
    });
    return cloned;
  }
  return obj;
}
function deepEqual(a, b) {
  if (a === b) return true;
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }
  if (!a || !b || typeof a !== "object" && typeof b !== "object") {
    return a === b;
  }
  if (a === null || a === void 0 || b === null || b === void 0) {
    return false;
  }
  if (a.constructor !== b.constructor) return false;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) {
    return false;
  }
  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqual(
      a[key],
      b[key]
    )) {
      return false;
    }
  }
  return true;
}
function camelToSnake(str) {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}
function snakeToCamel(str) {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
function randomString(length = 10) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
function truncateText(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength - 3) + "...";
}
function isBrowser() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}
function isNode() {
  return typeof process !== "undefined" && process.versions?.node !== void 0;
}

// src/index.ts
var PRIMITIVES_VERSION = "1.0.0";
var packageInfo = {
  name: "@growthub/primitives",
  version: PRIMITIVES_VERSION,
  description: "Stateless utility functions and primitives for the Growthub Marketing OS",
  license: "MIT"
};
export {
  PRIMITIVES_VERSION,
  analyzeBrandVoice,
  camelToSnake,
  debounce,
  deepClone,
  deepEqual,
  estimateTaskDuration,
  extractAgentType,
  formatBytes,
  formatExecutionMetadata,
  generateColorPalette,
  generateRunId,
  generateThreadId,
  getTaskProgress,
  isBrowser,
  isNode,
  isTaskActive,
  isTaskCompleted,
  isValidEmail,
  isValidHexColor,
  isValidUrl,
  isValidUuid,
  packageInfo,
  parseAgentContext,
  parseHexColor,
  randomString,
  retryWithBackoff,
  rgbToHsl,
  sanitizeUserInput,
  serializeAgentContext,
  sleep,
  snakeToCamel,
  throttle,
  truncateText,
  validateWithSchema
};
/**
 * @growthub/primitives - Growthub Marketing OS Primitives
 * 
 * Stateless utility functions and primitives for the Growthub Marketing OS.
 * These utilities contain no business logic and are perfect for open-source distribution.
 * 
 * @license MIT
 * @version 1.0.0
 */
//# sourceMappingURL=index.js.map