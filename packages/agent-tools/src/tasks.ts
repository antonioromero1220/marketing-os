/**
 * @growthub/agent-tools/tasks
 * Agent Task Coordination and OpenAI Function Calling Abstractions
 * 
 * Professional agent task patterns extracted from the AT-03 production system.
 * Provides simplified abstractions for OpenAI function calling and task coordination.
 */

import { z } from 'zod'
import type { CSI } from '@growthub/compiler-core'

// Base schemas for all agent tasks
export const BaseAgentTaskRequestSchema = z.object({
  threadId: z.string().uuid(),
  userId: z.string().min(1),
  agentType: z.enum(['CONTENT_GENERATION_AGENT', 'TEXT_ANALYSIS_AGENT']),
  taskSequence: z.number().int().min(1),
  previousCSI: z.object({
    completedSteps: z.array(z.string()).default([]),
    currentProgress: z.number().default(0),
    totalSteps: z.number().default(4),
    currentStep: z.string().default('pending')
  }).optional(),
})

export type BaseAgentTaskRequest = z.infer<typeof BaseAgentTaskRequestSchema>

// Agent task function definition
export interface AgentTaskFunction {
  name: string
  description: string
  parameters: {
    type: "object"
    properties: Record<string, any>
    required: string[]
  }
}

// Agent task execution result
export interface AgentTaskResult {
  success: boolean
  stepResult: {
    step: string
    [key: string]: any
  }
  updatedCSI: CSI
  agentTaskId?: string
  error?: {
    message: string
    code: string
    details?: any
  }
}

// Agent task configuration
export interface AgentTaskConfig {
  taskName: string
  taskType: 'analysis' | 'image_generation' | 'text_generation' | 'completion'
  apiRoute?: string
  toolName: string
  systemPrompt: string
  userPromptTemplate: (data: any) => string
  functionDefinition: AgentTaskFunction
  progressPercent: number
  modelConfig?: {
    model?: string
    temperature?: number
    maxTokens?: number
    topP?: number
  }
}

// OpenAI Client Interface
export interface OpenAIClient {
  chat: {
    completions: {
      create(params: any): Promise<any>
    }
  }
}

/**
 * Agent Task Executor Class
 * Handles the complete lifecycle of agent tasks with OpenAI function calling
 */
export class AgentTaskExecutor {
  private openaiClient: OpenAIClient
  private defaultModel: string
  private defaultTemperature: number

  constructor(
    openaiClient: OpenAIClient,
    options: { 
      defaultModel?: string
      defaultTemperature?: number 
    } = {}
  ) {
    this.openaiClient = openaiClient
    this.defaultModel = options.defaultModel || 'gpt-4o-mini'
    this.defaultTemperature = options.defaultTemperature || 0.3
  }

  /**
   * Execute an agent task with OpenAI function calling
   */
  async executeAgentTask<T extends BaseAgentTaskRequest>(
    request: T,
    taskInput: Record<string, any>,
    config: AgentTaskConfig
  ): Promise<AgentTaskResult> {
    try {
      // Validate request
      const validatedRequest = BaseAgentTaskRequestSchema.parse(request)

      // Prepare OpenAI request
      const modelConfig = config.modelConfig || {}
      const response = await this.openaiClient.chat.completions.create({
        model: modelConfig.model || this.defaultModel,
        messages: [
          {
            role: "system",
            content: config.systemPrompt
          },
          {
            role: "user",
            content: config.userPromptTemplate(taskInput)
          }
        ],
        tools: [{ type: "function", function: config.functionDefinition }],
        tool_choice: { type: "function", function: { name: config.functionDefinition.name } },
        temperature: modelConfig.temperature ?? this.defaultTemperature,
        ...(modelConfig.maxTokens && { max_tokens: modelConfig.maxTokens }),
        ...(modelConfig.topP && { top_p: modelConfig.topP })
      })

      // Parse result
      const toolCall = response.choices[0].message.tool_calls?.[0]
      if (!toolCall) {
        throw new Error('No function call returned from OpenAI')
      }

      const result = JSON.parse(toolCall.function.arguments || '{}')

      // Update CSI
      const previousCSI = validatedRequest.previousCSI || {
        completedSteps: [],
        currentProgress: 0,
        totalSteps: 4,
        currentStep: 'pending'
      }

      const updatedCSI: CSI = {
        completedSteps: [...previousCSI.completedSteps, config.taskName],
        currentProgress: config.progressPercent,
        totalSteps: previousCSI.totalSteps,
        currentStep: config.taskName,
        metadata: {
          lastUpdated: new Date().toISOString(),
          taskName: config.taskName,
          taskType: config.taskType
        }
      }

      return {
        success: true,
        stepResult: { step: config.taskName, ...result },
        updatedCSI
      }

    } catch (error) {
      console.error(`[${config.taskName}] Failed:`, error)
      
      return {
        success: false,
        stepResult: { step: config.taskName },
        updatedCSI: request.previousCSI || {
          completedSteps: [],
          currentProgress: 0,
          totalSteps: 4,
          currentStep: 'failed'
        },
        error: {
          message: error instanceof Error ? error.message : 'Unknown error',
          code: 'TASK_EXECUTION_FAILED',
          details: error
        }
      }
    }
  }
}

