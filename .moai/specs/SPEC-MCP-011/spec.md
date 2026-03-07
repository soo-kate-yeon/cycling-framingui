# SPEC-MCP-011: MCP Slash Command Registry and Guided UX

## Overview

| Field | Value |
|-------|-------|
| **SPEC ID** | SPEC-MCP-011 |
| **Title** | MCP Slash Command Registry and Guided UX |
| **Status** | Implemented |
| **Priority** | High |
| **Created** | 2026-03-07 |
| **Author** | Codex + soo-kate-yeon |
| **Dependencies** | SPEC-MCP-005, SPEC-MCP-006, SPEC-MCP-008 |

## Problem

FramingUI MCP now has strong lower-level tools and a usable screen workflow, but it still lacks a productized command layer for high-frequency design actions.

Current gaps:

- Users must know tool names and workflow order instead of invoking intent-level actions.
- Existing MCP prompts explain workflows, but they are not packaged as reusable slash command contracts.
- There is no canonical metadata source for command usage, examples, argument help, or tab-completion style UX.
- Common design refinement tasks such as responsive optimization and theme swap are not expressed as first-class commands.
- Command UX differs by client, but FramingUI does not provide a shared command registry that clients can render consistently.
- The CLI lacks an adapter/export surface for command metadata that client shells can consume directly.
- First-time `npx` usage does not provide a safe, human-readable onboarding path outside MCP clients.
- There is no one-shot maintenance command for updating installed FramingUI packages in a project.

This limits discoverability and makes FramingUI feel like a tool bundle rather than a guided design system workflow surface.

## Goals

| # | Goal | Success Criteria |
|---|------|------------------|
| G1 | Define a canonical command layer | All supported commands are represented in one registry with stable names, arguments, help text, examples, and workflow mappings |
| G2 | Make common UI tasks intent-driven | Users can invoke screen creation, section creation, drafting, responsive optimization, accessibility review, theme swap, environment diagnosis, export, and install checks through stable commands |
| G3 | Support guided command UX | Registry metadata is sufficient for slash command lists, tab-help text, inline usage hints, and `--help` fallback rendering |
| G4 | Keep MCP and client UX decoupled | Command behavior is defined once and may be rendered in multiple clients without changing MCP tool contracts |
| G5 | Preserve workflow quality | Commands call the existing validated MCP workflows rather than bypassing context, validation, or environment checks |
| G6 | Support client adapters and first-run guidance | Clients and humans can consume the same command metadata through adapters and CLI help/guide entrypoints |
| G7 | Add a maintenance shortcut | Users can update installed FramingUI packages in one command from the CLI |

## Non-Goals

- Defining client-specific UI implementations for Claude Code, Codex, Cursor, or custom shells
- Replacing MCP tools with slash commands at the protocol layer
- Adding style commands for palette or tone in this phase
- Creating a fully interactive shell inside the MCP server

## Command Set

### Generation

- `/screen`
- `/section`
- `/draft`

### Optimization

- `/responsive`
- `/a11y`

### Style

- `/theme-swap`

### Operations

- `/doctor`
- `/export`
- `/update`
- `/install-check`

## Requirements

### Ubiquitous Requirements

- The system SHALL define a canonical slash command registry for FramingUI design workflows.
- The system SHALL provide a command adapter surface that can render the canonical registry in machine-readable and human-readable formats.
- The CLI SHALL provide an explicit human help or guide command for first-time users.
- The CLI SHALL avoid printing onboarding text to stdout when running as an MCP stdio server.
- The system SHALL support a project maintenance command for updating installed FramingUI packages.
- Each command SHALL include, at minimum:
  - `name`
  - `summary`
  - `usage`
  - `args`
  - `options`
  - `examples`
  - `workflow`
  - `promptRecipe`
- The registry SHALL be client-agnostic and SHALL NOT assume a single host application.
- The registry SHALL provide enough metadata to render tab-completion help or a `--help` fallback.
- Commands SHALL map to existing MCP tool workflows or prompt recipes rather than inventing parallel execution logic.

### Event-Driven Requirements

