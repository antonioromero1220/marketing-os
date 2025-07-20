# Agent Contribution Directive

**Marketing OS Open-Core Framework**  
**Agent-First Development Protocol**

---

## 🎯 **FIRST DIRECTIVE**

**All agents contributing to this codebase MUST prioritize production-ready, stateless, agent-parsable code over quick fixes or temporary solutions.**

This directive supersedes all other considerations. Every contribution must advance the system's capacity for autonomous operation, maintainability, and extensibility.

---

## 🔒 **LAPD Compliance Requirements**

### **Living Artifact Preservation Directive (LAPD)**
All contributions must maintain the LAPD protocol:

1. **Agent Identification**: Every modified file must include agent ID and timestamp
2. **Reflection Documentation**: Changes to tier-protected files require reflection notes
3. **Functional Zone Annotation**: Critical code sections must be marked with zone boundaries
4. **Manifest Updates**: New artifacts must be registered in the system manifest

### **Required Headers for New Files**
```typescript
/**
 * @agent: [YourAgentID]
 * @created: [ISO-8601-timestamp]
 * @tier: [1-5, where 1=critical, 5=experimental]
 * @zone: [functional-zone-name]
 * @lapd: compliant
 */
```

---

## 🏗️ **Architecture Principles**

### **1. Package-First Design**
- Each package (`@growthub/schemas`, `@growthub/primitives`, etc.) is self-contained
- Cross-package dependencies must be explicit and typed
- No circular dependencies between packages

### **2. Stateless-First Functions**
```typescript
// ✅ CORRECT: Pure, stateless function
export function validateBrand(data: unknown): Brand {
  return brandSchema.parse(data);
}

// ❌ INCORRECT: Stateful, side-effect heavy
export async function validateAndSaveBrand(data: unknown) {
  const brand = brandSchema.parse(data);
  await database.brands.save(brand); // Side effect!
  return brand;
}
```

### **3. Agent-Parsable Documentation**
Every function, interface, and module must include:
- **Purpose**: What this component does
- **Inputs**: Detailed parameter specifications
- **Outputs**: Return type and shape
- **Agent Notes**: Special considerations for autonomous operation

---

## 🔄 **Contribution Workflow**

### **Phase 1: Analysis**
1. **Query the codebase** using semantic search to understand existing patterns
2. **Read related documentation** in `docs/` and package READMEs
3. **Identify tier level** of files you plan to modify
4. **Check for existing agent claims** on critical artifacts

### **Phase 2: Design**
1. **Design for statelessness** - prefer pure functions over stateful classes
2. **Validate with schemas** - use `@growthub/schemas` for all data validation
3. **Plan coordination** - use `@growthub/primitives` for locks and events
4. **Document interfaces** - create TypeScript interfaces before implementation

### **Phase 3: Implementation**
1. **Write production-ready code** - no placeholders, no TODOs, no shortcuts
2. **Include comprehensive error handling** with typed error responses
3. **Add validation at boundaries** using Zod schemas
4. **Test agent coordination** patterns if implementing multi-agent features

### **Phase 4: Documentation**
1. **Update package READMEs** with new functionality
2. **Add reflection notes** for tier 1-2 changes
3. **Update manifest** if creating new living artifacts
4. **Include usage examples** that other agents can follow

### **Phase 5: Validation**
1. **TypeScript strict mode** must pass with zero errors
2. **Build process** must complete successfully for all packages
3. **Import paths** must resolve correctly across the monorepo
4. **No `any` or `unknown`** types without explicit validation schemas

---

## 🛠️ **Technical Standards**

### **Code Quality Standards**
```typescript
// Required: Explicit return types
export function processTask(input: TaskInput): TaskOutput {
  // Required: Input validation
  const validated = taskInputSchema.parse(input);
  
  // Required: Error handling with types
  try {
    return executeTask(validated);
  } catch (error) {
    throw new TaskExecutionError('Processing failed', { cause: error });
  }
}

// Required: Interface definitions
interface TaskInput {
  id: string;
  type: TaskType;
  payload: Record<string, unknown>;
}

interface TaskOutput {
  result: string;
  metadata: TaskMetadata;
  timestamp: Date;
}
```

### **Package Integration Requirements**
- **Schemas**: All data structures must have corresponding Zod schemas
- **Primitives**: Use lock management for any concurrent operations
- **Brand Kit**: Respect brand validation and asset management patterns
- **Compiler Core**: Follow decomposition and orchestration patterns
- **Agent Tools**: Implement proper KV coordination and task management

### **Documentation Standards**
Every contribution must include:

```markdown
## Agent Implementation Notes

**Agent ID**: [Your identifier]
**Coordination Requirements**: [Any locks or events needed]
**Dependencies**: [Package dependencies and versions]
**Extension Points**: [Where future agents can build on this]
**Validation Schema**: [Reference to relevant schemas]
```

---

## 🤝 **Agent Coordination Patterns**

### **Multi-Agent Collaboration**
When multiple agents work on related functionality:

1. **Acquire locks** using `@growthub/primitives` lock helpers
2. **Emit progress events** for transparency
3. **Document coordination** in reflection notes
4. **Test failure scenarios** and recovery patterns

### **Conflict Resolution**
- **Tier 1 files**: Require explicit agent handoff before modification
- **Tier 2-3 files**: Use standard lock acquisition patterns  
- **Tier 4-5 files**: Open for concurrent modification with merge conflict resolution

---

## 🎯 **Success Criteria**

A successful agent contribution:

✅ **Advances system autonomy** - makes the system more self-maintaining  
✅ **Maintains LAPD compliance** - all documentation and artifacts updated  
✅ **Follows architectural patterns** - stateless, typed, validated  
✅ **Includes comprehensive documentation** - other agents can understand and extend  
✅ **Passes all validation** - TypeScript, build, and integration tests  
✅ **Demonstrates production readiness** - no temporary fixes or placeholders  

---

## 🚨 **Critical Restrictions**

### **Never Permitted**
- Using `any` or `unknown` without explicit schema validation
- Creating stateful singletons or global mutable state
- Bypassing the LAPD documentation requirements
- Introducing breaking changes without version bumps
- Hardcoding configuration values instead of using schemas

### **Always Required**  
- TypeScript strict mode compliance
- Zod schema validation at package boundaries
- Agent coordination using primitives for concurrent operations
- Reflection notes for any tier 1-2 file modifications
- Production-ready error handling with typed exceptions

---

## 📚 **Essential Reading**

Before contributing, agents must review:

1. [`docs/agent-primitives-playbook.md`](./docs/agent-primitives-playbook.md) - Coordination patterns
2. [`docs/architecture.md`](./docs/architecture.md) - System design principles  
3. [`docs/compiler-begets-compiler.md`](./docs/compiler-begets-compiler.md) - Evolution strategy
4. [`packages/schemas/VALIDATION-ARCHITECTURE.md`](./packages/schemas/VALIDATION-ARCHITECTURE.md) - Validation patterns
5. [`packages/primitives/UTILITIES-ARCHITECTURE.md`](./packages/primitives/UTILITIES-ARCHITECTURE.md) - Helper functions

---

**Remember: This codebase is designed for autonomous operation. Every contribution should increase the system's capacity for self-maintenance, self-documentation, and agent coordination.** 