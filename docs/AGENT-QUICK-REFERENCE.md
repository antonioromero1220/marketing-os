# Agent Quick Reference

**Fast navigation for autonomous agents contributing to Marketing OS**

---

## 🚀 **Start Here**

1. **[AGENT-CONTRIBUTION-DIRECTIVE.md](../AGENT-CONTRIBUTION-DIRECTIVE.md)** ← **REQUIRED READING**
   - First Directive and core principles
   - LAPD compliance requirements
   - 5-phase contribution workflow

---

## 📖 **Essential Documentation**

### **Core Architecture**
- **[architecture.md](./architecture.md)** - System layers and deployment topology
- **[compiler-begets-compiler.md](./compiler-begets-compiler.md)** - Recursive evolution strategy

### **Practical Guides**
- **[agent-primitives-playbook.md](./agent-primitives-playbook.md)** - Lock management, events, retries
- **[how-to-deploy.md](./how-to-deploy.md)** - Local dev to production deployment

---

## 📦 **Package-Specific Documentation**

### **Validation Foundation**
- **[packages/schemas/VALIDATION-ARCHITECTURE.md](../packages/schemas/VALIDATION-ARCHITECTURE.md)** - Zod schemas and validation patterns
- **[packages/schemas/README.md](../packages/schemas/README.md)** - Usage and installation

### **Core Utilities**  
- **[packages/primitives/UTILITIES-ARCHITECTURE.md](../packages/primitives/UTILITIES-ARCHITECTURE.md)** - Stateless helpers and cross-package utilities
- **[packages/primitives/README.md](../packages/primitives/README.md)** - Lock management and retry patterns

### **System Coordination**
- **[packages/agent-tools/AGENT-COORDINATION.md](../packages/agent-tools/AGENT-COORDINATION.md)** - KV locks, task management, CSI tracking
- **[packages/compiler-core/AGENT-ARCHITECTURE.md](../packages/compiler-core/AGENT-ARCHITECTURE.md)** - Decomposition and orchestration

### **Brand Management**
- **[packages/brand-kit/BRAND-MANAGEMENT.md](../packages/brand-kit/BRAND-MANAGEMENT.md)** - Asset coordination and validation

---

## ⚡ **Quick Code Patterns**

### **Lock Management**
```typescript
import { withLock } from '@growthub/primitives';
await withLock(`run:${userId}:${threadId}`, async () => {
  // Your coordination logic here
});
```

### **Validation Pattern**
```typescript
import { brandSchema } from '@growthub/schemas';
const validated = brandSchema.parse(input);
```

### **Error Handling**
```typescript
try {
  return await operation();
} catch (error) {
  throw new CustomError('Operation failed', { cause: error });
}
```

---

## 🔧 **Development Checklist**

**Before You Start:**
- [ ] Read the Agent Contribution Directive
- [ ] Understand the package you're modifying
- [ ] Check for existing agent claims on files

**During Development:**
- [ ] Use TypeScript strict mode
- [ ] Validate inputs with Zod schemas  
- [ ] Implement proper error handling
- [ ] Add LAPD headers to new files

**Before Submitting:**
- [ ] All TypeScript errors resolved
- [ ] Build process completes successfully
- [ ] Documentation updated
- [ ] Reflection notes added (if tier 1-2 files)

---

## 🎯 **Remember the First Directive**

**Production-ready, stateless, agent-parsable code over quick fixes.**

Every contribution should increase the system's autonomous operation capacity. 