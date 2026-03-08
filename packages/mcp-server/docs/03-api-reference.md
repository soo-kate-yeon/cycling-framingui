# API Reference

This is the high-level reference for `@framingui/mcp-server`.

## Authentication

### `whoami`

Optional session inspection. Useful for checking current account state and licensed themes.

## Discovery Tools

### `list-themes` and `preview-theme`

Use these to inspect available themes and theme recipes.

### `list-components` and `preview-component`

Use these to inspect component availability, props, variants, imports, and examples.

### `list-screen-templates` and `preview-screen-template`

Use these for inspiration and structural hints. Templates are not the final contract.

### `list-icon-libraries` and `preview-icon-library`

Use these before introducing icons or icon-only actions.

### `list_tokens`

Use this for shell, page, and section tokens.

## Production Workflow Tools

### `get-screen-generation-context`

Returns:

- `templateHints`
- `componentPlan`
- `sectionPlan`
- `definitionStarter`
- `components`
- `themeRecipes`
- `workflow`
- `warnings`

### `validate-screen-definition`

Validates a screen definition before code is written.

Returns:

- `valid`
- `errors`
- `warnings`
- `suggestions`
- `autoFixPatches`

### `validate-environment`

Validates:

- required packages
- Tailwind configuration
- style contract
- optional source-file code audit via `sourceFiles`

### `generate_screen`

Optional code-generation helper. Use it when you want a reference implementation after validation.

## Legacy Tools

### `generate-blueprint`

Legacy helper for integrations that still depend on blueprint artifacts.

### `export-screen`

Legacy blueprint export tool.

### `validate_screen`

Legacy lightweight validator. Prefer `validate-screen-definition`.
