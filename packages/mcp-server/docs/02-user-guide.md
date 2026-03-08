# User Guide

This guide focuses on how agents and developers should use FramingUI today.

## CLI Commands

```bash
npx -y @framingui/mcp-server@latest init
npx -y @framingui/mcp-server@latest login
npx -y @framingui/mcp-server@latest logout
npx -y @framingui/mcp-server@latest status
npx -y @framingui/mcp-server@latest
```

## Slash Commands

FramingUI ships command guidance for these actions:

- `/screen`: full screen generation
- `/draft`: structural draft before final code
- `/section`: section generation or replacement
- `/responsive`: responsive refinement
- `/a11y`: accessibility review
- `/theme-swap`: regenerate the same structure under a new theme
- `/doctor`: diagnose auth, style-contract, and environment issues
- `/install-check`: dependency and Tailwind verification
- `/export`: export artifacts
- `/update`: update installed FramingUI packages

## Tool Groups

### Discovery

- `list-themes`
- `preview-theme`
- `list-components`
- `preview-component`
- `list-screen-templates`
- `preview-screen-template`
- `list_tokens`
- `list-icon-libraries`
- `preview-icon-library`

### Production Workflow

- `get-screen-generation-context`
- `validate-screen-definition`
- `validate-environment`
- `generate_screen` as an optional helper

### Legacy Helpers

- `generate-blueprint`
- `export-screen`
- `validate_screen`

## Current Recommended Workflow

1. detect the style contract
2. inspect `preview-theme` if theme defaults matter
3. call `get-screen-generation-context`
4. call `preview-component` for anything ambiguous
5. call `list-icon-libraries` before introducing icons
6. validate the definition with `validate-screen-definition`
7. write React code directly from the validated contract
8. run `validate-environment` with `sourceFiles` before handoff

## Style Contracts

### host-utility

Use explicit utility classes. Do not rely on FramingUI default variants unless you intentionally migrate.

### framingui-native

Import `@framingui/ui/styles` from a global stylesheet and use FramingUI variants and variables.

### migrate

Pause the generation flow and decide how the target app should move from host utilities to FramingUI-native styling.

## Guardrails

- Do not claim a component is missing without checking the catalog.
- Semantic wrappers such as `header`, `nav`, `section`, and `footer` can remain HTML.
- Interactive and form primitives should use FramingUI components when available.
- Treat templates as hints, not structural requirements.
- Treat the validated screen definition as the production contract.
