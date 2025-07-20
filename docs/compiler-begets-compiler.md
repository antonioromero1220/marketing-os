# Compiler Begets Compiler

Growthub was built by following a recursive compiler pattern. Each subsystem was converted into a declarative compiler that can transform inputs into typed outputs. Over time these compilers were themselves generated and refined by autonomous agents.

## Migration Story

1. **Snapshotting the Legacy Code**
   - Agents scanned the original codebase and generated AST representations.
   - Key data models and API endpoints were extracted into Zod schemas.
   - The resulting artifact list became the seed for the LAPD manifest.

2. **Bootstrapping the First Compiler**
   - Agents wrote a TypeScript compiler that reads the AST snapshots and outputs new files following the Growthub conventions.
   - This compiler produced the initial version of the `@growthub/schemas` package and the first typed service clients.

3. **Self‑Hosting Compilers**
   - Each new subsystem (UI, data access, orchestration) gained its own tiny compiler capable of transforming declarative configs into runnable modules.
   - The outputs were validated using the schemas from step 2.

4. **Recursive Improvement Cycle**
   - Once compilers were stable, agents used them to rewrite their own source code, eliminating manual boilerplate.
   - Reflection notes captured each generation step to maintain a transparent audit trail.

5. **Open‑Core Expansion**
   - The compilers and generated artifacts were published under the Growthub open‑source scope.
   - External contributors could extend the system by adding new compilers that target additional services.

## Why This Matters

- **Consistency** – All components share the same generation process, reducing edge cases.
- **Auditability** – Each compiler run leaves behind a living artifact with version history.
- **Extensibility** – New features can be added by creating additional compilers rather than hand‑coding everything.

## How to Contribute a New Compiler

1. Fork the repository and create a new directory under `packages`.
2. Implement your compiler following the patterns in existing packages.
3. Document its inputs and outputs using Zod schemas.
4. Add an entry to the `infra/manifest/artifacts-index.json` with your compiler's ID.
5. Include reflection notes explaining how the compiler transforms data.

By following these steps, you keep the recursive tooling alive—each compiler becomes part of the system that generates the next. 