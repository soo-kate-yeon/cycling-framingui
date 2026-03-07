# @framingui/mcp-server

Framingui MCP Server v2.0.0 - stdio-based MCP protocol implementation for Claude Code.

## Overview

MCP (Model Context Protocol) server enabling AI-driven blueprint generation, theme preview, and production code export for the Framingui design system.

Consumer install and upgrade steps live in [docs/packages/install-update.md](../../docs/packages/install-update.md).

## Features

- **🤖 stdio MCP Protocol**: Claude Code native tool registration via JSON-RPC 2.0 (16 tools)
- **🎨 Theme Preview**: 6 built-in OKLCH-based themes with CSS variable generation
- **📋 Blueprint Generation**: Natural language → Blueprint JSON with validation
- **💾 Data-Only Output**: No file system writes, Claude Code handles file operations
- **🚀 Production Export**: JSX, TSX, Vue code generation
- **🏗️ Screen Generation** (SPEC-LAYOUT-002): JSON screen definition → Production code
- **✅ Screen Validation**: Validate screen definitions with helpful error suggestions
- **🏷️ Layout Tokens**: List shell, page, and section tokens from SPEC-LAYOUT-001
- **🧩 Component Discovery** (SPEC-MCP-003): Browse 30+ UI components with props and examples
- **📄 Template Discovery** (SPEC-MCP-003): Explore 13 screen templates with customization boundaries
- **🔒 Secure Design**: No previewUrl/filePath exposure, input validation, path traversal protection

## Installation

```bash
pnpm install
```

## Authentication (Phase 4.1)

The MCP server supports optional API key authentication to enable access to premium themes.

### Environment Variables

```bash
# Required for premium theme access
FRAMINGUI_API_KEY=tk_live_xxx...

# Optional: API endpoint (defaults to https://framingui.com)
FRAMINGUI_API_URL=https://framingui.com  # or http://localhost:3000 for dev
```

### Theme Access

**All Themes** (Requires valid API key and license):

- `classic-magazine` - Classic magazine style
- `dark-boldness` - Fitness & wellness
- `minimal-workspace` - Minimal workspace
- `neutral-workspace` - Neutral humanism
- `pebble` - Round minimal
- `square-minimalism` - Square minimalism

**Note:** All 6 themes require authentication. No free themes are available.

### Authentication Behavior

**Without API Key**:

- Server starts normally
- All theme access attempts return authentication error
- Tools function but theme-related operations require auth

**With Valid API Key**:

- Server verifies key on startup (cached for 5 minutes)
- Licensed themes become accessible
- Unlicensed themes return license error

**With Invalid API Key**:

- Server logs error but continues running
- Falls back to no theme access
- Does not crash the server

## Quick Start: `init` Command

프로젝트에 FramingUI를 한 줄로 설정합니다.

```bash
npx @framingui/mcp-server init
```

자동으로 수행되는 작업:

1. **프로젝트 감지** - Next.js / Vite 자동 인식
2. **패키지 설치** - `@framingui/ui`, `tailwindcss-animate` (패키지 매니저 자동 감지: pnpm/yarn/bun/npm)
3. **Tailwind CSS 설정** - `tailwind.config.ts`에 content 경로 및 animate 플러그인 추가
4. **CSS 토큰 임포트** - `globals.css`에 `@import '@framingui/ui/styles'` 추가
5. **MCP 연결** - `.mcp.json`에 framingui 서버 등록 (프로젝트 루트)
6. **가이드 생성** - `FRAMINGUI-GUIDE.md` 프로젝트 루트에 생성
7. **AI 에이전트 가이드** - `CLAUDE.md` 및 `AGENTS.md`에 Framingui 워크플로우 섹션 추가
8. **완료 안내** - 인증 필요성 및 다음 단계 안내

설정 완료 후 Claude Code를 재시작하면, AI에게 "로그인 화면 만들어줘"와 같이 자연어로 화면 생성을 요청할 수 있습니다.

### CLI Commands

