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

// src/utils.ts
var utils_exports = {};
__export(utils_exports, {
  camelToSnake: () => camelToSnake,
  debounce: () => debounce,
  deepClone: () => deepClone,
  deepEqual: () => deepEqual,
  formatBytes: () => formatBytes,
  isBrowser: () => isBrowser,
  isNode: () => isNode,
  randomString: () => randomString,
  retryWithBackoff: () => retryWithBackoff,
  sleep: () => sleep,
  snakeToCamel: () => snakeToCamel,
  throttle: () => throttle,
  truncateText: () => truncateText
});
module.exports = __toCommonJS(utils_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  camelToSnake,
  debounce,
  deepClone,
  deepEqual,
  formatBytes,
  isBrowser,
  isNode,
  randomString,
  retryWithBackoff,
  sleep,
  snakeToCamel,
  throttle,
  truncateText
});
//# sourceMappingURL=utils.cjs.map