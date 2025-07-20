export { ValidationResult, isValidEmail, isValidHexColor, isValidUrl, isValidUuid, sanitizeUserInput, validateWithSchema } from './validation.cjs';
export { analyzeBrandVoice, generateColorPalette, parseHexColor, rgbToHsl } from './brand.cjs';
export { AgentTaskStatus, estimateTaskDuration, extractAgentType, formatExecutionMetadata, generateRunId, generateThreadId, getTaskProgress, isTaskActive, isTaskCompleted, parseAgentContext, serializeAgentContext } from './agent.cjs';
export { camelToSnake, debounce, deepClone, deepEqual, formatBytes, isBrowser, isNode, randomString, retryWithBackoff, sleep, snakeToCamel, throttle, truncateText } from './utils.cjs';
import 'zod';

/**
 * @growthub/primitives - Growthub Marketing OS Primitives
 *
 * Stateless utility functions and primitives for the Growthub Marketing OS.
 * These utilities contain no business logic and are perfect for open-source distribution.
 *
 * @license MIT
 * @version 1.0.0
 */

declare const PRIMITIVES_VERSION = "1.0.0";
declare const packageInfo: {
    readonly name: "@growthub/primitives";
    readonly version: "1.0.0";
    readonly description: "Stateless utility functions and primitives for the Growthub Marketing OS";
    readonly license: "MIT";
};

export { PRIMITIVES_VERSION, packageInfo };