| Command                                    | Description              |
| ------------------------------------------ | ------------------------ |
| `npx -y @framingui/mcp-server@latest`      | MCP stdio 서버 시작      |
| `npx -y @framingui/mcp-server@latest init` | 프로젝트 초기 설정       |
| `framingui-mcp help`                       | CLI 도움말               |
| `framingui-mcp commands --format json`     | command adapter export   |
| `framingui-mcp login`                      | 브라우저 OAuth 로그인    |
| `framingui-mcp logout`                     | 로그아웃                 |
| `framingui-mcp status`                     | 인증 상태 확인           |
| `framingui-mcp update --check`             | 패키지 업데이트 점검     |
| `framingui-mcp server`                     | MCP stdio 서버 명시 시작 |

## Development Quick Start

### 1. Build the Server

```bash
pnpm install
pnpm build
```

### 2. Test with MCP Inspector

```bash
pnpm inspect
# Opens browser at http://localhost:6274
```

### 3. Integrate with Claude Code

See [Package Guide](../../docs/packages/mcp-server.md) for complete setup instructions.

**Quick Config** (프로젝트 루트 `.mcp.json`):

```json
{
  "mcpServers": {
    "framingui": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@framingui/mcp-server@latest"]
    }
  }
}
```

## MCP Tools

### 1. Generate Blueprint

**Tool**: `generate-blueprint`

**Description**: Generate a UI blueprint from natural language description

**Input**:

```json
{
  "description": "User profile dashboard with avatar, bio, settings link",
  "layout": "sidebar-left",
  "themeId": "calm-wellness",
  "componentHints": ["Card", "Avatar", "Button"]
}
```

**Output** (Data-Only, v2.0.0):

```json
{
  "success": true,
  "blueprint": {
    "id": "bp-1738123456789-abc123",
    "name": "User profile dashboard",
    "themeId": "calm-wellness",
    "layout": "sidebar-left",
    "components": [...],
    "timestamp": 1738123456789
  }
}
```

**Note**: `previewUrl` field removed in v2.0.0 (use SPEC-PLAYGROUND-001 for visual preview)

### 2. Preview Theme

**Tool**: `preview-theme`

**Description**: Preview a Framingui theme and retrieve its design tokens

**Input**:

```json
{
  "themeId": "premium-editorial"
}
```

**Output** (Data-Only, v2.0.0):

```json
{
  "success": true,
  "theme": {
    "id": "premium-editorial",
    "name": "Premium Editorial",
    "description": "Elegant magazine-style UI",
    "cssVariables": {
      "--color-primary": "oklch(0.2 0 0)",
      "--color-secondary": "oklch(0.98 0 0)",
      "--font-family": "Georgia",
      "--border-radius": "0"
    }
  }
}
```

**Note**: `previewUrl` field removed in v2.0.0

### 3. Export Screen

**Tool**: `export-screen`

**Description**: Export a blueprint to production-ready code (TSX/JSX/Vue)

**Input** (v2.0.0: accepts blueprint object):

```json
{
  "blueprint": {
    "id": "bp-1738123456789-abc123",
    "name": "User Dashboard",
    "themeId": "calm-wellness",
    "layout": "sidebar-left",
    "components": [],
    "timestamp": 1738123456789
  },
  "format": "tsx"
}
```

**Output** (Data-Only, v2.0.0):

```json
{
  "success": true,
  "code": "import React from 'react';\n\nexport default function UserDashboard() { ... }"
}
```

**Note**: `filePath` field removed in v2.0.0. Claude Code handles file writes.

### 4. List Themes

**Tool**: `list-themes`

**Description**: List the themes accessible to the current authenticated session

**Input**:

```json
{}
```

**Output**:

```json
{
  "success": true,
  "themes": [
    {
      "id": "calm-wellness",
      "name": "Calm Wellness",
      "description": "Serene wellness applications",
      "brandTone": "calm",
      "schemaVersion": "2.1"
    }
  ],
  "count": 13
}
```

## Screen Generation Tools (SPEC-LAYOUT-002 Phase 4)

### 5. Generate Screen

**Tool**: `generate_screen`

