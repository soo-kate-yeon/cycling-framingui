---
id: SPEC-MCP-007
version: "1.0.0"
status: "planned"
created: "2026-03-06"
updated: "2026-03-06"
author: "soo-kate-yeon"
priority: "HIGH"
lifecycle: "spec-anchored"
---

## HISTORY

| Version | Date       | Author        | Changes                              |
| ------- | ---------- | ------------- | ------------------------------------ |
| 1.0.0   | 2026-03-06 | soo-kate-yeon | Initial draft (planned)              |

---

# SPEC-MCP-007: MCP Server Data Source API Migration (Phase 2)

## Executive Summary

MCP server v0.5.6 has completed Phase 1 API migration for themes and icon libraries via `data-client.ts`. However, 12 additional data sources still rely on local `@framingui/core`, `@framingui/ui`, hardcoded registries, and filesystem reads. This SPEC defines Phase 2: migrating all remaining local data sources to the framingui.com API, enabling the removal of `@framingui/core` and `@framingui/ui` workspace dependencies from the MCP server package.

---

## Problem Statement

### Current State

The MCP server (`@framingui/mcp-server` v0.5.6) successfully migrated theme and icon library data to API-based fetching. However, the following local dependencies remain:

| Dependency | Usage Count | Files Affected |
| --- | --- | --- |
| `@framingui/ui` templateRegistry | 3 files | list-screen-templates.ts, preview-screen-template.ts, template-matcher.ts |
| `@framingui/core` layout tokens | 1 file | list-tokens.ts |
| `@framingui/core` loadTheme/oklchToCSS | 1 file | css-generator.ts |
| `@framingui/core` COMPONENT_CATALOG | 1 file | validate-screen-definition.ts |
| Hardcoded component registry | 4 files | component-registry.ts, list-components.ts, preview-component.ts, get-screen-generation-context.ts |
| Hardcoded component props | 3 files | component-props.ts, preview-component.ts, validate-screen-definition.ts |
| fs.readFileSync | 1 file | core-resolver.ts |
| Hardcoded keyword mappings | 2 files | template-matcher.ts, hint-generator.ts |
| Hardcoded token lists | 1 file | validate-screen-definition.ts |
| Hardcoded screen examples | 1 file | screen-examples.ts |

### Root Causes

1. **Monorepo coupling**: MCP server imports from workspace packages, preventing standalone npm publication
2. **Filesystem reads**: `core-resolver.ts` uses `fs.readFileSync` to read UI package source code, which fails in npm-installed contexts
3. **Hardcoded data**: Component registries, props, tokens, and keyword mappings are static TypeScript objects that become stale without package updates
4. **Inconsistent architecture**: Themes and icon libraries use API fetch while other data sources use local imports

### Impact

