# SPEC-MCP-008: MCP Workflow Reliability and Contract Unification

## Overview

| Field | Value |
|-------|-------|
| **SPEC ID** | SPEC-MCP-008 |
| **Title** | MCP Workflow Reliability and Contract Unification |
| **Status** | ✅ Completed |
| **Priority** | Critical |
| **Created** | 2026-03-06 |
| **Author** | Codex + soo-kate-yeon |
| **Dependencies** | SPEC-MCP-004, SPEC-MCP-007 |

---

## Problem Statement

Recent real-world usage exposed a structural reliability gap in the FramingUI MCP workflow. The current tools exist, but they do not operate on a single contract.

Observed failures:

1. **Implicit auth/session contract**
   `preview-theme` fails with `whoami required`, but `whoami` as a mandatory first call is only enforced at runtime.

2. **Theme entitlement mismatch**
   `whoami` reports licensed themes such as `pebble`, while `list-themes` can return an empty list and `preview-theme("pebble")` can return not found.

3. **Screen contract drift**
   `validate-screen-definition` and `generate_screen` rely on different component catalogs and validation rules.

4. **Code generation overclaim**
   `generate_screen` claims production-ready output but produces invalid Tailwind classes and drops child text content.

5. **Theme recipe usability gap**
   Theme recipe data exists, but the MCP workflow does not automatically apply that data to generated code or context guidance.

6. **Low-quality context assembly**
   `get-screen-generation-context` returns narrow component suggestions and can force low-confidence template matches.

### Root Causes

1. **Hidden server-side workflow gate**
   The `requireWhoami()` gate is global, but the contract is not encoded as discoverable tool capability metadata.

2. **Split authority for themes**
   `whoami`, theme list, and theme detail are resolved through separate layers and can diverge.

3. **No single source of truth for screen contracts**
   The MCP server API catalog, `@framingui/core` validator, and `@framingui/ui` exports are not synchronized.

4. **Generic codegen instead of supported renderers**
   `generate_screen` uses generic HTML and inferred Tailwind mappings instead of adapter-based `@framingui/ui` generation.

5. **Heuristic context without reliability thresholds**
   Template and component selection rely on hardcoded keyword maps and small fallbacks rather than contract-backed discovery.

### Impact

- Agents cannot reliably infer the correct tool order.
- Licensed users can appear unauthorized or see missing resources.
- A screen definition may validate successfully and still fail generation.
- Generated output requires manual rewriting for production use.
- Theme recipes are manually copied from JSON instead of being applied by the system.

---

## Goals

| # | Goal | Success Criteria |
|---|------|------------------|
| G1 | Remove hidden workflow prerequisites | Protected tools work without a prior `whoami` call |
| G2 | Establish a single theme authority | `whoami`, `list-themes`, and `preview-theme` are consistent for the same session |
| G3 | Unify screen definition contracts | Validation, context generation, and code generation use the same schema and component catalog |
| G4 | Make codegen trustworthy | `generate_screen` only emits supported code paths and never invents invalid classes |
| G5 | Make theme recipes first-class | Theme recipe data is automatically surfaced and applied where relevant |
| G6 | Improve context quality | Low-confidence template matches degrade safely and component coverage is materially broader |

### Non-Goals

- Redesigning the visual design system itself
- Replacing existing theme/token semantics outside MCP workflow boundaries
- Building a general-purpose design-to-code engine beyond supported FramingUI components

---

## EARS Requirements

### Ubiquitous Requirements

- **[U1]** The MCP server SHALL expose a discoverable workflow contract for protected tools.
- **[U2]** The MCP server SHALL NOT require a hidden prior `whoami` call for any protected tool.
- **[U3]** The MCP server SHALL use one canonical screen contract artifact for validation, context, and generation.
- **[U4]** The MCP server SHALL resolve theme entitlement, theme listing, and theme detail from one authoritative capability model.
- **[U5]** The MCP server SHALL only describe generated output as production-ready if it passes explicit codegen quality gates.
- **[U6]** Theme recipe resolution SHALL be part of the supported workflow, not a manual JSON lookup step.

### Event-Driven Requirements

- **[E1]** WHEN a protected tool is called with valid credentials THEN the server SHALL bootstrap session capability state automatically.
- **[E2]** WHEN theme entitlement data and theme inventory disagree THEN the server SHALL return a structured inconsistency error or self-heal through a forced refresh, but SHALL NOT silently return an empty list.
- **[E3]** WHEN `validate-screen-definition` accepts a component THEN `generate_screen` SHALL recognize the same component under the same schema version.
- **[E4]** WHEN `generate_screen` cannot render a component safely THEN it SHALL fail with an explicit unsupported-codegen error instead of emitting invalid code.
- **[E5]** WHEN a theme provides recipes for a component used in screen generation THEN those recipes SHALL be surfaced through context and applied by supported codegen paths.
- **[E6]** WHEN template matching confidence falls below the configured threshold THEN `get-screen-generation-context` SHALL return no primary template match rather than forcing a misleading one.