**Description**: Generate production-ready code from JSON screen definition

**Input**:

```json
{
  "screenDefinition": {
    "id": "user-dashboard",
    "shell": "shell.web.dashboard",
    "page": "page.dashboard",
    "sections": [
      {
        "id": "header",
        "token": "section.container",
        "components": [
          {
            "type": "Heading",
            "props": { "level": 1, "children": "Dashboard" }
          }
        ]
      }
    ]
  },
  "outputFormat": "react",
  "options": {
    "typescript": true,
    "cssFramework": "styled-components"
  }
}
```

**Output**:

```json
{
  "success": true,
  "code": "import React from 'react';\nimport styled from 'styled-components';\n\n...",
  "cssVariables": ":root { --shell-header-height: 64px; ... }"
}
```

**Output Formats**:

- `css-in-js`: Styled-components or Emotion
- `tailwind`: Tailwind CSS classes
- `react`: Pure React component with CSS variables

### 6. Validate Screen

**Tool**: `validate_screen`

**Description**: Validate JSON screen definition with helpful feedback

**Input**:

```json
{
  "screenDefinition": {
    "id": "test-screen",
    "shell": "shell.web.app",
    "page": "page.detail",
    "sections": []
  },
  "strictMode": false
}
```

**Output**:

```json
{
  "success": true,
  "valid": true,
  "errors": [],
  "warnings": ["Optional field 'meta' not provided"],
  "suggestions": [
    {
      "field": "shell",
      "message": "Shell token must match pattern",
      "suggestion": "Use format: shell.{platform}.{name}"
    }
  ]
}
```

### 7. List Tokens

**Tool**: `list_tokens`

**Description**: List available layout tokens from SPEC-LAYOUT-001

**Input**:

```json
{
  "tokenType": "shell",
  "filter": "dashboard"
}
```

**Output**:

```json
{
  "success": true,
  "shells": [
    {
      "id": "shell.web.dashboard",
      "name": "Web Dashboard Shell",
      "description": "Dashboard application shell with header and sidebar",
      "platform": "web"
    }
  ],
  "metadata": {
    "total": 1,
    "filtered": 1
  }
}
```

**Token Types**:

- `shell`: Shell layout tokens (shell.web._, shell.mobile._)
- `page`: Page layout tokens (page.dashboard, page.detail, etc.)
- `section`: Section pattern tokens (section.grid-4, section.hero, etc.)
- `all`: All token types

## Component & Template Discovery Tools (SPEC-MCP-003)

### 8. List Components

**Tool**: `list-components`

**Description**: List all available UI components from @framingui component catalog

**Input**:

```json
{
  "category": "core",
  "search": "button"
}
```

**Parameters**:

- `category` (optional): Filter by category - `'core' | 'complex' | 'advanced' | 'all'` (default: `'all'`)
- `search` (optional): Search components by name or description

**Output**:

```json
{
  "success": true,
  "components": [
    {
      "id": "button",
      "name": "Button",
      "category": "core",
      "description": "Interactive button with variants",
      "variantsCount": 6,
      "hasSubComponents": false,
      "tier": 1
    }
  ],
  "count": 15,
  "categories": {
    "core": 15,
    "complex": 10,
    "advanced": 5
  }
}
```

**Component Categories**:

- **core** (Tier 1): Button, Input, Label, Card, Badge, Avatar, Separator, Checkbox, RadioGroup, Switch, Textarea, Skeleton, ScrollArea, Form, Select
- **complex** (Tier 2): Dialog, DropdownMenu, Table, Tabs, Toast, Tooltip, Popover, Sheet, AlertDialog, Progress
- **advanced** (Tier 3): Sidebar, NavigationMenu, Breadcrumb, Command, Calendar

**Total Components**: 30+

### 9. Preview Component

**Tool**: `preview-component`

**Description**: Get detailed information about a specific UI component including props, variants, sub-components, and usage examples

**Input**:

```json
{
  "componentId": "button",
  "includeExamples": true,
  "includeDependencies": true
}
```

