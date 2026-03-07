# User Guide

Complete guide to using all Framingui MCP Server features.

## Table of Contents

1. [Authentication Flow](#authentication-flow)
2. [MCP Tools Reference](#mcp-tools-reference)
3. [Theme System](#theme-system)
4. [Component Catalog](#component-catalog)
5. [Screen Templates](#screen-templates)
6. [Workflows](#workflows)
7. [Troubleshooting](#troubleshooting)

---

## Authentication Flow

Framingui requires authentication before using any tools.

### 1. Login

```bash
npx @framingui/mcp-server login
```

Opens your browser for OAuth. Credentials are saved to `~/.framingui/credentials.json`.

### 2. whoami (Mandatory First Call)

Every MCP session must start with `whoami`. All other tools will reject requests until `whoami` is called.

**Returns**:

| Field            | Type     | Description                                              |
| ---------------- | -------- | -------------------------------------------------------- |
| `plan`           | string   | Subscription tier: `free`, `pro`, `enterprise`, `master` |
| `isMaster`       | boolean  | Whether this is a master account with full access        |
| `licensedThemes` | string[] | Theme IDs accessible with your license                   |
| `totalThemes`    | number   | Total available themes                                   |
| `mcpSupport`     | object   | MCP support period and renewal info                      |

### 3. Use Tools

After `whoami`, all 17 tools become available.

---

## MCP Tools Reference

### Overview

| #   | Tool                            | Category     | Description                                     |
| --- | ------------------------------- | ------------ | ----------------------------------------------- |
| 1   | `whoami`                        | Auth         | Verify account & license (mandatory first call) |
| 2   | `list-themes`                   | Theme        | List available themes                           |
| 3   | `preview-theme`                 | Theme        | Get theme design tokens                         |
| 4   | `list-icon-libraries`           | Icons        | List icon libraries                             |
| 5   | `preview-icon-library`          | Icons        | Preview icon library details                    |
| 6   | `list-components`               | Components   | Browse 30+ UI components                        |
| 7   | `preview-component`             | Components   | Get component props & examples                  |
| 8   | `list-screen-templates`         | Templates    | Browse 13 screen templates                      |
| 9   | `preview-screen-template`       | Templates    | Get template structure & customization          |
| 10  | `list_tokens`                   | Tokens       | List layout tokens (shell/page/section)         |
| 11  | `generate-blueprint`            | Prototyping  | Generate UI blueprint from natural language     |
| 12  | `export-screen`                 | Prototyping  | Export blueprint to JSX/TSX/Vue                 |
| 13  | `validate_screen`               | Validation   | Basic screen definition validation              |
| 14  | `get-screen-generation-context` | Workflow 1/3 | Get context for screen generation               |
| 15  | `validate-screen-definition`    | Workflow 2/3 | Validate screen definition with auto-fix        |
| 16  | `generate_screen`               | Workflow 3/4 | Generate production code with theme             |
| 17  | `validate-environment`          | Workflow 3/3 | Verify NPM packages & Tailwind config           |

### Tool Details

#### whoami

**Purpose**: Verify your account, license status, and accessible themes.

> **Important**: This must be the first tool called in every session. All other tools will reject requests until `whoami` is called.

#### list-themes / preview-theme

- `list-themes`: Returns all 6 available themes with IDs and descriptions
- `preview-theme`: Returns full v2.1 theme data including design tokens (colors, typography, spacing, component tokens)

**Input** (preview-theme):

```json
{ "themeId": "classic-magazine" }
```

#### list-icon-libraries / preview-icon-library

- `list-icon-libraries`: Returns available icon libraries (e.g., lucide, heroicons, feather)
- `preview-icon-library`: Returns library config, package name, icon samples, and usage instructions

#### list-components / preview-component

- `list-components`: Browse 30+ components by category (`core`, `complex`, `advanced`)
- `preview-component`: Get detailed props, variants, usage examples, and dependencies

**Categories**:

- **core** (Tier 1): Button, Input, Label, Card, Badge, Avatar, Separator, Checkbox, RadioGroup, Switch, Textarea, Skeleton, ScrollArea, Form, Select
- **complex** (Tier 2): Dialog, DropdownMenu, Table, Tabs, Toast, Tooltip, Popover, Sheet, AlertDialog, Progress
- **advanced** (Tier 3): Sidebar, NavigationMenu, Breadcrumb, Command, Calendar

#### list-screen-templates / preview-screen-template

- `list-screen-templates`: Browse 13 templates by category (`auth`, `dashboard`, `form`, `marketing`, `feedback`)
- `preview-screen-template`: Get skeleton structure, layout config, customization boundaries

#### list_tokens

Lists available layout tokens from SPEC-LAYOUT-001.

**Token Types**: `shell`, `page`, `section`, `all`

#### generate-blueprint / export-screen

Lightweight prototyping workflow:

1. `generate-blueprint`: Natural language → Blueprint JSON
2. `export-screen`: Blueprint → JSX/TSX/Vue code

#### get-screen-generation-context → validate-screen-definition → generate_screen

Production workflow:

1. `get-screen-generation-context` **(Step 1/3)**: Get complete context for AI to generate screen definitions — template matches, available components, JSON schema, example definitions, theme recipes
2. `validate-screen-definition` **(Step 2/3)**: Validate screen definition JSON with detailed errors, suggestions, and auto-fix patches
3. `generate_screen` **(Step 3/4)**: Generate production-ready React code with theme engine applied — the theme recipes (Tailwind classes, component styling) are applied here

#### validate-environment

**(Optional Step)**: Validates your project environment:

- Checks if required NPM packages are installed
- Validates Tailwind CSS configuration (content paths, animate plugin)
- Returns ready-to-use install commands for missing packages

---

## Theme System

Framingui provides 6 premium themes. All themes require authentication.

### Available Themes

| Theme ID            | Name              | Style                             |
| ------------------- | ----------------- | --------------------------------- |
| `classic-magazine`  | Classic Magazine  | Editorial with serif typography   |
| `dark-boldness`     | Dark Boldness     | Fitness & wellness, energetic     |
| `minimal-workspace` | Minimal Workspace | Clean, minimal, workspace-focused |
| `neutral-workspace` | Neutral Workspace | Warm neutral tones, humanist      |
| `pebble`            | Pebble            | Soft rounded corners, minimal     |
| `square-minimalism` | Square Minimalism | Sharp edges, bold minimalism      |

### Theme Data Structure (v2.1)

Each theme provides:

- **Color tokens**: Primary, secondary, background, text, accent colors
- **Typography**: Font families, sizes, line heights, weights
- **Spacing**: Padding, margin, gap scales
- **Border radius**: Component corner rounding
- **Shadows**: Elevation levels
- **Component tokens**: Per-component styling overrides

---

## Component Catalog

30+ built-in components from `@framingui/ui`:

### Core Components (Tier 1)

Button, Input, Label, Card, Badge, Avatar, Separator, Checkbox, RadioGroup, Switch, Textarea, Skeleton, ScrollArea, Form, Select

### Complex Components (Tier 2)

Dialog, DropdownMenu, Table, Tabs, Toast, Tooltip, Popover, Sheet, AlertDialog, Progress

### Advanced Components (Tier 3)

Sidebar, NavigationMenu, Breadcrumb, Command, Calendar

Use `list-components` and `preview-component` to discover details, props, variants, and usage examples.

---

## Screen Templates

13 pre-built screen templates:

| Category      | Templates                                    |
| ------------- | -------------------------------------------- |
| **Auth**      | login, signup, forgot-password, verification |
| **Dashboard** | overview                                     |
| **Marketing** | landing, preferences, profile                |
| **Feedback**  | loading, error, empty, confirmation, success |

Use `list-screen-templates` and `preview-screen-template` to explore skeleton structure, layout, and customization boundaries.

---

## Workflows

### Workflow 1: Quick Prototype

Best for rapid iteration and design exploration.

```
1. whoami (verify account)
2. generate-blueprint (natural language → blueprint)
3. export-screen (blueprint → JSX/TSX/Vue code)
```

**Example**:

```
You: "Create a user profile card with the minimal-workspace theme"
→ AI calls generate-blueprint
→ AI calls export-screen with format: tsx
→ Returns: TypeScript React component
```

### Workflow 2: Production Screen (Recommended)

Best for production-ready code with full theme application and validation.

```
1. whoami (verify account)
2. get-screen-generation-context (gather context from your description)
3. validate-screen-definition (validate the screen definition JSON)
4. generate_screen (generate themed production code)
5. validate-environment (optional: check dependencies & Tailwind config)
```

**Example**:

```
You: "Build a dashboard with sales metrics, user stats, and activity feed"
→ AI calls get-screen-generation-context
→ AI writes Screen Definition JSON based on context
→ AI calls validate-screen-definition (runs auto-fix if needed)
→ AI calls generate_screen → Production React code with theme applied
→ AI calls validate-environment → Lists missing packages & install commands
```

> **Why use this workflow?** `generate_screen` applies theme recipes (Tailwind classes, component styling). Without it, your code won't have the theme's visual identity.

### Workflow 3: Exploration

Discover available resources before building.

```
You: "What components do you have for forms?"
→ AI calls list-components with category: core

You: "Show me the Button component details"
→ AI calls preview-component with componentId: button

You: "Any templates for authentication?"
→ AI calls list-screen-templates with category: auth

You: "Show me the login template"
→ AI calls preview-screen-template with templateId: auth.login
```

---

## Troubleshooting

### "Authentication required"

Run `npx @framingui/mcp-server login` or set `FRAMINGUI_API_KEY` environment variable.

### `whoami`

`whoami` is optional. Use it to inspect `licensedThemes` and current account state, but authenticated tool calls can run without a prior `whoami` request.

### Theme not accessible

Use `whoami` to check your `licensedThemes`. You can only access themes included in your license.

### "Module not found" errors in generated code

Run `validate-environment` after generating code to check for missing dependencies.

### Tailwind styles not showing

Run `validate-environment` with `checkTailwind: true` to verify your `tailwind.config` has `@framingui/ui` content paths and the `tailwindcss-animate` plugin.

---

## MCP Prompts

The server provides 2 built-in prompts:

| Prompt            | Description                                                   |
| ----------------- | ------------------------------------------------------------- |
| `getting-started` | Complete onboarding guide: auth, themes, components, workflow |
| `screen-workflow` | Detailed 4-step production screen generation workflow         |

These prompts are platform-agnostic and work with any MCP-compatible client.

---

**Next**: [API Reference](./03-api-reference.md) — Complete tool schemas and error codes

**Version**: 0.4.5 | **Last Updated**: 2026-02-16
