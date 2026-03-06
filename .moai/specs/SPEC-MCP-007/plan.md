---
id: SPEC-MCP-007
type: plan
version: "1.0.0"
created: "2026-03-06"
updated: "2026-03-06"
author: "soo-kate-yeon"
---

# SPEC-MCP-007: Implementation Plan

## Overview

MCP server data source API migration Phase 2. Five implementation phases migrating 12 local data sources to framingui.com API endpoints.

Tags: `[SPEC-MCP-007:U-001]`, `[SPEC-MCP-007:U-002]`, `[SPEC-MCP-007:U-003]`

---

## Phase 1: Server-Side API Routes (Priority: HIGH)

### Goal

Create API endpoints in `playground-web` that serve the data currently embedded in `@framingui/ui` and `@framingui/core` packages.

### Tasks

#### 1.1 Templates API

- `[SPEC-MCP-007:E-001]` Create `packages/playground-web/app/api/mcp/templates/route.ts`
  - GET handler returns all templates from `@framingui/ui` templateRegistry
  - Query params: `category` (optional filter), `search` (optional keyword)
  - Response: `{ success: true, templates: TemplateMeta[], count: number }`
  - Authentication: Bearer token via `Authorization` header

- `[SPEC-MCP-007:E-002]` Create `packages/playground-web/app/api/mcp/templates/[id]/route.ts`
  - GET handler returns single template by ID from templateRegistry.get(id)
  - Response: `{ success: true, template: TemplateDefinition }` (full definition with components, layout, tags)

#### 1.2 Components API

- `[SPEC-MCP-007:E-003]` Create `packages/playground-web/app/api/mcp/components/route.ts`
  - GET handler returns all 30 components organized by tier
  - Query params: `category` (core/complex/advanced), `search` (keyword)
  - Response: `{ success: true, components: ComponentMeta[], count: number }`
  - Source: Merge data from `component-registry.ts` COMPONENT_CATALOG into server-side module

- `[SPEC-MCP-007:E-004]` Create `packages/playground-web/app/api/mcp/components/[id]/route.ts`
  - GET handler returns component metadata + props + variants + examples
  - Response: `{ success: true, component: ComponentDetail }` (ComponentMeta + ComponentPropsData merged)
  - Source: Merge `component-registry.ts` + `component-props.ts` data

#### 1.3 Tokens API

- `[SPEC-MCP-007:E-005]` Create `packages/playground-web/app/api/mcp/tokens/route.ts`
  - GET handler returns layout tokens from `@framingui/core`
  - Query params: `type` (shell/page/section/all), `filter` (keyword)
  - Response: `{ success: true, shells?: TokenMeta[], pages?: TokenMeta[], sections?: TokenMeta[], metadata: { total } }`
  - Source: `getAllShellTokens()`, `getAllMobileShellTokens()`, `getAllPageLayoutTokens()`, `getAllSectionPatternTokens()`

#### 1.4 CSS Generation API

- `[SPEC-MCP-007:E-006]` Create `packages/playground-web/app/api/mcp/themes/[id]/css/route.ts`
  - GET handler generates CSS variables from theme data
  - Response: `{ success: true, css: string }` (complete CSS Variables output)
  - Source: `@framingui/core` loadTheme + oklchToCSS (server-side generation)

#### 1.5 Screen Examples API

- `[SPEC-MCP-007:E-007]` Create `packages/playground-web/app/api/mcp/examples/screens/route.ts`
  - GET handler returns reference screen definition examples
  - Response: `{ success: true, examples: ScreenExample[] }`
  - Source: Move `screen-examples.ts` data into server-side module

### Authentication Pattern

All routes follow the existing pattern from `/api/mcp/themes/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  // Verify API key and return data
}
```

### Milestone

- All 7 API routes deployed and accessible
- Each route returns the same data structure as the current local sources
- Authentication works identically to existing theme/icon library routes

---

## Phase 2: data-client.ts Extension (Priority: HIGH)

### Goal

Add fetch functions to `data-client.ts` for all new API endpoints, following the existing `fetchThemeList`/`fetchTheme` pattern.

### Tasks

#### 2.1 New Cache Instances

```typescript
const templateListCache = new MemoryCache<TemplateMeta[]>();
const templateCache = new MemoryCache<TemplateDefinition>();
const componentListCache = new MemoryCache<ComponentMeta[]>();
const componentCache = new MemoryCache<ComponentDetail>();
const tokenListCache = new MemoryCache<TokenListResponse>();
const cssCache = new MemoryCache<string>();
const screenExamplesCache = new MemoryCache<ScreenExample[]>();
```

#### 2.2 Type Definitions

