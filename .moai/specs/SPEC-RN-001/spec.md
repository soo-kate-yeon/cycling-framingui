---
id: SPEC-RN-001
version: "1.0.0"
status: "complete"
created: "2026-03-14"
updated: "2026-03-14"
author: "Codex + soo-kate-yeon"
priority: "high"
---

# SPEC-RN-001: Extract React Native Runtime Package From Prototype

## Summary

SPEC-MCP-012 and SPEC-MCP-013 made React Native a first-class direct-write path in FramingUI MCP. That improved context detection, workflow guidance, and validation, but it did not solve the core runtime problem: RN users still do not have a shared token consumption layer or a minimal runtime primitive set they can actually import.

The shadowoo prototype validated that token-aware direct-write becomes much more stable once a codebase has:

- a typed RN token consumption layer
- a small set of generic primitives
- predictable import paths for token-backed styles

This SPEC extracts that generic portion into a reusable FramingUI package so RN users can benefit from it without depending on a single app’s internal structure.

## Problem

FramingUI currently provides:

- web runtime components in `@framingui/ui`
- token authority in `@framingui/tokens`
- MCP discovery, guidance, and QC for React Native direct-write

What it does not provide for RN users:

- a published runtime package for token consumption
- generic importable RN primitives
- a stable “happy path” between MCP guidance and real RN code

As a result, RN support exists conceptually, but practical adoption still depends on app-local scaffolding.

## Goals

- Define and extract a reusable React Native runtime package
- Keep FramingUI stack-agnostic while still giving RN users a concrete runtime path
- Reuse `@framingui/tokens` as the authority layer
- Support `StyleSheet.create`-friendly direct-write patterns
- Ship a minimal, productizable primitive set that matches the current MCP direct-write philosophy

## Non-Goals

- Full parity with `@framingui/ui`
- Web/RN single-source component parity in this phase
- Screen code generation for React Native
- App-specific shells, branding, or auth-specific wrappers
- Forcing consumers onto Tamagui, NativeWind, or another styling framework

## User Value

FramingUI should be able to offer React Native users the same core promise it already offers on web:

1. shared token authority
2. a concrete runtime layer
3. MCP guidance that maps onto real importable components

The user-facing message should become:

“FramingUI supports React Native direct-write with a small runtime package that gives you token-backed building blocks without requiring a full styling-system migration.”

## Package Direction

Recommended package:

- `packages/react-native`
- npm name: `@framingui/react-native`

Why this direction:

- clearer to consumers than `ui-native-core`
- separate from `@framingui/ui`, avoiding false parity expectations
- leaves room for future higher-level RN packages if needed

## EARS Requirements

### Ubiquitous

- The system SHALL provide a published React Native runtime package that depends on `@framingui/tokens`.
- The package SHALL expose typed token consumption helpers suitable for `StyleSheet.create`.
- The package SHALL expose a minimal generic primitive set for React Native direct-write workflows.

### Event-Driven

- WHEN an RN user installs the package THEN they SHALL be able to import token helpers and primitives without app-local scaffolding.
- WHEN MCP recommends RN direct-write primitives THEN the recommended component vocabulary SHALL map onto package exports where available.
- WHEN package consumers use the primitives in `StyleSheet.create` workflows THEN the primitives SHALL preserve plain RN patterns rather than requiring CSS or class-based styling.

### State-Driven

- IF a consumer uses the package in Expo THEN it SHALL work without requiring bare-RN-only configuration.
- IF a consumer uses only token helpers and not the primitives THEN the package SHALL still provide value as a thin consumption layer.
- IF a consumer needs app-specific shells or branded variants THEN those SHALL remain app-local unless separately generalized.

### Unwanted

- The package SHALL NOT depend on web-only APIs such as CSS imports, Tailwind config, or `react-dom`.
- The package SHALL NOT require Tamagui, NativeWind, or Radix.
- The package SHALL NOT embed app-specific copy, auth flow assumptions, or product branding.

## Scope

### In Scope