- WHEN a client asks for available commands THEN the system SHALL be able to return the full command catalog with summaries and usage strings.
- WHEN a client asks for a specific command THEN the system SHALL be able to return detailed help metadata including examples and options.
- WHEN a CLI user requests command metadata THEN the adapter surface SHALL be able to return at least:
  - `json`
  - `markdown`
  - `text`
- WHEN the CLI runs with no subcommand in an interactive TTY THEN it SHALL print a short onboarding guide and SHALL NOT start an MCP stdio session automatically.
- WHEN the CLI runs with no subcommand in a non-interactive stdio context THEN it SHALL preserve MCP server startup behavior.
- WHEN `/update` or the equivalent CLI maintenance command is invoked THEN the system SHALL detect installed FramingUI packages and build the correct package-manager update command.
- WHEN `/screen` is invoked THEN the workflow SHALL follow:
  - `get-screen-generation-context`
  - `validate-screen-definition`
  - `generate_screen`
  - `validate-environment` when a target project path is known
- WHEN `/section` is invoked THEN the workflow SHALL support section-scoped generation using component discovery and definition validation before optional codegen.
- WHEN `/draft` is invoked THEN the workflow SHALL generate a structural draft without requiring code generation by default.
- WHEN `/responsive` is invoked THEN the workflow SHALL support layout adaptation modes including:
  - `mobile-first`
  - `tablet-safe`
  - `touch-optimized`
  and density options including:
  - `preserve`
  - `denser`
  - `lighter`
- WHEN `/a11y` is invoked THEN the workflow SHALL provide accessibility findings and MAY provide a fix patch or regenerated output when requested.
- WHEN `/theme-swap` is invoked THEN the workflow SHALL re-run supported theme application paths instead of performing superficial string replacement.
- WHEN `/doctor` is invoked THEN the workflow SHALL inspect auth, theme availability, and environment configuration.
- WHEN `/install-check` is invoked THEN the workflow SHALL call `validate-environment` directly or through an equivalent environment validation path.
- WHEN `/export` is invoked THEN the workflow SHALL use either `export-screen` or `generate_screen`, depending on the source artifact type.
- WHEN `/update` is invoked THEN the workflow SHALL update installed FramingUI packages in the target project and MAY include `tailwindcss-animate` when it is already part of the setup.

### State-Driven Requirements

- IF a client supports slash command menus or tab completion THEN the registry metadata SHALL be sufficient to render one-line summaries and usage hints inline.
- IF a client does not support native slash command UX THEN the same metadata SHALL be renderable through text help such as `/screen --help`.
- IF a user invokes the CLI directly from a terminal THEN the onboarding path SHALL describe what FramingUI is, the `init` flow, authentication, and how MCP clients discover commands.
- IF a command targets an existing screen artifact THEN the command contract SHALL allow the target to be a file path, screen definition, or current selection context.
- IF a command requires generated code delivery to a real project THEN environment validation SHALL remain part of the supported workflow.
- IF density refinement is needed THEN it SHALL be expressed as an option under `/responsive` rather than a standalone command.
- IF no FramingUI packages are installed in the target project THEN the update command SHALL fail with a clear remediation hint instead of running an empty package-manager command.

### Unwanted Requirements

- The system SHALL NOT create a separate undocumented command contract per client.
- The system SHALL NOT bypass validation or dependency checks for convenience-oriented commands.
- The system SHALL NOT introduce `palette` or `tone` commands in this phase.
- The system SHALL NOT define `hierarchy` as a standalone command in this phase.
- The system SHALL NOT require clients to hardcode help text outside the canonical registry.
- The system SHALL NOT emit onboarding text on stdout during MCP stdio startup.

## Command Contracts

### `/screen`

Purpose:
- Generate a full screen from a natural-language description.

Canonical usage:
```text
/screen <description> [--theme <themeId>] [--platform web|mobile] [--template <id>] [--output draft|code]
```

Primary result:
- Validated screen definition and generated code when requested.

### `/section`

Purpose:
- Generate or replace a section inside an existing screen.

Canonical usage:
```text
/section <description> [--slot header|main|sidebar|footer] [--into <screen-id|file>] [--replace <section-id>]
```

Primary result:
- Section patch, section definition, and optional generated fragment/code.

### `/draft`

