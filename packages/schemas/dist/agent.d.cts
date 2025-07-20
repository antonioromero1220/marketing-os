import { z } from 'zod';

/**
 * @growthub/schemas - Agent Task & Execution Schemas
 *
 * Pure Zod schemas for agent task management, execution tracking, and metadata.
 * These schemas are stateless and contain no business logic - perfect for OSS.
 */

declare const AgentTypeSchema: z.ZodEnum<["CONTENT_GENERATION_AGENT", "TEXT_ANALYSIS_AGENT", "IMAGE_ANALYSIS_AGENT", "SOCIAL_MEDIA_AGENT", "EMAIL_MARKETING_AGENT", "SEO_OPTIMIZATION_AGENT", "BRAND_ANALYSIS_AGENT", "COMPETITOR_ANALYSIS_AGENT"]>;
type AgentType = z.infer<typeof AgentTypeSchema>;
declare const AgentTaskStatusSchema: z.ZodEnum<["PENDING", "RUNNING", "COMPLETED", "FAILED", "CANCELLED"]>;
declare const AgentTaskTypeSchema: z.ZodEnum<["api_call", "image_generation", "text_generation", "analysis", "completion", "decomposition", "orchestration"]>;
declare const AgentTaskSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    user_id: z.ZodString;
    thread_id: z.ZodString;
    autopilot_chat_id: z.ZodOptional<z.ZodString>;
    agent_job_id: z.ZodOptional<z.ZodString>;
    task_name: z.ZodString;
    task_type: z.ZodEnum<["api_call", "image_generation", "text_generation", "analysis", "completion", "decomposition", "orchestration"]>;
    task_sequence: z.ZodNumber;
    api_route: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodEnum<["PENDING", "RUNNING", "COMPLETED", "FAILED", "CANCELLED"]>>;
    started_at: z.ZodOptional<z.ZodString>;
    completed_at: z.ZodOptional<z.ZodString>;
    duration_ms: z.ZodOptional<z.ZodNumber>;
    task_input: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    task_output: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    error_details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    is_actively_running: z.ZodDefault<z.ZodBoolean>;
    rendering_metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    streaming_metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    created_at: z.ZodOptional<z.ZodString>;
    updated_at: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED" | "CANCELLED";
    user_id: string;
    thread_id: string;
    task_name: string;
    task_type: "api_call" | "image_generation" | "text_generation" | "analysis" | "completion" | "decomposition" | "orchestration";
    task_sequence: number;
    is_actively_running: boolean;
    id?: string | undefined;
    autopilot_chat_id?: string | undefined;
    agent_job_id?: string | undefined;
    api_route?: string | undefined;
    started_at?: string | undefined;
    completed_at?: string | undefined;
    duration_ms?: number | undefined;
    task_input?: Record<string, unknown> | undefined;
    task_output?: Record<string, unknown> | undefined;
    error_details?: Record<string, unknown> | undefined;
    rendering_metadata?: Record<string, unknown> | undefined;
    streaming_metadata?: Record<string, unknown> | undefined;
    created_at?: string | undefined;
    updated_at?: string | undefined;
}, {
    user_id: string;
    thread_id: string;
    task_name: string;
    task_type: "api_call" | "image_generation" | "text_generation" | "analysis" | "completion" | "decomposition" | "orchestration";
    task_sequence: number;
    status?: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED" | "CANCELLED" | undefined;
    id?: string | undefined;
    autopilot_chat_id?: string | undefined;
    agent_job_id?: string | undefined;
    api_route?: string | undefined;
    started_at?: string | undefined;
    completed_at?: string | undefined;
    duration_ms?: number | undefined;
    task_input?: Record<string, unknown> | undefined;
    task_output?: Record<string, unknown> | undefined;
    error_details?: Record<string, unknown> | undefined;
    is_actively_running?: boolean | undefined;
    rendering_metadata?: Record<string, unknown> | undefined;
    streaming_metadata?: Record<string, unknown> | undefined;
    created_at?: string | undefined;
    updated_at?: string | undefined;
}>;
type AgentTask = z.infer<typeof AgentTaskSchema>;
type AgentTaskStatus = z.infer<typeof AgentTaskStatusSchema>;
type AgentTaskType = z.infer<typeof AgentTaskTypeSchema>;
declare const CSISchema: z.ZodObject<{
    completedSteps: z.ZodArray<z.ZodString, "many">;
    currentProgress: z.ZodNumber;
    totalSteps: z.ZodNumber;
    currentStep: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    completedSteps: string[];
    currentProgress: number;
    totalSteps: number;
    currentStep?: string | undefined;
}, {
    completedSteps: string[];
    currentProgress: number;
    totalSteps: number;
    currentStep?: string | undefined;
}>;
declare const AgentContextSchema: z.ZodObject<{
    userId: z.ZodString;
    threadId: z.ZodString;
    runId: z.ZodOptional<z.ZodString>;
    agentType: z.ZodEnum<["CONTENT_GENERATION_AGENT", "TEXT_ANALYSIS_AGENT", "IMAGE_ANALYSIS_AGENT", "SOCIAL_MEDIA_AGENT", "EMAIL_MARKETING_AGENT", "SEO_OPTIMIZATION_AGENT", "BRAND_ANALYSIS_AGENT", "COMPETITOR_ANALYSIS_AGENT"]>;
    taskSequence: z.ZodNumber;
    previousCSI: z.ZodOptional<z.ZodObject<{
        completedSteps: z.ZodArray<z.ZodString, "many">;
        currentProgress: z.ZodNumber;
        totalSteps: z.ZodNumber;
        currentStep: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        completedSteps: string[];
        currentProgress: number;
        totalSteps: number;
        currentStep?: string | undefined;
    }, {
        completedSteps: string[];
        currentProgress: number;
        totalSteps: number;
        currentStep?: string | undefined;
    }>>;
    brandContext: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    executionMetadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    userId: string;
    threadId: string;
    agentType: "CONTENT_GENERATION_AGENT" | "TEXT_ANALYSIS_AGENT" | "IMAGE_ANALYSIS_AGENT" | "SOCIAL_MEDIA_AGENT" | "EMAIL_MARKETING_AGENT" | "SEO_OPTIMIZATION_AGENT" | "BRAND_ANALYSIS_AGENT" | "COMPETITOR_ANALYSIS_AGENT";
    taskSequence: number;
    runId?: string | undefined;
    previousCSI?: {
        completedSteps: string[];
        currentProgress: number;
        totalSteps: number;
        currentStep?: string | undefined;
    } | undefined;
    brandContext?: Record<string, unknown> | undefined;
    executionMetadata?: Record<string, unknown> | undefined;
}, {
    userId: string;
    threadId: string;
    agentType: "CONTENT_GENERATION_AGENT" | "TEXT_ANALYSIS_AGENT" | "IMAGE_ANALYSIS_AGENT" | "SOCIAL_MEDIA_AGENT" | "EMAIL_MARKETING_AGENT" | "SEO_OPTIMIZATION_AGENT" | "BRAND_ANALYSIS_AGENT" | "COMPETITOR_ANALYSIS_AGENT";
    taskSequence: number;
    runId?: string | undefined;
    previousCSI?: {
        completedSteps: string[];
        currentProgress: number;
        totalSteps: number;
        currentStep?: string | undefined;
    } | undefined;
    brandContext?: Record<string, unknown> | undefined;
    executionMetadata?: Record<string, unknown> | undefined;
}>;
type CSI = z.infer<typeof CSISchema>;
type AgentContext = z.infer<typeof AgentContextSchema>;
declare const AgentStepMetadataSchema: z.ZodObject<{
    step: z.ZodString;
    stepNumber: z.ZodNumber;
    totalSteps: z.ZodNumber;
    agentType: z.ZodEnum<["CONTENT_GENERATION_AGENT", "TEXT_ANALYSIS_AGENT", "IMAGE_ANALYSIS_AGENT", "SOCIAL_MEDIA_AGENT", "EMAIL_MARKETING_AGENT", "SEO_OPTIMIZATION_AGENT", "BRAND_ANALYSIS_AGENT", "COMPETITOR_ANALYSIS_AGENT"]>;
    toolName: z.ZodString;
    status: z.ZodEnum<["pending", "running", "completed", "failed"]>;
    progress: z.ZodNumber;
    timestamp: z.ZodOptional<z.ZodString>;
    executionTime: z.ZodOptional<z.ZodNumber>;
    assets: z.ZodOptional<z.ZodArray<z.ZodObject<{
        type: z.ZodString;
        url: z.ZodString;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        type: string;
        url: string;
        metadata?: Record<string, unknown> | undefined;
    }, {
        type: string;
        url: string;
        metadata?: Record<string, unknown> | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    status: "pending" | "running" | "completed" | "failed";
    totalSteps: number;
    agentType: "CONTENT_GENERATION_AGENT" | "TEXT_ANALYSIS_AGENT" | "IMAGE_ANALYSIS_AGENT" | "SOCIAL_MEDIA_AGENT" | "EMAIL_MARKETING_AGENT" | "SEO_OPTIMIZATION_AGENT" | "BRAND_ANALYSIS_AGENT" | "COMPETITOR_ANALYSIS_AGENT";
    step: string;
    stepNumber: number;
    toolName: string;
    progress: number;
    timestamp?: string | undefined;
    executionTime?: number | undefined;
    assets?: {
        type: string;
        url: string;
        metadata?: Record<string, unknown> | undefined;
    }[] | undefined;
}, {
    status: "pending" | "running" | "completed" | "failed";
    totalSteps: number;
    agentType: "CONTENT_GENERATION_AGENT" | "TEXT_ANALYSIS_AGENT" | "IMAGE_ANALYSIS_AGENT" | "SOCIAL_MEDIA_AGENT" | "EMAIL_MARKETING_AGENT" | "SEO_OPTIMIZATION_AGENT" | "BRAND_ANALYSIS_AGENT" | "COMPETITOR_ANALYSIS_AGENT";
    step: string;
    stepNumber: number;
    toolName: string;
    progress: number;
    timestamp?: string | undefined;
    executionTime?: number | undefined;
    assets?: {
        type: string;
        url: string;
        metadata?: Record<string, unknown> | undefined;
    }[] | undefined;
}>;
declare const ThreadExecutionStatusSchema: z.ZodObject<{
    threadId: z.ZodString;
    userId: z.ZodString;
    status: z.ZodEnum<["idle", "running", "completed", "failed"]>;
    currentStep: z.ZodOptional<z.ZodString>;
    totalSteps: z.ZodOptional<z.ZodNumber>;
    completedSteps: z.ZodOptional<z.ZodNumber>;
    progress: z.ZodOptional<z.ZodNumber>;
    startedAt: z.ZodOptional<z.ZodString>;
    completedAt: z.ZodOptional<z.ZodString>;
    error: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    status: "running" | "completed" | "failed" | "idle";
    userId: string;
    threadId: string;
    completedSteps?: number | undefined;
    totalSteps?: number | undefined;
    currentStep?: string | undefined;
    progress?: number | undefined;
    metadata?: Record<string, unknown> | undefined;
    startedAt?: string | undefined;
    completedAt?: string | undefined;
    error?: string | undefined;
}, {
    status: "running" | "completed" | "failed" | "idle";
    userId: string;
    threadId: string;
    completedSteps?: number | undefined;
    totalSteps?: number | undefined;
    currentStep?: string | undefined;
    progress?: number | undefined;
    metadata?: Record<string, unknown> | undefined;
    startedAt?: string | undefined;
    completedAt?: string | undefined;
    error?: string | undefined;
}>;
type AgentStepMetadata = z.infer<typeof AgentStepMetadataSchema>;
type ThreadExecutionStatus = z.infer<typeof ThreadExecutionStatusSchema>;
declare const CreateAgentTaskSchema: z.ZodObject<{
    user_id: z.ZodString;
    thread_id: z.ZodString;
    autopilot_chat_id: z.ZodOptional<z.ZodString>;
    agent_job_id: z.ZodOptional<z.ZodString>;
    api_route: z.ZodOptional<z.ZodString>;
} & {
    task_name: z.ZodString;
    task_type: z.ZodEnum<["api_call", "image_generation", "text_generation", "analysis", "completion", "decomposition", "orchestration"]>;
    task_sequence: z.ZodNumber;
    task_input: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    rendering_metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    streaming_metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    user_id: string;
    thread_id: string;
    task_name: string;
    task_type: "api_call" | "image_generation" | "text_generation" | "analysis" | "completion" | "decomposition" | "orchestration";
    task_sequence: number;
    autopilot_chat_id?: string | undefined;
    agent_job_id?: string | undefined;
    api_route?: string | undefined;
    task_input?: Record<string, unknown> | undefined;
    rendering_metadata?: Record<string, unknown> | undefined;
    streaming_metadata?: Record<string, unknown> | undefined;
}, {
    user_id: string;
    thread_id: string;
    task_name: string;
    task_type: "api_call" | "image_generation" | "text_generation" | "analysis" | "completion" | "decomposition" | "orchestration";
    task_sequence: number;
    autopilot_chat_id?: string | undefined;
    agent_job_id?: string | undefined;
    api_route?: string | undefined;
    task_input?: Record<string, unknown> | undefined;
    rendering_metadata?: Record<string, unknown> | undefined;
    streaming_metadata?: Record<string, unknown> | undefined;
}>;
declare const UpdateAgentTaskSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<["PENDING", "RUNNING", "COMPLETED", "FAILED", "CANCELLED"]>>;
    task_output: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    error_details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    rendering_metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    streaming_metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    is_actively_running: z.ZodOptional<z.ZodBoolean>;
    completed_at: z.ZodOptional<z.ZodString>;
    duration_ms: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    status?: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED" | "CANCELLED" | undefined;
    completed_at?: string | undefined;
    duration_ms?: number | undefined;
    task_output?: Record<string, unknown> | undefined;
    error_details?: Record<string, unknown> | undefined;
    is_actively_running?: boolean | undefined;
    rendering_metadata?: Record<string, unknown> | undefined;
    streaming_metadata?: Record<string, unknown> | undefined;
}, {
    status?: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED" | "CANCELLED" | undefined;
    completed_at?: string | undefined;
    duration_ms?: number | undefined;
    task_output?: Record<string, unknown> | undefined;
    error_details?: Record<string, unknown> | undefined;
    is_actively_running?: boolean | undefined;
    rendering_metadata?: Record<string, unknown> | undefined;
    streaming_metadata?: Record<string, unknown> | undefined;
}>;
type CreateAgentTask = z.infer<typeof CreateAgentTaskSchema>;
type UpdateAgentTask = z.infer<typeof UpdateAgentTaskSchema>;
declare const AgentFunctionDefinitionSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    parameters: z.ZodObject<{
        type: z.ZodLiteral<"object">;
        properties: z.ZodRecord<z.ZodString, z.ZodUnknown>;
        required: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        type: "object";
        properties: Record<string, unknown>;
        required: string[];
    }, {
        type: "object";
        properties: Record<string, unknown>;
        required: string[];
    }>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    parameters: {
        type: "object";
        properties: Record<string, unknown>;
        required: string[];
    };
}, {
    name: string;
    description: string;
    parameters: {
        type: "object";
        properties: Record<string, unknown>;
        required: string[];
    };
}>;
declare const AgentToolConfigSchema: z.ZodObject<{
    taskName: z.ZodString;
    taskType: z.ZodEnum<["api_call", "image_generation", "text_generation", "analysis", "completion", "decomposition", "orchestration"]>;
    apiRoute: z.ZodString;
    toolName: z.ZodString;
    progressPercent: z.ZodNumber;
    functionDefinition: z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
        parameters: z.ZodObject<{
            type: z.ZodLiteral<"object">;
            properties: z.ZodRecord<z.ZodString, z.ZodUnknown>;
            required: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            type: "object";
            properties: Record<string, unknown>;
            required: string[];
        }, {
            type: "object";
            properties: Record<string, unknown>;
            required: string[];
        }>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        description: string;
        parameters: {
            type: "object";
            properties: Record<string, unknown>;
            required: string[];
        };
    }, {
        name: string;
        description: string;
        parameters: {
            type: "object";
            properties: Record<string, unknown>;
            required: string[];
        };
    }>;
    systemPrompt: z.ZodString;
    userPromptTemplate: z.ZodFunction<z.ZodTuple<[z.ZodRecord<z.ZodString, z.ZodUnknown>], z.ZodUnknown>, z.ZodString>;
}, "strip", z.ZodTypeAny, {
    toolName: string;
    taskName: string;
    taskType: "api_call" | "image_generation" | "text_generation" | "analysis" | "completion" | "decomposition" | "orchestration";
    apiRoute: string;
    progressPercent: number;
    functionDefinition: {
        name: string;
        description: string;
        parameters: {
            type: "object";
            properties: Record<string, unknown>;
            required: string[];
        };
    };
    systemPrompt: string;
    userPromptTemplate: (args_0: Record<string, unknown>, ...args: unknown[]) => string;
}, {
    toolName: string;
    taskName: string;
    taskType: "api_call" | "image_generation" | "text_generation" | "analysis" | "completion" | "decomposition" | "orchestration";
    apiRoute: string;
    progressPercent: number;
    functionDefinition: {
        name: string;
        description: string;
        parameters: {
            type: "object";
            properties: Record<string, unknown>;
            required: string[];
        };
    };
    systemPrompt: string;
    userPromptTemplate: (args_0: Record<string, unknown>, ...args: unknown[]) => string;
}>;
type AgentFunctionDefinition = z.infer<typeof AgentFunctionDefinitionSchema>;
type AgentToolConfig = z.infer<typeof AgentToolConfigSchema>;
declare const agentSchemas: {
    readonly AgentTypeSchema: z.ZodEnum<["CONTENT_GENERATION_AGENT", "TEXT_ANALYSIS_AGENT", "IMAGE_ANALYSIS_AGENT", "SOCIAL_MEDIA_AGENT", "EMAIL_MARKETING_AGENT", "SEO_OPTIMIZATION_AGENT", "BRAND_ANALYSIS_AGENT", "COMPETITOR_ANALYSIS_AGENT"]>;
    readonly AgentTaskSchema: z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        user_id: z.ZodString;
        thread_id: z.ZodString;
        autopilot_chat_id: z.ZodOptional<z.ZodString>;
        agent_job_id: z.ZodOptional<z.ZodString>;
        task_name: z.ZodString;
        task_type: z.ZodEnum<["api_call", "image_generation", "text_generation", "analysis", "completion", "decomposition", "orchestration"]>;
        task_sequence: z.ZodNumber;
        api_route: z.ZodOptional<z.ZodString>;
        status: z.ZodDefault<z.ZodEnum<["PENDING", "RUNNING", "COMPLETED", "FAILED", "CANCELLED"]>>;
        started_at: z.ZodOptional<z.ZodString>;
        completed_at: z.ZodOptional<z.ZodString>;
        duration_ms: z.ZodOptional<z.ZodNumber>;
        task_input: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        task_output: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        error_details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        is_actively_running: z.ZodDefault<z.ZodBoolean>;
        rendering_metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        streaming_metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        created_at: z.ZodOptional<z.ZodString>;
        updated_at: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED" | "CANCELLED";
        user_id: string;
        thread_id: string;
        task_name: string;
        task_type: "api_call" | "image_generation" | "text_generation" | "analysis" | "completion" | "decomposition" | "orchestration";
        task_sequence: number;
        is_actively_running: boolean;
        id?: string | undefined;
        autopilot_chat_id?: string | undefined;
        agent_job_id?: string | undefined;
        api_route?: string | undefined;
        started_at?: string | undefined;
        completed_at?: string | undefined;
        duration_ms?: number | undefined;
        task_input?: Record<string, unknown> | undefined;
        task_output?: Record<string, unknown> | undefined;
        error_details?: Record<string, unknown> | undefined;
        rendering_metadata?: Record<string, unknown> | undefined;
        streaming_metadata?: Record<string, unknown> | undefined;
        created_at?: string | undefined;
        updated_at?: string | undefined;
    }, {
        user_id: string;
        thread_id: string;
        task_name: string;
        task_type: "api_call" | "image_generation" | "text_generation" | "analysis" | "completion" | "decomposition" | "orchestration";
        task_sequence: number;
        status?: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED" | "CANCELLED" | undefined;
        id?: string | undefined;
        autopilot_chat_id?: string | undefined;
        agent_job_id?: string | undefined;
        api_route?: string | undefined;
        started_at?: string | undefined;
        completed_at?: string | undefined;
        duration_ms?: number | undefined;
        task_input?: Record<string, unknown> | undefined;
        task_output?: Record<string, unknown> | undefined;
        error_details?: Record<string, unknown> | undefined;
        is_actively_running?: boolean | undefined;
        rendering_metadata?: Record<string, unknown> | undefined;
        streaming_metadata?: Record<string, unknown> | undefined;
        created_at?: string | undefined;
        updated_at?: string | undefined;
    }>;
    readonly AgentTaskStatusSchema: z.ZodEnum<["PENDING", "RUNNING", "COMPLETED", "FAILED", "CANCELLED"]>;
    readonly AgentTaskTypeSchema: z.ZodEnum<["api_call", "image_generation", "text_generation", "analysis", "completion", "decomposition", "orchestration"]>;
    readonly CSISchema: z.ZodObject<{
        completedSteps: z.ZodArray<z.ZodString, "many">;
        currentProgress: z.ZodNumber;
        totalSteps: z.ZodNumber;
        currentStep: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        completedSteps: string[];
        currentProgress: number;
        totalSteps: number;
        currentStep?: string | undefined;
    }, {
        completedSteps: string[];
        currentProgress: number;
        totalSteps: number;
        currentStep?: string | undefined;
    }>;
    readonly AgentContextSchema: z.ZodObject<{
        userId: z.ZodString;
        threadId: z.ZodString;
        runId: z.ZodOptional<z.ZodString>;
        agentType: z.ZodEnum<["CONTENT_GENERATION_AGENT", "TEXT_ANALYSIS_AGENT", "IMAGE_ANALYSIS_AGENT", "SOCIAL_MEDIA_AGENT", "EMAIL_MARKETING_AGENT", "SEO_OPTIMIZATION_AGENT", "BRAND_ANALYSIS_AGENT", "COMPETITOR_ANALYSIS_AGENT"]>;
        taskSequence: z.ZodNumber;
        previousCSI: z.ZodOptional<z.ZodObject<{
            completedSteps: z.ZodArray<z.ZodString, "many">;
            currentProgress: z.ZodNumber;
            totalSteps: z.ZodNumber;
            currentStep: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            completedSteps: string[];
            currentProgress: number;
            totalSteps: number;
            currentStep?: string | undefined;
        }, {
            completedSteps: string[];
            currentProgress: number;
            totalSteps: number;
            currentStep?: string | undefined;
        }>>;
        brandContext: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        executionMetadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        userId: string;
        threadId: string;
        agentType: "CONTENT_GENERATION_AGENT" | "TEXT_ANALYSIS_AGENT" | "IMAGE_ANALYSIS_AGENT" | "SOCIAL_MEDIA_AGENT" | "EMAIL_MARKETING_AGENT" | "SEO_OPTIMIZATION_AGENT" | "BRAND_ANALYSIS_AGENT" | "COMPETITOR_ANALYSIS_AGENT";
        taskSequence: number;
        runId?: string | undefined;
        previousCSI?: {
            completedSteps: string[];
            currentProgress: number;
            totalSteps: number;
            currentStep?: string | undefined;
        } | undefined;
        brandContext?: Record<string, unknown> | undefined;
        executionMetadata?: Record<string, unknown> | undefined;
    }, {
        userId: string;
        threadId: string;
        agentType: "CONTENT_GENERATION_AGENT" | "TEXT_ANALYSIS_AGENT" | "IMAGE_ANALYSIS_AGENT" | "SOCIAL_MEDIA_AGENT" | "EMAIL_MARKETING_AGENT" | "SEO_OPTIMIZATION_AGENT" | "BRAND_ANALYSIS_AGENT" | "COMPETITOR_ANALYSIS_AGENT";
        taskSequence: number;
        runId?: string | undefined;
        previousCSI?: {
            completedSteps: string[];
            currentProgress: number;
            totalSteps: number;
            currentStep?: string | undefined;
        } | undefined;
        brandContext?: Record<string, unknown> | undefined;
        executionMetadata?: Record<string, unknown> | undefined;
    }>;
    readonly AgentStepMetadataSchema: z.ZodObject<{
        step: z.ZodString;
        stepNumber: z.ZodNumber;
        totalSteps: z.ZodNumber;
        agentType: z.ZodEnum<["CONTENT_GENERATION_AGENT", "TEXT_ANALYSIS_AGENT", "IMAGE_ANALYSIS_AGENT", "SOCIAL_MEDIA_AGENT", "EMAIL_MARKETING_AGENT", "SEO_OPTIMIZATION_AGENT", "BRAND_ANALYSIS_AGENT", "COMPETITOR_ANALYSIS_AGENT"]>;
        toolName: z.ZodString;
        status: z.ZodEnum<["pending", "running", "completed", "failed"]>;
        progress: z.ZodNumber;
        timestamp: z.ZodOptional<z.ZodString>;
        executionTime: z.ZodOptional<z.ZodNumber>;
        assets: z.ZodOptional<z.ZodArray<z.ZodObject<{
            type: z.ZodString;
            url: z.ZodString;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, "strip", z.ZodTypeAny, {
            type: string;
            url: string;
            metadata?: Record<string, unknown> | undefined;
        }, {
            type: string;
            url: string;
            metadata?: Record<string, unknown> | undefined;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        status: "pending" | "running" | "completed" | "failed";
        totalSteps: number;
        agentType: "CONTENT_GENERATION_AGENT" | "TEXT_ANALYSIS_AGENT" | "IMAGE_ANALYSIS_AGENT" | "SOCIAL_MEDIA_AGENT" | "EMAIL_MARKETING_AGENT" | "SEO_OPTIMIZATION_AGENT" | "BRAND_ANALYSIS_AGENT" | "COMPETITOR_ANALYSIS_AGENT";
        step: string;
        stepNumber: number;
        toolName: string;
        progress: number;
        timestamp?: string | undefined;
        executionTime?: number | undefined;
        assets?: {
            type: string;
            url: string;
            metadata?: Record<string, unknown> | undefined;
        }[] | undefined;
    }, {
        status: "pending" | "running" | "completed" | "failed";
        totalSteps: number;
        agentType: "CONTENT_GENERATION_AGENT" | "TEXT_ANALYSIS_AGENT" | "IMAGE_ANALYSIS_AGENT" | "SOCIAL_MEDIA_AGENT" | "EMAIL_MARKETING_AGENT" | "SEO_OPTIMIZATION_AGENT" | "BRAND_ANALYSIS_AGENT" | "COMPETITOR_ANALYSIS_AGENT";
        step: string;
        stepNumber: number;
        toolName: string;
        progress: number;
        timestamp?: string | undefined;
        executionTime?: number | undefined;
        assets?: {
            type: string;
            url: string;
            metadata?: Record<string, unknown> | undefined;
        }[] | undefined;
    }>;
    readonly ThreadExecutionStatusSchema: z.ZodObject<{
        threadId: z.ZodString;
        userId: z.ZodString;
        status: z.ZodEnum<["idle", "running", "completed", "failed"]>;
        currentStep: z.ZodOptional<z.ZodString>;
        totalSteps: z.ZodOptional<z.ZodNumber>;
        completedSteps: z.ZodOptional<z.ZodNumber>;
        progress: z.ZodOptional<z.ZodNumber>;
        startedAt: z.ZodOptional<z.ZodString>;
        completedAt: z.ZodOptional<z.ZodString>;
        error: z.ZodOptional<z.ZodString>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        status: "running" | "completed" | "failed" | "idle";
        userId: string;
        threadId: string;
        completedSteps?: number | undefined;
        totalSteps?: number | undefined;
        currentStep?: string | undefined;
        progress?: number | undefined;
        metadata?: Record<string, unknown> | undefined;
        startedAt?: string | undefined;
        completedAt?: string | undefined;
        error?: string | undefined;
    }, {
        status: "running" | "completed" | "failed" | "idle";
        userId: string;
        threadId: string;
        completedSteps?: number | undefined;
        totalSteps?: number | undefined;
        currentStep?: string | undefined;
        progress?: number | undefined;
        metadata?: Record<string, unknown> | undefined;
        startedAt?: string | undefined;
        completedAt?: string | undefined;
        error?: string | undefined;
    }>;
    readonly CreateAgentTaskSchema: z.ZodObject<{
        user_id: z.ZodString;
        thread_id: z.ZodString;
        autopilot_chat_id: z.ZodOptional<z.ZodString>;
        agent_job_id: z.ZodOptional<z.ZodString>;
        api_route: z.ZodOptional<z.ZodString>;
    } & {
        task_name: z.ZodString;
        task_type: z.ZodEnum<["api_call", "image_generation", "text_generation", "analysis", "completion", "decomposition", "orchestration"]>;
        task_sequence: z.ZodNumber;
        task_input: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        rendering_metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        streaming_metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        user_id: string;
        thread_id: string;
        task_name: string;
        task_type: "api_call" | "image_generation" | "text_generation" | "analysis" | "completion" | "decomposition" | "orchestration";
        task_sequence: number;
        autopilot_chat_id?: string | undefined;
        agent_job_id?: string | undefined;
        api_route?: string | undefined;
        task_input?: Record<string, unknown> | undefined;
        rendering_metadata?: Record<string, unknown> | undefined;
        streaming_metadata?: Record<string, unknown> | undefined;
    }, {
        user_id: string;
        thread_id: string;
        task_name: string;
        task_type: "api_call" | "image_generation" | "text_generation" | "analysis" | "completion" | "decomposition" | "orchestration";
        task_sequence: number;
        autopilot_chat_id?: string | undefined;
        agent_job_id?: string | undefined;
        api_route?: string | undefined;
        task_input?: Record<string, unknown> | undefined;
        rendering_metadata?: Record<string, unknown> | undefined;
        streaming_metadata?: Record<string, unknown> | undefined;
    }>;
    readonly UpdateAgentTaskSchema: z.ZodObject<{
        status: z.ZodOptional<z.ZodEnum<["PENDING", "RUNNING", "COMPLETED", "FAILED", "CANCELLED"]>>;
        task_output: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        error_details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        rendering_metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        streaming_metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        is_actively_running: z.ZodOptional<z.ZodBoolean>;
        completed_at: z.ZodOptional<z.ZodString>;
        duration_ms: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        status?: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED" | "CANCELLED" | undefined;
        completed_at?: string | undefined;
        duration_ms?: number | undefined;
        task_output?: Record<string, unknown> | undefined;
        error_details?: Record<string, unknown> | undefined;
        is_actively_running?: boolean | undefined;
        rendering_metadata?: Record<string, unknown> | undefined;
        streaming_metadata?: Record<string, unknown> | undefined;
    }, {
        status?: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED" | "CANCELLED" | undefined;
        completed_at?: string | undefined;
        duration_ms?: number | undefined;
        task_output?: Record<string, unknown> | undefined;
        error_details?: Record<string, unknown> | undefined;
        is_actively_running?: boolean | undefined;
        rendering_metadata?: Record<string, unknown> | undefined;
        streaming_metadata?: Record<string, unknown> | undefined;
    }>;
    readonly AgentFunctionDefinitionSchema: z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
        parameters: z.ZodObject<{
            type: z.ZodLiteral<"object">;
            properties: z.ZodRecord<z.ZodString, z.ZodUnknown>;
            required: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            type: "object";
            properties: Record<string, unknown>;
            required: string[];
        }, {
            type: "object";
            properties: Record<string, unknown>;
            required: string[];
        }>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        description: string;
        parameters: {
            type: "object";
            properties: Record<string, unknown>;
            required: string[];
        };
    }, {
        name: string;
        description: string;
        parameters: {
            type: "object";
            properties: Record<string, unknown>;
            required: string[];
        };
    }>;
    readonly AgentToolConfigSchema: z.ZodObject<{
        taskName: z.ZodString;
        taskType: z.ZodEnum<["api_call", "image_generation", "text_generation", "analysis", "completion", "decomposition", "orchestration"]>;
        apiRoute: z.ZodString;
        toolName: z.ZodString;
        progressPercent: z.ZodNumber;
        functionDefinition: z.ZodObject<{
            name: z.ZodString;
            description: z.ZodString;
            parameters: z.ZodObject<{
                type: z.ZodLiteral<"object">;
                properties: z.ZodRecord<z.ZodString, z.ZodUnknown>;
                required: z.ZodArray<z.ZodString, "many">;
            }, "strip", z.ZodTypeAny, {
                type: "object";
                properties: Record<string, unknown>;
                required: string[];
            }, {
                type: "object";
                properties: Record<string, unknown>;
                required: string[];
            }>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            description: string;
            parameters: {
                type: "object";
                properties: Record<string, unknown>;
                required: string[];
            };
        }, {
            name: string;
            description: string;
            parameters: {
                type: "object";
                properties: Record<string, unknown>;
                required: string[];
            };
        }>;
        systemPrompt: z.ZodString;
        userPromptTemplate: z.ZodFunction<z.ZodTuple<[z.ZodRecord<z.ZodString, z.ZodUnknown>], z.ZodUnknown>, z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        toolName: string;
        taskName: string;
        taskType: "api_call" | "image_generation" | "text_generation" | "analysis" | "completion" | "decomposition" | "orchestration";
        apiRoute: string;
        progressPercent: number;
        functionDefinition: {
            name: string;
            description: string;
            parameters: {
                type: "object";
                properties: Record<string, unknown>;
                required: string[];
            };
        };
        systemPrompt: string;
        userPromptTemplate: (args_0: Record<string, unknown>, ...args: unknown[]) => string;
    }, {
        toolName: string;
        taskName: string;
        taskType: "api_call" | "image_generation" | "text_generation" | "analysis" | "completion" | "decomposition" | "orchestration";
        apiRoute: string;
        progressPercent: number;
        functionDefinition: {
            name: string;
            description: string;
            parameters: {
                type: "object";
                properties: Record<string, unknown>;
                required: string[];
            };
        };
        systemPrompt: string;
        userPromptTemplate: (args_0: Record<string, unknown>, ...args: unknown[]) => string;
    }>;
};

export { type AgentContext, AgentContextSchema, type AgentFunctionDefinition, AgentFunctionDefinitionSchema, type AgentStepMetadata, AgentStepMetadataSchema, type AgentTask, AgentTaskSchema, type AgentTaskStatus, AgentTaskStatusSchema, type AgentTaskType, AgentTaskTypeSchema, type AgentToolConfig, AgentToolConfigSchema, type AgentType, AgentTypeSchema, type CSI, CSISchema, type CreateAgentTask, CreateAgentTaskSchema, type ThreadExecutionStatus, ThreadExecutionStatusSchema, type UpdateAgentTask, UpdateAgentTaskSchema, agentSchemas };