**Parameters**:

- `componentId` (required): Component ID (lowercase with hyphens, e.g., `'button'`, `'card'`, `'dialog'`)
- `includeExamples` (optional): Include usage examples (default: `true`)
- `includeDependencies` (optional): Include dependency information (default: `true`)

**Output**:

```json
{
  "success": true,
  "component": {
    "id": "button",
    "name": "Button",
    "category": "core",
    "description": "Interactive button with variants",
    "tier": 1,
    "props": [
      {
        "name": "variant",
        "type": "'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'",
        "required": false,
        "defaultValue": "'default'",
        "description": "Visual style variant"
      },
      {
        "name": "size",
        "type": "'default' | 'sm' | 'lg' | 'icon'",
        "required": false,
        "defaultValue": "'default'",
        "description": "Button size"
      }
    ],
    "variants": [
      {
        "name": "variant",
        "value": "default",
        "description": "Default blue button"
      },
      {
        "name": "variant",
        "value": "destructive",
        "description": "Red destructive action"
      }
    ],
    "importStatement": "import { Button } from '@framingui';",
    "dependencies": {
      "internal": [],
      "external": ["@radix-ui/react-slot"]
    },
    "examples": [
      {
        "title": "Basic Usage",
        "code": "import { Button } from '@framingui';\n\n<Button variant=\"default\">Click me</Button>",
        "description": "Simple button with default variant"
      }
    ],
    "accessibility": "Supports keyboard navigation and ARIA attributes"
  }
}
```

**Error Handling**: When component not found, returns error with list of available components

### 10. List Screen Templates

**Tool**: `list-screen-templates`

**Description**: List all available screen templates from the Framingui template registry

**Input**:

```json
{
  "category": "auth",
  "search": "login"
}
```

**Parameters**:

- `category` (optional): Filter by category - `'auth' | 'dashboard' | 'form' | 'marketing' | 'feedback' | 'all'` (default: `'all'`)
- `search` (optional): Search templates by name or description

**Output**:

```json
{
  "success": true,
  "templates": [
    {
      "id": "auth.login",
      "name": "Login",
      "category": "auth",
      "description": "User authentication login screen",
      "requiredComponentsCount": 5,
      "layoutType": "centered",
      "version": "1.0.0",
      "tags": ["authentication", "form"]
    }
  ],
  "count": 4,
  "categories": {
    "auth": 4,
    "dashboard": 1,
    "form": 0,
    "marketing": 3,
    "feedback": 5
  }
}
```

**Template Categories**:

- **auth**: login, signup, forgot-password, verification
- **marketing**: landing, preferences, profile
- **feedback**: loading, error, empty, confirmation, success
- **dashboard**: overview

**Total Templates**: 13

## MCP Prompts (Universal Guidance)

The MCP server provides 9 built-in prompts that work across all MCP clients:

### 1. getting-started

**Purpose**: Complete onboarding guide for FramingUI

**Content**:

- Authentication setup (framingui-mcp login)
- Theme exploration workflow
- Component availability checking
- 4-step screen generation workflow
- Common mistakes and troubleshooting

**When to use**: First-time users, onboarding, workflow overview

### 2. screen-workflow

**Purpose**: Detailed 4-step production workflow

**Content**:

- Step 1/4: get-screen-generation-context
- Step 2/4: validate-screen-definition
- Step 3/4: generate_screen
- Step 4/4: validate-environment
- Complete examples and troubleshooting

**When to use**: Production screen generation and `/screen`, `/section`, `/draft` style workflows

### 3. responsive-workflow

**Purpose**: Responsive optimization workflow behind `/responsive`

### 4. a11y-workflow

**Purpose**: Accessibility audit workflow behind `/a11y`

### 5. theme-swap-workflow

**Purpose**: Theme application workflow behind `/theme-swap`

### 6. doctor-workflow

**Purpose**: Environment diagnosis workflow behind `/doctor` and `/install-check`

### 7. slash-commands

**Purpose**: Slash command catalog for FramingUI design workflows

### 8. command-help

