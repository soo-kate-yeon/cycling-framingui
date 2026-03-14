---
id: SPEC-MCP-013
version: "1.0.0"
status: "proposed"
created: "2026-03-14"
updated: "2026-03-14"
author: "Codex + soo-kate-yeon"
priority: "high"
---

# SPEC-MCP-013: Project Context Auto-Detection and Session Defaults

## Summary

SPEC-MCP-012 added first-class React Native direct-write support, but the MCP experience still expects users or agents to pass `platform: "react-native"` manually on discovery and context tools. That is acceptable for internal testing, but it is weaker than the web path because FramingUI does not yet establish a durable project context for the session.

This SPEC adds project-aware context detection so FramingUI can infer whether the active app is web, Expo, or bare React Native and then apply that context consistently across MCP tools and generated guidance.

## Problem

Current gaps after SPEC-MCP-012:

- `validate-environment` can infer platform from a project path, but discovery/context tools cannot
- there is no single bootstrap step that tells the server which app it is working against
- generated guidance still depends on the user remembering to pass `platform: "react-native"`
- `init` and guide generation remain web-first and do not establish native defaults
- session state is auth-aware, but not project-aware

The result is that React Native support exists, but it is easier to fall off the happy path than on web.

## Goals

- Add an explicit project-context detection step for MCP sessions
- Allow downstream tools to use inferred defaults when `platform` is omitted
- Make Expo / bare React Native / web context visible in the response model
- Update generated guidance so the recommended first step becomes project-context detection instead of ad hoc manual flags
- Preserve explicit override behavior when users intentionally request a different platform

## Non-Goals

- Persisting cross-machine or cloud-backed project preferences
- Replacing authentication flow with project-context flow
- Adding React Native code generation
- Adding React Native runtime packages
- Detecting every framework in the ecosystem beyond the supported web / Expo / React Native scope

## User Value

FramingUI should be able to say:

1. Point me at your project once.
2. I will detect whether it is web, Expo, or React Native.
3. I will use that as the default for discovery, context, and validation until you override it.

That removes repetitive flags and makes React Native feel like a first-class path instead of a hidden advanced option.

## EARS Requirements

### Ubiquitous

- The MCP server SHALL support a project-context detection workflow based on a filesystem path.
- The MCP server SHALL expose the detected platform and runtime in a reusable response shape.
- The MCP server SHALL preserve explicit `platform` inputs as the highest-priority override.

### Event-Driven

- WHEN a user or agent provides a project path THEN the MCP server SHALL detect whether the project is `web`, `expo`, or `react-native`.
- WHEN project context has been established for the session AND a downstream tool omits `platform` THEN the server SHALL use the detected default platform.
- WHEN a downstream tool receives both an explicit `platform` and a detected session default THEN the explicit platform SHALL win.
- WHEN the detected project is Expo or React Native THEN generated guidance SHALL recommend React Native direct-write workflow by default.

### State-Driven

- IF a project contains `expo` dependencies THEN the detected runtime SHALL be `expo`.
- IF a project contains `react-native` without Expo THEN the detected runtime SHALL be `react-native`.
- IF a project does not contain React Native markers THEN the detected runtime SHALL fall back to `web` unless overridden.
- IF no project context has been established THEN existing tool behavior SHALL remain backward compatible.

### Unwanted

- The system SHALL NOT silently replace an explicitly requested platform with the detected default.
- The system SHALL NOT require project-context detection before all MCP usage.
- The system SHALL NOT treat project-context detection as an auth gate like `whoami`.

## Implementation Scope

### In Scope

- New MCP tool for project-context detection
- Session-default platform/runtime handling for eligible tools
- Optional local persistence for generated guidance or MCP-local state if needed
- `init` / generated guide updates to recommend the context bootstrap step
- Tests for detection, override precedence, and backward compatibility

### Deferred

- Multi-project session switching UX beyond a single active default
- IDE/editor-side automatic cwd propagation protocol changes
- Deep framework taxonomy beyond web / Expo / React Native

## Proposed UX

Recommended flow:

1. `detect-project-context({ projectPath })`
2. server returns `platform`, `runtime`, `packageManager`, and recommended workflow
3. optional: server stores session default context
4. `get-screen-generation-context({ description })`
5. `preview-component({ componentId })`
6. `validate-environment({ projectPath, sourceFiles })`

The direct-write path remains explicit in logic, but implicit in ergonomics.

## Task Breakdown

### TASK-001: Add project-context detection contract

Deliverables:

- MCP schema for project-context detection
- response shape for `platform`, `runtime`, `packageManager`, and recommendations
- session-state contract for active project defaults

Validation commands:

- `pnpm --filter @framingui/mcp-server typecheck`
- `pnpm --filter @framingui/mcp-server test -- --runInBand __tests__/tools/detect-project-context.test.ts`

Success conditions:

- project context can be detected from a path
- schema supports the new tool cleanly
- tests prove Expo / bare RN / web discrimination

### TASK-002: Apply session defaults to downstream tools

Deliverables:

- shared resolver for `explicit input -> session default -> legacy fallback`
- integration in `get-screen-generation-context`
- integration in `list-components`
- integration in `preview-component`

Validation commands:

- `pnpm --filter @framingui/mcp-server typecheck`
- `pnpm --filter @framingui/mcp-server test -- --runInBand __tests__/tools/project-context-defaults.test.ts`

Success conditions:

- omitted `platform` uses session defaults when available
- explicit `platform` still wins
- no-context sessions remain backward compatible

### TASK-003: Update bootstrap and generated guidance

Deliverables:

- `init` flow recommendations updated
- generated guide / `AGENTS.md` / `CLAUDE.md` updated
- README workflow updated

Validation commands:

- `pnpm --filter @framingui/mcp-server typecheck`
- `pnpm --filter @framingui/mcp-server test -- --runInBand __tests__/cli/project-context-guidance.test.ts`

Success conditions:

- project-context detection is presented as the recommended first step when path is known
- RN projects no longer rely on memorizing manual platform flags

## Full Completion Criteria

- All three tasks completed in order
- `pnpm --filter @framingui/mcp-server test`
- `pnpm --filter @framingui/mcp-server typecheck`
- `pnpm --filter @framingui/mcp-server build`

## Product Gaps This SPEC Addresses

Compared with current web experience, RN users are still missing:

- automatic platform defaults
- project bootstrap ergonomics
- init-time native-aware guidance
- lower-friction discovery flow without repeated `platform` flags

This SPEC addresses those ergonomics gaps without changing the underlying direct-write philosophy.