- `@framingui/core` (^0.4.0) and `@framingui/ui` (^0.6.0) remain as production dependencies
- npm package size includes unused portions of core and ui packages
- Data staleness requires MCP server package updates to reflect component/template changes
- Broken functionality when installed via npm (fs.readFileSync paths don't resolve)

---

## Goals

- **G1**: Migrate all remaining local data sources to framingui.com API endpoints
- **G2**: Extend `data-client.ts` with fetch functions for templates, components, tokens, and examples
- **G3**: Remove `@framingui/core` and `@framingui/ui` from production dependencies
- **G4**: Maintain backward compatibility -- all MCP tools must produce identical output
- **G5**: Enable graceful degradation with MemoryCache fallback on API failures

---

## EARS Requirements

### Ubiquitous Requirements

**U-001**: The MCP server **shall always** fetch all data through the framingui.com API instead of local package imports.

- Screen templates, component metadata, component props, layout tokens, CSS generation data, screen examples
- No `import { ... } from '@framingui/core'` or `import { ... } from '@framingui/ui'` in production code

**U-002**: The MCP server **shall always** use `MemoryCache` (10-minute TTL) for all API responses, consistent with existing theme/icon library caching.

**U-003**: The MCP server **shall always** maintain the same response format and data structure for all MCP tools after migration.

- Tool output schemas remain unchanged
- AI agents relying on current response formats must not be affected

---

### Event-Driven Requirements

**E-001**: **WHEN** `fetchTemplateList()` is called **THEN** the data-client returns the full list of screen templates from `/api/mcp/templates`.

**E-002**: **WHEN** `fetchTemplate(templateId)` is called **THEN** the data-client returns the complete template definition including required components, layout, and tags from `/api/mcp/templates/:id`.

**E-003**: **WHEN** `fetchComponentList()` is called **THEN** the data-client returns the full component catalog (30 components across 3 tiers) from `/api/mcp/components`.

**E-004**: **WHEN** `fetchComponent(componentId)` is called **THEN** the data-client returns component metadata plus props, variants, sub-components, examples, and accessibility information from `/api/mcp/components/:id`.

**E-005**: **WHEN** `fetchTokenList(tokenType)` is called **THEN** the data-client returns layout tokens (shells, pages, sections) from `/api/mcp/tokens`.

**E-006**: **WHEN** `fetchCSSVariables(themeId)` is called **THEN** the data-client returns pre-generated CSS variables string from `/api/mcp/themes/:id/css`.

**E-007**: **WHEN** `fetchScreenExamples()` is called **THEN** the data-client returns reference screen definition examples from `/api/mcp/examples/screens`.

**E-008**: **WHEN** any API fetch fails (network error, auth error, server error) **THEN** the data-client returns cached data if available, or falls back to an empty result with error logging.

---

### State-Driven Requirements

**S-001**: **IF** the user is authenticated (valid API key) **THEN** all data endpoints return full data.

**S-002**: **IF** the user is not authenticated **THEN** API calls return null and tools report auth-required errors, consistent with existing theme/icon library behavior.

**S-003**: **IF** cached data exists and is within TTL (10 minutes) **THEN** the cached data is returned without making an API call.

**S-004**: **IF** the API returns an error but cached data exists (even if expired) **THEN** the stale cached data is returned as a fallback with a warning log.

---

### Unwanted Requirements

**W-001**: The MCP server **shall not** import from `@framingui/core` in any production source file after migration is complete.

**W-002**: The MCP server **shall not** import from `@framingui/ui` in any production source file after migration is complete.

**W-003**: The MCP server **shall not** use `fs.readFileSync` or any filesystem read operations for data fetching.

**W-004**: The MCP server **shall not** contain hardcoded component registries, props data, keyword mappings, or token validation lists after migration is complete.

---

### Optional Requirements

**O-001**: **Where possible**, provide a `fetchHintKeywords()` endpoint to make keyword mappings API-driven instead of hardcoded.

**O-002**: **Where possible**, provide a `fetchValidationTokens()` endpoint to make valid shell/page/section token lists API-driven.

**O-003**: **Where possible**, add integration tests that compare API responses against the current hardcoded data to verify data parity.

---

## Technical Specifications

### 1. Server-Side API Routes (playground-web)

New API routes in `packages/playground-web/app/api/mcp/`:

| Route | Method | Source Data | Response Format |
| --- | --- | --- | --- |
| `/api/mcp/templates` | GET | `@framingui/ui` templateRegistry | `{ success, templates: TemplateMeta[] }` |
| `/api/mcp/templates/[id]` | GET | `@framingui/ui` templateRegistry.get(id) | `{ success, template: TemplateDefinition }` |
| `/api/mcp/components` | GET | `@framingui/ui` component catalog | `{ success, components: ComponentMeta[] }` |
| `/api/mcp/components/[id]` | GET | Component meta + props data | `{ success, component: ComponentDetail }` |
| `/api/mcp/tokens` | GET | `@framingui/core` layout token getters | `{ success, shells, pages, sections }` |
| `/api/mcp/themes/[id]/css` | GET | `@framingui/core` CSS generator | `{ success, css: string }` |
| `/api/mcp/examples/screens` | GET | Screen example definitions | `{ success, examples: ScreenExample[] }` |

All routes require Bearer token authentication consistent with existing `/api/mcp/themes` and `/api/mcp/icon-libraries`.

### 2. data-client.ts Extension

New fetch functions added to `packages/mcp-server/src/api/data-client.ts`:

```typescript
// Template functions
export async function fetchTemplateList(): Promise<TemplateMeta[]>;
export async function fetchTemplate(templateId: string): Promise<TemplateDefinition | null>;

// Component functions
export async function fetchComponentList(): Promise<ComponentMeta[]>;
export async function fetchComponent(componentId: string): Promise<ComponentDetail | null>;

// Token functions
export async function fetchTokenList(tokenType?: 'shell' | 'page' | 'section' | 'all'): Promise<TokenListResponse>;

// CSS generation
export async function fetchCSSVariables(themeId: string): Promise<string | null>;

// Screen examples
export async function fetchScreenExamples(): Promise<ScreenExample[]>;
```

Each function follows the existing pattern:
1. Check MemoryCache first
2. Call `apiFetch<T>(path)` if cache miss
3. Store result in cache with 10-minute TTL
4. Return empty/null on failure with error logging

### 3. MCP Tool File Updates

| File | Current Import | After Migration |
| --- | --- | --- |
| `tools/list-screen-templates.ts` | `import { templateRegistry } from '@framingui/ui'` | `import { fetchTemplateList } from '../api/data-client.js'` |
| `tools/preview-screen-template.ts` | `import { templateRegistry } from '@framingui/ui'` | `import { fetchTemplate } from '../api/data-client.js'` |
| `tools/list-components.ts` | `import { getAllComponents } from '../data/component-registry.js'` | `import { fetchComponentList } from '../api/data-client.js'` |
| `tools/preview-component.ts` | `import { getComponentById } from '../data/component-registry.js'` | `import { fetchComponent } from '../api/data-client.js'` |
| `tools/get-screen-generation-context.ts` | Multiple local imports | `import { fetchComponentList, fetchTemplate, ... } from '../api/data-client.js'` |
| `tools/validate-screen-definition.ts` | `import { COMPONENT_CATALOG } from '@framingui/core'` | `import { fetchComponentList, fetchTokenList } from '../api/data-client.js'` |
| `tools/list-tokens.ts` | `import { getAllShellTokens, ... } from '@framingui/core'` | `import { fetchTokenList } from '../api/data-client.js'` |
| `generators/css-generator.ts` | `import { loadTheme, oklchToCSS } from '@framingui/core'` | `import { fetchCSSVariables } from '../api/data-client.js'` |
| `generators/core-resolver.ts` | `import { readFileSync } from 'fs'` | `import { fetchComponent } from '../api/data-client.js'` |
| `data/template-matcher.ts` | `import { templateRegistry } from '@framingui/ui'` | `import { fetchTemplate } from '../api/data-client.js'` |

### 4. Files to Remove/Archive After Migration

| File | Action | Reason |
| --- | --- | --- |
| `data/component-registry.ts` | Remove | Data served by API |
| `data/component-props.ts` | Remove | Data served by API (merged into component detail endpoint) |
| `data/examples/screen-examples.ts` | Remove | Data served by API |
| `data/hint-generator.ts` | Keep (O-001) | Keyword mappings may remain hardcoded if API endpoint is not implemented |
| `data/template-matcher.ts` | Refactor | Remove templateRegistry import, use API for template metadata |

### 5. package.json Dependency Changes

```json
// REMOVE from dependencies:
"@framingui/core": "^0.4.0",
"@framingui/ui": "^0.6.0"
```

These packages remain as devDependencies only if needed for type definitions during development.

---

## Affected Files

### Server-Side (playground-web) - New Files

| # | File Path | Change Type |
| --- | --- | --- |
| 1 | `packages/playground-web/app/api/mcp/templates/route.ts` | New |
| 2 | `packages/playground-web/app/api/mcp/templates/[id]/route.ts` | New |
| 3 | `packages/playground-web/app/api/mcp/components/route.ts` | New |
| 4 | `packages/playground-web/app/api/mcp/components/[id]/route.ts` | New |
| 5 | `packages/playground-web/app/api/mcp/tokens/route.ts` | New |
| 6 | `packages/playground-web/app/api/mcp/themes/[id]/css/route.ts` | New |
| 7 | `packages/playground-web/app/api/mcp/examples/screens/route.ts` | New |

### MCP Server - Modified Files

| # | File Path | Change Type |
| --- | --- | --- |
| 8 | `packages/mcp-server/src/api/data-client.ts` | Modify (extend) |
| 9 | `packages/mcp-server/src/tools/list-screen-templates.ts` | Modify |
| 10 | `packages/mcp-server/src/tools/preview-screen-template.ts` | Modify |
| 11 | `packages/mcp-server/src/tools/list-components.ts` | Modify |
| 12 | `packages/mcp-server/src/tools/preview-component.ts` | Modify |
| 13 | `packages/mcp-server/src/tools/get-screen-generation-context.ts` | Modify |
| 14 | `packages/mcp-server/src/tools/validate-screen-definition.ts` | Modify |
| 15 | `packages/mcp-server/src/tools/list-tokens.ts` | Modify |
| 16 | `packages/mcp-server/src/generators/css-generator.ts` | Modify |
| 17 | `packages/mcp-server/src/generators/core-resolver.ts` | Modify |
| 18 | `packages/mcp-server/src/data/template-matcher.ts` | Modify |
| 19 | `packages/mcp-server/package.json` | Modify |

### MCP Server - Files to Remove

| # | File Path | Change Type |
| --- | --- | --- |
| 20 | `packages/mcp-server/src/data/component-registry.ts` | Remove |
| 21 | `packages/mcp-server/src/data/component-props.ts` | Remove |
| 22 | `packages/mcp-server/src/data/examples/screen-examples.ts` | Remove |

---

## References

| SPEC ID | Title | Relationship |
| --- | --- | --- |
| SPEC-MCP-002 | MCP Server Base Implementation | Base architecture |
| SPEC-MCP-003 | Component & Template Discovery Tools | Tool schemas |
| SPEC-MCP-004 | Screen Definition Schema | Validation schemas |
| SPEC-MCP-005 | Agent Workflow & Dependency Management | Pattern reuse |
| SPEC-MCP-006 | MCP Onboarding Improvement + v0.3.2 | Prior MCP SPEC |
| SPEC-COMPONENT-001 | Component System | Component data source |
| SPEC-LAYOUT-001 | Layout Token System | Token data source |

---

## Traceability Tags

- `[SPEC-MCP-007:U-001]` - All data via API
- `[SPEC-MCP-007:U-002]` - MemoryCache consistency
- `[SPEC-MCP-007:U-003]` - Response format preservation
- `[SPEC-MCP-007:E-001]` - fetchTemplateList
- `[SPEC-MCP-007:E-002]` - fetchTemplate
- `[SPEC-MCP-007:E-003]` - fetchComponentList
- `[SPEC-MCP-007:E-004]` - fetchComponent
- `[SPEC-MCP-007:E-005]` - fetchTokenList
- `[SPEC-MCP-007:E-006]` - fetchCSSVariables
- `[SPEC-MCP-007:E-007]` - fetchScreenExamples
- `[SPEC-MCP-007:E-008]` - API failure fallback
- `[SPEC-MCP-007:S-001]` - Authenticated access
- `[SPEC-MCP-007:S-002]` - Unauthenticated rejection
- `[SPEC-MCP-007:S-003]` - Cache hit behavior
- `[SPEC-MCP-007:S-004]` - Stale cache fallback
- `[SPEC-MCP-007:W-001]` - No @framingui/core imports
- `[SPEC-MCP-007:W-002]` - No @framingui/ui imports
- `[SPEC-MCP-007:W-003]` - No filesystem reads
- `[SPEC-MCP-007:W-004]` - No hardcoded registries
- `[SPEC-MCP-007:O-001]` - API-driven hint keywords
- `[SPEC-MCP-007:O-002]` - API-driven validation tokens
- `[SPEC-MCP-007:O-003]` - Integration test parity