### State-Driven Requirements

- **[S1]** IF the user is authenticated but has not called `whoami` THEN `list-themes`, `preview-theme`, and screen tools SHALL still operate.
- **[S2]** IF the system enters degraded mode due to upstream API failure THEN the response SHALL explicitly declare the mode and source of fallback data.
- **[S3]** IF a theme is listed as licensed for the session THEN `preview-theme(themeId)` SHALL either succeed or return a structured entitlement inconsistency error.
- **[S4]** IF a component exists as a subcomponent or composed child pattern rather than a top-level node THEN validation and generation SHALL follow the same representation rule.

### Unwanted Requirements

- **[W1]** The system SHALL NOT emit `whoami required` as the only remediation guidance.
- **[W2]** The system SHALL NOT maintain separate hardcoded component catalogs across API routes and MCP tool implementations.
- **[W3]** The system SHALL NOT emit synthetic Tailwind classes that are not backed by project tokens or a declared mapping layer.
- **[W4]** The system SHALL NOT self-close components that contain text or child content.
- **[W5]** The system SHALL NOT force a template recommendation when confidence is low.

### Optional Requirements

- **[O1]** Where possible, the server SHOULD expose a `schemaVersion` or `contractVersion` for screen-related tools.
- **[O2]** Where possible, context responses SHOULD include confidence explanations for template and component suggestions.
- **[O3]** Where possible, the MCP server SHOULD expose recipe application diagnostics in generation responses.

---

## Technical Specification

### 1. Session and Capability Contract

Introduce a session bootstrap layer in `packages/mcp-server`:

- `whoami` becomes an inspection tool, not a prerequisite gate.
- Protected tools perform lazy capability hydration from current credentials.
- Errors become structured:

```json
{
  "success": false,
  "code": "AUTH_REQUIRED",
  "message": "Authentication required",
  "nextAction": "Run framingui-mcp login or provide FRAMINGUI_API_KEY",
  "retryable": true
}
```

- Tool descriptions and prompts must reflect the real contract.

### 2. Single Theme Authority

Create a shared theme capability model covering:

- session entitlement
- listable theme inventory
- previewable theme details
- fallback/degraded status

The invariant is:

```text
listed theme ids == previewable theme ids subset
listed theme ids subset of entitled theme ids
```

On violation, return a structured inconsistency result rather than a silent empty or misleading success.

### 3. Unified Screen Contract Artifact

Create one canonical generated contract artifact consumed by:

- `packages/mcp-server/src/tools/validate-screen-definition.ts`
- `packages/mcp-server/src/tools/get-screen-generation-context.ts`
- `packages/mcp-server/src/tools/generate-screen.ts`
- `packages/playground-web/app/api/mcp/components/*`
- supporting `@framingui/core` resolution logic

The artifact must define:

- component ids and names
- top-level vs composed-only components
- subcomponent relationships
- prop metadata
- supported codegen strategy
- contract version

### 4. Supported Codegen Adapters

Replace generic HTML/Tailwind inference with supported renderer adapters:

- `react-framingui` adapter for `@framingui/ui` JSX output
- optional Tailwind adapter only where mappings are explicit and tested

Rules:

- no invented utility classes
- no self-closing nodes with children
- unsupported component paths fail explicitly
- generated output must compile in fixture projects

### 5. Theme Recipe Resolution Pipeline

Promote recipes into the screen generation pipeline:

- context tool returns recipe coverage for suggested components
- generation resolves applicable recipe classes or variants automatically
- validation can warn when a component/theme pairing has no supported recipe strategy

### 6. Context Quality Improvements

Upgrade `get-screen-generation-context` to:

- use confidence thresholds for template matches
- widen component discovery beyond a two-component fallback
- include subcomponents and composition guidance
- expose why a template or component was suggested

### 7. Observability and Regression Safety

Add contract-level telemetry and regression fixtures for:

- auth bootstrap success/failure
- entitlement mismatch detection
- validation/generation parity
- recipe application
- generated code compileability

---

## Affected Packages

- `packages/mcp-server`
- `packages/playground-web`
- `packages/core`
- `packages/ui`
- `.moai/specs`

---

**Completed Date**: 2026-03-06

---

## Documentation Impact

Update all affected workflow documentation if implementation proceeds:

- MCP getting-started prompt
- screen workflow prompt
- MCP docs in `packages/playground-web/content/docs/`
- any README sections that describe theme preview or screen generation

---

## Risks

1. Existing agents may implicitly rely on current weak contracts.
2. Unifying catalogs may expose hidden incompatibilities across `core` and `ui`.
3. Tightening codegen can temporarily reduce supported output surface until adapters are implemented.

Mitigation:

- ship contract versioning
- keep explicit degraded/unsupported responses
- add parity fixtures before replacing old behavior
