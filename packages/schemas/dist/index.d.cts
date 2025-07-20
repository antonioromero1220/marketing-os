import * as zod_to_json_schema from 'zod-to-json-schema';
export { BrandAsset, BrandAssetSchema, BrandAssetType, BrandAssetTypeSchema, BrandAssetUpload, BrandAssetUploadSchema, BrandContext, BrandContextSchema, BrandKit, BrandKitSchema, CreateBrandKit, CreateBrandKitSchema, UpdateBrandKit, UpdateBrandKitSchema, brandSchemas } from './brand.cjs';
export { AgentContext, AgentContextSchema, AgentFunctionDefinition, AgentFunctionDefinitionSchema, AgentStepMetadata, AgentStepMetadataSchema, AgentTask, AgentTaskSchema, AgentTaskStatus, AgentTaskStatusSchema, AgentTaskType, AgentTaskTypeSchema, AgentToolConfig, AgentToolConfigSchema, AgentType, AgentTypeSchema, CSI, CSISchema, CreateAgentTask, CreateAgentTaskSchema, ThreadExecutionStatus, ThreadExecutionStatusSchema, UpdateAgentTask, UpdateAgentTaskSchema, agentSchemas } from './agent.cjs';
export { CompilerConfig, CompilerConfigSchema, CompilerContext, CompilerContextSchema, CompilerError, CompilerErrorSchema, CompilerThreadExecutionStatus, CompilerThreadExecutionStatusSchema, DecompositionPlan, DecompositionPlanSchema, DecompositionStep, DecompositionStepSchema, KVLockMetadata, KVLockMetadataSchema, LockError, LockErrorSchema, OrchestrationDecision, OrchestrationDecisionSchema, OrchestrationError, OrchestrationErrorSchema, OrchestrationEvent, OrchestrationEventSchema, PreInitPayload, PreInitPayloadSchema, StatusMetadata, StatusMetadataSchema, ThreadAnalysisResult, ThreadAnalysisResultSchema, ValidationError, ValidationErrorSchema, ValidationResult, ValidationResultSchema, compilerSchemas } from './compiler.cjs';
import { z } from 'zod';

