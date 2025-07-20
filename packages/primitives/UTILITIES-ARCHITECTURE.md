# 🔧 @growthub/primitives - Utilities Architecture Documentation

## 🤖 Package 2: Stateless Utility Foundation

> **Agent Infrastructure File**: Production-ready stateless utility functions and primitives for the Marketing OS ecosystem with zero business logic, perfect for open-source distribution and cross-system integration.

---

## 📋 Architecture Overview

The `@growthub/primitives` package implements **Stateless Utility Foundation** patterns, providing stateless, pure functions that serve as building blocks across all packages of the Marketing OS architecture.

### 🏗️ Core Utility Systems

| Utility System | Purpose | Cross-Package Usage |
|----------------|---------|---------------------|
| **ValidationUtils** | Input validation and sanitization | All packages - data integrity |
| **BrandUtils** | Brand data transformation utilities | Brand package & Agent integration |
| **AgentUtils** | Agent coordination helper functions | Intelligence & coordination packages |
| **SystemUtils** | Cross-system utility functions | All packages - common operations |

---

## 🔄 Utility Architecture Flow

```
Raw Data → Validation Utils → Transformation Utils → Coordination Utils → Integration Utils → Validated Output
    ↓           ↓                     ↓                   ↓                  ↓                    ↓
  Input      Sanitization        Data Mapping        Cross-System       Package           Production
            & Validation                             Coordination       Integration        Ready Data
```

### 🎯 Stateless Design Patterns

#### 1. **Pure Function Architecture Pattern**
```typescript
// 🔐 FUNCTIONAL ZONE - AGENT CONTEXT LOCK ACTIVE
// 🔄 FUNCTION: transformData()
// 🎯 PURPOSE: Pure transformation with no side effects
// 🛡️ STATELESS DESIGN — PREDICTABLE & TESTABLE

interface PureFunctionDesign<TInput, TOutput> {
  input: TInput                    // Input data type
  output: TOutput                  // Output data type  
  dependencies: never[]            // No external dependencies
  sideEffects: never[]             // No side effects
  deterministic: true              // Same input = same output
  testable: true                   // Easy unit testing
}

// Stateless utility protocol
const statelessProtocol = {
  purity: 'Functions produce no side effects',
  determinism: 'Same input always produces same output',
  composition: 'Functions compose together seamlessly',  
  testability: 'Easy unit testing and validation',
  performance: 'Optimized for speed and memory efficiency'
}
```

#### 2. **Cross-Package Integration Pattern**
```typescript
// Seamless integration across @growthub packages
interface CrossPackageUtility<T> {
  packageSource: string            // Originating package
  utilityType: string             // Function classification
  dependencies: string[]          // Required packages
  integrationPoints: string[]     // Integration interfaces
  compatibilityVersion: string   // Version compatibility
}

// Integration coordination
const integrationCoordination = {
  schemas: 'Validate data using @growthub/schemas',
  compiler: 'Transform data for @growthub/compiler-core',
  agents: 'Prepare data for @growthub/agent-tools',
  brands: 'Format data for @growthub/brand-kit',
  primitives: 'Provide foundational utilities for all'
}
```

#### 3. **Performance Optimization Pattern**
```typescript
// High-performance utilities with memoization
interface PerformanceOptimized<T> {
  memoized: boolean               // Results caching enabled
  batchProcessing: boolean        // Batch operations support
  streamProcessing: boolean       // Stream processing capable
  memoryEfficient: boolean        // Optimized memory usage
  cpuOptimized: boolean          // Optimized CPU usage
}

// Performance optimization strategies
const performanceStrategies = {
  memoization: 'Cache expensive computation results',
  batching: 'Process multiple items together efficiently',
  streaming: 'Handle large datasets without memory overload',
  lazy_evaluation: 'Defer computation until needed',
  parallel_processing: 'Utilize multiple cores when beneficial'
}
```

---

## 🧩 Module Architecture

### `/validation` - Input Validation Utilities

**Purpose**: Stateless validation and sanitization functions

