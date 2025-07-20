import { z } from 'zod';

/**
 * @growthub/compiler-core/decomposition
 * Core decomposition engine patterns and utilities
 */

declare const DecompositionEventSchema: z.ZodObject<{
    threadId: z.ZodString;
    userId: z.ZodString;
    agentType: z.ZodEnum<["CONTENT_GENERATION_AGENT", "TEXT_ANALYSIS_AGENT"]>;
    prompt: z.ZodString;
    context: z.ZodObject<{
        brandKit: z.ZodObject<{
            id: z.ZodString;
            brand_name: z.ZodString;
            colors: z.ZodOptional<z.ZodObject<{
                primary: z.ZodOptional<z.ZodString>;
                secondary: z.ZodOptional<z.ZodString>;
                accent: z.ZodOptional<z.ZodString>;
                neutral: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                primary?: string | undefined;
                secondary?: string | undefined;
                accent?: string | undefined;
                neutral?: string | undefined;
            }, {
                primary?: string | undefined;
                secondary?: string | undefined;
                accent?: string | undefined;
                neutral?: string | undefined;
            }>>;
            messaging: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            brand_name: string;
            colors?: {
                primary?: string | undefined;
                secondary?: string | undefined;
                accent?: string | undefined;
                neutral?: string | undefined;
            } | undefined;
            messaging?: string | undefined;
        }, {
            id: string;
            brand_name: string;
            colors?: {
                primary?: string | undefined;
                secondary?: string | undefined;
                accent?: string | undefined;
                neutral?: string | undefined;
            } | undefined;
            messaging?: string | undefined;
        }>;
        referenceImages: z.ZodDefault<z.ZodArray<z.ZodObject<{
            url: z.ZodString;
            type: z.ZodString;
            description: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            type: string;
            url: string;
            description: string;
        }, {
            type: string;
            url: string;
            description: string;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        brandKit: {
            id: string;
            brand_name: string;
            colors?: {
                primary?: string | undefined;
                secondary?: string | undefined;
                accent?: string | undefined;
                neutral?: string | undefined;
            } | undefined;
            messaging?: string | undefined;
        };
        referenceImages: {
            type: string;
            url: string;
            description: string;
        }[];
    }, {
        brandKit: {
            id: string;
            brand_name: string;
            colors?: {
                primary?: string | undefined;
                secondary?: string | undefined;
                accent?: string | undefined;
                neutral?: string | undefined;
            } | undefined;
            messaging?: string | undefined;
        };
        referenceImages?: {
            type: string;
            url: string;
            description: string;
        }[] | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    threadId: string;
    userId: string;
    agentType: "CONTENT_GENERATION_AGENT" | "TEXT_ANALYSIS_AGENT";
    prompt: string;
    context: {
        brandKit: {
            id: string;
            brand_name: string;
            colors?: {
                primary?: string | undefined;
                secondary?: string | undefined;
                accent?: string | undefined;
                neutral?: string | undefined;
            } | undefined;
            messaging?: string | undefined;
        };
        referenceImages: {
            type: string;
            url: string;
            description: string;
        }[];
    };
}, {
    threadId: string;
    userId: string;
    agentType: "CONTENT_GENERATION_AGENT" | "TEXT_ANALYSIS_AGENT";
    prompt: string;
    context: {
        brandKit: {
            id: string;
            brand_name: string;
            colors?: {
                primary?: string | undefined;
                secondary?: string | undefined;
                accent?: string | undefined;
                neutral?: string | undefined;
            } | undefined;
            messaging?: string | undefined;
        };
        referenceImages?: {
            type: string;
            url: string;
            description: string;
        }[] | undefined;
    };
}>;
type DecompositionEvent = z.infer<typeof DecompositionEventSchema>;
declare const decompositionStructuredOutput: {
    type: "json_schema";
    json_schema: {
        name: string;
        strict: boolean;
        schema: {
            type: string;
            properties: {
                threadId: {
                    type: string;
                    format: string;
                };
                userId: {
                    type: string;
                    minLength: number;
                };
                agentType: {
                    type: string;
                    enum: string[];
                };
                prompt: {
                    type: string;
                    minLength: number;
                };
                context: {
                    type: string;
                    properties: {
                        brandKit: {
                            type: string;
                            properties: {
                                id: {
                                    type: string;
                                };
                                brand_name: {
                                    type: string;
                                };
                                colors: {
                                    type: string;
                                    properties: {
                                        primary: {
                                            type: string;
                                        };
                                        secondary: {
                                            type: string;
                                        };
                                        accent: {
                                            type: string;
                                        };
                                        neutral: {
                                            type: string;
                                        };
                                    };
                                    required: string[];
                                    additionalProperties: boolean;
                                };
                                messaging: {
                                    type: string;
                                };
                            };
                            required: string[];
                            additionalProperties: boolean;
                        };
                        referenceImages: {
                            type: string;
                            items: {
                                type: string;
                                properties: {
                                    url: {
                                        type: string;
                                    };
                                    type: {
                                        type: string;
                                    };
                                    description: {
                                        type: string;
                                    };
                                };
                                required: string[];
                                additionalProperties: boolean;
                            };
                        };
                    };
                    required: string[];
                    additionalProperties: boolean;
                };
            };
            required: string[];
            additionalProperties: boolean;
        };
    };
};
interface DecompositionResult {
    threadId: string;
    userId: string;
    agentType: 'CONTENT_GENERATION_AGENT' | 'TEXT_ANALYSIS_AGENT';
    steps: DecompositionStep[];
    metadata: {
        startedAt: string;
        completedAt?: string;
        duration?: number;
        status: 'pending' | 'running' | 'completed' | 'failed';
    };
}
interface DecompositionStep {
    stepName: string;
    stepType: 'analysis' | 'planning' | 'coordination' | 'execution';
    status: 'pending' | 'running' | 'completed' | 'failed';
    result?: any;
    metadata?: Record<string, any>;
    timestamp: string;
}
interface BrandContext {
    brand_name: string;
    colors: string[];
    messaging: string | null;
    referenceImages: Array<{
        url: string;
        type: string;
        description: string;
    }>;
}
/**
 * Transform context from DecompositionEvent to BrandContext format
 */
declare function transformBrandContext(context: DecompositionEvent['context']): BrandContext;
/**
 * Validate decomposition event data with Zod
 */
declare function validateDecompositionEvent(data: unknown): DecompositionEvent;
/**
 * Create decomposition step metadata
 */
declare function createDecompositionStep(stepName: string, stepType: DecompositionStep['stepType'], metadata?: Record<string, any>): DecompositionStep;
/**
 * Update decomposition step status
 */
declare function updateDecompositionStep(step: DecompositionStep, status: DecompositionStep['status'], result?: any, metadata?: Record<string, any>): DecompositionStep;
/**
 * Calculate decomposition progress percentage
 */
declare function calculateDecompositionProgress(steps: DecompositionStep[]): number;
/**
 * Check if decomposition is complete
 */
declare function isDecompositionComplete(steps: DecompositionStep[]): boolean;
/**
 * Get current decomposition step
 */
declare function getCurrentDecompositionStep(steps: DecompositionStep[]): DecompositionStep | null;

export { type BrandContext, type DecompositionEvent, DecompositionEventSchema, type DecompositionResult, type DecompositionStep, calculateDecompositionProgress, createDecompositionStep, decompositionStructuredOutput, getCurrentDecompositionStep, isDecompositionComplete, transformBrandContext, updateDecompositionStep, validateDecompositionEvent };
