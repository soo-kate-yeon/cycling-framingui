---
id: SPEC-RN-001
version: "1.0.0"
status: "proposed"
created: "2026-03-14"
updated: "2026-03-14"
author: "Codex"
---

# Plan

1. Define the package boundary and scaffold `packages/react-native`.
2. Extract generic token helpers first, before any primitives.
3. Extract only primitives that survived the shadowoo generalization test.
4. Update docs and MCP guidance after the runtime path is real.
5. Validate package-local build/tests first, then shared MCP impact.

# Sequencing Rules

1. Complete one task at a time.
2. Run that task's validation before moving on.
3. Commit after each successful task.
4. Do not expand the primitive surface during extraction unless the current task explicitly requires it.
