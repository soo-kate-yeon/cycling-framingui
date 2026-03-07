# Catalog Source of Truth

## Goal

Remove `.moai` as the default source of product catalog data.

`themes`, `icon-libraries`, and `templates` should behave like versioned product assets:

- tracked in git
- shipped with packages or deployed with the web app
- consistent across local dev, CI, npm consumers, MCP, and production

`.moai` should remain an override or workspace-specific area, not the canonical product catalog.

## Current State

### Themes

- Current default loader path is effectively:
  - project `.moai/themes/generated`
  - fallback bundled data in `@framingui/core`
- Main runtime entry points:
  - `@framingui/core` `loadTheme()` / `listThemes()`
  - `packages/playground-web/app/api/mcp/themes/*`

### Icon libraries

- Current default loader path is effectively:
  - project `.moai/icon-libraries/generated`
  - fallback bundled data in `@framingui/core`
- Main runtime entry points:
  - `@framingui/core` `loadIconLibrary()` / `listIconLibraries()`
  - `packages/playground-web/app/api/mcp/icon-libraries/*`

### Templates

- `.moai` is not the runtime source for screen templates today.
- Current runtime entry points read tracked registry code:
  - `@framingui/ui` `templateRegistry`
  - `packages/playground-web/app/api/mcp/templates/*`
- But ownership is currently split:
  - template definitions and screen-type taxonomy live in `packages/core/src/screen-templates/*`
  - template components and registration also live in `packages/ui/src/templates/*`

Templates are therefore package-backed already, but they still do not have a single catalog boundary.

## Problem

Using `.moai` as a default source creates operational coupling between:

- local workspace layout
- package runtime resolution
- CI checkout contents
- deployed server filesystem

This causes four classes of failure:

1. Path-sensitive behavior

- `process.cwd()` or deployment layout changes can make catalog data disappear.

2. Inconsistent environments

- local dev can work while CI or production fails.

3. Update friction

- adding a new theme or icon library depends on file placement rules instead of package or deployment versioning.

4. Blurred ownership for templates

- template ids, metadata, taxonomy, and React implementations are spread across packages.
- changing or adding a template can require touching both `core` and `ui` without a clear source of truth.
- MCP template listing currently depends on UI-side registration for data that is conceptually catalog data.

## Target Model

### Rule

Product catalog data must come from tracked package data first.

`.moai` may override that data, but must not be required for baseline runtime behavior.

### Source priority

For `themes` and `icon-libraries`, resolution order should be:

1. explicit override directory
2. project-local override directory
3. package-shipped catalog data
4. remote API only when explicitly intended

That means:

- local customization remains possible
- consumers always get a complete default catalog
- production and CI do not depend on `.moai`

For `templates`, the rule is slightly different:

1. tracked template definitions and metadata
2. tracked UI implementations
3. project-local overrides only if custom templates are explicitly supported

Templates are not just JSON assets. They include:

- screen-type definitions
- discovery metadata
- rendering implementations

So the correct fix is not to dump every template file into one package. The fix is to separate catalog-owned definition data from UI-owned rendering code.

## Recommended Package Layout

### Option A: dedicated catalog package

Recommended long-term structure:

```text
packages/catalog/
  package.json
  src/
    themes/
      generated/
        pebble.json
        square-minimalism.json
        ...
    icon-libraries/
      generated/
        lucide.json
        heroicons.json
        ...
    templates/
      definitions/
        auth/
          login.ts
          signup.ts
        feedback/
          loading.ts
          error.ts
        index.ts
    index.ts
```

Consumers:

- `@framingui/core`
  - reads default themes and icon libraries from `@framingui/catalog`
- `@framingui/playground-web`
  - lists themes, icons, and templates from the same catalog package
- `@framingui/mcp-server`
  - continues using web APIs, which now rely on a stable catalog source
- `@framingui/ui`
  - owns template rendering components, but consumes catalog definitions instead of owning canonical template metadata

Benefits:

- single ownership boundary
- versioned updates
- no cross-package data duplication
- easy future expansion to template metadata, previews, screenshots, docs manifests
- lets templates move into the same ownership boundary without forcing React rendering code into the catalog package

### Option B: keep data inside `@framingui/core`

Acceptable as an intermediate step:

