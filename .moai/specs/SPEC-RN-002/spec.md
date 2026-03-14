---
id: SPEC-RN-002
version: "1.0.0"
status: complete
created: "2026-03-14"
updated: "2026-03-14"
author: Codex
priority: high
lifecycle: spec-anchored
---

# SPEC-RN-002: React Native Parity Expansion Plan

## Summary

React Native support has reached the minimum direct-write stage: a token contract exists, a small runtime surface can exist, and MCP can guide native work. What is still missing is the part that makes FramingUI web outputs feel product-grade:

- a real theme runtime instead of fixed RN-friendly values
- richer layout tokens that shape screens, not just spacing
- a reusable component system that covers the common 80 percent of product UI
- MCP/runtime parity so discovery, direct write, and QC all target the same RN system

This SPEC defines the expansion plan required to move React Native from "guided direct-write" to a system that can credibly approach FramingUI web output quality.

## Problem

The current RN path only partially expresses FramingUI design decisions.

- Token contracts can be typed against `@framingui/tokens`
- Runtime token values are still fixed rather than theme-resolved
- Layout decisions are limited to basic spacing and width helpers
- The runtime primitive surface is too small to shape the majority of app screens
- MCP can guide native work, but it cannot yet target a rich enough RN system to produce web-level consistency

Without addressing these gaps, React Native remains a promising workflow rather than a mature product surface.

## Goals

- Introduce a real RN theme runtime that resolves FramingUI theme inputs into runtime values
- Expand layout tokens so screen rhythm and structure become reusable decisions
- Build an 80/20 RN component system around roughly 20 components
- Align MCP guidance and validation with the expanded RN runtime
- Ensure every task has a measurable validation gate before follow-on work starts

## Non-Goals

- Full one-to-one parity with every `@framingui/ui` component
- RN screen code generation parity in this phase
- Supporting multiple RN styling frameworks at once
- App-specific flows, branding, or auth shells

## Target Outcome

At the end of this roadmap, React Native should support:

- theme-driven runtime values
- shared layout decisions
- a product-grade 20-component system
- MCP discovery that points at real importable RN surfaces
- validation rules that enforce token, layout, and component consistency

## 80/20 Component Target

The component system should prioritize the 20 components that most commonly shape product UI in React Native:

1. `Screen`
2. `Stack`
3. `Text`
4. `Heading`
5. `Button`
6. `IconButton`
7. `TextField`
8. `TextArea`
9. `PickerField`
10. `Checkbox`
11. `RadioGroup`
12. `Switch`
13. `Card`
14. `ListItem`
15. `Badge`
16. `Avatar`
17. `InlineMessage`
18. `Modal` or `BottomSheet`
19. `SegmentedControl` or `Tabs`
20. `Skeleton` or `EmptyState`

These components should cover the majority of:

- auth flows
- onboarding
- settings
- profile
- list/detail
- paywall
- lightweight dashboard
- form-based screens

## Task Breakdown

### TASK-001: Theme Runtime Foundation

Deliverables:

- RN theme runtime schema
- runtime resolver that converts FramingUI theme inputs into RN values
- `ThemeProvider`, `useTheme`, and `createThemedStyles`
- migration path from fixed token values to theme-derived values

Required validation:

- `pnpm --filter @framingui/react-native test -- theme-runtime`
- `pnpm --filter @framingui/react-native build`

Success conditions:

- runtime values can be swapped by theme without editing component code
- at least the existing base primitives consume theme-derived values
- fixed token values are no longer the only source of truth for RN runtime styling

Blocking gate:

- TASK-002 cannot begin until theme switching is proven by automated tests

### TASK-002: Layout Token Expansion

Deliverables:

- layout token groups for screen inset, section gap, content width, form rhythm, and safe-area presets
- layout helpers built on top of those tokens
- tests for layout token resolution and helper output

Required validation:

- `pnpm --filter @framingui/react-native test -- layout`
- `pnpm --filter @framingui/react-native build`

Success conditions:

