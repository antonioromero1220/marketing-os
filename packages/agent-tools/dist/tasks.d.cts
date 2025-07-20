import { z } from 'zod';
import { CSI } from '@growthub/compiler-core';

/**
 * @growthub/agent-tools/tasks
 * Agent Task Coordination and OpenAI Function Calling Abstractions
 *
 * Professional agent task patterns extracted from the AT-03 production system.
 * Provides simplified abstractions for OpenAI function calling and task coordination.
 */

declare const BaseAgentTaskRequestSchema: z.ZodObject<{
    threadId: z.ZodString;
    userId: z.ZodString;
    agentType: z.ZodEnum<["CONTENT_GENERATION_AGENT", "TEXT_ANALYSIS_AGENT"]>;
    taskSequence: z.ZodNumber;
    previousCSI: z.ZodOptional<z.ZodObject<{
        completedSteps: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        currentProgress: z.ZodDefault<z.ZodNumber>;
        totalSteps: z.ZodDefault<z.ZodNumber>;
        currentStep: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        completedSteps: string[];
        currentProgress: number;
        totalSteps: number;
        currentStep: string;
    }, {
        completedSteps?: string[] | undefined;
        currentProgress?: number | undefined;
        totalSteps?: number | undefined;
        currentStep?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    threadId: string;
    userId: string;
    agentType: "CONTENT_GENERATION_AGENT" | "TEXT_ANALYSIS_AGENT";
    taskSequence: number;
    previousCSI?: {
        completedSteps: string[];
        currentProgress: number;
        totalSteps: number;
        currentStep: string;
    } | undefined;
}, {
    threadId: string;
    userId: string;
    agentType: "CONTENT_GENERATION_AGENT" | "TEXT_ANALYSIS_AGENT";
    taskSequence: number;
    previousCSI?: {
        completedSteps?: string[] | undefined;
        currentProgress?: number | undefined;
        totalSteps?: number | undefined;
        currentStep?: string | undefined;
    } | undefined;
}>;
type BaseAgentTaskRequest = z.infer<typeof BaseAgentTaskRequestSchema>;
interface AgentTaskFunction {
    name: string;
    description: string;
    parameters: {
        type: "object";
        properties: Record<string, any>;
        required: string[];
    };
}
interface AgentTaskResult {
    success: boolean;
    stepResult: {
        step: string;
        [key: string]: any;
    };
    updatedCSI: CSI;
    agentTaskId?: string;
    error?: {
        message: string;
        code: string;
        details?: any;
    };
}
interface AgentTaskConfig {
    taskName: string;
    taskType: 'analysis' | 'image_generation' | 'text_generation' | 'completion';
    apiRoute?: string;
    toolName: string;
    systemPrompt: string;
    userPromptTemplate: (data: any) => string;
    functionDefinition: AgentTaskFunction;
    progressPercent: number;
    modelConfig?: {
        model?: string;
        temperature?: number;
        maxTokens?: number;
        topP?: number;
    };
}
interface OpenAIClient {
    chat: {
        completions: {
            create(params: any): Promise<any>;
        };
    };
}
/**
 * Agent Task Executor Class
 * Handles the complete lifecycle of agent tasks with OpenAI function calling
 */
declare class AgentTaskExecutor {
    private openaiClient;
    private defaultModel;
    private defaultTemperature;
    constructor(openaiClient: OpenAIClient, options?: {
        defaultModel?: string;
        defaultTemperature?: number;
    });
    /**
     * Execute an agent task with OpenAI function calling
     */
    executeAgentTask<T extends BaseAgentTaskRequest>(request: T, taskInput: Record<string, any>, config: AgentTaskConfig): Promise<AgentTaskResult>;
}
/**
 * Predefined Agent Task Configurations
 * Common configurations for different agent task types
 */
declare const AgentTaskConfigs: {
    INTENT_ANALYSIS: {
        taskName: string;
        taskType: "analysis";
        apiRoute: string;
        toolName: string;
        systemPrompt: string;
        userPromptTemplate: (data: any) => string;
        functionDefinition: {
            name: string;
            description: string;
            parameters: {
                type: "object";
                properties: {
                    analysis: {
                        type: string;
                    };
                    conclusion: {
                        type: string;
                    };
                    confidence: {
                        type: string;
                    };
                    inferred_assets: {
                        type: string;
                    };
                    asset_types: {
                        type: string;
                        items: {
                            type: string;
                        };
                    };
                    reasoning_steps: {
                        type: string;
                        items: {
                            type: string;
                        };
                    };
                };
                required: string[];
            };
        };
        progressPercent: number;
    };
    BRAND_ANALYSIS: {
        taskName: string;
        taskType: "analysis";
        apiRoute: string;
        toolName: string;
        systemPrompt: string;
        userPromptTemplate: (data: any) => string;
        functionDefinition: {
            name: string;
            description: string;
            parameters: {
                type: "object";
                properties: {
                    analysis: {
                        type: string;
                    };
                    conclusion: {
                        type: string;
                    };
                    confidence: {
                        type: string;
                    };
                    brand_strength: {
                        type: string;
                        enum: string[];
                    };
                    brand_consistency_score: {
                        type: string;
                    };
                    recommendations: {
                        type: string;
                        items: {
                            type: string;
                        };
                    };
                };
                required: string[];
            };
        };
        progressPercent: number;
    };
    COMPLEXITY_ASSESSMENT: {
        taskName: string;
        taskType: "analysis";
        apiRoute: string;
        toolName: string;
        systemPrompt: string;
        userPromptTemplate: (data: any) => string;
        functionDefinition: {
            name: string;
            description: string;
            parameters: {
                type: "object";
                properties: {
                    analysis: {
                        type: string;
                    };
                    conclusion: {
                        type: string;
                    };
                    confidence: {
                        type: string;
                    };
                    complexity_level: {
                        type: string;
                        enum: string[];
                    };
                    complexity_score: {
                        type: string;
                    };
                    estimated_duration_ms: {
                        type: string;
                    };
                    resource_requirements: {
                        type: string;
                        items: {
                            type: string;
                        };
                    };
                    optimization_suggestions: {
                        type: string;
                        items: {
                            type: string;
                        };
                    };
                };
                required: string[];
            };
        };
        progressPercent: number;
    };
};
/**
 * Task Builder - Fluent interface for building agent tasks
 */
declare class AgentTaskBuilder {
    private config;
    static create(taskName: string): AgentTaskBuilder;
    name(taskName: string): AgentTaskBuilder;
    type(taskType: AgentTaskConfig['taskType']): AgentTaskBuilder;
    route(apiRoute: string): AgentTaskBuilder;
    tool(toolName: string): AgentTaskBuilder;
    systemPrompt(prompt: string): AgentTaskBuilder;
    userPrompt(template: (data: any) => string): AgentTaskBuilder;
    function(definition: AgentTaskFunction): AgentTaskBuilder;
    progress(percent: number): AgentTaskBuilder;
    model(config: AgentTaskConfig['modelConfig']): AgentTaskBuilder;
    build(): AgentTaskConfig;
}
/**
 * Error handling utilities
 */
declare function handleAgentTaskError(error: any, taskName: string): {
    success: boolean;
    error: string;
    details: z.ZodIssue[];
    message?: undefined;
} | {
    success: boolean;
    error: string;
    message: string;
    details?: undefined;
};
/**
 * Validate agent task request
 */
declare function validateAgentTaskRequest(data: unknown): {
    success: boolean;
    data?: BaseAgentTaskRequest;
    errors?: any[];
};
/**
 * Create task helpers using predefined configurations
 */
declare const createTaskHelpers: (executor: AgentTaskExecutor) => {
    createIntentAnalysisTask: (request: BaseAgentTaskRequest & {
        prompt: string;
        brandContext: any;
    }) => Promise<AgentTaskResult>;
    createBrandAnalysisTask: (request: BaseAgentTaskRequest & {
        brandContext: any;
    }) => Promise<AgentTaskResult>;
    createComplexityAssessmentTask: (request: BaseAgentTaskRequest & {
        prompt: string;
        brandContext: any;
        inferredAssets: number;
        brandStrength: string;
    }) => Promise<AgentTaskResult>;
};

export { AgentTaskBuilder, type AgentTaskConfig, AgentTaskConfigs, AgentTaskExecutor, type AgentTaskFunction, type AgentTaskResult, type BaseAgentTaskRequest, BaseAgentTaskRequestSchema, type OpenAIClient, createTaskHelpers, handleAgentTaskError, validateAgentTaskRequest };