```text
packages/core/
  src/
    catalog/
      themes/generated/*
      icon-libraries/generated/*
      templates/definitions/*
```

This is operationally much better than `.moai`, but less clean than a dedicated catalog package because:

- core mixes runtime logic and product data
- future metadata growth will bloat the package boundary

## Recommended Runtime API

### Provider interface

Introduce a catalog provider abstraction instead of hard-coded path logic:

```ts
interface CatalogProvider<T> {
  list(): T[];
  get(id: string): T | null;
}
```

For themes and icons:

- `BundledThemeProvider`
- `BundledIconLibraryProvider`
- `ProjectOverrideThemeProvider`
- `ProjectOverrideIconLibraryProvider`

Then compose them:

```ts
overrideProvider -> bundledProvider
```

This removes the need for filesystem guessing inside high-level loaders.

For templates, the equivalent abstraction should be:

```ts
interface TemplateDefinitionProvider {
  list(): ScreenTemplateDefinition[];
  get(id: string): ScreenTemplateDefinition | null;
}

interface TemplateRendererProvider {
  get(id: string): unknown | null;
}
```

That keeps template discovery separate from template rendering.

## Directory Semantics

### Keep `.moai` only for local/project state

Good uses for `.moai`:

- generated local overrides
- temporary agent outputs
- cache
- SDK/session metadata
- unpublished custom themes

Bad uses for `.moai`:

- required production catalog data
- required package runtime assets
- versioned product inventory

### Optional rename

Renaming `.moai` to `.framingui` is not the main fix.

Even if renamed, the architectural problem remains if it is still the default runtime source.

So:

- role separation matters more than folder name
- rename only if it improves product semantics later

## Update Workflow

### After migration

Adding a theme or icon library should be:

1. add tracked JSON to catalog package
2. update any docs or screenshots
3. release package or redeploy web app

Not:

1. regenerate `.moai`
2. hope runtime resolves the right working directory

## Templates

Templates should stay tracked and package-backed, but the current folder ownership should change.

### What should move

The following belong in the catalog boundary:

- template ids
- names
- categories
- descriptions
- tags
- version
- required components metadata
- layout metadata
- screen-type taxonomy

This is the "what templates exist" layer.

### What should stay in UI

The following should remain in `@framingui/ui` or another UI package:

- React components
- stories
- visual implementation details
- component composition logic

This is the "how a template renders" layer.

### Recommended split

Long-term target:

```text
packages/catalog/
  src/
    templates/
      definitions/
        auth/
          login.ts
          signup.ts
        feedback/
          loading.ts
          error.ts
        index.ts

packages/ui/
  src/
    templates/
      renderers/
        auth/
          login.tsx
          signup.tsx
        feedback/
          loading.tsx
          error.tsx
        index.ts
```

Runtime composition becomes:

- `@framingui/catalog`
  - owns template definitions and metadata
- `@framingui/ui`
  - maps template id to renderer/component
- web and MCP APIs
  - list templates from catalog definitions
  - optionally enrich with renderer availability

Do not move templates into `.moai` as the canonical runtime source.

If local custom templates are ever supported, `.moai` can hold overrides or unpublished workspace templates, but only as an optional extension layer.

## Migration Plan

### Phase 1

- Treat `.moai` as override only in code comments and loader design.
- Stop introducing new required runtime paths under `.moai`.

### Phase 2

- Create `@framingui/catalog` or `packages/core/src/catalog`.
- Move tracked themes and icon libraries there.
- Make bundled catalog the default provider.

### Phase 3

- Move template definitions and screen-type taxonomy into the catalog boundary.
- Keep template renderers in `@framingui/ui`.
- Change web/MCP template listing to read catalog definitions rather than UI-owned registration.

### Phase 4

- Reduce `.moai` fallback usage to explicit override handling.
- Add tests for:
  - no `.moai` present
  - `.moai` override present
  - CI checkout with tracked catalog only
  - npm consumer with no repo metadata

### Phase 5

- Align docs and generation scripts so catalog updates target the tracked catalog location first.

## Recommendation

Use this decision:

- `themes` and `icon-libraries`: move to tracked package catalog, `.moai` becomes override
- `templates`: also move the definition layer into the tracked catalog boundary, while keeping render components in `@framingui/ui`

This gives stable runtime behavior and predictable release/update flow.