**Purpose**: Detailed help for one slash command including usage, options, examples, and MCP workflow mapping

### 9. update-workflow

**Purpose**: Maintenance workflow behind `/update`

### CLI adapter export

You can export client-oriented slash command adapters from the CLI:

```bash
framingui-mcp commands --client codex --format json
framingui-mcp commands --client claude-code --format markdown
framingui-mcp commands --client cursor --command /responsive --format text
```

**Note**: These prompts are platform-agnostic and work with Claude Code, OpenAI Codex, Cursor, Windsurf, and any MCP-compatible client.

**Total Prompts**: 9

### 11. Preview Screen Template

**Tool**: `preview-screen-template`

**Description**: Get detailed information about a specific screen template including skeleton structure, layout configuration, and customization boundaries

**Input**:

```json
{
  "templateId": "auth.login",
  "includeLayoutTokens": true
}
```

**Parameters**:

- `templateId` (required): Template ID in format `category.name` (e.g., `'auth.login'`, `'feedback.loading'`)
- `includeLayoutTokens` (optional): Include responsive layout tokens (default: `true`)

**Output**:

```json
{
  "success": true,
  "template": {
    "id": "auth.login",
    "name": "Login",
    "category": "auth",
    "description": "User authentication login screen",
    "version": "1.0.0",
    "skeleton": {
      "shell": "centered-card",
      "page": "auth-page",
      "sections": [
        {
          "id": "header",
          "name": "Header",
          "slot": "logo",
          "required": true
        },
        {
          "id": "form",
          "name": "Form",
          "slot": "main",
          "required": true
        }
      ]
    },
    "layout": {
      "type": "centered",
      "responsive": {
        "mobile": {
          "padding": "1rem",
          "gap": "1rem",
          "columns": 1
        },
        "tablet": {
          "padding": "2rem",
          "gap": "1.5rem",
          "columns": 1
        },
        "desktop": {
          "padding": "2rem",
          "gap": "2rem",
          "columns": 1
        }
      }
    },
    "customizable": {
      "texts": ["title", "subtitle", "button_label"],
      "optional": ["social_login", "remember_me"],
      "slots": ["logo", "footer", "socialLogin"]
    },
    "requiredComponents": ["Input", "Button", "Card", "Form", "Label"],
    "importStatement": "import { LoginTemplate } from '@framingui';",
    "exampleProps": {
      "texts": {
        "title": "Welcome Back",
        "subtitle": "Sign in to your account"
      },
      "options": {
        "social_login": true,
        "remember_me": true
      }
    },
    "created": "2026-01-15",
    "updated": "2026-01-20",
    "tags": ["authentication", "form"]
  }
}
```

**Error Handling**: When template not found, returns error with list of available templates

**Use Cases**:

- AI agents exploring available templates
- Template integration planning
- Understanding customization boundaries
- Component dependency analysis

## Usage Examples

### From Claude Code

**Blueprint & Theme Workflows**:

```
User: "Create a user dashboard with profile card using calm-wellness theme"
→ Claude Code calls generate-blueprint
→ Blueprint JSON returned

User: "Show me the premium-editorial theme"
→ Claude Code calls preview-theme
→ Theme metadata and CSS variables returned

User: "Export that dashboard as TypeScript React"
→ Claude Code calls export-screen
→ TSX code returned (ready to copy/paste)
```

**Screen Generation Workflows**:

```
User: "Generate a dashboard screen using shell.web.dashboard and page.dashboard"
→ Claude Code calls generate_screen
→ Production-ready React code with CSS variables returned

User: "What layout tokens are available for sections?"
→ Claude Code calls list_tokens with tokenType='section'
→ List of section tokens (grid-2, grid-3, hero, etc.) returned
```

**Component Discovery Workflows** (SPEC-MCP-003):

```
User: "What UI components are available?"
→ Claude Code calls list-components
→ List of 30+ components categorized by tier returned

User: "Show me details about the Button component"
→ Claude Code calls preview-component with componentId='button'
→ Props, variants, examples, and dependencies returned

User: "I need a dialog component. What are the props?"
→ Claude Code calls preview-component with componentId='dialog'
→ Complete Dialog component specification with sub-components returned
```

