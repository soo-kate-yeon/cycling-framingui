# SPEC-MCP-008 Implementation Plan

## Overview

| Field | Value |
|-------|-------|
| **SPEC ID** | SPEC-MCP-008 |
| **Title** | MCP Workflow Reliability and Contract Unification |
| **Total Phases** | 6 |
| **Estimated Effort** | 4-6 days |
| **Status** | ✅ Completed |

---

## Phase 0: Contract Baseline and Fixtures

### Objective

Capture current failures as explicit regression fixtures before changing runtime behavior.

### Deliverables

```
packages/mcp-server/__tests__/
  tools/
    auth-bootstrap.test.ts
    theme-authority-consistency.test.ts
    screen-contract-parity.test.ts
    generate-screen-quality.test.ts
```

### Tasks

| # | Task | Owner | Estimate |
|---|------|-------|----------|
| 0.1 | Encode current `whoami required` behavior as baseline test | expert-backend | 0.5d |
| 0.2 | Add theme consistency fixtures for licensed/listed/previewable themes | expert-backend | 0.5d |
| 0.3 | Add validation vs generation parity fixture definitions | expert-backend | 0.5d |
| 0.4 | Add codegen quality fixtures for text children and invalid classes | expert-backend | 0.5d |

### Success Criteria

- [x] Every failure class from the issue list exists as a reproducible test or fixture

---

## Phase 1: Session Bootstrap Refactor

### Objective

Remove hidden `whoami` gating and replace it with lazy capability bootstrap.

### Deliverables

```
packages/mcp-server/src/
  auth/
    guard.ts
    state.ts
    verify.ts
  index.ts
  tools/whoami.ts
  prompts/getting-started.ts
```

### Tasks

| # | Task | Owner | Estimate |
|---|------|-------|----------|
| 1.1 | Replace `requireWhoami()` global gate with lazy bootstrap service | expert-backend | 0.5d |
| 1.2 | Standardize structured auth errors with `code`, `nextAction`, `retryable` | expert-backend | 0.5d |
| 1.3 | Update `whoami` semantics to session inspection | expert-backend | 0.25d |
| 1.4 | Update MCP tool descriptions and prompts to match actual contract | expert-backend | 0.25d |

### Success Criteria

- [x] Protected tools work without a prior `whoami` call
- [x] No tool returns bare `whoami required` without structured remediation

---

## Phase 2: Single Theme Authority

### Objective

Guarantee theme entitlement, theme list, and theme preview consistency.

### Deliverables

```
packages/mcp-server/src/
  api/data-client.ts
  tools/list-themes.ts
  tools/preview-theme.ts
  tools/whoami.ts
packages/playground-web/app/api/mcp/themes/
  route.ts
  [id]/route.ts
packages/playground-web/lib/mcp/
  auth-helper.ts
```

### Tasks

| # | Task | Owner | Estimate |
|---|------|-------|----------|
| 2.1 | Define canonical capability snapshot for theme access | expert-backend | 0.25d |
| 2.2 | Refactor theme endpoints and client to consume the same authority model | expert-backend | 0.75d |
| 2.3 | Add inconsistency detection and forced refresh path | expert-backend | 0.5d |
| 2.4 | Add explicit degraded mode response for upstream failures | expert-backend | 0.25d |

### Success Criteria

- [x] `whoami`, `list-themes`, and `preview-theme` agree for a given session
- [x] Licensed theme plus missing preview returns explicit inconsistency signal, not silent failure

---

## Phase 3: Unified Screen Contract

### Objective

Replace drifted catalogs with one generated screen contract artifact.

### Deliverables

```
packages/core/src/
  screen-contract/
    index.ts
    generated-contract.ts
packages/mcp-server/src/tools/
  validate-screen-definition.ts
  get-screen-generation-context.ts
  generate-screen.ts
packages/playground-web/app/api/mcp/components/
  route.ts
  [id]/route.ts
```

### Tasks

