---
id: SPEC-MCP-007
type: acceptance
version: "1.0.0"
created: "2026-03-06"
updated: "2026-03-06"
author: "soo-kate-yeon"
---

# SPEC-MCP-007: Acceptance Criteria

Tags: `[SPEC-MCP-007:U-001]`, `[SPEC-MCP-007:U-002]`, `[SPEC-MCP-007:U-003]`

---

## Scenario 1: Template List API Migration

`[SPEC-MCP-007:E-001]`

**Given** the MCP server is authenticated with a valid API key
**And** the framingui.com API is available
**When** an AI agent calls the `list-screen-templates` tool
**Then** the tool returns the full list of screen templates fetched from `/api/mcp/templates`
**And** the response format matches the current schema: `{ success, templates, count, categories }`
**And** the template count matches the count returned by the current local `templateRegistry.getAll()`
**And** no import from `@framingui/ui` exists in `list-screen-templates.ts`

---

## Scenario 2: Component Detail API Migration

`[SPEC-MCP-007:E-003]`, `[SPEC-MCP-007:E-004]`

**Given** the MCP server is authenticated with a valid API key
**When** an AI agent calls the `preview-component` tool with `componentId: "button"`
**Then** the tool returns the component metadata (id, name, category, tier, description, variantsCount)
**And** the tool returns the component props (variant, size, asChild with types and defaults)
**And** the tool returns usage examples (Basic Usage, Destructive Action)
**And** the tool returns accessibility information
**And** the response is fetched from `/api/mcp/components/button` (not from hardcoded `component-registry.ts` or `component-props.ts`)

---

## Scenario 3: Token List API Migration

`[SPEC-MCP-007:E-005]`

**Given** the MCP server is authenticated with a valid API key
**When** an AI agent calls the `list-tokens` tool with `tokenType: "shell"`
**Then** the tool returns all web shell tokens (shell.web.app, shell.web.dashboard, shell.web.auth, shell.web.marketing, shell.web.minimal)
**And** the tool returns all mobile shell tokens (shell.mobile.app, shell.mobile.fullscreen, etc.)
**And** the response is fetched from `/api/mcp/tokens?type=shell`
**And** no import from `@framingui/core` exists in `list-tokens.ts`

---

## Scenario 4: API Failure with Cache Fallback

`[SPEC-MCP-007:E-008]`, `[SPEC-MCP-007:S-003]`, `[SPEC-MCP-007:S-004]`

**Given** the MCP server has previously fetched and cached component data
**And** the cached data is within the 10-minute TTL
**When** an AI agent calls the `list-components` tool
**Then** the cached data is returned without making an API call
**And** a log message indicates cache hit: `[data-client] Using cached component list`

**Given** the MCP server has previously fetched component data
**And** the cached data has expired (older than 10 minutes)
**And** the framingui.com API is unreachable (network error)
**When** an AI agent calls the `list-components` tool
**Then** the stale cached data is returned as a fallback
**And** a warning log is emitted: `[data-client] Using stale cache for /api/mcp/components`
**And** the response includes the same data structure as a fresh API response

---

## Scenario 5: Unauthenticated Access

`[SPEC-MCP-007:S-002]`

**Given** the MCP server does not have a valid API key
**When** an AI agent calls the `list-screen-templates` tool
**Then** the data-client logs an authentication error
**And** the tool returns an empty result or auth-required error
**And** the behavior is consistent with the existing `fetchThemeList()` unauthenticated behavior

---

## Scenario 6: CSS Generation via API

`[SPEC-MCP-007:E-006]`

**Given** the MCP server is authenticated
**When** the `export-screen` tool generates CSS for theme `square-minimalism`
**Then** the CSS is fetched from `/api/mcp/themes/square-minimalism/css`
**And** the returned CSS contains the same variables as the current local `generateCSS()` output
**And** the CSS includes `:root { }` with color, spacing, radius, typography, border, elevation, and motion variables
**And** no import from `@framingui/core` exists in `css-generator.ts`

---

## Scenario 7: Screen Validation with API-Driven Tokens

`[SPEC-MCP-007:O-002]`, `[SPEC-MCP-007:W-004]`

**Given** the MCP server is authenticated
**When** an AI agent calls `validate-screen-definition` with shell `"shell.web.dashboard"`
**Then** the validator fetches valid shell tokens from the API (or uses cached data)
**And** the validation correctly identifies `"shell.web.dashboard"` as valid
**And** validation of an unknown shell like `"shell.web.unknown"` returns an error with suggestions

**Given** an AI agent calls `validate-screen-definition` with component type `"Button"`
**Then** the validator fetches the component catalog from the API
**And** correctly validates that `"Button"` exists in the catalog
**And** validates props against API-fetched prop definitions

---

## Scenario 8: Core Resolver Without Filesystem Access

`[SPEC-MCP-007:W-003]`

**Given** the MCP server is installed via npm (not in monorepo)
**When** the `export-screen` tool resolves a Tier 1 component `"Button"`
**Then** the component example code is fetched from the API
**And** no `fs.readFileSync` or filesystem operation is performed
**And** the returned code matches the current `TIER1_EXAMPLES["Button"]` content

---

## Scenario 9: Template Matcher Without Local Imports

`[SPEC-MCP-007:W-002]`

**Given** the MCP server is authenticated
**When** the screen generation context tool calls `matchTemplates("login page")`
**Then** the template matcher fetches template metadata from the API
**And** correctly matches `auth.login` as the best template
**And** returns layout recommendations (shell.web.auth, page.wizard)
**And** no import from `@framingui/ui` exists in `template-matcher.ts`

---

## Scenario 10: Dependency Removal Verification

`[SPEC-MCP-007:W-001]`, `[SPEC-MCP-007:W-002]`

**Given** all migration phases are complete
**When** inspecting `packages/mcp-server/package.json` dependencies
**Then** `@framingui/core` is not listed in `dependencies` (may be in devDependencies)
**And** `@framingui/ui` is not listed in `dependencies` (may be in devDependencies)

**When** running `grep -r "@framingui/core" packages/mcp-server/src/ --include="*.ts"` excluding test files
**Then** zero matches are found (no production imports)

**When** running `grep -r "@framingui/ui" packages/mcp-server/src/ --include="*.ts"` excluding test files
**Then** zero matches are found (no production imports)

**When** running `pnpm build` in the mcp-server package
**Then** the build succeeds without errors

---

## Quality Gate Criteria

### Definition of Done

- [ ] All 7 API routes deployed and returning correct data
- [ ] All 7 fetch functions in data-client.ts implemented with caching
- [ ] All HIGH priority tools (7 files) updated to use API fetching
- [ ] All MEDIUM priority files (4 files) migrated
- [ ] Deprecated data files (3 files) removed
- [ ] `@framingui/core` removed from production dependencies
- [ ] `@framingui/ui` removed from production dependencies
- [ ] Zero `fs.readFileSync` calls in production code
- [ ] Build passes: `pnpm build` succeeds
- [ ] All existing MCP tools produce identical output format

### Verification Methods

| Method | Target | Pass Criteria |
| --- | --- | --- |
| Manual MCP tool testing | All 12 tools | Output matches pre-migration format |
| Build verification | `pnpm build` | Zero errors |
| Dependency audit | package.json | No core/ui in dependencies |
| Import scan | `grep -r "@framingui/core\|@framingui/ui"` | Zero production matches |
| API response comparison | Each endpoint | Data parity with local sources |
| Cache behavior test | data-client.ts | Cache hit, cache miss, stale fallback all work |