**Template Discovery Workflows** (SPEC-MCP-003):

```
User: "What screen templates are available for authentication?"
→ Claude Code calls list-screen-templates with category='auth'
→ 4 auth templates (login, signup, forgot-password, verification) returned

User: "Show me the login template structure"
→ Claude Code calls preview-screen-template with templateId='auth.login'
→ Skeleton, layout, customization boundaries, and required components returned

User: "What can I customize in the loading template?"
→ Claude Code calls preview-screen-template with templateId='feedback.loading'
→ Customizable texts, slots, and optional features returned
```

See [Package Guide](../../docs/packages/mcp-server.md) for complete examples.

## Architecture

```
packages/mcp-server/
├── src/
│   ├── index.ts               # stdio MCP server entry point (13 tools)
│   ├── tools/                 # MCP tool implementations
│   │   ├── generate-blueprint.ts    # Blueprint generation
│   │   ├── preview-theme.ts         # Theme preview
│   │   ├── list-themes.ts           # Theme listing
│   │   ├── list-icon-libraries.ts   # Icon library listing
│   │   ├── preview-icon-library.ts  # Icon library preview
│   │   ├── export-screen.ts         # Blueprint export
│   │   ├── generate-screen.ts       # Screen code generation (SPEC-LAYOUT-002)
│   │   ├── validate-screen.ts       # Screen validation (SPEC-LAYOUT-002)
│   │   ├── list-tokens.ts           # Layout token listing (SPEC-LAYOUT-002)
│   │   ├── list-components.ts       # Component listing (SPEC-MCP-003)
│   │   ├── preview-component.ts     # Component preview (SPEC-MCP-003)
│   │   ├── list-screen-templates.ts # Template listing (SPEC-MCP-003)
│   │   └── preview-screen-template.ts # Template preview (SPEC-MCP-003)
│   ├── data/                  # Data utilities (non-API helpers)
│   │   ├── template-matcher.ts      # Template matching logic
│   │   ├── hint-generator.ts        # AI hint generation
│   │   └── recipe-resolver.ts       # Recipe resolution
│   ├── storage/               # Blueprint storage
│   │   ├── blueprint-storage.ts
│   │   └── timestamp-manager.ts
│   ├── schemas/               # Zod validation
│   │   └── mcp-schemas.ts
│   └── utils/                 # Helper functions
│       ├── error-handler.ts
│       └── logger.ts          # stderr-only logging
└── __tests__/                 # Test suites
    ├── tools/                 # Tool tests
    │   ├── generate-blueprint.test.ts
    │   ├── preview-theme.test.ts
    │   ├── export-screen.test.ts
    │   ├── screen-tools.test.ts       # SPEC-LAYOUT-002 Phase 4 tests
    │   ├── list-components.test.ts    # SPEC-MCP-003 tests
    │   ├── preview-component.test.ts  # SPEC-MCP-003 tests
    │   ├── list-screen-templates.test.ts # SPEC-MCP-003 tests
    │   └── preview-screen-template.test.ts # SPEC-MCP-003 tests
    ├── mcp-protocol/          # JSON-RPC validation
    ├── storage/               # Storage tests
    └── utils/                 # Utility tests
```

**Key Changes in v2.0.0**:

- ✅ stdio transport (StdioServerTransport)
- ✅ JSON-RPC 2.0 protocol
- ✅ stderr-only logging (stdout reserved for MCP messages)
- ❌ HTTP endpoints removed (moved to SPEC-PLAYGROUND-001)
- ❌ previewUrl/filePath removed from outputs

## Built-in Themes (6 Total)

1. `classic-magazine` - Classic magazine style
2. `dark-boldness` - Fitness & wellness
3. `minimal-workspace` - Minimal workspace
4. `neutral-workspace` - Neutral humanism
5. `pebble` - Round minimal
6. `square-minimalism` - Square minimalism