/**
 * Predefined Agent Task Configurations
 * Common configurations for different agent task types
 */
export const AgentTaskConfigs = {
  INTENT_ANALYSIS: {
    taskName: 'intent_analysis',
    taskType: 'analysis' as const,
    apiRoute: '/api/v2/decomposition/intent-analysis',
    toolName: 'o3_mini_intent_analyzer',
    systemPrompt: 'Analyze user prompts for content generation tasks. Use causal reasoning to determine intent, asset count, and types.',
    userPromptTemplate: (data: any) => 
      `Analyze: "${data.prompt}" for ${data.brandContext?.brand_name || 'brand'} (${data.brandContext?.referenceImages?.length || 0} ref images)`,
    functionDefinition: {
      name: "analyze_intent",
      description: "Analyzes user prompt for asset generation intent",
      parameters: {
        type: "object" as const,
        properties: {
          analysis: { type: "string" },
          conclusion: { type: "string" },
          confidence: { type: "number" },
          inferred_assets: { type: "integer" },
          asset_types: { type: "array", items: { type: "string" } },
          reasoning_steps: { type: "array", items: { type: "string" } }
        },
        required: ["analysis", "conclusion", "confidence", "inferred_assets"]
      }
    },
    progressPercent: 25
  },

  BRAND_ANALYSIS: {
    taskName: 'brand_analysis',
    taskType: 'analysis' as const,
    apiRoute: '/api/v2/decomposition/brand-analysis',
    toolName: 'o3_mini_brand_analyzer',
    systemPrompt: 'Analyze brand assets for content generation readiness. Assess completeness, consistency, and strength.',
    userPromptTemplate: (data: any) => 
      `Analyze brand: ${data.brandContext?.brand_name || 'Unknown'}
Colors: ${data.brandContext?.colors ? JSON.stringify(data.brandContext.colors) : 'None'}
Messaging: ${data.brandContext?.messaging || 'None'}
Reference Images: ${data.brandContext?.referenceImages?.length || 0}`,
    functionDefinition: {
      name: "analyze_brand",
      description: "Analyzes brand assets and context for content generation readiness",
      parameters: {
        type: "object" as const,
        properties: {
          analysis: { type: "string" },
          conclusion: { type: "string" },
          confidence: { type: "number" },
          brand_strength: { type: "string", enum: ["weak", "moderate", "strong", "excellent"] },
          brand_consistency_score: { type: "number" },
          recommendations: { type: "array", items: { type: "string" } }
        },
        required: ["analysis", "conclusion", "confidence", "brand_strength"]
      }
    },
    progressPercent: 50
  },

  COMPLEXITY_ASSESSMENT: {
    taskName: 'complexity_assessment',
    taskType: 'analysis' as const,
    apiRoute: '/api/v2/decomposition/complexity-assessment',
    toolName: 'o3_mini_complexity_analyzer',
    systemPrompt: 'Assess complexity for content generation tasks. Consider assets, brand strength, and execution requirements.',
    userPromptTemplate: (data: any) => 
      `Assess complexity:
Prompt: "${data.prompt || ''}"
Brand: ${data.brandContext?.brand_name || 'Unknown'} (${data.brandStrength || 'Unknown'})
Assets: ${data.inferredAssets || 1}
References: ${data.brandContext?.referenceImages?.length || 0}`,
    functionDefinition: {
      name: "assess_complexity",
      description: "Assesses task complexity for content generation execution",
      parameters: {
        type: "object" as const,
        properties: {
          analysis: { type: "string" },
          conclusion: { type: "string" },
          confidence: { type: "number" },
          complexity_level: { type: "string", enum: ["simple", "moderate", "complex", "expert"] },
          complexity_score: { type: "number" },
          estimated_duration_ms: { type: "integer" },
          resource_requirements: { type: "array", items: { type: "string" } },
          optimization_suggestions: { type: "array", items: { type: "string" } }
        },
        required: ["analysis", "conclusion", "confidence", "complexity_level", "complexity_score"]
      }
    },
    progressPercent: 75
  }
}

