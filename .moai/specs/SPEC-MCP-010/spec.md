# SPEC-MCP-010: Serverless Theme Catalog Fallback

## Problem

`@framingui/core` resolves themes from filesystem paths:

1. consumer `.moai/themes/generated`
2. monorepo `.moai/themes/generated`
3. `dist/bundled/themes/generated`

In serverless Next.js production bundles, those filesystem paths can be absent even when the app code is deployed correctly. When that happens:

- `listThemes()` returns `[]`
- `loadTheme()` returns `null`
- MCP auth normalization collapses licensed themes to `[]`
- `/api/mcp/themes` and `/api/mcp/themes/:id` become unusable

## Goal

Make theme catalog access deterministic in serverless/runtime bundles without requiring `.moai` or dist filesystem access.

## Requirements

1. `@framingui/core` must expose bundled theme data through in-memory module exports.
2. `loadTheme`, `listThemes`, and `themeExists` must fall back to bundled in-memory data when filesystem resolution fails.
3. Filesystem-based theme overrides must still take precedence when available.
4. MCP theme/auth routes must work in production runtimes where only compiled JS is present.

## Non-Goals

- Changing theme entitlement policy
- Changing licensing semantics
- Removing existing filesystem override support

