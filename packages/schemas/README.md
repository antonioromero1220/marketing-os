# @growthub/schemas

Pure Zod schemas and TypeScript types for the Growthub Marketing OS. This package contains stateless validation schemas with no business logic, making it perfect for open-source distribution and external integrations.

## Features

- 🔐 **Type-Safe**: Full TypeScript support with Zod validation
- 🧩 **Modular**: Organized into logical modules (brand, agent, compiler)
- 🌐 **Universal**: Works in Node.js, browsers, and edge environments
- 📦 **Tree-Shakable**: Import only what you need
- 🔄 **JSON Schema**: Convert to OpenAPI/JSON Schema for documentation
- ⚡ **Zero Dependencies**: Only depends on Zod

## Installation

```bash
npm install @growthub/schemas
# or
pnpm add @growthub/schemas
# or
yarn add @growthub/schemas
```

## Quick Start

```typescript
import { BrandKitSchema, AgentTaskSchema, validate } from '@growthub/schemas';

// Validate brand kit data
const brandResult = validate(BrandKitSchema, {
  name: 'My Brand',
  colors: ['#FF6B6B', '#4ECDC4'],
  brand_voice: 'friendly'
});

if (brandResult.success) {
  console.log('Valid brand kit:', brandResult.data);
} else {
  console.error('Validation errors:', brandResult.errors);
}
```

## Modules

### Brand Schemas

Validation schemas for brand management, assets, and context:

```typescript
import { 
  BrandKitSchema,
  BrandAssetSchema,
  BrandContextSchema,
  CreateBrandKitSchema,
  type BrandKit
} from '@growthub/schemas/brand';

// Validate a brand kit
const brandKit: BrandKit = {
  name: 'Tech Startup',
  description: 'Modern tech company branding',
  colors: ['#007AFF', '#FF3B30'],
  brand_voice: 'professional',
  target_audience: 'B2B software developers'
};

const result = BrandKitSchema.safeParse(brandKit);
```

### Agent Schemas

Schemas for agent tasks, execution, and metadata:

```typescript
import {
  AgentTaskSchema,
  AgentTypeSchema,
  CSISchema,
  CreateAgentTaskSchema,
  type AgentTask
} from '@growthub/schemas/agent';

// Create an agent task
const task = CreateAgentTaskSchema.parse({
  user_id: '123e4567-e89b-12d3-a456-426614174000',
  thread_id: 'thread_abc123',
  task_name: 'generate_social_posts',
  task_type: 'text_generation',
  task_sequence: 1,
  task_input: {
    prompt: 'Create 3 social media posts about our product launch',
    platform: 'twitter'
  }
});
```

### Compiler Schemas

Schemas for the agent compiler system:

```typescript
import {
  CompilerContextSchema,
  DecompositionPlanSchema,
  ValidationResultSchema,
  type CompilerConfig
} from '@growthub/schemas/compiler';

// Validate compiler configuration
const config: CompilerConfig = {
  environment: 'production',
  enableLogging: true,
  maxConcurrentJobs: 20,
  preInit: {
    skipKvLock: false,
    lockTtlSeconds: 900,
    validateBrandKit: true
  }
};
```

## Utilities

### Validation Helper

```typescript
import { validate, BrandKitSchema } from '@growthub/schemas';

const result = validate(BrandKitSchema, unknownData);

if (result.success) {
  // TypeScript knows result.data is BrandKit
  console.log(result.data.name);
} else {
  // Handle validation errors
  result.errors?.forEach(error => console.error(error));
}
```

### JSON Schema Generation

Convert Zod schemas to JSON Schema for API documentation:

```typescript
import { toJsonSchema, BrandKitSchema } from '@growthub/schemas';

const jsonSchema = toJsonSchema(BrandKitSchema);
// Use for OpenAPI documentation, client code generation, etc.
```

### Schema Manipulation

```typescript
import { 
  createPartialSchema, 
  createOmitSchema, 
  BrandKitSchema 
} from '@growthub/schemas';

// Create update schema (all fields optional)
const UpdateBrandKitSchema = createPartialSchema(BrandKitSchema);

// Create creation schema (omit auto-generated fields)
const CreateBrandKitSchema = createOmitSchema(BrandKitSchema, [
  'id', 
  'created_at', 
  'updated_at'
]);
```

## Common Patterns

### API Response Wrapper

```typescript
import { apiResponseSchema, BrandKitSchema } from '@growthub/schemas';

// Create a typed API response schema
const BrandKitResponseSchema = apiResponseSchema(BrandKitSchema);

type BrandKitResponse = z.infer<typeof BrandKitResponseSchema>;
// {
//   success: boolean;
//   data?: BrandKit;
//   error?: string;
//   metadata?: { ... };
// }
```

### Pagination

```typescript
import { paginationSchema, type Pagination } from '@growthub/schemas';

const params: Pagination = {
  page: 1,
  limit: 20,
  orderBy: 'created_at',
  orderDirection: 'desc'
};
```

## Environment Support

This package works in all JavaScript environments:

- ✅ Node.js (ESM & CommonJS)
- ✅ Browser (ES2020+)
- ✅ Edge Runtime (Vercel, Cloudflare Workers)
- ✅ React Native
- ✅ Deno

## Tree Shaking

Import only what you need to minimize bundle size:

```typescript
// ✅ Good - only imports specific schemas
import { BrandKitSchema } from '@growthub/schemas/brand';

// ❌ Avoid - imports everything
import * as schemas from '@growthub/schemas';
```

## TypeScript Integration

All schemas include full TypeScript types:

```typescript
import { BrandKit, AgentTask, CompilerContext } from '@growthub/schemas';

function processBrand(brand: BrandKit) {
  // Full type safety and IntelliSense
  console.log(brand.name); // ✅ string
  console.log(brand.colors); // ✅ string[] | undefined
  console.log(brand.invalid); // ❌ TypeScript error
}
```

## Version Compatibility

Check version compatibility:

```typescript
import { SCHEMA_VERSION, isCompatibleVersion } from '@growthub/schemas';

console.log(SCHEMA_VERSION); // "1.0.0"
console.log(isCompatibleVersion('1.0.0')); // true
```

## Development

### Building

```bash
pnpm build
```

### Testing

```bash
pnpm test
```

### Type Checking

```bash
pnpm type-check
```

## License

MIT © Growthub

---

**Part of the [Growthub Marketing OS](https://github.com/yourgrowthub/marketing-os) ecosystem.**