**CSS Format**: All color values use OKLCH format for perceptual uniformity

**Authentication**: All themes require valid API key and license

## Quality Metrics (SPEC-MCP-002 v2.0.0)

| Metric                       | Target  | Current    | Status |
| ---------------------------- | ------- | ---------- | ------ |
| **Test Coverage**            | ≥ 85%   | **94.39%** | ✅     |
| **TypeScript Errors**        | 0       | **0**      | ✅     |
| **Critical Vulnerabilities** | 0       | **0**      | ✅     |
| **Tool Response Time**       | < 500ms | < 100ms    | ✅     |
| **Server Startup**           | < 1s    | < 500ms    | ✅     |

**Test Results**:

- 29 test files
- 290 test cases
- 100% pass rate
- Zero failures

## Architecture: API-Based Data Sources (v0.6.0)

Since v0.6.0, the MCP server fetches all data from the framingui.com API via `data-client.ts`. This removes `@framingui/core` and `@framingui/ui` from production dependencies, enabling truly standalone npm installation.

**Data Client** (`src/api/data-client.ts`):

- `fetchThemeList()`, `fetchTheme(id)` — Theme data
- `fetchIconLibraries()`, `fetchIconLibrary(id)` — Icon libraries
- `fetchTemplateList()`, `fetchTemplate(id)` — Screen templates
- `fetchComponentList()`, `fetchComponent(id)` — Component catalog
- `fetchTokenList(type?)` — Layout tokens
- `fetchCSSVariables(themeId)` — CSS generation
- `fetchScreenExamples()` — Screen examples

All functions use `MemoryCache` (10-min TTL) with `getStale()` fallback for network resilience.

## Documentation

### Consumer Documentation

- 📦 [Install And Update Guide](../../docs/packages/install-update.md) - package install, upgrade, and cache troubleshooting
- 🤖 [Package Guide](../../docs/packages/mcp-server.md) - setup and usage
- 📘 [Local MCP Docs](./docs/README.md) - quick start, API reference, and integration notes

### Quick Links

- 🧪 [Test Coverage Report](./coverage/) - 94.39% coverage
- 🎨 [Theme System](../../packages/core/src/themes/) - 6 themes
- 🧩 [UI Component Library](../../packages/ui/) - 30+ production-ready components
- 📄 [Template Registry](../../packages/ui/src/templates/) - 13 screen templates
- 🔧 [MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector) - Protocol testing tool

## Development

```bash
# Install dependencies
pnpm install

# Build (TypeScript → dist/)
pnpm build

# Run tests
pnpm test

# Test with coverage
pnpm test:coverage

# Watch mode
pnpm dev

# Lint
pnpm lint

# Start MCP server (stdio)
pnpm start

# MCP Inspector (browser-based testing)
pnpm inspect
```

### Validation Scripts

```bash
# Automated MCP protocol validation
node validate-mcp.mjs

# Manual testing with MCP Inspector
pnpm inspect
```

## Migration from v1.0.0 (HTTP) to v2.0.0 (stdio)

**Breaking Changes**:

- ❌ HTTP endpoints removed → stdio transport only
- ❌ `previewUrl` field removed from `generate-blueprint` and `preview-theme` outputs
- ❌ `filePath` field removed from `export-screen` output
- ❌ File system writes removed from `export-screen`
- ✅ `export-screen` now accepts `blueprint` object instead of `blueprintId`

**Why?**

- **Claude Code Integration**: stdio is the standard MCP transport
- **Data-Only Philosophy**: Claude Code handles all file operations
- **Security**: No file system side effects from MCP tools

**Visual Preview**: Use the FramingUI playground app for React-based rendering and theme inspection.

## Contributing

Contributions welcome! Please ensure:

- Tests pass (`pnpm test`)
- Coverage ≥ 85% (`pnpm test:coverage`)
- TypeScript strict mode compliance (`pnpm build`)
- MCP protocol validation (`node validate-mcp.mjs`)

## License

MIT

---

**Version**: 0.6.5
**Last Updated**: 2026-03-07
**Total Tools**: 17