| # | Task | Owner | Estimate |
|---|------|-------|----------|
| 3.1 | Define artifact schema for components, subcomponents, props, and support modes | expert-backend | 0.5d |
| 3.2 | Generate contract data from `@framingui/ui` exports and composition metadata | expert-backend | 0.75d |
| 3.3 | Refactor validation, context, and API routes to consume the artifact | expert-backend | 0.75d |
| 3.4 | Resolve representation rule for composed nodes like `CardHeader` and `CardContent` | expert-backend | 0.5d |

### Success Criteria

- [x] A screen accepted by validation is eligible for generation under the same contract version
- [x] `Text`, `Heading`, `Badge`, `Separator`, and card substructure are represented consistently

---

## Phase 4: Safe Codegen and Recipe Application

### Objective

Replace unreliable generic generation with supported adapters and automatic recipe handling.

### Deliverables

```
packages/core/src/screen-generation/
  generators/
    react-generator.ts
    tailwind-generator.ts
  resolver/
    component-resolver.ts
packages/mcp-server/src/
  generators/
  data/recipe-resolver.ts
  tools/generate-screen.ts
```

### Tasks

| # | Task | Owner | Estimate |
|---|------|-------|----------|
| 4.1 | Introduce adapter-based generation for supported `@framingui/ui` output | expert-frontend | 1.0d |
| 4.2 | Prevent invalid Tailwind utility synthesis unless mapping is explicit | expert-frontend | 0.5d |
| 4.3 | Fix children rendering rules for text and nested content | expert-frontend | 0.25d |
| 4.4 | Integrate theme recipe resolution into generation pipeline | expert-frontend | 0.5d |
| 4.5 | Return explicit unsupported-codegen errors for unmapped components | expert-frontend | 0.25d |

### Success Criteria

- [x] Generated JSX preserves text children
- [x] Generated output does not contain non-existent utility classes
- [x] Recipes are applied automatically when supported

---

## Phase 5: Context Quality Upgrade

### Objective

Improve template matching, component coverage, and explainability in context responses.

### Deliverables

```
packages/mcp-server/src/
  data/template-matcher.ts
  data/hint-generator.ts
  tools/get-screen-generation-context.ts
```

### Tasks

| # | Task | Owner | Estimate |
|---|------|-------|----------|
| 5.1 | Add confidence threshold and no-match fallback | expert-backend | 0.25d |
| 5.2 | Expand component discovery using contract artifact and recipe coverage | expert-backend | 0.5d |
| 5.3 | Return reasoned metadata for template and component suggestions | expert-backend | 0.25d |
| 5.4 | Reduce hardcoded fallback set and remove misleading low-confidence primary matches | expert-backend | 0.25d |

### Success Criteria

- [x] Blog-like descriptions no longer collapse into weak `core.landing` matches by default
- [x] Context returns materially broader component coverage than `card` and `button`

---

## Phase 6: Documentation and Final Validation

### Objective

Align docs with implementation and run the smallest meaningful cross-package validation set.

### Deliverables

```
.moai/specs/SPEC-MCP-008/
  acceptance.md
packages/playground-web/content/docs/
packages/mcp-server/src/prompts/
```

### Tasks

| # | Task | Owner | Estimate |
|---|------|-------|----------|
| 6.1 | Update MCP docs and prompts | expert-backend | 0.25d |
| 6.2 | Run targeted package tests | expert-testing | 0.25d |
| 6.3 | Run cross-package typecheck and build | expert-testing | 0.25d |
| 6.4 | Write implementation report or sync note if workflow requires | expert-backend | 0.25d |

### Validation Commands

- `pnpm --filter @framingui/mcp-server test`
- `pnpm --filter @framingui/core test`
- `pnpm --filter @framingui/ui test`
- `pnpm typecheck`
- `pnpm build:all`

### Success Criteria

- [x] Docs describe the real workflow

---

**Status**: ✅ Project Completed Successfully
- [ ] Targeted tests pass
- [ ] Cross-package typecheck and build pass

---

## Recommended Implementation Order

1. Phase 0
2. Phase 1
3. Phase 2
4. Phase 3
5. Phase 4
6. Phase 5
7. Phase 6

This order is intentional. Auth and theme authority must stabilize before screen contract work, and contract unification must land before codegen quality changes.