/**
 * Task Builder - Fluent interface for building agent tasks
 */
export class AgentTaskBuilder {
  private config: Partial<AgentTaskConfig> = {}

  static create(taskName: string): AgentTaskBuilder {
    return new AgentTaskBuilder().name(taskName)
  }

  name(taskName: string): AgentTaskBuilder {
    this.config.taskName = taskName
    return this
  }

  type(taskType: AgentTaskConfig['taskType']): AgentTaskBuilder {
    this.config.taskType = taskType
    return this
  }

  route(apiRoute: string): AgentTaskBuilder {
    this.config.apiRoute = apiRoute
    return this
  }

  tool(toolName: string): AgentTaskBuilder {
    this.config.toolName = toolName
    return this
  }

  systemPrompt(prompt: string): AgentTaskBuilder {
    this.config.systemPrompt = prompt
    return this
  }

  userPrompt(template: (data: any) => string): AgentTaskBuilder {
    this.config.userPromptTemplate = template
    return this
  }

  function(definition: AgentTaskFunction): AgentTaskBuilder {
    this.config.functionDefinition = definition
    return this
  }

  progress(percent: number): AgentTaskBuilder {
    this.config.progressPercent = percent
    return this
  }

  model(config: AgentTaskConfig['modelConfig']): AgentTaskBuilder {
    this.config.modelConfig = config
    return this
  }

  build(): AgentTaskConfig {
    const required = [
      'taskName', 'taskType', 'toolName', 'systemPrompt', 
      'userPromptTemplate', 'functionDefinition', 'progressPercent'
    ]

    for (const field of required) {
      if (!this.config[field as keyof AgentTaskConfig]) {
        throw new Error(`Missing required field: ${field}`)
      }
    }

    return this.config as AgentTaskConfig
  }
}

/**
 * Error handling utilities
 */
export function handleAgentTaskError(error: any, taskName: string) {
  console.error(`[${taskName}] Failed:`, error)
  
  if (error instanceof z.ZodError) {
    return {
      success: false,
      error: 'Invalid request data',
      details: error.errors
    }
  }

  return {
    success: false,
    error: `${taskName} failed`,
    message: error instanceof Error ? error.message : 'Unknown error'
  }
}

/**
 * Validate agent task request
 */
export function validateAgentTaskRequest(data: unknown): { success: boolean; data?: BaseAgentTaskRequest; errors?: any[] } {
  try {
    const validatedData = BaseAgentTaskRequestSchema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.errors }
    }
    return { success: false, errors: [{ message: 'Unknown validation error' }] }
  }
}

/**
 * Create task helpers using predefined configurations
 */
export const createTaskHelpers = (executor: AgentTaskExecutor) => ({
  createIntentAnalysisTask: (request: BaseAgentTaskRequest & { prompt: string; brandContext: any }) => 
    executor.executeAgentTask(request, { prompt: request.prompt, brandContext: request.brandContext }, AgentTaskConfigs.INTENT_ANALYSIS),

  createBrandAnalysisTask: (request: BaseAgentTaskRequest & { brandContext: any }) => 
    executor.executeAgentTask(request, { brandContext: request.brandContext }, AgentTaskConfigs.BRAND_ANALYSIS),

  createComplexityAssessmentTask: (request: BaseAgentTaskRequest & { 
    prompt: string; 
    brandContext: any; 
    inferredAssets: number; 
    brandStrength: string 
  }) => 
    executor.executeAgentTask(request, { 
      prompt: request.prompt, 
      brandContext: request.brandContext, 
      inferredAssets: request.inferredAssets,
      brandStrength: request.brandStrength 
    }, AgentTaskConfigs.COMPLEXITY_ASSESSMENT)
}) 