declare const schemas: {
    readonly CompilerContextSchema: z.ZodObject<{
        userId: z.ZodString;
        threadId: z.ZodString;
        runId: z.ZodString;
        jwtToken: z.ZodString;
        timestamp: z.ZodString;
        brandKitId: z.ZodOptional<z.ZodString>;
        agentType: z.ZodOptional<z.ZodEnum<["CONTENT_GENERATION_AGENT", "TEXT_ANALYSIS_AGENT", "IMAGE_ANALYSIS_AGENT", "SOCIAL_MEDIA_AGENT", "EMAIL_MARKETING_AGENT", "SEO_OPTIMIZATION_AGENT", "BRAND_ANALYSIS_AGENT", "COMPETITOR_ANALYSIS_AGENT"]>>;
    }, "strip", z.ZodTypeAny, {
        userId: string;
        threadId: string;
        runId: string;
        jwtToken: string;
        timestamp: string;
        brandKitId?: string | undefined;
        agentType?: "CONTENT_GENERATION_AGENT" | "TEXT_ANALYSIS_AGENT" | "IMAGE_ANALYSIS_AGENT" | "SOCIAL_MEDIA_AGENT" | "EMAIL_MARKETING_AGENT" | "SEO_OPTIMIZATION_AGENT" | "BRAND_ANALYSIS_AGENT" | "COMPETITOR_ANALYSIS_AGENT" | undefined;
    }, {
        userId: string;
        threadId: string;
        runId: string;
        jwtToken: string;
        timestamp: string;
        brandKitId?: string | undefined;
        agentType?: "CONTENT_GENERATION_AGENT" | "TEXT_ANALYSIS_AGENT" | "IMAGE_ANALYSIS_AGENT" | "SOCIAL_MEDIA_AGENT" | "EMAIL_MARKETING_AGENT" | "SEO_OPTIMIZATION_AGENT" | "BRAND_ANALYSIS_AGENT" | "COMPETITOR_ANALYSIS_AGENT" | undefined;
    }>;
    readonly ValidationResultSchema: z.ZodObject<{
        success: z.ZodBoolean;
        data: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        errors: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        success: boolean;
        data?: Record<string, unknown> | undefined;
        errors?: string[] | undefined;
        metadata?: Record<string, unknown> | undefined;
    }, {
        success: boolean;
        data?: Record<string, unknown> | undefined;
        errors?: string[] | undefined;
        metadata?: Record<string, unknown> | undefined;
    }>;
    readonly PreInitPayloadSchema: z.ZodObject<{
        userId: z.ZodString;
        threadId: z.ZodString;
        runId: z.ZodString;
        prompt: z.ZodString;
        agentType: z.ZodEnum<["CONTENT_GENERATION_AGENT", "TEXT_ANALYSIS_AGENT", "IMAGE_ANALYSIS_AGENT", "SOCIAL_MEDIA_AGENT", "EMAIL_MARKETING_AGENT", "SEO_OPTIMIZATION_AGENT", "BRAND_ANALYSIS_AGENT", "COMPETITOR_ANALYSIS_AGENT"]>;
        creativeCount: z.ZodNumber;
        brandKitId: z.ZodOptional<z.ZodString>;
        referenceImages: z.ZodOptional<z.ZodArray<z.ZodObject<{
            url: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            weight: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            url: string;
            weight: number;
            description?: string | undefined;
        }, {
            url: string;
            description?: string | undefined;
            weight?: number | undefined;
        }>, "many">>;
        settings: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        userId: string;
        threadId: string;
        runId: string;
        agentType: "CONTENT_GENERATION_AGENT" | "TEXT_ANALYSIS_AGENT" | "IMAGE_ANALYSIS_AGENT" | "SOCIAL_MEDIA_AGENT" | "EMAIL_MARKETING_AGENT" | "SEO_OPTIMIZATION_AGENT" | "BRAND_ANALYSIS_AGENT" | "COMPETITOR_ANALYSIS_AGENT";
        prompt: string;
        creativeCount: number;
        brandKitId?: string | undefined;
        referenceImages?: {
            url: string;
            weight: number;
            description?: string | undefined;
        }[] | undefined;
        settings?: Record<string, unknown> | undefined;
    }, {
        userId: string;
        threadId: string;
        runId: string;
        agentType: "CONTENT_GENERATION_AGENT" | "TEXT_ANALYSIS_AGENT" | "IMAGE_ANALYSIS_AGENT" | "SOCIAL_MEDIA_AGENT" | "EMAIL_MARKETING_AGENT" | "SEO_OPTIMIZATION_AGENT" | "BRAND_ANALYSIS_AGENT" | "COMPETITOR_ANALYSIS_AGENT";
        prompt: string;
        creativeCount: number;
        brandKitId?: string | undefined;
        referenceImages?: {
            url: string;
            description?: string | undefined;
            weight?: number | undefined;
        }[] | undefined;
        settings?: Record<string, unknown> | undefined;
    }>;
    readonly OrchestrationEventSchema: z.ZodObject<{
        id: z.ZodString;
        type: z.ZodEnum<["decomposition", "execution", "completion"]>;
        userId: z.ZodString;
        threadId: z.ZodString;
        runId: z.ZodString;
        agentType: z.ZodEnum<["CONTENT_GENERATION_AGENT", "TEXT_ANALYSIS_AGENT", "IMAGE_ANALYSIS_AGENT", "SOCIAL_MEDIA_AGENT", "EMAIL_MARKETING_AGENT", "SEO_OPTIMIZATION_AGENT", "BRAND_ANALYSIS_AGENT", "COMPETITOR_ANALYSIS_AGENT"]>;
        payload: z.ZodRecord<z.ZodString, z.ZodUnknown>;
        metadata: z.ZodOptional<z.ZodObject<{
            kvLock: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            brandContext: z.ZodOptional<z.ZodObject<{
                brand_kit: z.ZodOptional<z.ZodObject<{
                    id: z.ZodOptional<z.ZodString>;
                    name: z.ZodString;
                    description: z.ZodOptional<z.ZodString>;
                    colors: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                    fonts: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                    logo_url: z.ZodOptional<z.ZodString>;
                    guidelines: z.ZodOptional<z.ZodString>;
                    industry: z.ZodOptional<z.ZodString>;
                    brand_voice: z.ZodOptional<z.ZodEnum<["professional", "casual", "friendly", "authoritative", "playful", "luxurious"]>>;
                    target_audience: z.ZodOptional<z.ZodString>;
                    created_at: z.ZodOptional<z.ZodString>;
                    updated_at: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    name: string;
                    description?: string | undefined;
                    id?: string | undefined;
                    colors?: string[] | undefined;
                    fonts?: string[] | undefined;
                    logo_url?: string | undefined;
                    guidelines?: string | undefined;
                    industry?: string | undefined;
                    brand_voice?: "professional" | "casual" | "friendly" | "authoritative" | "playful" | "luxurious" | undefined;
                    target_audience?: string | undefined;
                    created_at?: string | undefined;
                    updated_at?: string | undefined;
                }, {
                    name: string;
                    description?: string | undefined;
                    id?: string | undefined;
                    colors?: string[] | undefined;
                    fonts?: string[] | undefined;
                    logo_url?: string | undefined;
                    guidelines?: string | undefined;
                    industry?: string | undefined;
                    brand_voice?: "professional" | "casual" | "friendly" | "authoritative" | "playful" | "luxurious" | undefined;
                    target_audience?: string | undefined;
                    created_at?: string | undefined;
                    updated_at?: string | undefined;
                }>>;
                selected_assets: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    id: z.ZodOptional<z.ZodString>;
                    brand_kit_id: z.ZodString;
                    asset_type: z.ZodEnum<["logo", "product_photo", "lifestyle_image", "icon", "banner", "pattern", "texture"]>;
                    name: z.ZodString;
                    description: z.ZodOptional<z.ZodString>;
                    url: z.ZodString;
                    file_size: z.ZodOptional<z.ZodNumber>;
                    dimensions: z.ZodOptional<z.ZodObject<{
                        width: z.ZodNumber;
                        height: z.ZodNumber;
                    }, "strip", z.ZodTypeAny, {
                        width: number;
                        height: number;
                    }, {
                        width: number;
                        height: number;
                    }>>;
                    format: z.ZodEnum<["png", "jpg", "jpeg", "svg", "webp", "gif"]>;
                    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                    is_primary: z.ZodDefault<z.ZodBoolean>;
                    created_at: z.ZodOptional<z.ZodString>;
                    updated_at: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    url: string;
                    name: string;
                    brand_kit_id: string;
                    asset_type: "logo" | "product_photo" | "lifestyle_image" | "icon" | "banner" | "pattern" | "texture";
                    format: "png" | "jpg" | "jpeg" | "svg" | "webp" | "gif";
                    is_primary: boolean;
                    description?: string | undefined;
                    id?: string | undefined;
                    created_at?: string | undefined;
                    updated_at?: string | undefined;
                    file_size?: number | undefined;
                    dimensions?: {
                        width: number;
                        height: number;
                    } | undefined;
                    tags?: string[] | undefined;
                }, {
                    url: string;
                    name: string;
                    brand_kit_id: string;
                    asset_type: "logo" | "product_photo" | "lifestyle_image" | "icon" | "banner" | "pattern" | "texture";
                    format: "png" | "jpg" | "jpeg" | "svg" | "webp" | "gif";
                    description?: string | undefined;
                    id?: string | undefined;
                    created_at?: string | undefined;
                    updated_at?: string | undefined;
                    file_size?: number | undefined;
                    dimensions?: {
                        width: number;
                        height: number;
                    } | undefined;
                    tags?: string[] | undefined;
                    is_primary?: boolean | undefined;
                }>, "many">>;
                brand_guidelines: z.ZodOptional<z.ZodString>;
                style_preferences: z.ZodOptional<z.ZodObject<{
                    tone: z.ZodOptional<z.ZodString>;
                    style: z.ZodOptional<z.ZodString>;
                    mood: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    tone?: string | undefined;
                    style?: string | undefined;
                    mood?: string | undefined;
                }, {
                    tone?: string | undefined;
                    style?: string | undefined;
                    mood?: string | undefined;
                }>>;
                reference_images: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    url: z.ZodString;
                    description: z.ZodOptional<z.ZodString>;
                    weight: z.ZodDefault<z.ZodNumber>;
                }, "strip", z.ZodTypeAny, {
                    url: string;
                    weight: number;
                    description?: string | undefined;
                }, {
                    url: string;
                    description?: string | undefined;
                    weight?: number | undefined;
                }>, "many">>;
            }, "strip", z.ZodTypeAny, {
                brand_kit?: {
                    name: string;
                    description?: string | undefined;
                    id?: string | undefined;
                    colors?: string[] | undefined;
                    fonts?: string[] | undefined;
                    logo_url?: string | undefined;
                    guidelines?: string | undefined;
                    industry?: string | undefined;
                    brand_voice?: "professional" | "casual" | "friendly" | "authoritative" | "playful" | "luxurious" | undefined;
                    target_audience?: string | undefined;
                    created_at?: string | undefined;
                    updated_at?: string | undefined;
                } | undefined;
                selected_assets?: {
                    url: string;
                    name: string;
                    brand_kit_id: string;
                    asset_type: "logo" | "product_photo" | "lifestyle_image" | "icon" | "banner" | "pattern" | "texture";
                    format: "png" | "jpg" | "jpeg" | "svg" | "webp" | "gif";
                    is_primary: boolean;
                    description?: string | undefined;
                    id?: string | undefined;
                    created_at?: string | undefined;
                    updated_at?: string | undefined;
                    file_size?: number | undefined;
                    dimensions?: {
                        width: number;
                        height: number;
                    } | undefined;
                    tags?: string[] | undefined;
                }[] | undefined;
                brand_guidelines?: string | undefined;
                style_preferences?: {
                    tone?: string | undefined;
                    style?: string | undefined;
                    mood?: string | undefined;
                } | undefined;
                reference_images?: {
                    url: string;
                    weight: number;
                    description?: string | undefined;
                }[] | undefined;
            }, {
                brand_kit?: {
                    name: string;
                    description?: string | undefined;
                    id?: string | undefined;
                    colors?: string[] | undefined;
                    fonts?: string[] | undefined;
                    logo_url?: string | undefined;
                    guidelines?: string | undefined;
                    industry?: string | undefined;
                    brand_voice?: "professional" | "casual" | "friendly" | "authoritative" | "playful" | "luxurious" | undefined;
                    target_audience?: string | undefined;
                    created_at?: string | undefined;
                    updated_at?: string | undefined;
                } | undefined;
                selected_assets?: {
                    url: string;
                    name: string;
                    brand_kit_id: string;
                    asset_type: "logo" | "product_photo" | "lifestyle_image" | "icon" | "banner" | "pattern" | "texture";
                    format: "png" | "jpg" | "jpeg" | "svg" | "webp" | "gif";
                    description?: string | undefined;
                    id?: string | undefined;
                    created_at?: string | undefined;
                    updated_at?: string | undefined;
                    file_size?: number | undefined;
                    dimensions?: {
                        width: number;
                        height: number;
                    } | undefined;
                    tags?: string[] | undefined;
                    is_primary?: boolean | undefined;
                }[] | undefined;
                brand_guidelines?: string | undefined;
                style_preferences?: {
                    tone?: string | undefined;
                    style?: string | undefined;
                    mood?: string | undefined;
                } | undefined;
                reference_images?: {
                    url: string;
                    description?: string | undefined;
                    weight?: number | undefined;
                }[] | undefined;
            }>>;
            executionPlan: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, "strip", z.ZodTypeAny, {
            kvLock?: Record<string, unknown> | undefined;
            brandContext?: {
                brand_kit?: {
                    name: string;
                    description?: string | undefined;
                    id?: string | undefined;
                    colors?: string[] | undefined;
                    fonts?: string[] | undefined;
                    logo_url?: string | undefined;
                    guidelines?: string | undefined;
                    industry?: string | undefined;
                    brand_voice?: "professional" | "casual" | "friendly" | "authoritative" | "playful" | "luxurious" | undefined;
                    target_audience?: string | undefined;
                    created_at?: string | undefined;
                    updated_at?: string | undefined;
                } | undefined;
                selected_assets?: {
                    url: string;
                    name: string;
                    brand_kit_id: string;
                    asset_type: "logo" | "product_photo" | "lifestyle_image" | "icon" | "banner" | "pattern" | "texture";
                    format: "png" | "jpg" | "jpeg" | "svg" | "webp" | "gif";
                    is_primary: boolean;
                    description?: string | undefined;
                    id?: string | undefined;
                    created_at?: string | undefined;
                    updated_at?: string | undefined;
                    file_size?: number | undefined;
                    dimensions?: {
                        width: number;
                        height: number;
                    } | undefined;
                    tags?: string[] | undefined;
                }[] | undefined;
                brand_guidelines?: string | undefined;
                style_preferences?: {
                    tone?: string | undefined;
                    style?: string | undefined;
                    mood?: string | undefined;
                } | undefined;
                reference_images?: {
                    url: string;
                    weight: number;
                    description?: string | undefined;
                }[] | undefined;
            } | undefined;
            executionPlan?: Record<string, unknown> | undefined;
        }, {
            kvLock?: Record<string, unknown> | undefined;
            brandContext?: {
                brand_kit?: {
                    name: string;
                    description?: string | undefined;
                    id?: string | undefined;
                    colors?: string[] | undefined;
                    fonts?: string[] | undefined;
                    logo_url?: string | undefined;
                    guidelines?: string | undefined;
                    industry?: string | undefined;
                    brand_voice?: "professional" | "casual" | "friendly" | "authoritative" | "playful" | "luxurious" | undefined;
                    target_audience?: string | undefined;
                    created_at?: string | undefined;
                    updated_at?: string | undefined;
                } | undefined;
                selected_assets?: {
                    url: string;
                    name: string;
                    brand_kit_id: string;
                    asset_type: "logo" | "product_photo" | "lifestyle_image" | "icon" | "banner" | "pattern" | "texture";
                    format: "png" | "jpg" | "jpeg" | "svg" | "webp" | "gif";
                    description?: string | undefined;
                    id?: string | undefined;
                    created_at?: string | undefined;
                    updated_at?: string | undefined;
                    file_size?: number | undefined;
                    dimensions?: {
                        width: number;
                        height: number;
                    } | undefined;
                    tags?: string[] | undefined;
                    is_primary?: boolean | undefined;
                }[] | undefined;
                brand_guidelines?: string | undefined;
                style_preferences?: {
                    tone?: string | undefined;
                    style?: string | undefined;
                    mood?: string | undefined;
                } | undefined;
                reference_images?: {
                    url: string;
                    description?: string | undefined;
                    weight?: number | undefined;
                }[] | undefined;
            } | undefined;
            executionPlan?: Record<string, unknown> | undefined;
        }>>;
        timestamp: z.ZodString;
        priority: z.ZodDefault<z.ZodEnum<["low", "normal", "high"]>>;
    }, "strip", z.ZodTypeAny, {
        userId: string;
        threadId: string;
        runId: string;
        timestamp: string;
        agentType: "CONTENT_GENERATION_AGENT" | "TEXT_ANALYSIS_AGENT" | "IMAGE_ANALYSIS_AGENT" | "SOCIAL_MEDIA_AGENT" | "EMAIL_MARKETING_AGENT" | "SEO_OPTIMIZATION_AGENT" | "BRAND_ANALYSIS_AGENT" | "COMPETITOR_ANALYSIS_AGENT";
        type: "decomposition" | "execution" | "completion";
        id: string;
        payload: Record<string, unknown>;
        priority: "low" | "normal" | "high";
        metadata?: {
            kvLock?: Record<string, unknown> | undefined;
            brandContext?: {
                brand_kit?: {
                    name: string;
                    description?: string | undefined;
                    id?: string | undefined;
                    colors?: string[] | undefined;
                    fonts?: string[] | undefined;
                    logo_url?: string | undefined;
                    guidelines?: string | undefined;
                    industry?: string | undefined;
                    brand_voice?: "professional" | "casual" | "friendly" | "authoritative" | "playful" | "luxurious" | undefined;
                    target_audience?: string | undefined;
                    created_at?: string | undefined;
                    updated_at?: string | undefined;
                } | undefined;
                selected_assets?: {
                    url: string;
                    name: string;
                    brand_kit_id: string;
                    asset_type: "logo" | "product_photo" | "lifestyle_image" | "icon" | "banner" | "pattern" | "texture";
                    format: "png" | "jpg" | "jpeg" | "svg" | "webp" | "gif";
                    is_primary: boolean;
                    description?: string | undefined;
                    id?: string | undefined;
                    created_at?: string | undefined;
                    updated_at?: string | undefined;
                    file_size?: number | undefined;
                    dimensions?: {
                        width: number;
                        height: number;
                    } | undefined;
                    tags?: string[] | undefined;
                }[] | undefined;
                brand_guidelines?: string | undefined;
                style_preferences?: {
                    tone?: string | undefined;
                    style?: string | undefined;
                    mood?: string | undefined;
                } | undefined;
                reference_images?: {
                    url: string;
                    weight: number;
                    description?: string | undefined;
                }[] | undefined;
            } | undefined;
            executionPlan?: Record<string, unknown> | undefined;
        } | undefined;
    }, {
        userId: string;
        threadId: string;
        runId: string;
        timestamp: string;
        agentType: "CONTENT_GENERATION_AGENT" | "TEXT_ANALYSIS_AGENT" | "IMAGE_ANALYSIS_AGENT" | "SOCIAL_MEDIA_AGENT" | "EMAIL_MARKETING_AGENT" | "SEO_OPTIMIZATION_AGENT" | "BRAND_ANALYSIS_AGENT" | "COMPETITOR_ANALYSIS_AGENT";
        type: "decomposition" | "execution" | "completion";
        id: string;
        payload: Record<string, unknown>;
        metadata?: {
            kvLock?: Record<string, unknown> | undefined;
            brandContext?: {
                brand_kit?: {
                    name: string;
                    description?: string | undefined;
                    id?: string | undefined;
                    colors?: string[] | undefined;
                    fonts?: string[] | undefined;
                    logo_url?: string | undefined;
                    guidelines?: string | undefined;
                    industry?: string | undefined;
                    brand_voice?: "professional" | "casual" | "friendly" | "authoritative" | "playful" | "luxurious" | undefined;
                    target_audience?: string | undefined;
                    created_at?: string | undefined;
                    updated_at?: string | undefined;
                } | undefined;
                selected_assets?: {
                    url: string;
                    name: string;
                    brand_kit_id: string;
                    asset_type: "logo" | "product_photo" | "lifestyle_image" | "icon" | "banner" | "pattern" | "texture";
                    format: "png" | "jpg" | "jpeg" | "svg" | "webp" | "gif";
                    description?: string | undefined;
                    id?: string | undefined;
                    created_at?: string | undefined;
                    updated_at?: string | undefined;
                    file_size?: number | undefined;
                    dimensions?: {
                        width: number;
                        height: number;
                    } | undefined;
                    tags?: string[] | undefined;
                    is_primary?: boolean | undefined;
                }[] | undefined;
                brand_guidelines?: string | undefined;
                style_preferences?: {
                    tone?: string | undefined;
                    style?: string | undefined;
                    mood?: string | undefined;
                } | undefined;
                reference_images?: {
                    url: string;
                    description?: string | undefined;
                    weight?: number | undefined;
                }[] | undefined;
            } | undefined;
            executionPlan?: Record<string, unknown> | undefined;
        } | undefined;
        priority?: "low" | "normal" | "high" | undefined;
    }>;
    readonly OrchestrationDecisionSchema: z.ZodObject<{
        shouldDecompose: z.ZodBoolean;
        executionPath: z.ZodEnum<["direct", "decomposed", "hybrid"]>;
        estimatedComplexity: z.ZodNumber;
        resourceRequirements: z.ZodArray<z.ZodString, "many">;
        parallelizable: z.ZodBoolean;
        dependencies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        shouldDecompose: boolean;
        executionPath: "direct" | "decomposed" | "hybrid";
        estimatedComplexity: number;
        resourceRequirements: string[];
        parallelizable: boolean;
        dependencies?: string[] | undefined;
    }, {
        shouldDecompose: boolean;
        executionPath: "direct" | "decomposed" | "hybrid";
        estimatedComplexity: number;
        resourceRequirements: string[];
        parallelizable: boolean;
        dependencies?: string[] | undefined;
    }>;
    readonly DecompositionStepSchema: z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        type: z.ZodEnum<["analysis", "generation", "validation", "completion"]>;
        description: z.ZodString;
        dependencies: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        estimatedDuration: z.ZodNumber;
        priority: z.ZodDefault<z.ZodNumber>;
        parallelizable: z.ZodDefault<z.ZodBoolean>;
        resources: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        type: "validation" | "completion" | "analysis" | "generation";
        description: string;
        id: string;
        name: string;
        priority: number;
        parallelizable: boolean;
        dependencies: string[];
        estimatedDuration: number;
        resources: string[];
        metadata?: Record<string, unknown> | undefined;
    }, {
        type: "validation" | "completion" | "analysis" | "generation";
        description: string;
        id: string;
        name: string;
        estimatedDuration: number;
        metadata?: Record<string, unknown> | undefined;
        priority?: number | undefined;
        parallelizable?: boolean | undefined;
        dependencies?: string[] | undefined;
        resources?: string[] | undefined;
    }>;
    readonly DecompositionPlanSchema: z.ZodObject<{
        id: z.ZodString;
        agentType: z.ZodEnum<["CONTENT_GENERATION_AGENT", "TEXT_ANALYSIS_AGENT", "IMAGE_ANALYSIS_AGENT", "SOCIAL_MEDIA_AGENT", "EMAIL_MARKETING_AGENT", "SEO_OPTIMIZATION_AGENT", "BRAND_ANALYSIS_AGENT", "COMPETITOR_ANALYSIS_AGENT"]>;
        steps: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            type: z.ZodEnum<["analysis", "generation", "validation", "completion"]>;
            description: z.ZodString;
            dependencies: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            estimatedDuration: z.ZodNumber;
            priority: z.ZodDefault<z.ZodNumber>;
            parallelizable: z.ZodDefault<z.ZodBoolean>;
            resources: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, "strip", z.ZodTypeAny, {
            type: "validation" | "completion" | "analysis" | "generation";
            description: string;
            id: string;
            name: string;
            priority: number;
            parallelizable: boolean;
            dependencies: string[];
            estimatedDuration: number;
            resources: string[];
            metadata?: Record<string, unknown> | undefined;
        }, {
            type: "validation" | "completion" | "analysis" | "generation";
            description: string;
            id: string;
            name: string;
            estimatedDuration: number;
            metadata?: Record<string, unknown> | undefined;
            priority?: number | undefined;
            parallelizable?: boolean | undefined;
            dependencies?: string[] | undefined;
            resources?: string[] | undefined;
        }>, "many">;
        context: z.ZodObject<{
            brandKit: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            assets: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            sequencing: z.ZodEnum<["parallel", "sequential"]>;
            userPrompt: z.ZodString;
            referenceImages: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            sequencing: "parallel" | "sequential";
            userPrompt: string;
            referenceImages?: string[] | undefined;
            brandKit?: Record<string, unknown> | undefined;
            assets?: string[] | undefined;
        }, {
            sequencing: "parallel" | "sequential";
            userPrompt: string;
            referenceImages?: string[] | undefined;
            brandKit?: Record<string, unknown> | undefined;
            assets?: string[] | undefined;
        }>;
        metadata: z.ZodObject<{
            totalSteps: z.ZodNumber;
            estimatedDuration: z.ZodNumber;
            complexity: z.ZodNumber;
            resourceRequirements: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            resourceRequirements: string[];
            estimatedDuration: number;
            totalSteps: number;
            complexity: number;
        }, {
            resourceRequirements: string[];
            estimatedDuration: number;
            totalSteps: number;
            complexity: number;
        }>;
        createdAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        agentType: "CONTENT_GENERATION_AGENT" | "TEXT_ANALYSIS_AGENT" | "IMAGE_ANALYSIS_AGENT" | "SOCIAL_MEDIA_AGENT" | "EMAIL_MARKETING_AGENT" | "SEO_OPTIMIZATION_AGENT" | "BRAND_ANALYSIS_AGENT" | "COMPETITOR_ANALYSIS_AGENT";
        metadata: {
            resourceRequirements: string[];
            estimatedDuration: number;
            totalSteps: number;
            complexity: number;
        };
        id: string;
        steps: {
            type: "validation" | "completion" | "analysis" | "generation";
            description: string;
            id: string;
            name: string;
            priority: number;
            parallelizable: boolean;
            dependencies: string[];
            estimatedDuration: number;
            resources: string[];
            metadata?: Record<string, unknown> | undefined;
        }[];
        context: {
            sequencing: "parallel" | "sequential";
            userPrompt: string;
            referenceImages?: string[] | undefined;
            brandKit?: Record<string, unknown> | undefined;
            assets?: string[] | undefined;
        };
        createdAt: string;
    }, {
        agentType: "CONTENT_GENERATION_AGENT" | "TEXT_ANALYSIS_AGENT" | "IMAGE_ANALYSIS_AGENT" | "SOCIAL_MEDIA_AGENT" | "EMAIL_MARKETING_AGENT" | "SEO_OPTIMIZATION_AGENT" | "BRAND_ANALYSIS_AGENT" | "COMPETITOR_ANALYSIS_AGENT";
        metadata: {
            resourceRequirements: string[];
            estimatedDuration: number;
            totalSteps: number;
            complexity: number;
        };
        id: string;
        steps: {
            type: "validation" | "completion" | "analysis" | "generation";
            description: string;
            id: string;
            name: string;
            estimatedDuration: number;
            metadata?: Record<string, unknown> | undefined;
            priority?: number | undefined;
            parallelizable?: boolean | undefined;
            dependencies?: string[] | undefined;
            resources?: string[] | undefined;
        }[];
        context: {
            sequencing: "parallel" | "sequential";
            userPrompt: string;
            referenceImages?: string[] | undefined;
            brandKit?: Record<string, unknown> | undefined;
            assets?: string[] | undefined;
        };
        createdAt: string;
    }>;
    readonly StatusMetadataSchema: z.ZodObject<{
        executionStats: z.ZodOptional<z.ZodObject<{
            totalTasks: z.ZodNumber;
            completedTasks: z.ZodNumber;
            failedTasks: z.ZodNumber;
            averageExecutionTime: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            totalTasks: number;
            completedTasks: number;
            failedTasks: number;
            averageExecutionTime?: number | undefined;
        }, {
            totalTasks: number;
            completedTasks: number;
            failedTasks: number;
            averageExecutionTime?: number | undefined;
        }>>;
        resourceUsage: z.ZodOptional<z.ZodObject<{
            memoryUsage: z.ZodOptional<z.ZodNumber>;
            cpuUsage: z.ZodOptional<z.ZodNumber>;
            networkCalls: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            memoryUsage?: number | undefined;
            cpuUsage?: number | undefined;
            networkCalls?: number | undefined;
        }, {
            memoryUsage?: number | undefined;
            cpuUsage?: number | undefined;
            networkCalls?: number | undefined;
        }>>;
        lastUpdate: z.ZodString;
        debugInfo: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        lastUpdate: string;
        executionStats?: {
            totalTasks: number;
            completedTasks: number;
            failedTasks: number;
            averageExecutionTime?: number | undefined;
        } | undefined;
        resourceUsage?: {
            memoryUsage?: number | undefined;
            cpuUsage?: number | undefined;
            networkCalls?: number | undefined;
        } | undefined;
        debugInfo?: Record<string, unknown> | undefined;
    }, {
        lastUpdate: string;
        executionStats?: {
            totalTasks: number;
            completedTasks: number;
            failedTasks: number;
            averageExecutionTime?: number | undefined;
        } | undefined;
        resourceUsage?: {
            memoryUsage?: number | undefined;
            cpuUsage?: number | undefined;
            networkCalls?: number | undefined;
        } | undefined;
        debugInfo?: Record<string, unknown> | undefined;
    }>;
    readonly CompilerThreadExecutionStatusSchema: z.ZodObject<{
        threadId: z.ZodString;
        userId: z.ZodString;
        status: z.ZodEnum<["idle", "running", "completed", "failed", "cancelled"]>;
        executionPhase: z.ZodOptional<z.ZodEnum<["init", "decomposition", "execution", "completion"]>>;
        currentStep: z.ZodOptional<z.ZodString>;
        totalSteps: z.ZodOptional<z.ZodNumber>;
        completedSteps: z.ZodOptional<z.ZodNumber>;
        progress: z.ZodOptional<z.ZodNumber>;
        runningMessages: z.ZodOptional<z.ZodNumber>;
        shouldEnableRealtime: z.ZodBoolean;
        shouldSwitchToHistorical: z.ZodBoolean;
        metadata: z.ZodOptional<z.ZodObject<{
            executionStats: z.ZodOptional<z.ZodObject<{
                totalTasks: z.ZodNumber;
                completedTasks: z.ZodNumber;
                failedTasks: z.ZodNumber;
                averageExecutionTime: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                totalTasks: number;
                completedTasks: number;
                failedTasks: number;
                averageExecutionTime?: number | undefined;
            }, {
                totalTasks: number;
                completedTasks: number;
                failedTasks: number;
                averageExecutionTime?: number | undefined;
            }>>;
            resourceUsage: z.ZodOptional<z.ZodObject<{
                memoryUsage: z.ZodOptional<z.ZodNumber>;
                cpuUsage: z.ZodOptional<z.ZodNumber>;
                networkCalls: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                memoryUsage?: number | undefined;
                cpuUsage?: number | undefined;
                networkCalls?: number | undefined;
            }, {
                memoryUsage?: number | undefined;
                cpuUsage?: number | undefined;
                networkCalls?: number | undefined;
            }>>;
            lastUpdate: z.ZodString;
            debugInfo: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, "strip", z.ZodTypeAny, {
            lastUpdate: string;
            executionStats?: {
                totalTasks: number;
                completedTasks: number;
                failedTasks: number;
                averageExecutionTime?: number | undefined;
            } | undefined;
            resourceUsage?: {
                memoryUsage?: number | undefined;
                cpuUsage?: number | undefined;
                networkCalls?: number | undefined;
            } | undefined;
            debugInfo?: Record<string, unknown> | undefined;
        }, {
            lastUpdate: string;
            executionStats?: {
                totalTasks: number;
                completedTasks: number;
                failedTasks: number;
                averageExecutionTime?: number | undefined;
            } | undefined;
            resourceUsage?: {
                memoryUsage?: number | undefined;
                cpuUsage?: number | undefined;
                networkCalls?: number | undefined;
            } | undefined;
            debugInfo?: Record<string, unknown> | undefined;
        }>>;
        startedAt: z.ZodOptional<z.ZodString>;
        completedAt: z.ZodOptional<z.ZodString>;
        error: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        userId: string;
        threadId: string;
        status: "idle" | "running" | "completed" | "failed" | "cancelled";
        shouldEnableRealtime: boolean;
        shouldSwitchToHistorical: boolean;
        metadata?: {
            lastUpdate: string;
            executionStats?: {
                totalTasks: number;
                completedTasks: number;
                failedTasks: number;
                averageExecutionTime?: number | undefined;
            } | undefined;
            resourceUsage?: {
                memoryUsage?: number | undefined;
                cpuUsage?: number | undefined;
                networkCalls?: number | undefined;
            } | undefined;
            debugInfo?: Record<string, unknown> | undefined;
        } | undefined;
        totalSteps?: number | undefined;
        executionPhase?: "decomposition" | "execution" | "completion" | "init" | undefined;
        currentStep?: string | undefined;
        completedSteps?: number | undefined;
        progress?: number | undefined;
        runningMessages?: number | undefined;
        startedAt?: string | undefined;
        completedAt?: string | undefined;
        error?: string | undefined;
    }, {
        userId: string;
        threadId: string;
        status: "idle" | "running" | "completed" | "failed" | "cancelled";
        shouldEnableRealtime: boolean;
        shouldSwitchToHistorical: boolean;
        metadata?: {
            lastUpdate: string;
            executionStats?: {
                totalTasks: number;
                completedTasks: number;
                failedTasks: number;
                averageExecutionTime?: number | undefined;
            } | undefined;
            resourceUsage?: {
                memoryUsage?: number | undefined;
                cpuUsage?: number | undefined;
                networkCalls?: number | undefined;
            } | undefined;
            debugInfo?: Record<string, unknown> | undefined;
        } | undefined;
        totalSteps?: number | undefined;
        executionPhase?: "decomposition" | "execution" | "completion" | "init" | undefined;
        currentStep?: string | undefined;
        completedSteps?: number | undefined;
        progress?: number | undefined;
        runningMessages?: number | undefined;
        startedAt?: string | undefined;
        completedAt?: string | undefined;
        error?: string | undefined;
    }>;
    readonly ThreadAnalysisResultSchema: z.ZodObject<{
        executionStatus: z.ZodObject<{
            threadId: z.ZodString;
            userId: z.ZodString;
            status: z.ZodEnum<["idle", "running", "completed", "failed", "cancelled"]>;
            executionPhase: z.ZodOptional<z.ZodEnum<["init", "decomposition", "execution", "completion"]>>;
            currentStep: z.ZodOptional<z.ZodString>;
            totalSteps: z.ZodOptional<z.ZodNumber>;
            completedSteps: z.ZodOptional<z.ZodNumber>;
            progress: z.ZodOptional<z.ZodNumber>;
            runningMessages: z.ZodOptional<z.ZodNumber>;
            shouldEnableRealtime: z.ZodBoolean;
            shouldSwitchToHistorical: z.ZodBoolean;
            metadata: z.ZodOptional<z.ZodObject<{
                executionStats: z.ZodOptional<z.ZodObject<{
                    totalTasks: z.ZodNumber;
                    completedTasks: z.ZodNumber;
                    failedTasks: z.ZodNumber;
                    averageExecutionTime: z.ZodOptional<z.ZodNumber>;
                }, "strip", z.ZodTypeAny, {
                    totalTasks: number;
                    completedTasks: number;
                    failedTasks: number;
                    averageExecutionTime?: number | undefined;
                }, {
                    totalTasks: number;
                    completedTasks: number;
                    failedTasks: number;
                    averageExecutionTime?: number | undefined;
                }>>;
                resourceUsage: z.ZodOptional<z.ZodObject<{
                    memoryUsage: z.ZodOptional<z.ZodNumber>;
                    cpuUsage: z.ZodOptional<z.ZodNumber>;
                    networkCalls: z.ZodOptional<z.ZodNumber>;
                }, "strip", z.ZodTypeAny, {
                    memoryUsage?: number | undefined;
                    cpuUsage?: number | undefined;
                    networkCalls?: number | undefined;
                }, {
                    memoryUsage?: number | undefined;
                    cpuUsage?: number | undefined;
                    networkCalls?: number | undefined;
                }>>;
                lastUpdate: z.ZodString;
                debugInfo: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, "strip", z.ZodTypeAny, {
                lastUpdate: string;
                executionStats?: {
                    totalTasks: number;
                    completedTasks: number;
                    failedTasks: number;
                    averageExecutionTime?: number | undefined;
                } | undefined;
                resourceUsage?: {
                    memoryUsage?: number | undefined;
                    cpuUsage?: number | undefined;
                    networkCalls?: number | undefined;
                } | undefined;
                debugInfo?: Record<string, unknown> | undefined;
            }, {
                lastUpdate: string;
                executionStats?: {
                    totalTasks: number;
                    completedTasks: number;
                    failedTasks: number;
                    averageExecutionTime?: number | undefined;
                } | undefined;
                resourceUsage?: {
                    memoryUsage?: number | undefined;
                    cpuUsage?: number | undefined;
                    networkCalls?: number | undefined;
                } | undefined;
                debugInfo?: Record<string, unknown> | undefined;
            }>>;
            startedAt: z.ZodOptional<z.ZodString>;
            completedAt: z.ZodOptional<z.ZodString>;
            error: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            userId: string;
            threadId: string;
            status: "idle" | "running" | "completed" | "failed" | "cancelled";
            shouldEnableRealtime: boolean;
            shouldSwitchToHistorical: boolean;
            metadata?: {
                lastUpdate: string;
                executionStats?: {
                    totalTasks: number;
                    completedTasks: number;
                    failedTasks: number;
                    averageExecutionTime?: number | undefined;
                } | undefined;
                resourceUsage?: {
                    memoryUsage?: number | undefined;
                    cpuUsage?: number | undefined;
                    networkCalls?: number | undefined;
                } | undefined;
                debugInfo?: Record<string, unknown> | undefined;
            } | undefined;
            totalSteps?: number | undefined;
            executionPhase?: "decomposition" | "execution" | "completion" | "init" | undefined;
            currentStep?: string | undefined;
            completedSteps?: number | undefined;
            progress?: number | undefined;
            runningMessages?: number | undefined;
            startedAt?: string | undefined;
            completedAt?: string | undefined;
            error?: string | undefined;
        }, {
            userId: string;
            threadId: string;
            status: "idle" | "running" | "completed" | "failed" | "cancelled";
            shouldEnableRealtime: boolean;
            shouldSwitchToHistorical: boolean;
            metadata?: {
                lastUpdate: string;
                executionStats?: {
                    totalTasks: number;
                    completedTasks: number;
                    failedTasks: number;
                    averageExecutionTime?: number | undefined;
                } | undefined;
                resourceUsage?: {
                    memoryUsage?: number | undefined;
                    cpuUsage?: number | undefined;
                    networkCalls?: number | undefined;
                } | undefined;
                debugInfo?: Record<string, unknown> | undefined;
            } | undefined;
            totalSteps?: number | undefined;
            executionPhase?: "decomposition" | "execution" | "completion" | "init" | undefined;
            currentStep?: string | undefined;
            completedSteps?: number | undefined;
            progress?: number | undefined;
            runningMessages?: number | undefined;
            startedAt?: string | undefined;
            completedAt?: string | undefined;
            error?: string | undefined;
        }>;
        runningMessages: z.ZodNumber;
        shouldEnableRealtime: z.ZodBoolean;
        shouldSwitchToHistorical: z.ZodBoolean;
        metadata: z.ZodOptional<z.ZodObject<{
            executionStats: z.ZodOptional<z.ZodObject<{
                totalTasks: z.ZodNumber;
                completedTasks: z.ZodNumber;
                failedTasks: z.ZodNumber;
                averageExecutionTime: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                totalTasks: number;
                completedTasks: number;
                failedTasks: number;
                averageExecutionTime?: number | undefined;
            }, {
                totalTasks: number;
                completedTasks: number;
                failedTasks: number;
                averageExecutionTime?: number | undefined;
            }>>;
            resourceUsage: z.ZodOptional<z.ZodObject<{
                memoryUsage: z.ZodOptional<z.ZodNumber>;
                cpuUsage: z.ZodOptional<z.ZodNumber>;
                networkCalls: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                memoryUsage?: number | undefined;
                cpuUsage?: number | undefined;
                networkCalls?: number | undefined;
            }, {
                memoryUsage?: number | undefined;
                cpuUsage?: number | undefined;
                networkCalls?: number | undefined;
            }>>;
            lastUpdate: z.ZodString;
            debugInfo: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, "strip", z.ZodTypeAny, {
            lastUpdate: string;
            executionStats?: {
                totalTasks: number;
                completedTasks: number;
                failedTasks: number;
                averageExecutionTime?: number | undefined;
            } | undefined;
            resourceUsage?: {
                memoryUsage?: number | undefined;
                cpuUsage?: number | undefined;
                networkCalls?: number | undefined;
            } | undefined;
            debugInfo?: Record<string, unknown> | undefined;
        }, {
            lastUpdate: string;
            executionStats?: {
                totalTasks: number;
                completedTasks: number;
                failedTasks: number;
                averageExecutionTime?: number | undefined;
            } | undefined;
            resourceUsage?: {
                memoryUsage?: number | undefined;
                cpuUsage?: number | undefined;
                networkCalls?: number | undefined;
            } | undefined;
            debugInfo?: Record<string, unknown> | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        runningMessages: number;
        shouldEnableRealtime: boolean;
        shouldSwitchToHistorical: boolean;
        executionStatus: {
            userId: string;
            threadId: string;
            status: "idle" | "running" | "completed" | "failed" | "cancelled";
            shouldEnableRealtime: boolean;
            shouldSwitchToHistorical: boolean;
            metadata?: {
                lastUpdate: string;
                executionStats?: {
                    totalTasks: number;
                    completedTasks: number;
                    failedTasks: number;
                    averageExecutionTime?: number | undefined;
                } | undefined;
                resourceUsage?: {
                    memoryUsage?: number | undefined;
                    cpuUsage?: number | undefined;
                    networkCalls?: number | undefined;
                } | undefined;
                debugInfo?: Record<string, unknown> | undefined;
            } | undefined;
            totalSteps?: number | undefined;
            executionPhase?: "decomposition" | "execution" | "completion" | "init" | undefined;
            currentStep?: string | undefined;
            completedSteps?: number | undefined;
            progress?: number | undefined;
            runningMessages?: number | undefined;
            startedAt?: string | undefined;
            completedAt?: string | undefined;
            error?: string | undefined;
        };
        metadata?: {
            lastUpdate: string;
            executionStats?: {
                totalTasks: number;
                completedTasks: number;
                failedTasks: number;
                averageExecutionTime?: number | undefined;
            } | undefined;
            resourceUsage?: {
                memoryUsage?: number | undefined;
                cpuUsage?: number | undefined;
                networkCalls?: number | undefined;
            } | undefined;
            debugInfo?: Record<string, unknown> | undefined;
        } | undefined;
    }, {
        runningMessages: number;
        shouldEnableRealtime: boolean;
        shouldSwitchToHistorical: boolean;
        executionStatus: {
            userId: string;
            threadId: string;
            status: "idle" | "running" | "completed" | "failed" | "cancelled";
            shouldEnableRealtime: boolean;
            shouldSwitchToHistorical: boolean;
            metadata?: {
                lastUpdate: string;
                executionStats?: {
                    totalTasks: number;
                    completedTasks: number;
                    failedTasks: number;
                    averageExecutionTime?: number | undefined;
                } | undefined;
                resourceUsage?: {
                    memoryUsage?: number | undefined;
                    cpuUsage?: number | undefined;
                    networkCalls?: number | undefined;
                } | undefined;
                debugInfo?: Record<string, unknown> | undefined;
            } | undefined;
            totalSteps?: number | undefined;
            executionPhase?: "decomposition" | "execution" | "completion" | "init" | undefined;
            currentStep?: string | undefined;
            completedSteps?: number | undefined;
            progress?: number | undefined;
            runningMessages?: number | undefined;
            startedAt?: string | undefined;
            completedAt?: string | undefined;
            error?: string | undefined;
        };
        metadata?: {
            lastUpdate: string;
            executionStats?: {
                totalTasks: number;
                completedTasks: number;
                failedTasks: number;
                averageExecutionTime?: number | undefined;
            } | undefined;
            resourceUsage?: {
                memoryUsage?: number | undefined;
                cpuUsage?: number | undefined;
                networkCalls?: number | undefined;
            } | undefined;
            debugInfo?: Record<string, unknown> | undefined;
        } | undefined;
    }>;
    readonly KVLockMetadataSchema: z.ZodObject<{
        lockId: z.ZodString;
        userId: z.ZodString;
        threadId: z.ZodString;
        lockKey: z.ZodString;
        acquiredAt: z.ZodString;
        expiresAt: z.ZodString;
        ttlSeconds: z.ZodNumber;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        userId: string;
        threadId: string;
        lockId: string;
        lockKey: string;
        acquiredAt: string;
        expiresAt: string;
        ttlSeconds: number;
        metadata?: Record<string, unknown> | undefined;
    }, {
        userId: string;
        threadId: string;
        lockId: string;
        lockKey: string;
        acquiredAt: string;
        expiresAt: string;
        ttlSeconds: number;
        metadata?: Record<string, unknown> | undefined;
    }>;
    readonly CompilerConfigSchema: z.ZodObject<{
        environment: z.ZodEnum<["development", "staging", "production"]>;
        enableLogging: z.ZodDefault<z.ZodBoolean>;
        enableFailsafe: z.ZodDefault<z.ZodBoolean>;
        maxConcurrentJobs: z.ZodDefault<z.ZodNumber>;
        preInit: z.ZodOptional<z.ZodObject<{
            skipKvLock: z.ZodDefault<z.ZodBoolean>;
            lockTtlSeconds: z.ZodDefault<z.ZodNumber>;
            validateBrandKit: z.ZodDefault<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            skipKvLock: boolean;
            lockTtlSeconds: number;
            validateBrandKit: boolean;
        }, {
            skipKvLock?: boolean | undefined;
            lockTtlSeconds?: number | undefined;
            validateBrandKit?: boolean | undefined;
        }>>;
        orchestration: z.ZodOptional<z.ZodObject<{
            enableDecomposition: z.ZodDefault<z.ZodBoolean>;
            decompositionThreshold: z.ZodObject<{
                minComplexity: z.ZodDefault<z.ZodNumber>;
                maxSteps: z.ZodDefault<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                minComplexity: number;
                maxSteps: number;
            }, {
                minComplexity?: number | undefined;
                maxSteps?: number | undefined;
            }>;
        }, "strip", z.ZodTypeAny, {
            enableDecomposition: boolean;
            decompositionThreshold: {
                minComplexity: number;
                maxSteps: number;
            };
        }, {
            decompositionThreshold: {
                minComplexity?: number | undefined;
                maxSteps?: number | undefined;
            };
            enableDecomposition?: boolean | undefined;
        }>>;
        database: z.ZodOptional<z.ZodObject<{
            connectionPool: z.ZodOptional<z.ZodObject<{
                maxConnections: z.ZodDefault<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                maxConnections: number;
            }, {
                maxConnections?: number | undefined;
            }>>;
            caching: z.ZodOptional<z.ZodObject<{
                enabled: z.ZodDefault<z.ZodBoolean>;
                ttlSeconds: z.ZodDefault<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                ttlSeconds: number;
                enabled: boolean;
            }, {
                ttlSeconds?: number | undefined;
                enabled?: boolean | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            connectionPool?: {
                maxConnections: number;
            } | undefined;
            caching?: {
                ttlSeconds: number;
                enabled: boolean;
            } | undefined;
        }, {
            connectionPool?: {
                maxConnections?: number | undefined;
            } | undefined;
            caching?: {
                ttlSeconds?: number | undefined;
                enabled?: boolean | undefined;
            } | undefined;
        }>>;
        streaming: z.ZodOptional<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            batchSize: z.ZodDefault<z.ZodNumber>;
            flushIntervalMs: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            enabled: boolean;
            batchSize: number;
            flushIntervalMs: number;
        }, {
            enabled?: boolean | undefined;
            batchSize?: number | undefined;
            flushIntervalMs?: number | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        environment: "development" | "staging" | "production";
        enableLogging: boolean;
        enableFailsafe: boolean;
        maxConcurrentJobs: number;
        preInit?: {
            skipKvLock: boolean;
            lockTtlSeconds: number;
            validateBrandKit: boolean;
        } | undefined;
        orchestration?: {
            enableDecomposition: boolean;
            decompositionThreshold: {
                minComplexity: number;
                maxSteps: number;
            };
        } | undefined;
        database?: {
            connectionPool?: {
                maxConnections: number;
            } | undefined;
            caching?: {
                ttlSeconds: number;
                enabled: boolean;
            } | undefined;
        } | undefined;
        streaming?: {
            enabled: boolean;
            batchSize: number;
            flushIntervalMs: number;
        } | undefined;
    }, {
        environment: "development" | "staging" | "production";
        enableLogging?: boolean | undefined;
        enableFailsafe?: boolean | undefined;
        maxConcurrentJobs?: number | undefined;
        preInit?: {
            skipKvLock?: boolean | undefined;
            lockTtlSeconds?: number | undefined;
            validateBrandKit?: boolean | undefined;
        } | undefined;
        orchestration?: {
            decompositionThreshold: {
                minComplexity?: number | undefined;
                maxSteps?: number | undefined;
            };
            enableDecomposition?: boolean | undefined;
        } | undefined;
        database?: {
            connectionPool?: {
                maxConnections?: number | undefined;
            } | undefined;
            caching?: {
                ttlSeconds?: number | undefined;
                enabled?: boolean | undefined;
            } | undefined;
        } | undefined;
        streaming?: {
            enabled?: boolean | undefined;
            batchSize?: number | undefined;
            flushIntervalMs?: number | undefined;
        } | undefined;
    }>;
    readonly CompilerErrorSchema: z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        timestamp: z.ZodString;
        context: z.ZodOptional<z.ZodObject<{
            userId: z.ZodString;
            threadId: z.ZodString;
            runId: z.ZodString;
            jwtToken: z.ZodString;
            timestamp: z.ZodString;
            brandKitId: z.ZodOptional<z.ZodString>;
            agentType: z.ZodOptional<z.ZodEnum<["CONTENT_GENERATION_AGENT", "TEXT_ANALYSIS_AGENT", "IMAGE_ANALYSIS_AGENT", "SOCIAL_MEDIA_AGENT", "EMAIL_MARKETING_AGENT", "SEO_OPTIMIZATION_AGENT", "BRAND_ANALYSIS_AGENT", "COMPETITOR_ANALYSIS_AGENT"]>>;
        }, "strip", z.ZodTypeAny, {
            userId: string;
            threadId: string;
            runId: string;
            jwtToken: string;
            timestamp: string;
            brandKitId?: string | undefined;
            agentType?: "CONTENT_GENERATION_AGENT" | "TEXT_ANALYSIS_AGENT" | "IMAGE_ANALYSIS_AGENT" | "SOCIAL_MEDIA_AGENT" | "EMAIL_MARKETING_AGENT" | "SEO_OPTIMIZATION_AGENT" | "BRAND_ANALYSIS_AGENT" | "COMPETITOR_ANALYSIS_AGENT" | undefined;
        }, {
            userId: string;
            threadId: string;
            runId: string;
            jwtToken: string;
            timestamp: string;
            brandKitId?: string | undefined;
            agentType?: "CONTENT_GENERATION_AGENT" | "TEXT_ANALYSIS_AGENT" | "IMAGE_ANALYSIS_AGENT" | "SOCIAL_MEDIA_AGENT" | "EMAIL_MARKETING_AGENT" | "SEO_OPTIMIZATION_AGENT" | "BRAND_ANALYSIS_AGENT" | "COMPETITOR_ANALYSIS_AGENT" | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        timestamp: string;
        code: string;
        message: string;
        context?: {
            userId: string;
            threadId: string;
            runId: string;
            jwtToken: string;
            timestamp: string;
            brandKitId?: string | undefined;
            agentType?: "CONTENT_GENERATION_AGENT" | "TEXT_ANALYSIS_AGENT" | "IMAGE_ANALYSIS_AGENT" | "SOCIAL_MEDIA_AGENT" | "EMAIL_MARKETING_AGENT" | "SEO_OPTIMIZATION_AGENT" | "BRAND_ANALYSIS_AGENT" | "COMPETITOR_ANALYSIS_AGENT" | undefined;
        } | undefined;
        details?: Record<string, unknown> | undefined;
    }, {
        timestamp: string;
        code: string;
        message: string;
        context?: {
            userId: string;
            threadId: string;
            runId: string;
            jwtToken: string;
            timestamp: string;
            brandKitId?: string | undefined;
            agentType?: "CONTENT_GENERATION_AGENT" | "TEXT_ANALYSIS_AGENT" | "IMAGE_ANALYSIS_AGENT" | "SOCIAL_MEDIA_AGENT" | "EMAIL_MARKETING_AGENT" | "SEO_OPTIMIZATION_AGENT" | "BRAND_ANALYSIS_AGENT" | "COMPETITOR_ANALYSIS_AGENT" | undefined;
        } | undefined;
        details?: Record<string, unknown> | undefined;
    }>;
    readonly ValidationErrorSchema: z.ZodObject<{
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        timestamp: z.ZodString;
        context: z.ZodOptional<z.ZodObject<{
            userId: z.ZodString;
            threadId: z.ZodString;
            runId: z.ZodString;
            jwtToken: z.ZodString;
            timestamp: z.ZodString;
            brandKitId: z.ZodOptional<z.ZodString>;
            agentType: z.ZodOptional<z.ZodEnum<["CONTENT_GENERATION_AGENT", "TEXT_ANALYSIS_AGENT", "IMAGE_ANALYSIS_AGENT", "SOCIAL_MEDIA_AGENT", "EMAIL_MARKETING_AGENT", "SEO_OPTIMIZATION_AGENT", "BRAND_ANALYSIS_AGENT", "COMPETITOR_ANALYSIS_AGENT"]>>;
        }, "strip", z.ZodTypeAny, {
            userId: string;
            threadId: string;
            runId: string;
            jwtToken: string;
            timestamp: string;
            brandKitId?: string | undefined;
            agentType?: "CONTENT_GENERATION_AGENT" | "TEXT_ANALYSIS_AGENT" | "IMAGE_ANALYSIS_AGENT" | "SOCIAL_MEDIA_AGENT" | "EMAIL_MARKETING_AGENT" | "SEO_OPTIMIZATION_AGENT" | "BRAND_ANALYSIS_AGENT" | "COMPETITOR_ANALYSIS_AGENT" | undefined;
        }, {
            userId: string;
            threadId: string;
            runId: string;
            jwtToken: string;
            timestamp: string;
            brandKitId?: string | undefined;
            agentType?: "CONTENT_GENERATION_AGENT" | "TEXT_ANALYSIS_AGENT" | "IMAGE_ANALYSIS_AGENT" | "SOCIAL_MEDIA_AGENT" | "EMAIL_MARKETING_AGENT" | "SEO_OPTIMIZATION_AGENT" | "BRAND_ANALYSIS_AGENT" | "COMPETITOR_ANALYSIS_AGENT" | undefined;
        }>>;
    } & {
        code: z.ZodLiteral<"VALIDATION_ERROR">;
        field: z.ZodOptional<z.ZodString>;
        expectedType: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        timestamp: string;
        code: "VALIDATION_ERROR";
        message: string;
        context?: {
            userId: string;
            threadId: string;
            runId: string;
            jwtToken: string;
            timestamp: string;
            brandKitId?: string | undefined;
            agentType?: "CONTENT_GENERATION_AGENT" | "TEXT_ANALYSIS_AGENT" | "IMAGE_ANALYSIS_AGENT" | "SOCIAL_MEDIA_AGENT" | "EMAIL_MARKETING_AGENT" | "SEO_OPTIMIZATION_AGENT" | "BRAND_ANALYSIS_AGENT" | "COMPETITOR_ANALYSIS_AGENT" | undefined;
        } | undefined;
        details?: Record<string, unknown> | undefined;
        field?: string | undefined;
        expectedType?: string | undefined;
    }, {
        timestamp: string;
        code: "VALIDATION_ERROR";
        message: string;
        context?: {
            userId: string;
            threadId: string;
            runId: string;
            jwtToken: string;
            timestamp: string;
            brandKitId?: string | undefined;
            agentType?: "CONTENT_GENERATION_AGENT" | "TEXT_ANALYSIS_AGENT" | "IMAGE_ANALYSIS_AGENT" | "SOCIAL_MEDIA_AGENT" | "EMAIL_MARKETING_AGENT" | "SEO_OPTIMIZATION_AGENT" | "BRAND_ANALYSIS_AGENT" | "COMPETITOR_ANALYSIS_AGENT" | undefined;
        } | undefined;
        details?: Record<string, unknown> | undefined;
        field?: string | undefined;
        expectedType?: string | undefined;
    }>;
    readonly LockErrorSchema: z.ZodObject<{
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        timestamp: z.ZodString;
        context: z.ZodOptional<z.ZodObject<{
            userId: z.ZodString;
            threadId: z.ZodString;
            runId: z.ZodString;
            jwtToken: z.ZodString;
            timestamp: z.ZodString;
            brandKitId: z.ZodOptional<z.ZodString>;
            agentType: z.ZodOptional<z.ZodEnum<["CONTENT_GENERATION_AGENT", "TEXT_ANALYSIS_AGENT", "IMAGE_ANALYSIS_AGENT", "SOCIAL_MEDIA_AGENT", "EMAIL_MARKETING_AGENT", "SEO_OPTIMIZATION_AGENT", "BRAND_ANALYSIS_AGENT", "COMPETITOR_ANALYSIS_AGENT"]>>;
        }, "strip", z.ZodTypeAny, {
            userId: string;
            threadId: string;
            runId: string;
            jwtToken: string;
            timestamp: string;
            brandKitId?: string | undefined;
            agentType?: "CONTENT_GENERATION_AGENT" | "TEXT_ANALYSIS_AGENT" | "IMAGE_ANALYSIS_AGENT" | "SOCIAL_MEDIA_AGENT" | "EMAIL_MARKETING_AGENT" | "SEO_OPTIMIZATION_AGENT" | "BRAND_ANALYSIS_AGENT" | "COMPETITOR_ANALYSIS_AGENT" | undefined;
        }, {
            userId: string;
            threadId: string;
            runId: string;
            jwtToken: string;
            timestamp: string;
            brandKitId?: string | undefined;
            agentType?: "CONTENT_GENERATION_AGENT" | "TEXT_ANALYSIS_AGENT" | "IMAGE_ANALYSIS_AGENT" | "SOCIAL_MEDIA_AGENT" | "EMAIL_MARKETING_AGENT" | "SEO_OPTIMIZATION_AGENT" | "BRAND_ANALYSIS_AGENT" | "COMPETITOR_ANALYSIS_AGENT" | undefined;
        }>>;
    } & {
        code: z.ZodLiteral<"LOCK_ERROR">;
        lockKey: z.ZodString;
        lockHolder: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        timestamp: string;
        code: "LOCK_ERROR";
        message: string;
        lockKey: string;
        context?: {
            userId: string;
            threadId: string;
            runId: string;
            jwtToken: string;
            timestamp: string;
            brandKitId?: string | undefined;
            agentType?: "CONTENT_GENERATION_AGENT" | "TEXT_ANALYSIS_AGENT" | "IMAGE_ANALYSIS_AGENT" | "SOCIAL_MEDIA_AGENT" | "EMAIL_MARKETING_AGENT" | "SEO_OPTIMIZATION_AGENT" | "BRAND_ANALYSIS_AGENT" | "COMPETITOR_ANALYSIS_AGENT" | undefined;
        } | undefined;
        details?: Record<string, unknown> | undefined;
        lockHolder?: string | undefined;
    }, {
        timestamp: string;
        code: "LOCK_ERROR";
        message: string;
        lockKey: string;
        context?: {
            userId: string;
            threadId: string;
            runId: string;
            jwtToken: string;
            timestamp: string;
            brandKitId?: string | undefined;
            agentType?: "CONTENT_GENERATION_AGENT" | "TEXT_ANALYSIS_AGENT" | "IMAGE_ANALYSIS_AGENT" | "SOCIAL_MEDIA_AGENT" | "EMAIL_MARKETING_AGENT" | "SEO_OPTIMIZATION_AGENT" | "BRAND_ANALYSIS_AGENT" | "COMPETITOR_ANALYSIS_AGENT" | undefined;
        } | undefined;
        details?: Record<string, unknown> | undefined;
        lockHolder?: string | undefined;
    }>;
    readonly OrchestrationErrorSchema: z.ZodObject<{
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        timestamp: z.ZodString;
        context: z.ZodOptional<z.ZodObject<{
            userId: z.ZodString;
            threadId: z.ZodString;
            runId: z.ZodString;
            jwtToken: z.ZodString;
            timestamp: z.ZodString;
            brandKitId: z.ZodOptional<z.ZodString>;
            agentType: z.ZodOptional<z.ZodEnum<["CONTENT_GENERATION_AGENT", "TEXT_ANALYSIS_AGENT", "IMAGE_ANALYSIS_AGENT", "SOCIAL_MEDIA_AGENT", "EMAIL_MARKETING_AGENT", "SEO_OPTIMIZATION_AGENT", "BRAND_ANALYSIS_AGENT", "COMPETITOR_ANALYSIS_AGENT"]>>;
        }, "strip", z.ZodTypeAny, {
            userId: string;
            threadId: string;
            runId: string;
            jwtToken: string;
            timestamp: string;
            brandKitId?: string | undefined;
            agentType?: "CONTENT_GENERATION_AGENT" | "TEXT_ANALYSIS_AGENT" | "IMAGE_ANALYSIS_AGENT" | "SOCIAL_MEDIA_AGENT" | "EMAIL_MARKETING_AGENT" | "SEO_OPTIMIZATION_AGENT" | "BRAND_ANALYSIS_AGENT" | "COMPETITOR_ANALYSIS_AGENT" | undefined;
        }, {
            userId: string;
            threadId: string;
            runId: string;
            jwtToken: string;
            timestamp: string;
            brandKitId?: string | undefined;
            agentType?: "CONTENT_GENERATION_AGENT" | "TEXT_ANALYSIS_AGENT" | "IMAGE_ANALYSIS_AGENT" | "SOCIAL_MEDIA_AGENT" | "EMAIL_MARKETING_AGENT" | "SEO_OPTIMIZATION_AGENT" | "BRAND_ANALYSIS_AGENT" | "COMPETITOR_ANALYSIS_AGENT" | undefined;
        }>>;
    } & {
        code: z.ZodLiteral<"ORCHESTRATION_ERROR">;
        phase: z.ZodEnum<["init", "decomposition", "execution", "completion"]>;
        stepId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        timestamp: string;
        code: "ORCHESTRATION_ERROR";
        message: string;
        phase: "decomposition" | "execution" | "completion" | "init";
        context?: {
            userId: string;
            threadId: string;
            runId: string;
            jwtToken: string;
            timestamp: string;
            brandKitId?: string | undefined;
            agentType?: "CONTENT_GENERATION_AGENT" | "TEXT_ANALYSIS_AGENT" | "IMAGE_ANALYSIS_AGENT" | "SOCIAL_MEDIA_AGENT" | "EMAIL_MARKETING_AGENT" | "SEO_OPTIMIZATION_AGENT" | "BRAND_ANALYSIS_AGENT" | "COMPETITOR_ANALYSIS_AGENT" | undefined;
        } | undefined;
        details?: Record<string, unknown> | undefined;
        stepId?: string | undefined;
    }, {
        timestamp: string;
        code: "ORCHESTRATION_ERROR";
        message: string;
        phase: "decomposition" | "execution" | "completion" | "init";
        context?: {
            userId: string;
            threadId: string;
            runId: string;
            jwtToken: string;
            timestamp: string;
            brandKitId?: string | undefined;
            agentType?: "CONTENT_GENERATION_AGENT" | "TEXT_ANALYSIS_AGENT" | "IMAGE_ANALYSIS_AGENT" | "SOCIAL_MEDIA_AGENT" | "EMAIL_MARKETING_AGENT" | "SEO_OPTIMIZATION_AGENT" | "BRAND_ANALYSIS_AGENT" | "COMPETITOR_ANALYSIS_AGENT" | undefined;
        } | undefined;
        details?: Record<string, unknown> | undefined;
        stepId?: string | undefined;
    }>;
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
        task_type: "decomposition" | "completion" | "analysis" | "orchestration" | "api_call" | "image_generation" | "text_generation";
        task_sequence: number;
        is_actively_running: boolean;
        id?: string | undefined;
        created_at?: string | undefined;
        updated_at?: string | undefined;
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
    }, {
        user_id: string;
        thread_id: string;
        task_name: string;
        task_type: "decomposition" | "completion" | "analysis" | "orchestration" | "api_call" | "image_generation" | "text_generation";
        task_sequence: number;
        status?: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED" | "CANCELLED" | undefined;
        id?: string | undefined;
        created_at?: string | undefined;
        updated_at?: string | undefined;
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
    }>;
    readonly AgentTaskStatusSchema: z.ZodEnum<["PENDING", "RUNNING", "COMPLETED", "FAILED", "CANCELLED"]>;
    readonly AgentTaskTypeSchema: z.ZodEnum<["api_call", "image_generation", "text_generation", "analysis", "completion", "decomposition", "orchestration"]>;
    readonly CSISchema: z.ZodObject<{
        completedSteps: z.ZodArray<z.ZodString, "many">;
        currentProgress: z.ZodNumber;
        totalSteps: z.ZodNumber;
        currentStep: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        totalSteps: number;
        completedSteps: string[];
        currentProgress: number;
        currentStep?: string | undefined;
    }, {
        totalSteps: number;
        completedSteps: string[];
        currentProgress: number;
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
            totalSteps: number;
            completedSteps: string[];
            currentProgress: number;
            currentStep?: string | undefined;
        }, {
            totalSteps: number;
            completedSteps: string[];
            currentProgress: number;
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
        brandContext?: Record<string, unknown> | undefined;
        previousCSI?: {
            totalSteps: number;
            completedSteps: string[];
            currentProgress: number;
            currentStep?: string | undefined;
        } | undefined;
        executionMetadata?: Record<string, unknown> | undefined;
    }, {
        userId: string;
        threadId: string;
        agentType: "CONTENT_GENERATION_AGENT" | "TEXT_ANALYSIS_AGENT" | "IMAGE_ANALYSIS_AGENT" | "SOCIAL_MEDIA_AGENT" | "EMAIL_MARKETING_AGENT" | "SEO_OPTIMIZATION_AGENT" | "BRAND_ANALYSIS_AGENT" | "COMPETITOR_ANALYSIS_AGENT";
        taskSequence: number;
        runId?: string | undefined;
        brandContext?: Record<string, unknown> | undefined;
        previousCSI?: {
            totalSteps: number;
            completedSteps: string[];
            currentProgress: number;
            currentStep?: string | undefined;
        } | undefined;
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
        agentType: "CONTENT_GENERATION_AGENT" | "TEXT_ANALYSIS_AGENT" | "IMAGE_ANALYSIS_AGENT" | "SOCIAL_MEDIA_AGENT" | "EMAIL_MARKETING_AGENT" | "SEO_OPTIMIZATION_AGENT" | "BRAND_ANALYSIS_AGENT" | "COMPETITOR_ANALYSIS_AGENT";
        status: "running" | "completed" | "failed" | "pending";
        totalSteps: number;
        progress: number;
        step: string;
        stepNumber: number;
        toolName: string;
        timestamp?: string | undefined;
        assets?: {
            type: string;
            url: string;
            metadata?: Record<string, unknown> | undefined;
        }[] | undefined;
        executionTime?: number | undefined;
    }, {
        agentType: "CONTENT_GENERATION_AGENT" | "TEXT_ANALYSIS_AGENT" | "IMAGE_ANALYSIS_AGENT" | "SOCIAL_MEDIA_AGENT" | "EMAIL_MARKETING_AGENT" | "SEO_OPTIMIZATION_AGENT" | "BRAND_ANALYSIS_AGENT" | "COMPETITOR_ANALYSIS_AGENT";
        status: "running" | "completed" | "failed" | "pending";
        totalSteps: number;
        progress: number;
        step: string;
        stepNumber: number;
        toolName: string;
        timestamp?: string | undefined;
        assets?: {
            type: string;
            url: string;
            metadata?: Record<string, unknown> | undefined;
        }[] | undefined;
        executionTime?: number | undefined;
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
        userId: string;
        threadId: string;
        status: "idle" | "running" | "completed" | "failed";
        metadata?: Record<string, unknown> | undefined;
        totalSteps?: number | undefined;
        currentStep?: string | undefined;
        completedSteps?: number | undefined;
        progress?: number | undefined;
        startedAt?: string | undefined;
        completedAt?: string | undefined;
        error?: string | undefined;
    }, {
        userId: string;
        threadId: string;
        status: "idle" | "running" | "completed" | "failed";
        metadata?: Record<string, unknown> | undefined;
        totalSteps?: number | undefined;
        currentStep?: string | undefined;
        completedSteps?: number | undefined;
        progress?: number | undefined;
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
        task_type: "decomposition" | "completion" | "analysis" | "orchestration" | "api_call" | "image_generation" | "text_generation";
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
        task_type: "decomposition" | "completion" | "analysis" | "orchestration" | "api_call" | "image_generation" | "text_generation";
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
        description: string;
        name: string;
        parameters: {
            type: "object";
            properties: Record<string, unknown>;
            required: string[];
        };
    }, {
        description: string;
        name: string;
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
            description: string;
            name: string;
            parameters: {
                type: "object";
                properties: Record<string, unknown>;
                required: string[];
            };
        }, {
            description: string;
            name: string;
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
        taskType: "decomposition" | "completion" | "analysis" | "orchestration" | "api_call" | "image_generation" | "text_generation";
        apiRoute: string;
        progressPercent: number;
        functionDefinition: {
            description: string;
            name: string;
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
        taskType: "decomposition" | "completion" | "analysis" | "orchestration" | "api_call" | "image_generation" | "text_generation";
        apiRoute: string;
        progressPercent: number;
        functionDefinition: {
            description: string;
            name: string;
            parameters: {
                type: "object";
                properties: Record<string, unknown>;
                required: string[];
            };
        };
        systemPrompt: string;
        userPromptTemplate: (args_0: Record<string, unknown>, ...args: unknown[]) => string;
    }>;
    readonly BrandKitSchema: z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        colors: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        fonts: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        logo_url: z.ZodOptional<z.ZodString>;
        guidelines: z.ZodOptional<z.ZodString>;
        industry: z.ZodOptional<z.ZodString>;
        brand_voice: z.ZodOptional<z.ZodEnum<["professional", "casual", "friendly", "authoritative", "playful", "luxurious"]>>;
        target_audience: z.ZodOptional<z.ZodString>;
        created_at: z.ZodOptional<z.ZodString>;
        updated_at: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        description?: string | undefined;
        id?: string | undefined;
        colors?: string[] | undefined;
        fonts?: string[] | undefined;
        logo_url?: string | undefined;
        guidelines?: string | undefined;
        industry?: string | undefined;
        brand_voice?: "professional" | "casual" | "friendly" | "authoritative" | "playful" | "luxurious" | undefined;
        target_audience?: string | undefined;
        created_at?: string | undefined;
        updated_at?: string | undefined;
    }, {
        name: string;
        description?: string | undefined;
        id?: string | undefined;
        colors?: string[] | undefined;
        fonts?: string[] | undefined;
        logo_url?: string | undefined;
        guidelines?: string | undefined;
        industry?: string | undefined;
        brand_voice?: "professional" | "casual" | "friendly" | "authoritative" | "playful" | "luxurious" | undefined;
        target_audience?: string | undefined;
        created_at?: string | undefined;
        updated_at?: string | undefined;
    }>;
    readonly BrandAssetSchema: z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        brand_kit_id: z.ZodString;
        asset_type: z.ZodEnum<["logo", "product_photo", "lifestyle_image", "icon", "banner", "pattern", "texture"]>;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        url: z.ZodString;
        file_size: z.ZodOptional<z.ZodNumber>;
        dimensions: z.ZodOptional<z.ZodObject<{
            width: z.ZodNumber;
            height: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            width: number;
            height: number;
        }, {
            width: number;
            height: number;
        }>>;
        format: z.ZodEnum<["png", "jpg", "jpeg", "svg", "webp", "gif"]>;
        tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        is_primary: z.ZodDefault<z.ZodBoolean>;
        created_at: z.ZodOptional<z.ZodString>;
        updated_at: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        url: string;
        name: string;
        brand_kit_id: string;
        asset_type: "logo" | "product_photo" | "lifestyle_image" | "icon" | "banner" | "pattern" | "texture";
        format: "png" | "jpg" | "jpeg" | "svg" | "webp" | "gif";
        is_primary: boolean;
        description?: string | undefined;
        id?: string | undefined;
        created_at?: string | undefined;
        updated_at?: string | undefined;
        file_size?: number | undefined;
        dimensions?: {
            width: number;
            height: number;
        } | undefined;
        tags?: string[] | undefined;
    }, {
        url: string;
        name: string;
        brand_kit_id: string;
        asset_type: "logo" | "product_photo" | "lifestyle_image" | "icon" | "banner" | "pattern" | "texture";
        format: "png" | "jpg" | "jpeg" | "svg" | "webp" | "gif";
        description?: string | undefined;
        id?: string | undefined;
        created_at?: string | undefined;
        updated_at?: string | undefined;
        file_size?: number | undefined;
        dimensions?: {
            width: number;
            height: number;
        } | undefined;
        tags?: string[] | undefined;
        is_primary?: boolean | undefined;
    }>;
    readonly BrandContextSchema: z.ZodObject<{
        brand_kit: z.ZodOptional<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            colors: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            fonts: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            logo_url: z.ZodOptional<z.ZodString>;
            guidelines: z.ZodOptional<z.ZodString>;
            industry: z.ZodOptional<z.ZodString>;
            brand_voice: z.ZodOptional<z.ZodEnum<["professional", "casual", "friendly", "authoritative", "playful", "luxurious"]>>;
            target_audience: z.ZodOptional<z.ZodString>;
            created_at: z.ZodOptional<z.ZodString>;
            updated_at: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            description?: string | undefined;
            id?: string | undefined;
            colors?: string[] | undefined;
            fonts?: string[] | undefined;
            logo_url?: string | undefined;
            guidelines?: string | undefined;
            industry?: string | undefined;
            brand_voice?: "professional" | "casual" | "friendly" | "authoritative" | "playful" | "luxurious" | undefined;
            target_audience?: string | undefined;
            created_at?: string | undefined;
            updated_at?: string | undefined;
        }, {
            name: string;
            description?: string | undefined;
            id?: string | undefined;
            colors?: string[] | undefined;
            fonts?: string[] | undefined;
            logo_url?: string | undefined;
            guidelines?: string | undefined;
            industry?: string | undefined;
            brand_voice?: "professional" | "casual" | "friendly" | "authoritative" | "playful" | "luxurious" | undefined;
            target_audience?: string | undefined;
            created_at?: string | undefined;
            updated_at?: string | undefined;
        }>>;
        selected_assets: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            brand_kit_id: z.ZodString;
            asset_type: z.ZodEnum<["logo", "product_photo", "lifestyle_image", "icon", "banner", "pattern", "texture"]>;
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            url: z.ZodString;
            file_size: z.ZodOptional<z.ZodNumber>;
            dimensions: z.ZodOptional<z.ZodObject<{
                width: z.ZodNumber;
                height: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                width: number;
                height: number;
            }, {
                width: number;
                height: number;
            }>>;
            format: z.ZodEnum<["png", "jpg", "jpeg", "svg", "webp", "gif"]>;
            tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            is_primary: z.ZodDefault<z.ZodBoolean>;
            created_at: z.ZodOptional<z.ZodString>;
            updated_at: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            url: string;
            name: string;
            brand_kit_id: string;
            asset_type: "logo" | "product_photo" | "lifestyle_image" | "icon" | "banner" | "pattern" | "texture";
            format: "png" | "jpg" | "jpeg" | "svg" | "webp" | "gif";
            is_primary: boolean;
            description?: string | undefined;
            id?: string | undefined;
            created_at?: string | undefined;
            updated_at?: string | undefined;
            file_size?: number | undefined;
            dimensions?: {
                width: number;
                height: number;
            } | undefined;
            tags?: string[] | undefined;
        }, {
            url: string;
            name: string;
            brand_kit_id: string;
            asset_type: "logo" | "product_photo" | "lifestyle_image" | "icon" | "banner" | "pattern" | "texture";
            format: "png" | "jpg" | "jpeg" | "svg" | "webp" | "gif";
            description?: string | undefined;
            id?: string | undefined;
            created_at?: string | undefined;
            updated_at?: string | undefined;
            file_size?: number | undefined;
            dimensions?: {
                width: number;
                height: number;
            } | undefined;
            tags?: string[] | undefined;
            is_primary?: boolean | undefined;
        }>, "many">>;
        brand_guidelines: z.ZodOptional<z.ZodString>;
        style_preferences: z.ZodOptional<z.ZodObject<{
            tone: z.ZodOptional<z.ZodString>;
            style: z.ZodOptional<z.ZodString>;
            mood: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            tone?: string | undefined;
            style?: string | undefined;
            mood?: string | undefined;
        }, {
            tone?: string | undefined;
            style?: string | undefined;
            mood?: string | undefined;
        }>>;
        reference_images: z.ZodOptional<z.ZodArray<z.ZodObject<{
            url: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            weight: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            url: string;
            weight: number;
            description?: string | undefined;
        }, {
            url: string;
            description?: string | undefined;
            weight?: number | undefined;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        brand_kit?: {
            name: string;
            description?: string | undefined;
            id?: string | undefined;
            colors?: string[] | undefined;
            fonts?: string[] | undefined;
            logo_url?: string | undefined;
            guidelines?: string | undefined;
            industry?: string | undefined;
            brand_voice?: "professional" | "casual" | "friendly" | "authoritative" | "playful" | "luxurious" | undefined;
            target_audience?: string | undefined;
            created_at?: string | undefined;
            updated_at?: string | undefined;
        } | undefined;
        selected_assets?: {
            url: string;
            name: string;
            brand_kit_id: string;
            asset_type: "logo" | "product_photo" | "lifestyle_image" | "icon" | "banner" | "pattern" | "texture";
            format: "png" | "jpg" | "jpeg" | "svg" | "webp" | "gif";
            is_primary: boolean;
            description?: string | undefined;
            id?: string | undefined;
            created_at?: string | undefined;
            updated_at?: string | undefined;
            file_size?: number | undefined;
            dimensions?: {
                width: number;
                height: number;
            } | undefined;
            tags?: string[] | undefined;
        }[] | undefined;
        brand_guidelines?: string | undefined;
        style_preferences?: {
            tone?: string | undefined;
            style?: string | undefined;
            mood?: string | undefined;
        } | undefined;
        reference_images?: {
            url: string;
            weight: number;
            description?: string | undefined;
        }[] | undefined;
    }, {
        brand_kit?: {
            name: string;
            description?: string | undefined;
            id?: string | undefined;
            colors?: string[] | undefined;
            fonts?: string[] | undefined;
            logo_url?: string | undefined;
            guidelines?: string | undefined;
            industry?: string | undefined;
            brand_voice?: "professional" | "casual" | "friendly" | "authoritative" | "playful" | "luxurious" | undefined;
            target_audience?: string | undefined;
            created_at?: string | undefined;
            updated_at?: string | undefined;
        } | undefined;
        selected_assets?: {
            url: string;
            name: string;
            brand_kit_id: string;
            asset_type: "logo" | "product_photo" | "lifestyle_image" | "icon" | "banner" | "pattern" | "texture";
            format: "png" | "jpg" | "jpeg" | "svg" | "webp" | "gif";
            description?: string | undefined;
            id?: string | undefined;
            created_at?: string | undefined;
            updated_at?: string | undefined;
            file_size?: number | undefined;
            dimensions?: {
                width: number;
                height: number;
            } | undefined;
            tags?: string[] | undefined;
            is_primary?: boolean | undefined;
        }[] | undefined;
        brand_guidelines?: string | undefined;
        style_preferences?: {
            tone?: string | undefined;
            style?: string | undefined;
            mood?: string | undefined;
        } | undefined;
        reference_images?: {
            url: string;
            description?: string | undefined;
            weight?: number | undefined;
        }[] | undefined;
    }>;
    readonly CreateBrandKitSchema: z.ZodObject<{
        description: z.ZodOptional<z.ZodString>;
        colors: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        fonts: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        logo_url: z.ZodOptional<z.ZodString>;
        guidelines: z.ZodOptional<z.ZodString>;
        industry: z.ZodOptional<z.ZodString>;
        brand_voice: z.ZodOptional<z.ZodEnum<["professional", "casual", "friendly", "authoritative", "playful", "luxurious"]>>;
        target_audience: z.ZodOptional<z.ZodString>;
    } & {
        name: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        description?: string | undefined;
        colors?: string[] | undefined;
        fonts?: string[] | undefined;
        logo_url?: string | undefined;
        guidelines?: string | undefined;
        industry?: string | undefined;
        brand_voice?: "professional" | "casual" | "friendly" | "authoritative" | "playful" | "luxurious" | undefined;
        target_audience?: string | undefined;
    }, {
        name: string;
        description?: string | undefined;
        colors?: string[] | undefined;
        fonts?: string[] | undefined;
        logo_url?: string | undefined;
        guidelines?: string | undefined;
        industry?: string | undefined;
        brand_voice?: "professional" | "casual" | "friendly" | "authoritative" | "playful" | "luxurious" | undefined;
        target_audience?: string | undefined;
    }>;
    readonly UpdateBrandKitSchema: z.ZodObject<{
        description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        name: z.ZodOptional<z.ZodString>;
        colors: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        fonts: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        logo_url: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        guidelines: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        industry: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        brand_voice: z.ZodOptional<z.ZodOptional<z.ZodEnum<["professional", "casual", "friendly", "authoritative", "playful", "luxurious"]>>>;
        target_audience: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        description?: string | undefined;
        name?: string | undefined;
        colors?: string[] | undefined;
        fonts?: string[] | undefined;
        logo_url?: string | undefined;
        guidelines?: string | undefined;
        industry?: string | undefined;
        brand_voice?: "professional" | "casual" | "friendly" | "authoritative" | "playful" | "luxurious" | undefined;
        target_audience?: string | undefined;
    }, {
        description?: string | undefined;
        name?: string | undefined;
        colors?: string[] | undefined;
        fonts?: string[] | undefined;
        logo_url?: string | undefined;
        guidelines?: string | undefined;
        industry?: string | undefined;
        brand_voice?: "professional" | "casual" | "friendly" | "authoritative" | "playful" | "luxurious" | undefined;
        target_audience?: string | undefined;
    }>;
    readonly BrandAssetUploadSchema: z.ZodObject<{
        brand_kit_id: z.ZodString;
        asset_type: z.ZodEnum<["logo", "product_photo", "lifestyle_image", "icon", "banner", "pattern", "texture"]>;
        name: z.ZodString;
        file: z.ZodAny;
        description: z.ZodOptional<z.ZodString>;
        tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        is_primary: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        brand_kit_id: string;
        asset_type: "logo" | "product_photo" | "lifestyle_image" | "icon" | "banner" | "pattern" | "texture";
        is_primary: boolean;
        description?: string | undefined;
        tags?: string[] | undefined;
        file?: any;
    }, {
        name: string;
        brand_kit_id: string;
        asset_type: "logo" | "product_photo" | "lifestyle_image" | "icon" | "banner" | "pattern" | "texture";
        description?: string | undefined;
        tags?: string[] | undefined;
        is_primary?: boolean | undefined;
        file?: any;
    }>;
    readonly BrandAssetTypeSchema: z.ZodEnum<["logo", "product_photo", "lifestyle_image", "icon", "banner", "pattern", "texture"]>;
};

/**
 * Convert a Zod schema to JSON Schema format
 * Useful for API documentation and client code generation
 */
declare function toJsonSchema<T extends z.ZodSchema>(schema: T): zod_to_json_schema.JsonSchema7Type & {
    $schema?: string | undefined;
    definitions?: {
        [key: string]: zod_to_json_schema.JsonSchema7Type;
    } | undefined;
};
/**
 * Validate data against a schema and return typed result
 */
declare function validate<T extends z.ZodSchema>(schema: T, data: unknown): {
    success: boolean;
    data?: z.infer<T>;
    errors?: string[];
};
/**
 * Create a partial schema from an existing schema
 * Useful for update operations
 */
declare function createPartialSchema<T extends z.ZodObject<any>>(schema: T): z.ZodObject<{
    [x: string]: z.ZodOptional<any>;
}, z.UnknownKeysParam, z.ZodTypeAny, {
    [x: string]: any;
}, {
    [x: string]: any;
}>;
/**
 * Create an omit schema from an existing schema
 * Useful for creation operations
 */
declare function createOmitSchema<T extends z.ZodObject<any>, K extends keyof T['shape']>(schema: T, keys: K[]): z.ZodObject<Omit<any, string | number | symbol>, z.UnknownKeysParam, z.ZodTypeAny, {}, {}>;
/**
 * Common UUID validation pattern
 */
declare const uuidSchema: z.ZodString;
/**
 * Common URL validation pattern
 */
declare const urlSchema: z.ZodString;
/**
 * Common email validation pattern
 */
declare const emailSchema: z.ZodString;
/**
 * Common timestamp validation pattern
 */
declare const timestampSchema: z.ZodString;
/**
 * Common hex color validation pattern
 */
declare const hexColorSchema: z.ZodString;
/**
 * Common pagination parameters
 */
declare const paginationSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    orderBy: z.ZodOptional<z.ZodString>;
    orderDirection: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    orderDirection: "asc" | "desc";
    orderBy?: string | undefined;
}, {
    page?: number | undefined;
    limit?: number | undefined;
    orderBy?: string | undefined;
    orderDirection?: "asc" | "desc" | undefined;
}>;
type Pagination = z.infer<typeof paginationSchema>;
/**
 * Common response wrapper
 */