**Validation Utility Patterns**:
```typescript
import { 
  sanitizeInput,
  validateEmail,
  validateUrl,
  validatePhone,
  validateCreditCard,
  sanitizeHtml,
  validateSchema,
  createValidator,
  combineValidators
} from '@growthub/primitives/validation'

// Pattern 1: Universal Input Sanitization
const inputSanitization = {
  // Text sanitization
  sanitizeText: (input: string, options: SanitizeOptions = {}) => {
    const config = {
      maxLength: 1000,
      allowHtml: false,
      removeEmojis: false,
      normalizeWhitespace: true,
      ...options
    }
    
    let sanitized = input.trim()
    
    if (!config.allowHtml) {
      sanitized = sanitizeHtml(sanitized)
    }
    
    if (config.normalizeWhitespace) {
      sanitized = sanitized.replace(/\s+/g, ' ')
    }
    
    if (!config.removeEmojis) {
      sanitized = sanitized.replace(/[\u{1F600}-\u{1F64F}]/gu, '') // Remove emojis
    }
    
    if (config.maxLength && sanitized.length > config.maxLength) {
      sanitized = sanitized.substring(0, config.maxLength).trim()
    }
    
    return sanitized
  },

  // URL sanitization and validation
  sanitizeUrl: (url: string): { valid: boolean; sanitized?: string; error?: string } => {
    try {
      // Basic cleanup
      const cleaned = url.trim().toLowerCase()
      
      // Add protocol if missing
      const withProtocol = cleaned.match(/^https?:\/\//) 
        ? cleaned 
        : `https://${cleaned}`
      
      // Validate URL structure
      const urlObj = new URL(withProtocol)
      
      // Security checks
      const allowedProtocols = ['http:', 'https:']
      if (!allowedProtocols.includes(urlObj.protocol)) {
        return { valid: false, error: 'Invalid protocol' }
      }
      
      // Suspicious domain checks
      const suspiciousDomains = ['localhost', '127.0.0.1', '0.0.0.0']
      if (suspiciousDomains.some(domain => urlObj.hostname.includes(domain))) {
        return { valid: false, error: 'Suspicious domain detected' }
      }
      
      return { valid: true, sanitized: urlObj.toString() }
    } catch (error) {
      return { valid: false, error: 'Invalid URL format' }
    }
  },

  // Email validation and normalization
  validateAndNormalizeEmail: (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    const cleaned = email.trim().toLowerCase()
    
    if (!emailRegex.test(cleaned)) {
      return { valid: false, error: 'Invalid email format' }
    }
    
    const [localPart, domain] = cleaned.split('@')
    
    // Normalize common email providers
    const domainNormalizations = {
      'googlemail.com': 'gmail.com',
      'google.com': 'gmail.com'
    }
    
    const normalizedDomain = domainNormalizations[domain] || domain
    const normalizedEmail = `${localPart}@${normalizedDomain}`
    
    return { valid: true, normalized: normalizedEmail }
  }
}

// Pattern 2: Schema-Agnostic Validation
const createUniversalValidator = <T>(validationRules: ValidationRule<T>[]) => {
  return (data: unknown): ValidationResult<T> => {
    const errors: ValidationError[] = []
    
    for (const rule of validationRules) {
      try {
        const result = rule.validate(data)
        if (!result.valid) {
          errors.push({
            field: rule.field,
            message: result.message || `Invalid ${rule.field}`,
            code: rule.code,
            severity: rule.severity || 'error'
          })
        }
      } catch (error) {
        errors.push({
          field: rule.field,
          message: `Validation error: ${error.message}`,
          code: 'VALIDATION_EXCEPTION',
          severity: 'error'
        })
      }
    }
    
    return {
      valid: errors.length === 0,
      data: errors.length === 0 ? data as T : undefined,
      errors: errors.length > 0 ? errors : undefined
    }
  }
}

// Pattern 3: Composable Validation
const composableValidation = {
  // Combine multiple validators
  combine: <T>(...validators: Validator<T>[]) => {
    return (data: unknown): ValidationResult<T> => {
      const allErrors: ValidationError[] = []
      
      for (const validator of validators) {
        const result = validator(data)
        if (!result.valid && result.errors) {
          allErrors.push(...result.errors)
        }
      }
      
      return {
        valid: allErrors.length === 0,
        data: allErrors.length === 0 ? data as T : undefined,
        errors: allErrors.length > 0 ? allErrors : undefined
      }
    }
  },

  // Create conditional validators
  conditional: <T>(
    condition: (data: unknown) => boolean,
    validator: Validator<T>
  ) => {
    return (data: unknown): ValidationResult<T> => {
      if (condition(data)) {
        return validator(data)
      }
      return { valid: true, data: data as T }
    }
  },

  // Transform then validate
  pipeline: <TInput, TOutput>(
    transformer: (data: TInput) => TOutput,
    validator: Validator<TOutput>
  ) => {
    return (data: unknown): ValidationResult<TOutput> => {
      try {
        const transformed = transformer(data as TInput)
        return validator(transformed)
      } catch (error) {
        return {
          valid: false,
          errors: [{
            field: 'transformation',
            message: `Transformation failed: ${error.message}`,
            code: 'TRANSFORM_ERROR',
            severity: 'error'
          }]
        }
      }
    }
  }
}
```

### `/brand` - Brand Transformation Utilities

**Purpose**: Stateless brand data transformation and formatting

**Brand Utility Patterns**:
```typescript
import {
  transformToBrandContext,
  formatBrandColors,
  extractBrandPersonality,
  generateBrandSummary,
  normalizeBrandData,
  createBrandGuidelines,
  analyzeBrandConsistency
} from '@growthub/primitives/brand'