- layout helpers express reusable structure decisions rather than raw spacing only
- screen/container rhythm can be composed from tokenized layout decisions
- layout token drift can be detected in tests

Blocking gate:

- TASK-003 cannot begin until layout helpers can express screen rhythm without raw literals

### TASK-003: Higher-Level Layout Primitives

Deliverables:

- `Section`
- `ScreenHeader`
- `FormSection`
- `ListSection`
- `ActionRow`

Required validation:

- `pnpm --filter @framingui/react-native test -- primitives-layout`
- `pnpm --filter @framingui/react-native build`

Success conditions:

- at least one auth-style screen and one settings/profile-style screen can be composed without app-local shells
- the new primitives consume theme and layout tokens rather than embedding fixed layout choices

Blocking gate:

- TASK-004 cannot begin until higher-level primitives prove that common screen structure is reusable

### TASK-004: Core Interaction and Form Surface

Deliverables:

- `Text`
- `Heading`
- `IconButton`
- `TextArea`
- `PickerField`
- `Checkbox`
- `RadioGroup`
- `Switch`

Required validation:

- `pnpm --filter @framingui/react-native test -- core-surface`
- `pnpm --filter @framingui/react-native build`

Success conditions:

- the RN system can express most form and action patterns without app-local control wrappers
- state variants such as disabled, invalid, selected, and focused are covered by tests

Blocking gate:

- TASK-005 cannot begin until the core interaction surface is test-proven and documented

### TASK-005: Data, Feedback, and Navigation Surface

Deliverables:

- `Card`
- `ListItem`
- `Badge`
- `Avatar`
- `InlineMessage`
- `Modal` or `BottomSheet`
- `SegmentedControl` or `Tabs`
- `Skeleton` or `EmptyState`

Required validation:

- `pnpm --filter @framingui/react-native test -- data-surface`
- `pnpm --filter @framingui/react-native build`

Success conditions:

- the component matrix reaches the planned 80/20 surface
- at least list/detail, settings, and paywall-style flows can be composed from package exports
- overlay/navigation choices are explicit and test-covered

Blocking gate:

- TASK-006 cannot begin until the runtime surface reaches the target matrix and usage examples compile

### TASK-006: MCP Parity and Validation Integration

Deliverables:

- `list-components` alignment with the expanded RN exports
- `preview-component` output for RN-specific contracts
- `get-screen-generation-context` guidance updated for the expanded runtime
- `validate-environment` checks for theme/layout/component drift
- docs and workflow guidance updates

Required validation:

- `pnpm --filter @framingui/mcp-server test`
- `pnpm --filter @framingui/mcp-server typecheck`
- `pnpm --filter @framingui/react-native test`
- `pnpm --filter @framingui/react-native build`

Success conditions:

- MCP recommendations map to real RN exports wherever the runtime surface exists
- RN guidance no longer depends on implied app-local scaffolding for common screens
- validation catches token, layout, and web-only drift for the expanded system

Blocking gate:

- final completion requires MCP and runtime validation to pass together

## Full Completion Criteria

- All six tasks completed in order
- Each task passed its own blocking validation before the next task started
- The RN runtime supports real theme resolution, expanded layout tokens, higher-level layout primitives, and the planned 80/20 component surface
- MCP guidance and validation target the expanded RN runtime correctly

## GitHub Tracking Requirement

This SPEC must be tracked through GitHub issues:

- one umbrella issue for the RN parity expansion roadmap
- one issue per task
- every task issue must include its blocking validation commands
- no task issue may be marked done without recording the required validation results

Tracking IDs:

- umbrella: `#90`
- TASK-001: `#91`
- TASK-002: `#92`
- TASK-003: `#93`
- TASK-004: `#94`
- TASK-005: `#95`
- TASK-006: `#96`

## Decision

FramingUI should pursue RN parity through a staged expansion plan, not by cloning the web system in one pass. The right product path is:

1. theme runtime
2. layout token system
3. higher-level primitives
4. 80/20 component matrix
5. MCP parity