Purpose:
- Create a screen draft before code generation.

Canonical usage:
```text
/draft <description> [--theme <themeId>] [--platform web|mobile] [--variants <n>]
```

Primary result:
- Layout draft, section structure, component candidates, and draft definition.

### `/responsive`

Purpose:
- Optimize an existing screen for responsive behavior.

Canonical usage:
```text
/responsive <target> [--mode mobile-first|tablet-safe|touch-optimized] [--density preserve|denser|lighter] [--breakpoint sm|md|lg]
```

Primary result:
- Responsive patch, breakpoint-specific recommendations, and regenerated output when requested.

### `/a11y`

Purpose:
- Audit and optionally fix accessibility issues.

Canonical usage:
```text
/a11y <target> [--fix] [--scope full|form|dialog|nav]
```

Primary result:
- Accessibility findings, severity-grouped recommendations, and optional fix patch.

### `/theme-swap`

Purpose:
- Reapply the same screen structure under a new theme.

Canonical usage:
```text
/theme-swap <target> --to <themeId> [--from <themeId>] [--output code|diff]
```

Primary result:
- Regenerated output with target theme recipes applied and unsupported pairing warnings where needed.

### `/doctor`

Purpose:
- Diagnose whether the current project is ready for FramingUI workflows.

Canonical usage:
```text
/doctor [<project-path>] [--auth] [--tailwind] [--themes] [--fix-hints]
```

Primary result:
- Environment issues, auth or theme access status, and prioritized fixes.

### `/install-check`

Purpose:
- Check only install and environment prerequisites for generated output.

Canonical usage:
```text
/install-check [<project-path>] [--for <screen|section|file>] [--packages-only]
```

Primary result:
- Missing packages, install commands, and setup gaps.

### `/export`

Purpose:
- Export a draft or screen artifact to a concrete output format.

Canonical usage:
```text
/export <target> [--format tsx|jsx|json] [--out <path>]
```

Primary result:
- Exported artifact content and dependency notes where relevant.

### `/update`

Purpose:
- Update installed FramingUI packages in a target project.

Canonical usage:
```text
/update [<project-path>] [--check]
```

Primary result:
- Package-manager specific update command or executed update operation.

## Prompt Recipe Mapping

The system SHOULD keep command entrypoints and prompt recipes aligned.

Initial prompt recipe set:

- `getting-started`
- `screen-workflow`
- `responsive-workflow`
- `a11y-workflow`
- `theme-swap-workflow`
- `doctor-workflow`
- `update-workflow`

Each command SHALL declare its preferred prompt recipe fallback so clients without native command UX can still guide the agent correctly.

## Metadata Contract

The canonical registry SHALL support a metadata shape equivalent to:

```json
{
  "name": "/responsive",
  "summary": "Optimize an existing screen for responsive layouts.",
  "usage": "/responsive <target> [--mode ...] [--density ...] [--breakpoint ...]",
  "args": [
    {
      "name": "target",
      "required": true,
      "description": "Screen file, screen definition, or current selection"
    }
  ],
  "options": [
    {
      "name": "--mode",
      "values": ["mobile-first", "tablet-safe", "touch-optimized"]
    },
    {
      "name": "--density",
      "values": ["preserve", "denser", "lighter"]
    }
  ],
  "examples": [
    "/responsive ./screen.json --mode mobile-first",
    "/responsive dashboard.tsx --mode touch-optimized --density lighter"
  ],
  "workflow": [
    "list_tokens",
    "validate-screen-definition",
    "generate_screen"
  ],
  "promptRecipe": "responsive-workflow"
}
```

## Implementation Notes

- Add a slash command registry module under `packages/mcp-server/src/`.
- Add adapter renderers for machine-readable and human-readable command surfaces.
- Add CLI entrypoints for:
  - first-run guide
  - command adapter export
  - package update
- Expose command metadata through either:
  - a new MCP prompt/indexed help layer, or
  - a lightweight command catalog tool or API route,
  depending on the delivery client.
- Reuse existing MCP tools and prompts wherever possible.
- Document the registry in MCP-facing docs and user-facing workflow docs.
- Keep command naming stable and short; optimize for memorability over internal precision.