// Pattern 1: Brand Context Transformation
const brandContextUtils = {
  // Transform brand kit for agent consumption
  transformForAgents: (brandKit: BrandKit, assets: BrandAsset[] = []) => {
    return {
      // Core Identity
      identity: {
        name: brandKit.brand_name,
        industry: brandKit.industry,
        description: brandKit.description,
        position: brandKit.market_position || 'Not specified'
      },

      // Communication Framework
      communication: {
        voice: brandKit.brand_voice,
        tone: brandKit.tone_of_voice || brandKit.brand_voice,
        personality: Array.isArray(brandKit.brand_personality) 
          ? brandKit.brand_personality 
          : [brandKit.brand_personality].filter(Boolean),
        messaging: brandKit.messaging_pillars || []
      },

      // Visual Identity
      visual: {
        colors: formatBrandColors(brandKit.colors),
        typography: brandKit.typography || {},
        assets: assets.map(asset => ({
          type: asset.asset_type,
          url: asset.url || asset.storage_url,
          usage: asset.usage_context || ['general']
        }))
      },

      // Audience
      audience: {
        primary: brandKit.target_audience,
        demographics: brandKit.audience_demographics || {},
        psychographics: brandKit.audience_psychographics || {},
        painPoints: brandKit.audience_pain_points || [],
        goals: brandKit.audience_goals || []
      },

      // Guidelines
      guidelines: {
        brand: Array.isArray(brandKit.brand_guidelines) 
          ? brandKit.brand_guidelines 
          : [brandKit.brand_guidelines].filter(Boolean),
        content: brandKit.content_themes || [],
        usage: brandKit.usage_guidelines || []
      }
    }
  },

  // Create agent-specific brand summaries
  createAgentSummary: (brandContext: BrandContext) => {
    const summary = []
    
    // Brand identity summary
    summary.push(`${brandContext.identity.name} is a ${brandContext.identity.industry} company`)
    
    // Voice and personality
    if (brandContext.communication.voice) {
      summary.push(`with a ${brandContext.communication.voice} brand voice`)
    }
    
    if (brandContext.communication.personality.length > 0) {
      const personalityText = brandContext.communication.personality.join(', ')
      summary.push(`characterized by being ${personalityText}`)
    }
    
    // Target audience
    if (brandContext.audience.primary) {
      summary.push(`targeting ${brandContext.audience.primary}`)
    }
    
    // Key differentiators
    if (brandContext.identity.position) {
      summary.push(`positioned as ${brandContext.identity.position}`)
    }
    
    return summary.join(' ')
  }
}