- new `packages/react-native` package scaffold
- typed token helpers
- minimal generic primitives
- package README and usage guidance
- MCP/discovery documentation updates that reference the new runtime path where appropriate
- tests and build wiring

### Deferred

- advanced layout primitives beyond the minimum direct-write set
- form library integrations
- full template system for RN
- Storybook or visual docs parity

## Proposed Public API

Initial exports should stay intentionally small.

Helpers:

- `tokens`
- `colors`
- `spacing`
- `radius`
- `typography`
- `shadows`
- `getTextStyle`
- `getShadowStyle`
- small spacing helpers if still justified after extraction

Primitives:

- `Button`
- `TextField`
- `InlineMessage`
- `Screen`
- `Stack`

Principles:

- generic names, not app-specific names
- no auth-specific shells in package surface
- no assumptions about routing or backend

## Extraction Guidance From Prototype

Shadowoo validated:

- typed tokens are reusable
- `Button`, `TextField`, `InlineMessage` are generic enough to extract
- app-specific `AuthScreenShell` should not be exported as-is

Generalization rule:

- extract if it is semantically generic
- keep local if it encodes product workflow, copy structure, or screen semantics

## Task Breakdown

### TASK-001: Define package contract and scaffold

Deliverables:

- `packages/react-native` package scaffold
- `package.json`, TS config, build config, exports map
- README stub
- initial test setup

Validation:

- `pnpm --filter @framingui/react-native build`
- `pnpm --filter @framingui/react-native test`

Success conditions:

- the package exists in the monorepo and builds independently
- exports are shaped for npm publication

### TASK-002: Extract token consumption helpers

Deliverables:

- token helper module wired to `@framingui/tokens`
- typed color/spacing/radius/typography/shadow surface
- helper tests

Validation:

- `pnpm --filter @framingui/react-native test`
- `pnpm --filter @framingui/react-native build`

Success conditions:

- RN consumers can import token helpers directly from the package
- helpers are generic and free of app-local assumptions

### TASK-003: Extract minimal generic primitives

Deliverables:

- `Button`
- `TextField`
- `InlineMessage`
- `Screen`
- `Stack`
- primitive tests

Validation:

- `pnpm --filter @framingui/react-native test`
- `pnpm --filter @framingui/react-native build`

Success conditions:

- primitives are generic, token-backed, and RN-native
- no web-only dependencies are introduced

### TASK-004: Integrate docs and MCP guidance

Deliverables:

- README updates
- package README
- MCP guidance or docs references updated to mention the runtime package where appropriate

Validation:

- `pnpm --filter @framingui/mcp-server test`
- `pnpm --filter @framingui/mcp-server typecheck`
- `pnpm --filter @framingui/react-native build`

Success conditions:

- RN guidance no longer sounds like “guidance only” when the package is available
- docs clearly distinguish direct-write workflow from full codegen

## Full Completion Criteria

- All four tasks completed in order
- `pnpm --filter @framingui/react-native test` passes
- `pnpm --filter @framingui/react-native build` passes
- `pnpm --filter @framingui/mcp-server test` passes
- `pnpm --filter @framingui/mcp-server typecheck` passes

## Product Risk Notes

- If the package surface grows too quickly, it will be judged against `@framingui/ui` parity and look incomplete.
- If the package stays too shadowoo-specific, it will fail the extraction test and become another app-local layer in disguise.
- If MCP guidance is updated before the package feels usable, users will hit a confusing half-finished experience.

## Decision

FramingUI should package the RN runtime path, but it should do so as a deliberately small, generic runtime package rather than trying to clone the entire web UI system in one step.

## Completion Record

- TASK-001 completed with a scaffolded `packages/react-native` package, exports map, README stub, and independent build/test wiring
- TASK-002 completed with typed runtime token values, RN helpers, and a FramingUI token-contract mapping layer
- TASK-003 completed with generic `Button`, `TextField`, `InlineMessage`, `Screen`, and `Stack` primitives plus package-level tests
- TASK-004 completed with root/package README updates, MCP prompt/template updates, and React Native discovery guidance that now points to `@framingui/react-native` where the runtime surface exists
