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
export {
  isValidEmail,
  isValidHexColor,
  isValidUrl,
  isValidUuid,
  sanitizeUserInput,
  validateWithSchema
};
//# sourceMappingURL=validation.js.map