// Pattern 2: Color Processing Utilities
const colorProcessingUtils = {
  // Normalize color formats
  normalizeColors: (colors: Record<string, string>) => {
    const normalized: Record<string, string> = {}
    
    Object.entries(colors).forEach(([key, value]) => {
      // Convert to uppercase hex
      if (value.startsWith('#')) {
        normalized[key] = value.toUpperCase()
      }
      // Convert rgb() to hex
      else if (value.startsWith('rgb')) {
        normalized[key] = rgbToHex(value)
      }
      // Convert named colors to hex
      else if (namedColors[value.toLowerCase()]) {
        normalized[key] = namedColors[value.toLowerCase()]
      }
      else {
        normalized[key] = value // Keep as-is if unrecognized
      }
    })
    
    return normalized
  },

  // Generate color variations
  generateColorPalette: (primaryColor: string) => {
    const base = hexToHsl(primaryColor)
    
    return {
      primary: primaryColor,
      light: hslToHex({ ...base, l: Math.min(95, base.l + 20) }),
      dark: hslToHex({ ...base, l: Math.max(5, base.l - 20) }),
      muted: hslToHex({ ...base, s: Math.max(10, base.s - 30) }),
      complementary: hslToHex({ ...base, h: (base.h + 180) % 360 }),
      analogous: [
        hslToHex({ ...base, h: (base.h + 30) % 360 }),
        hslToHex({ ...base, h: (base.h - 30 + 360) % 360 })
      ]
    }
  },

  // Analyze color accessibility
  analyzeAccessibility: (backgroundColor: string, foregroundColor: string) => {
    const bgRgb = hexToRgb(backgroundColor)
    const fgRgb = hexToRgb(foregroundColor)
    
    const contrastRatio = calculateContrastRatio(bgRgb, fgRgb)
    
    return {
      ratio: contrastRatio,
      wcagAA: contrastRatio >= 4.5,
      wcagAAA: contrastRatio >= 7.0,
      recommendations: contrastRatio < 4.5 ? [
        'Increase color contrast for better readability',
        'Consider darker text or lighter background',
        'Test with accessibility tools'
      ] : []
    }
  }
}

// Pattern 3: Brand Consistency Analysis
const consistencyAnalysisUtils = {
  // Analyze brand element consistency
  analyzeBrandConsistency: (brandKit: BrandKit, assets: BrandAsset[]) => {
    const analysis = {
      colorConsistency: analyzeColorConsistency(brandKit, assets),
      typographyConsistency: analyzeTypographyConsistency(brandKit, assets),
      voiceConsistency: analyzeVoiceConsistency(brandKit),
      visualConsistency: analyzeVisualConsistency(assets),
      overallScore: 0
    }
    
    // Calculate weighted overall score
    const weights = { color: 0.3, typography: 0.2, voice: 0.3, visual: 0.2 }
    analysis.overallScore = (
      analysis.colorConsistency * weights.color +
      analysis.typographyConsistency * weights.typography +
      analysis.voiceConsistency * weights.voice +
      analysis.visualConsistency * weights.visual
    )
    
    return analysis
  },

  // Generate improvement recommendations
  generateRecommendations: (consistencyAnalysis: ConsistencyAnalysis) => {
    const recommendations: Recommendation[] = []
    
    if (consistencyAnalysis.colorConsistency < 0.7) {
      recommendations.push({
        type: 'color_consistency',
        priority: 'high',
        title: 'Improve Color Consistency',
        description: 'Your brand colors are not consistently applied across assets',
        actionItems: [
          'Define primary and secondary color usage guidelines',
          'Ensure all assets use approved brand colors',
          'Create color usage examples for different contexts'
        ]
      })
    }
    
    if (consistencyAnalysis.voiceConsistency < 0.6) {
      recommendations.push({
        type: 'voice_consistency',
        priority: 'high',
        title: 'Strengthen Brand Voice',
        description: 'Brand voice and messaging need better definition',
        actionItems: [
          'Develop detailed brand voice guidelines',
          'Create messaging templates',
          'Train team on brand voice application'
        ]
      })
    }
    
    return recommendations.sort((a, b) => 
      a.priority === 'high' ? -1 : 
      b.priority === 'high' ? 1 : 0
    )
  }
}
```

### `/agent` - Agent Coordination Utilities

**Purpose**: Stateless agent helper functions and coordination utilities

**Agent Utility Patterns**:
```typescript
import {
  formatAgentRequest,
  parseAgentResponse,
  calculateProgress,
  extractMetadata,
  createAgentContext,
  validateAgentOutput,
  optimizeAgentInput
} from '@growthub/primitives/agent'

