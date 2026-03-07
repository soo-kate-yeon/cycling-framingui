# API Reference

Complete API reference for all 17 MCP tools in Framingui MCP Server v0.4.5.

## Table of Contents

1. [Authentication](#authentication)
2. [Theme Tools](#theme-tools)
3. [Icon Library Tools](#icon-library-tools)
4. [Component Tools](#component-tools)
5. [Screen Template Tools](#screen-template-tools)
6. [Layout Token Tools](#layout-token-tools)
7. [Prototyping Tools](#prototyping-tools)
8. [Production Workflow Tools](#production-workflow-tools)
9. [Error Codes](#error-codes)

---

## Authentication

### whoami

Verify your account, license status, and accessible themes.

> `whoami` is optional. Use it to inspect the current session and licensed themes. Authenticated tool calls do not require a prior `whoami` request.

**Input Schema**:

```typescript
{
} // No parameters
```

**Output Schema**:

```typescript
interface WhoamiOutput {
  success: boolean;
  plan?: 'free' | 'pro' | 'enterprise' | 'master';
  isMaster?: boolean;
  licensedThemes?: string[];
  totalThemes?: number;
  mcpSupport?: {
    expiresAt: string | null;
    renewable: boolean;
  };
  error?: string;
}
```

**Example Response**:

```json
{
  "success": true,
  "plan": "pro",
  "isMaster": false,
  "licensedThemes": ["classic-magazine", "minimal-workspace"],
  "totalThemes": 6,
  "mcpSupport": {
    "expiresAt": "2027-02-16T00:00:00Z",
    "renewable": true
  }
}
```

**Error Response** (not authenticated):

```json
{
  "success": false,
  "error": "Authentication required. Run `framingui-mcp login` to authenticate, or set FRAMINGUI_API_KEY environment variable."
}
```

---

## Theme Tools

### list-themes

List the themes accessible to the current authenticated session.

**Input**: `{}` (no parameters)

**Output**:

```typescript
{
  success: boolean;
  themes: Array<{
    id: string;
    name: string;
    description: string;
    brandTone?: string;
    schemaVersion?: string;
  }>;
  count: number;
}
```

### preview-theme

Preview a theme and retrieve its full v2.1 theme data including design tokens.

**Input**:

| Parameter | Type   | Required | Description                                    |
| --------- | ------ | -------- | ---------------------------------------------- |
| `themeId` | string | ✓        | Theme ID (lowercase alphanumeric with hyphens) |

**Output**: Complete theme data including colors, typography, spacing, and component tokens.

**Example Input**:

```json
{ "themeId": "classic-magazine" }
```

---

## Icon Library Tools

### list-icon-libraries

List all icon libraries accessible to the current hosted catalog.

**Input**: `{}` (no parameters)

**Output**: Array of icon library IDs with metadata.

### preview-icon-library

Preview an icon library and retrieve its configuration.

**Input**:

| Parameter   | Type   | Required | Description                                              |
| ----------- | ------ | -------- | -------------------------------------------------------- |
| `libraryId` | string | ✓        | Icon library ID (e.g., `lucide`, `heroicons`, `feather`) |

**Output**: Library configuration, NPM package name, icon samples, and usage instructions.

---

## Component Tools

### list-components

List all available UI components from `@framingui/ui`.

**Input**:

| Parameter  | Type   | Required | Description                                                   |
| ---------- | ------ | -------- | ------------------------------------------------------------- |
| `category` | string | ✗        | Filter: `core`, `complex`, `advanced`, `all` (default: `all`) |
| `search`   | string | ✗        | Search by keyword                                             |

**Output**:

```typescript
{
  success: boolean;
  components: Array<{
    id: string;
    name: string;
    category: 'core' | 'complex' | 'advanced';
    description: string;
    variantsCount: number;
    hasSubComponents: boolean;
    tier: number;
  }>;
  count: number;
  categories: {
    core: number;
    complex: number;
    advanced: number;
  }
}
```

### preview-component

Get detailed information about a specific UI component.

**Input**:

| Parameter             | Type    | Required | Description                                     |
| --------------------- | ------- | -------- | ----------------------------------------------- |
| `componentId`         | string  | ✓        | Component ID (e.g., `button`, `card`, `dialog`) |
| `includeExamples`     | boolean | ✗        | Include usage examples (default: `true`)        |
| `includeDependencies` | boolean | ✗        | Include dependency info (default: `true`)       |

**Output**:

```typescript
{
  success: boolean;
  component: {
    id: string;
    name: string;
    category: string;
    description: string;
    tier: number;
    props: Array<{
      name: string;
      type: string;
      required: boolean;
      defaultValue?: string;
      description: string;
    }>;
    variants: Array<{ name: string; value: string; description: string }>;
    importStatement: string;
    dependencies: { internal: string[]; external: string[] };
    examples?: Array<{ title: string; code: string; description: string }>;
    accessibility?: string;
  };
}
```

---

## Screen Template Tools

### list-screen-templates

List all available screen templates from the Template Registry.

**Input**:

| Parameter  | Type   | Required | Description                                                         |
| ---------- | ------ | -------- | ------------------------------------------------------------------- |
| `category` | string | ✗        | Filter: `auth`, `dashboard`, `form`, `marketing`, `feedback`, `all` |
| `search`   | string | ✗        | Search by keyword                                                   |

**Output**: Array of template IDs with categories, descriptions, and preview information.

### preview-screen-template

Preview a screen template with skeleton, layout, and customization boundaries.

**Input**:

| Parameter             | Type    | Required | Description                                               |
| --------------------- | ------- | -------- | --------------------------------------------------------- |
| `templateId`          | string  | ✓        | Template ID (format: `category.name`, e.g., `auth.login`) |
| `includeLayoutTokens` | boolean | ✗        | Include responsive layout tokens (default: `true`)        |

**Output**: Template details including skeleton structure, layout configuration, customization boundaries, required components, and usage guide.

---

## Layout Token Tools

### list_tokens

List available layout tokens from SPEC-LAYOUT-001.

**Input**:

| Parameter   | Type   | Required | Description                                       |
| ----------- | ------ | -------- | ------------------------------------------------- |
| `tokenType` | string | ✗        | Filter: `shell`, `page`, `section`, `all`         |
| `filter`    | string | ✗        | Pattern filter (case-insensitive substring match) |

**Output**: Array of layout tokens with descriptions and usage contexts.

---

## Prototyping Tools

### generate-blueprint

Generate a UI blueprint from natural language description.

> For production-ready code, use the production workflow instead.

**Input**:

| Parameter        | Type     | Required | Description                                                                                         |
| ---------------- | -------- | -------- | --------------------------------------------------------------------------------------------------- |
| `description`    | string   | ✓        | Natural language description (10-500 chars)                                                         |
| `layout`         | string   | ✓        | Layout type: `single-column`, `two-column`, `sidebar-left`, `sidebar-right`, `dashboard`, `landing` |
| `themeId`        | string   | ✓        | Theme ID                                                                                            |
| `componentHints` | string[] | ✗        | Optional component type hints                                                                       |
| `iconLibrary`    | string   | ✗        | Icon library ID                                                                                     |

**Output**: Blueprint object with layout structure and component suggestions.

### export-screen

Export a blueprint to production code.

**Input**:

| Parameter   | Type   | Required | Description                        |
| ----------- | ------ | -------- | ---------------------------------- |
| `blueprint` | object | ✓        | Blueprint object to export         |
| `format`    | string | ✓        | Export format: `jsx`, `tsx`, `vue` |

**Output**: Generated code in the requested format.

---

## Production Workflow Tools

### get-screen-generation-context (Step 1/3)

Get complete context for AI agents to generate screen definitions from natural language.

**Input**:

| Parameter         | Type    | Required | Description                                   |
| ----------------- | ------- | -------- | --------------------------------------------- |
| `description`     | string  | ✓        | Natural language description (5-1000 chars)   |
| `themeId`         | string  | ✗        | Optional theme ID for recipe information      |
| `includeExamples` | boolean | ✗        | Include example definitions (default: `true`) |

**Output**:

- Template matches based on description
- Available components with usage examples
- JSON schema for Screen Definition
- Example definitions for reference
- Theme recipes and contextual hints

### validate-screen-definition (Step 2/3)

Validate a screen definition JSON with detailed error messages and auto-fix.

**Input**:

| Parameter    | Type    | Required | Description                                |
| ------------ | ------- | -------- | ------------------------------------------ |
| `definition` | object  | ✓        | Screen definition object to validate       |
| `strict`     | boolean | ✗        | Enable strict validation (default: `true`) |

**Output**:

```typescript
{
  valid: boolean;
  errors: Array<{ field: string; message: string; suggestion: string; autoFix?: object }>;
  warnings: Array<string>;
  suggestions: Array<{ field: string; message: string; autoFix?: object }>;
  autoFixPatches: Array<object>; // JSON Patch operations
}
```

### generate_screen (Step 3/4)

Generate production-ready React code with theme applied from validated Screen Definition.

> **Why this tool is essential**: It applies theme recipes to components. Without it, theme styling will not be applied.

**Input**:

| Parameter          | Type   | Required | Description                                                                                     |
| ------------------ | ------ | -------- | ----------------------------------------------------------------------------------------------- |
| `screenDefinition` | object | ✓        | JSON screen definition with `id`, `shell`, `page`, `sections`                                   |
| `outputFormat`     | string | ✓        | Code format: `css-in-js`, `tailwind`, `react`                                                   |
| `options`          | object | ✗        | `{ cssFramework?: 'styled-components' \| 'emotion', typescript?: boolean, prettier?: boolean }` |

**Output**:

- Generated code with theme applied
- `dependencies` field listing required packages
- `dependencies.installCommands` with ready-to-use install commands

### validate-environment (Step 3/3, Optional)

Validate user environment: NPM packages + Tailwind CSS configuration.

**Input**:

| Parameter          | Type     | Required | Description                                    |
| ------------------ | -------- | -------- | ---------------------------------------------- |
| `projectPath`      | string   | ✓        | Path to `package.json` or project root         |
| `requiredPackages` | string[] | ✓        | Package names to validate                      |
| `checkTailwind`    | boolean  | ✗        | Validate Tailwind CSS config (default: `true`) |

**Output**:

```typescript
{
  installed: Array<{ name: string; version: string }>;
  missing: string[];
  installCommands: { npm: string; yarn: string; pnpm: string; bun: string };
  tailwind?: {
    configFound: boolean;
    issues: string[];
    fixes: string[];
  };
}
```

### validate_screen

Basic screen definition validation with helpful feedback.

> For the recommended workflow, use `validate-screen-definition` instead which provides more detailed validation and auto-fix patches.

**Input**:

| Parameter          | Type    | Required | Description                                 |
| ------------------ | ------- | -------- | ------------------------------------------- |
| `screenDefinition` | object  | ✓        | JSON screen definition to validate          |
| `strictMode`       | boolean | ✗        | Enable strict validation (default: `false`) |

---

## Error Codes

### Authentication Errors

| Error                          | Cause                                                  | Solution                                                     |
| ------------------------------ | ------------------------------------------------------ | ------------------------------------------------------------ |
| `Authentication required`      | No API key found                                       | Run `framingui-mcp login` or set `FRAMINGUI_API_KEY`         |
| `Authentication failed`        | Expired or revoked key                                 | Re-run `framingui-mcp login` or refresh the API key          |
| `THEME_AUTHORITY_INCONSISTENT` | Session/license data disagrees with theme availability | Refresh authentication state and retry; report if persistent |

### Validation Errors

| Error                 | Cause                              | Solution                               |
| --------------------- | ---------------------------------- | -------------------------------------- |
| `INVALID_DESCRIPTION` | Description < 10 or > 500 chars    | Adjust length                          |
| `INVALID_THEME_ID`    | Non-existent theme                 | Check `list-themes`                    |
| `INVALID_LAYOUT`      | Unsupported layout type            | Use one of the 6 supported layouts     |
| `VALIDATION_FAILED`   | Screen definition validation error | Apply `autoFixPatches` or fix manually |

### License Errors

| Error                | Cause                      | Solution                                     |
| -------------------- | -------------------------- | -------------------------------------------- |
| `Theme not licensed` | Theme not in your license  | Check `whoami` response for `licensedThemes` |
| `License expired`    | MCP support period expired | Renew license                                |

---

**Next**: [Architecture](./04-architecture.md) — System design & data flow

**Version**: 0.4.5 | **Last Updated**: 2026-02-16