- Add `TemplateMeta`, `TemplateDefinition`, `ComponentDetail`, `TokenListResponse`, `ScreenExample` interfaces to data-client.ts
- Ensure type compatibility with existing `../schemas/mcp-schemas.js` types

#### 2.3 Fetch Functions

- `fetchTemplateList()` - GET `/api/mcp/templates`
- `fetchTemplate(templateId)` - GET `/api/mcp/templates/${templateId}`
- `fetchComponentList()` - GET `/api/mcp/components`
- `fetchComponent(componentId)` - GET `/api/mcp/components/${componentId}`
- `fetchTokenList(tokenType?)` - GET `/api/mcp/tokens?type=${tokenType}`
- `fetchCSSVariables(themeId)` - GET `/api/mcp/themes/${themeId}/css`
- `fetchScreenExamples()` - GET `/api/mcp/examples/screens`

#### 2.4 Stale Cache Fallback `[SPEC-MCP-007:S-004]`

Enhance `apiFetch()` or individual functions to support stale cache fallback:

```typescript
// If API fails, try returning stale cache even if TTL expired
const staleData = cache.getStale(key); // New method needed on MemoryCache
if (staleData) {
  logError(`[data-client] Using stale cache for ${path}`);
  return staleData;
}
```

### Milestone

- All 7 new fetch functions implemented and typed
- Cache behavior consistent with existing fetchThemeList/fetchTheme
- Stale cache fallback mechanism implemented

---

## Phase 3: HIGH Priority MCP Tool Updates (Priority: HIGH)

### Goal

Update the most-used MCP tools to use API-based data fetching instead of local imports.

### Tasks

#### 3.1 Screen Template Tools

- `[SPEC-MCP-007:W-002]` Update `tools/list-screen-templates.ts`
  - Replace `import { templateRegistry } from '@framingui/ui'` with `fetchTemplateList()`
  - Adapt category filtering to work with API response data
  - Ensure `categories` count calculation works with API data

- Update `tools/preview-screen-template.ts`
  - Replace `templateRegistry.get(id)` with `fetchTemplate(id)`
  - Maintain identical output format

#### 3.2 Component Tools

- `[SPEC-MCP-007:W-004]` Update `tools/list-components.ts`
  - Replace `import { getAllComponents } from '../data/component-registry.js'` with `fetchComponentList()`

- Update `tools/preview-component.ts`
  - Replace `getComponentById()` and `getComponentPropsData()` with `fetchComponent(id)`
  - Component detail API merges metadata + props in single response

#### 3.3 Screen Generation Context Tool

- Update `tools/get-screen-generation-context.ts`
  - Replace all local component/template/props imports with data-client calls
  - This tool aggregates multiple data sources -- use `Promise.all()` for parallel fetching

#### 3.4 Validation Tool

- `[SPEC-MCP-007:W-001]` Update `tools/validate-screen-definition.ts`
  - Replace `import { COMPONENT_CATALOG } from '@framingui/core'` with `fetchComponentList()`
  - Replace hardcoded `VALID_SHELLS`, `VALID_PAGES`, `VALID_SECTION_PATTERNS` with `fetchTokenList()`
  - Cache token lists for validation (high-frequency use)

#### 3.5 Token Tool

- `[SPEC-MCP-007:W-001]` Update `tools/list-tokens.ts`
  - Replace `import { getAllShellTokens, ... } from '@framingui/core'` with `fetchTokenList(tokenType)`
  - Remove dynamic import pattern

### Milestone

- 7 tool files updated to use data-client fetch functions
- All tools produce identical output to current implementation
- No `@framingui/core` or `@framingui/ui` imports in updated tool files

---

## Phase 4: MEDIUM Priority Migrations (Priority: MEDIUM)

### Goal

Migrate secondary data sources that have less direct user impact.

### Tasks

#### 4.1 CSS Generator

- `[SPEC-MCP-007:E-006]` Update `generators/css-generator.ts`
  - Replace `import { loadTheme, oklchToCSS } from '@framingui/core'` with `fetchCSSVariables(themeId)`
  - `generateCSSFromThemeId()` becomes a thin wrapper around the API call
  - `generateCSS(theme)` and `extractCSSVariables(theme)` become API-backed

#### 4.2 Core Resolver

- `[SPEC-MCP-007:W-003]` Update `generators/core-resolver.ts`
  - Remove `import { readFileSync } from 'fs'`
  - Replace filesystem reads with `fetchComponent(id)` for component source/examples
  - `TIER1_EXAMPLES` hardcoded object replaced by API-fetched examples
  - `getTier1Source()` returns component data from API instead of reading .tsx files

#### 4.3 Template Matcher