// Pattern 1: Agent Request Formatting
const agentRequestUtils = {
  // Format request for different agent types
  formatForAgentType: (baseRequest: BaseAgentRequest, agentType: AgentType) => {
    const formatters = {
      CONTENT_GENERATION_AGENT: (request: BaseAgentRequest) => ({
        ...request,
        systemPrompt: 'You are an expert marketing content creator...',
        parameters: {
          temperature: 0.8,
          max_tokens: 2000,
          creativity: 'high'
        },
        context_requirements: ['brand_voice', 'target_audience', 'content_goals']
      }),

      MARKET_RESEARCH_AGENT: (request: BaseAgentRequest) => ({
        ...request,
        systemPrompt: 'You are a market research analyst...',
        parameters: {
          temperature: 0.3,
          max_tokens: 1500,
          accuracy: 'high'
        },
        context_requirements: ['industry', 'target_market', 'research_objectives']
      }),

      ANALYTICS_AGENT: (request: BaseAgentRequest) => ({
        ...request,
        systemPrompt: 'You are a marketing analytics expert...',
        parameters: {
          temperature: 0.1,
          max_tokens: 1000,
          precision: 'high'
        },
        context_requirements: ['data_sources', 'metrics', 'time_period']
      })
    }

    const formatter = formatters[agentType]
    return formatter ? formatter(baseRequest) : baseRequest
  },

  // Optimize input for better agent performance
  optimizeInput: (input: AgentInput) => {
    return {
      // Clean and structure the prompt
      prompt: optimizePrompt(input.prompt),
      
      // Organize context by relevance
      context: organizeContext(input.context),
      
      // Set optimal parameters
      parameters: optimizeParameters(input.parameters, input.agentType),
      
      // Add performance hints
      performanceHints: generatePerformanceHints(input)
    }
  }
}