declare const apiResponseSchema: <T extends z.ZodSchema>(dataSchema: T) => z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<T>;
    error: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodObject<{
        requestId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodString;
        pagination: z.ZodOptional<z.ZodObject<{
            page: z.ZodDefault<z.ZodNumber>;
            limit: z.ZodDefault<z.ZodNumber>;
            orderBy: z.ZodOptional<z.ZodString>;
            orderDirection: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
        }, "strip", z.ZodTypeAny, {
            page: number;
            limit: number;
            orderDirection: "asc" | "desc";
            orderBy?: string | undefined;
        }, {
            page?: number | undefined;
            limit?: number | undefined;
            orderBy?: string | undefined;
            orderDirection?: "asc" | "desc" | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        timestamp: string;
        requestId?: string | undefined;
        pagination?: {
            page: number;
            limit: number;
            orderDirection: "asc" | "desc";
            orderBy?: string | undefined;
        } | undefined;
    }, {
        timestamp: string;
        requestId?: string | undefined;
        pagination?: {
            page?: number | undefined;
            limit?: number | undefined;
            orderBy?: string | undefined;
            orderDirection?: "asc" | "desc" | undefined;
        } | undefined;
    }>>;
}, "strip", z.ZodTypeAny, z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
    success: z.ZodBoolean;
    data: z.ZodOptional<T>;
    error: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodObject<{
        requestId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodString;
        pagination: z.ZodOptional<z.ZodObject<{
            page: z.ZodDefault<z.ZodNumber>;
            limit: z.ZodDefault<z.ZodNumber>;
            orderBy: z.ZodOptional<z.ZodString>;
            orderDirection: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
        }, "strip", z.ZodTypeAny, {
            page: number;
            limit: number;
            orderDirection: "asc" | "desc";
            orderBy?: string | undefined;
        }, {
            page?: number | undefined;
            limit?: number | undefined;
            orderBy?: string | undefined;
            orderDirection?: "asc" | "desc" | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        timestamp: string;
        requestId?: string | undefined;
        pagination?: {
            page: number;
            limit: number;
            orderDirection: "asc" | "desc";
            orderBy?: string | undefined;
        } | undefined;
    }, {
        timestamp: string;
        requestId?: string | undefined;
        pagination?: {
            page?: number | undefined;
            limit?: number | undefined;
            orderBy?: string | undefined;
            orderDirection?: "asc" | "desc" | undefined;
        } | undefined;
    }>>;
}>, any> extends infer T_1 ? { [k in keyof T_1]: z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
    success: z.ZodBoolean;
    data: z.ZodOptional<T>;
    error: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodObject<{
        requestId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodString;
        pagination: z.ZodOptional<z.ZodObject<{
            page: z.ZodDefault<z.ZodNumber>;
            limit: z.ZodDefault<z.ZodNumber>;
            orderBy: z.ZodOptional<z.ZodString>;
            orderDirection: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
        }, "strip", z.ZodTypeAny, {
            page: number;
            limit: number;
            orderDirection: "asc" | "desc";
            orderBy?: string | undefined;
        }, {
            page?: number | undefined;
            limit?: number | undefined;
            orderBy?: string | undefined;
            orderDirection?: "asc" | "desc" | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        timestamp: string;
        requestId?: string | undefined;
        pagination?: {
            page: number;
            limit: number;
            orderDirection: "asc" | "desc";
            orderBy?: string | undefined;
        } | undefined;
    }, {
        timestamp: string;
        requestId?: string | undefined;
        pagination?: {
            page?: number | undefined;
            limit?: number | undefined;
            orderBy?: string | undefined;
            orderDirection?: "asc" | "desc" | undefined;
        } | undefined;
    }>>;
}>, any>[k]; } : never, z.baseObjectInputType<{
    success: z.ZodBoolean;
    data: z.ZodOptional<T>;
    error: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodObject<{
        requestId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodString;
        pagination: z.ZodOptional<z.ZodObject<{
            page: z.ZodDefault<z.ZodNumber>;
            limit: z.ZodDefault<z.ZodNumber>;
            orderBy: z.ZodOptional<z.ZodString>;
            orderDirection: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
        }, "strip", z.ZodTypeAny, {
            page: number;
            limit: number;
            orderDirection: "asc" | "desc";
            orderBy?: string | undefined;
        }, {
            page?: number | undefined;
            limit?: number | undefined;
            orderBy?: string | undefined;
            orderDirection?: "asc" | "desc" | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        timestamp: string;
        requestId?: string | undefined;
        pagination?: {
            page: number;
            limit: number;
            orderDirection: "asc" | "desc";
            orderBy?: string | undefined;
        } | undefined;
    }, {
        timestamp: string;
        requestId?: string | undefined;
        pagination?: {
            page?: number | undefined;
            limit?: number | undefined;
            orderBy?: string | undefined;
            orderDirection?: "asc" | "desc" | undefined;
        } | undefined;
    }>>;
}> extends infer T_2 ? { [k_1 in keyof T_2]: z.baseObjectInputType<{
    success: z.ZodBoolean;
    data: z.ZodOptional<T>;
    error: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodObject<{
        requestId: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodString;
        pagination: z.ZodOptional<z.ZodObject<{
            page: z.ZodDefault<z.ZodNumber>;
            limit: z.ZodDefault<z.ZodNumber>;
            orderBy: z.ZodOptional<z.ZodString>;
            orderDirection: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
        }, "strip", z.ZodTypeAny, {
            page: number;
            limit: number;
            orderDirection: "asc" | "desc";
            orderBy?: string | undefined;
        }, {
            page?: number | undefined;
            limit?: number | undefined;
            orderBy?: string | undefined;
            orderDirection?: "asc" | "desc" | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        timestamp: string;
        requestId?: string | undefined;
        pagination?: {
            page: number;
            limit: number;
            orderDirection: "asc" | "desc";
            orderBy?: string | undefined;
        } | undefined;
    }, {
        timestamp: string;
        requestId?: string | undefined;
        pagination?: {
            page?: number | undefined;
            limit?: number | undefined;
            orderBy?: string | undefined;
            orderDirection?: "asc" | "desc" | undefined;
        } | undefined;
    }>>;
}>[k_1]; } : never>;
type ApiResponse<T> = {
    success: boolean;
    data?: T;
    error?: string;
    metadata?: {
        requestId?: string;
        timestamp: string;
        pagination?: Pagination;
    };
};
declare const SCHEMA_VERSION = "1.0.0";
declare const COMPATIBLE_VERSIONS: string[];
/**
 * Check if a schema version is compatible with this package
 */
declare function isCompatibleVersion(version: string): boolean;

export { type ApiResponse, COMPATIBLE_VERSIONS, type Pagination, SCHEMA_VERSION, apiResponseSchema, createOmitSchema, createPartialSchema, emailSchema, hexColorSchema, isCompatibleVersion, paginationSchema, schemas, timestampSchema, toJsonSchema, urlSchema, uuidSchema, validate };