- Update `data/template-matcher.ts`
  - Remove `import { templateRegistry } from '@framingui/ui'`
  - `matchTemplates()` uses `fetchTemplateList()` for template metadata
  - `KEYWORD_TEMPLATE_MAP` remains hardcoded (unless O-001 is implemented)
  - `TEMPLATE_LAYOUT_RECOMMENDATIONS` remains hardcoded

#### 4.4 Hint Generator

- `data/hint-generator.ts` has no external imports (pure hardcoded keywords)
- Keep as-is for Phase 5 or O-001 implementation
- No migration needed unless API-driven keywords are implemented

### Milestone

- CSS generation, core resolver, and template matcher use API data
- No filesystem operations remain in MCP server
- Hint generator kept stable (no external dependencies)

---

## Phase 5: LOW Priority + Cleanup (Priority: LOW)

### Goal

Remove deprecated files, clean up dependencies, and finalize migration.

### Tasks

#### 5.1 Remove Deprecated Data Files

- Delete `packages/mcp-server/src/data/component-registry.ts`
- Delete `packages/mcp-server/src/data/component-props.ts`
- Delete `packages/mcp-server/src/data/examples/screen-examples.ts`
- Delete `packages/mcp-server/src/data/examples/screen-examples.d.ts`
- Update any remaining imports that reference deleted files

#### 5.2 Clean Up package.json

- Remove `@framingui/core` from dependencies
- Remove `@framingui/ui` from dependencies
- Keep as devDependencies only if needed for type references during build
- Verify build succeeds with `pnpm build`

#### 5.3 Update Validation Token Lists `[SPEC-MCP-007:O-002]`

- If O-002 is implemented: Remove hardcoded `VALID_SHELLS`, `VALID_PAGES`, `VALID_SECTION_PATTERNS` from `validate-screen-definition.ts`
- If O-002 is not implemented: Leave hardcoded lists but add TODO comment for future migration

#### 5.4 Integration Testing `[SPEC-MCP-007:O-003]`

- Create comparison tests that:
  1. Call each API endpoint
  2. Compare response data against the original hardcoded/local data
  3. Verify parity (same IDs, same structure, same values)

#### 5.5 Version Bump

- Update `packages/mcp-server/package.json` version (scope determined at implementation time)
- Update CHANGELOG

### Milestone

- Zero production imports from `@framingui/core` and `@framingui/ui`
- Package size reduced (no bundled core/ui dependencies)
- All tests pass
- Clean build with `pnpm build`

---

## Technical Approach

### Architecture Pattern

```
AI Agent (Claude, Codex, etc.)
    |
    v
MCP Server (@framingui/mcp-server)
    |
    v
data-client.ts (fetch + MemoryCache)
    |
    v
framingui.com API (/api/mcp/*)
    |
    v
playground-web (Next.js API Routes)
    |
    v
@framingui/core + @framingui/ui (server-side only)
```

### Key Design Decisions

1. **Server-side rendering of data**: playground-web API routes import `@framingui/core` and `@framingui/ui` server-side, keeping the dependency on the server rather than the MCP client
2. **Consistent caching**: All new fetch functions use the same `MemoryCache` class with 10-minute TTL
3. **Parallel fetching**: Tools that need multiple data sources use `Promise.all()` for concurrent requests
4. **Stale cache fallback**: New `getStale()` method on MemoryCache returns expired data when API is unreachable

### Risk Analysis

| Risk | Impact | Mitigation |
| --- | --- | --- |
| API downtime causes tool failures | HIGH | Stale cache fallback (S-004) + error logging |
| Data parity issues between API and local | MEDIUM | Integration tests (O-003) comparing API vs local data |
| Increased latency for first requests | LOW | 10-minute cache TTL reduces repeat API calls |
| Authentication changes break tools | MEDIUM | Consistent auth pattern across all endpoints |
| Rate limiting on API | LOW | Cache reduces API call frequency significantly |

---

## Dependencies

### External Dependencies

- framingui.com API availability for all new endpoints
- Bearer token authentication infrastructure (already in place)

### Internal Dependencies

- Phase 2 depends on Phase 1 (API routes must exist before client can fetch)
- Phase 3 depends on Phase 2 (tools need fetch functions)
- Phase 4 depends on Phase 2 (secondary tools also need fetch functions)
- Phase 5 depends on Phases 3+4 (cleanup after all migrations complete)

### Cross-SPEC Dependencies

- SPEC-COMPONENT-001: Component data structure definitions
- SPEC-LAYOUT-001 / SPEC-LAYOUT-004: Token data definitions
- SPEC-MCP-003: Tool schema definitions
- SPEC-MCP-004: Screen definition schema
