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
  isValidEmail: () => isValidEmail,
  isValidHexColor: () => isValidHexColor,
  isValidUrl: () => isValidUrl,
  isValidUuid: () => isValidUuid,
  sanitizeUserInput: () => sanitizeUserInput,
  validateWithSchema: () => validateWithSchema
});
module.exports = __toCommonJS(validation_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  isValidEmail,
  isValidHexColor,
  isValidUrl,
  isValidUuid,
  sanitizeUserInput,
  validateWithSchema
});
//# sourceMappingURL=validation.cjs.map