// Pattern 2: Response Processing Utilities
const responseProcessingUtils = {
  // Parse and validate agent responses
  parseAgentResponse: (rawResponse: string, expectedFormat: ResponseFormat) => {
    try {
      switch (expectedFormat) {
        case 'json':
          return {
            success: true,
            data: JSON.parse(rawResponse),
            format: 'json'
          }
        
        case 'structured_text':
          return {
            success: true,
            data: parseStructuredText(rawResponse),
            format: 'structured_text'
          }
        
        case 'markdown':
          return {
            success: true,
            data: parseMarkdown(rawResponse),
            format: 'markdown'
          }
        
        default:
          return {
            success: true,
            data: rawResponse,
            format: 'plain_text'
          }
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to parse response: ${error.message}`,
        rawResponse
      }
    }
  },

  // Extract quality metrics from responses
  assessResponseQuality: (response: AgentResponse, criteria: QualityCriteria) => {
    const assessments = {
      completeness: assessCompleteness(response, criteria),
      relevance: assessRelevance(response, criteria),
      accuracy: assessAccuracy(response, criteria),
      clarity: assessClarity(response, criteria),
      brandAlignment: assessBrandAlignment(response, criteria)
    }

    const overallScore = Object.values(assessments)
      .reduce((sum, score) => sum + score, 0) / Object.values(assessments).length

    return {
      overallScore,
      individual: assessments,
      passed: overallScore >= (criteria.minimumScore || 0.7),
      recommendations: generateQualityRecommendations(assessments, criteria)
    }
  }
}

// Pattern 3: Progress Calculation Utilities
const progressCalculationUtils = {
  // Calculate progress across multiple steps
  calculateOverallProgress: (steps: AgentStep[]) => {
    if (steps.length === 0) return 0

    const totalWeight = steps.reduce((sum, step) => sum + (step.weight || 1), 0)
    const weightedProgress = steps.reduce((sum, step) => {
      const stepWeight = step.weight || 1
      const stepProgress = step.progress || 0
      return sum + (stepProgress * stepWeight)
    }, 0)

    return Math.round((weightedProgress / totalWeight) * 100) / 100 // Round to 2 decimals
  },

  // Estimate time remaining
  estimateTimeRemaining: (steps: AgentStep[], currentTime: Date) => {
    const completedSteps = steps.filter(step => step.status === 'completed')
    const remainingSteps = steps.filter(step => step.status !== 'completed')

    if (completedSteps.length === 0) {
      // No completed steps, use estimates
      return remainingSteps.reduce((sum, step) => sum + (step.estimatedDuration || 60000), 0)
    }

    // Calculate average time per step from completed steps
    const totalCompletedTime = completedSteps.reduce((sum, step) => {
      if (step.startTime && step.endTime) {
        return sum + (step.endTime.getTime() - step.startTime.getTime())
      }
      return sum + (step.estimatedDuration || 60000)
    }, 0)

    const avgTimePerStep = totalCompletedTime / completedSteps.length
    
    // Estimate remaining time
    return remainingSteps.length * avgTimePerStep
  },

  // Create progress summaries
  createProgressSummary: (steps: AgentStep[], context: ProgressContext) => {
    const overall = calculateOverallProgress(steps)
    const remaining = estimateTimeRemaining(steps, context.currentTime)
    const currentStep = steps.find(step => step.status === 'running')

    return {
      overallProgress: overall,
      currentStep: currentStep?.name || 'Completed',
      remainingSteps: steps.filter(step => step.status === 'pending').length,
      estimatedTimeRemaining: remaining,
      status: overall === 100 ? 'completed' : 
              currentStep ? 'running' : 'pending',
      phase: determineCurrentPhase(steps),
      nextMilestone: findNextMilestone(steps)
    }
  }
}
```

### `/utils` - System Utilities

**Purpose**: Cross-system utility functions and common operations

**System Utility Patterns**:
```typescript
import {
  generateId,
  formatDate,
  parseDate,
  deepMerge,
  deepClone,
  debounce,
  throttle,
  retry,
  timeout,
  createHash,
  validateChecksum
} from '@growthub/primitives/utils'

// Pattern 1: Data Manipulation Utilities
const dataManipulationUtils = {
  // Deep merge objects with conflict resolution
  deepMerge: (target: any, source: any, options: MergeOptions = {}) => {
    const { 
      arrayMergeStrategy = 'concat', 
      conflictResolution = 'source_wins',
      maxDepth = 10 
    } = options

    if (maxDepth <= 0) return target

    const result = { ...target }

    Object.keys(source).forEach(key => {
      if (source[key] === null || source[key] === undefined) {
        if (options.includeNulls) {
          result[key] = source[key]
        }
        return
      }

      if (Array.isArray(source[key])) {
        if (Array.isArray(target[key])) {
          switch (arrayMergeStrategy) {
            case 'concat':
              result[key] = [...target[key], ...source[key]]
              break
            case 'replace':
              result[key] = source[key]
              break
            case 'merge_unique':
              result[key] = [...new Set([...target[key], ...source[key]])]
              break
          }
        } else {
          result[key] = source[key]
        }
      }
      else if (typeof source[key] === 'object') {
        result[key] = deepMerge(
          target[key] || {}, 
          source[key], 
          { ...options, maxDepth: maxDepth - 1 }
        )
      }
      else {
        // Handle primitive conflicts
        switch (conflictResolution) {
          case 'source_wins':
            result[key] = source[key]
            break
          case 'target_wins':
            if (!(key in target)) {
              result[key] = source[key]
            }
            break
          case 'concat_strings':
            if (typeof target[key] === 'string' && typeof source[key] === 'string') {
              result[key] = target[key] + source[key]
            } else {
              result[key] = source[key]
            }
            break
        }
      }
    })

    return result
  },

  // Safe deep clone
  deepClone: <T>(obj: T): T => {
    if (obj === null || typeof obj !== 'object') return obj
    
    if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T
    if (obj instanceof Array) return obj.map(item => deepClone(item)) as unknown as T
    if (obj instanceof Map) {
      const cloned = new Map()
      obj.forEach((value, key) => cloned.set(key, deepClone(value)))
      return cloned as unknown as T
    }
    if (obj instanceof Set) {
      const cloned = new Set()
      obj.forEach(value => cloned.add(deepClone(value)))
      return cloned as unknown as T
    }
    
    const cloned = {} as T
    Object.keys(obj).forEach(key => {
      ;(cloned as any)[key] = deepClone((obj as any)[key])
    })
    
    return cloned
  }
}

// Pattern 2: Performance Utilities
const performanceUtils = {
  // Enhanced debounce with cancel and flush
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    delay: number,
    options: DebounceOptions = {}
  ) => {
    let timeoutId: NodeJS.Timeout | null = null
    let lastArgs: Parameters<T> | null = null
    let lastThis: ThisParameterType<T> | null = null

    const debounced = function (this: ThisParameterType<T>, ...args: Parameters<T>) {
      lastThis = this
      lastArgs = args

      const callNow = options.leading && !timeoutId

      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      timeoutId = setTimeout(() => {
        timeoutId = null
        if (!options.leading && lastArgs && lastThis) {
          func.apply(lastThis, lastArgs)
        }
      }, delay)

      if (callNow && lastArgs && lastThis) {
        func.apply(lastThis, lastArgs)
      }
    } as T

    debounced.cancel = () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = null
      }
      lastArgs = null
      lastThis = null
    }

    debounced.flush = () => {
      if (timeoutId && lastArgs && lastThis) {
        clearTimeout(timeoutId)
        func.apply(lastThis, lastArgs)
        timeoutId = null
        lastArgs = null
        lastThis = null
      }
    }

    return debounced
  },

  // Memory-efficient throttle
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number,
    options: ThrottleOptions = {}
  ) => {
    let inThrottle = false
    let lastResult: ReturnType<T>

    return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
      if (!inThrottle) {
        lastResult = func.apply(this, args)
        inThrottle = true
        
        setTimeout(() => {
          inThrottle = false
          if (options.trailing && args) {
            lastResult = func.apply(this, args)
          }
        }, limit)
      }
      
      return lastResult
    } as T
  }
}

// Pattern 3: Error Handling and Retry Utilities
const errorHandlingUtils = {
  // Advanced retry with exponential backoff
  retry: async <T>(
    operation: () => Promise<T>,
    options: RetryOptions = {}
  ): Promise<T> => {
    const {
      maxAttempts = 3,
      baseDelay = 1000,
      maxDelay = 10000,
      backoffMultiplier = 2,
      retryCondition = () => true,
      onRetry = () => {}
    } = options

    let lastError: Error
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error as Error
        
        if (attempt === maxAttempts || !retryCondition(error as Error, attempt)) {
          throw lastError
        }
        
        const delay = Math.min(
          baseDelay * Math.pow(backoffMultiplier, attempt - 1),
          maxDelay
        )
        
        await new Promise(resolve => setTimeout(resolve, delay))
        onRetry(error as Error, attempt)
      }
    }
    
    throw lastError!
  },

  // Timeout wrapper
  withTimeout: <T>(
    operation: () => Promise<T>,
    timeoutMs: number,
    timeoutMessage = 'Operation timed out'
  ): Promise<T> => {
    return Promise.race([
      operation(),
      new Promise<T>((_, reject) => {
        setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs)
      })
    ])
  },

  // Circuit breaker pattern
  createCircuitBreaker: <T extends (...args: any[]) => Promise<any>>(
    operation: T,
    options: CircuitBreakerOptions = {}
  ) => {
    const {
      failureThreshold = 5,
      recoveryTimeout = 60000,
      monitoringPeriod = 600000
    } = options

    let state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED'
    let failures = 0
    let lastFailureTime = 0
    let successCount = 0

    return async function (...args: Parameters<T>): Promise<ReturnType<T>> {
      if (state === 'OPEN') {
        if (Date.now() - lastFailureTime > recoveryTimeout) {
          state = 'HALF_OPEN'
          successCount = 0
        } else {
          throw new Error('Circuit breaker is OPEN')
        }
      }

      try {
        const result = await operation(...args)
        
        if (state === 'HALF_OPEN') {
          successCount++
          if (successCount >= 3) { // 3 successful calls to close
            state = 'CLOSED'
            failures = 0
          }
        } else if (state === 'CLOSED') {
          failures = 0
        }
        
        return result
      } catch (error) {
        failures++
        lastFailureTime = Date.now()
        
        if (failures >= failureThreshold) {
          state = 'OPEN'
        } else if (state === 'HALF_OPEN') {
          state = 'OPEN'
        }
        
        throw error
      }
    } as T
  }
}
```

---

## 🔄 Cross-Package Integration Patterns

### 1. **Schema Integration Protocol**

Seamless integration with `@growthub/schemas`:

```typescript
// Validate data using primitives + schemas
import { validate } from '@growthub/schemas'
import { sanitizeInput, deepMerge } from '@growthub/primitives/utils'

const validateAndSanitize = async <T>(
  data: unknown,
  schema: ZodSchema<T>,
  sanitizationRules: SanitizationRules
): Promise<ValidationResult<T>> => {
  // Step 1: Sanitize input using primitives
  const sanitizedData = sanitizeInput(data, sanitizationRules)
  
  // Step 2: Validate using schemas
  const validationResult = validate(schema, sanitizedData)
  
  // Step 3: Enhance errors with utility functions
  if (!validationResult.success) {
    validationResult.errors = enhanceValidationErrors(validationResult.errors)
  }
  
  return validationResult
}
```

### 2. **Brand Kit Integration Protocol**

Transform data for `@growthub/brand-kit`:

```typescript
// Prepare brand data for brand-kit package
import { transformToBrandContext } from '@growthub/primitives/brand'
import { BrandDataManager } from '@growthub/brand-kit'

const integratedBrandWorkflow = async (rawBrandData: unknown) => {
  // Step 1: Transform using primitives
  const brandContext = transformToBrandContext(rawBrandData)
  
  // Step 2: Use brand-kit for storage
  const brandManager = new BrandDataManager()
  const storedBrand = await brandManager.createBrandKit(userId, brandContext)
  
  // Step 3: Return combined result
  return deepMerge(brandContext, { id: storedBrand.id, stored: true })
}
```

### 3. **Agent Tools Integration Protocol**

Coordinate with `@growthub/agent-tools`:

```typescript
// Agent coordination with primitives utilities
import { formatAgentRequest, calculateProgress } from '@growthub/primitives/agent'
import { AgentTaskExecutor } from '@growthub/agent-tools'

const coordinatedAgentExecution = async (baseRequest: BaseAgentRequest) => {
  // Step 1: Format request using primitives
  const optimizedRequest = formatAgentRequest(baseRequest)
  
  // Step 2: Execute using agent-tools
  const executor = new AgentTaskExecutor()
  const execution = await executor.executeAgentTask(optimizedRequest)
  
  // Step 3: Process progress using primitives
  const progressSummary = calculateProgress(execution.steps)
  
  return { execution, progressSummary }
}
```

---

## 📊 Performance Benchmarks

### Utility Performance Metrics

```typescript
interface UtilityPerformanceMetrics {
  // Function Performance
  executionTime: Record<string, number>    // Function execution times (ms)
  memoryUsage: Record<string, number>      // Memory usage per function (MB)
  callFrequency: Record<string, number>    // Function call frequency
  errorRates: Record<string, number>       // Error rates by function (0-1)

  // Optimization Metrics
  cacheHitRates: Record<string, number>    // Cache hit rates (0-1)
  memoizationEffectiveness: number         // Memoization performance gain
  batchProcessingGains: number            // Batch processing efficiency
  parallelizationGains: number           // Parallel processing benefits

  // Integration Metrics
  crossPackageUsage: Record<string, number> // Usage by other packages
  integrationLatency: number               // Cross-package integration latency
  compatibilityScore: number              // Package compatibility (0-1)
}

// Performance monitoring and optimization
const optimizeUtilityPerformance = (metrics: UtilityPerformanceMetrics) => {
  const optimizations: OptimizationRecommendation[] = []

  // Identify performance bottlenecks
  Object.entries(metrics.executionTime).forEach(([func, time]) => {
    if (time > 100) { // 100ms threshold
      optimizations.push({
        type: 'performance',
        function: func,
        issue: 'High execution time',
        recommendation: 'Consider memoization or algorithm optimization',
        priority: time > 1000 ? 'high' : 'medium'
      })
    }
  })

  // Suggest caching for frequently called functions
  Object.entries(metrics.callFrequency).forEach(([func, frequency]) => {
    if (frequency > 1000 && metrics.cacheHitRates[func] < 0.5) {
      optimizations.push({
        type: 'caching',
        function: func,
        issue: 'Low cache hit rate for frequently called function',
        recommendation: 'Implement better caching strategy',
        priority: 'high'
      })
    }
  })

  return optimizations
}
```

---

## 🚀 Best Practices & Guidelines

### Stateless Function Design

1. **Pure Functions Only**
   ```typescript
   // ✅ Good: Pure function
   const transform = (data: Input): Output => {
     return processData(data)
   }
   
   // ❌ Bad: Side effects
   let globalState = {}
   const impureTransform = (data: Input) => {
     globalState.lastInput = data // Side effect!
     return processData(data)
   }
   ```

2. **Composition Over Inheritance**
   ```typescript
   // Compose small functions into larger ones
   const processUserData = compose(
     validateInput,
     sanitizeData,
     transformFormat,
     enrichWithDefaults
   )
   ```

3. **Type Safety First**
   ```typescript
   // Use strict TypeScript types
   const validateEmail = (input: string): ValidationResult<string> => {
     // Implementation with proper typing
   }
   ```

4. **Error Handling**
   ```typescript
   // Return errors, don't throw
   const parseData = (input: string): Result<ParsedData, ParseError> => {
     try {
       return { success: true, data: JSON.parse(input) }
     } catch (error) {
       return { success: false, error: new ParseError(error.message) }
     }
   }
   ```

---

**Generated**: 2025-01-17  
**System**: Marketing OS Package 2 - Stateless Utility Foundation  
**Compliance**: ✅ STATELESS_DESIGN  
**Integration**: ✅ CROSS_PACKAGE_READY 