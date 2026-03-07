# Architecture Documentation

System architecture and data flow for Framingui MCP Server v0.4.5.

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Module Structure](#module-structure)
4. [Authentication Layer](#authentication-layer)
5. [Data Flow](#data-flow)
6. [Security](#security)

---

## System Overview

### Core Concepts

Framingui MCP Server is a **stdio-based MCP protocol** server that communicates with AI coding assistants via JSON-RPC 2.0.

**Key Components**:

- **CLI Router**: Command routing for `login`, `logout`, `status`, `init`, and MCP server start
- **Auth Layer**: OAuth login, API key verification, and license gating
- **MCP Protocol Handler**: stdio-based JSON-RPC 2.0 tool/prompt registration
- **17 MCP Tools**: Theme, component, template, and screen generation tools
- **2 MCP Prompts**: Getting started and screen workflow guidance

### Design Principles

1. **stdio-only**: No HTTP server — all communication via stdin/stdout (MCP standard)
2. **Data-only output**: No file writes — AI assistant handles file operations
3. **Auth-gated**: Protected tools require authentication
4. **Type safety**: Zod schemas for all input validation
5. **Theme engine**: Theme recipes applied server-side for consistent styling

---

## Architecture Diagram

### System Architecture

```mermaid
graph TB
    subgraph "AI Assistant"
        User[User]
        AI[AI Agent]
    end

    subgraph "Framingui MCP Server (stdio)"
        CLI[CLI Router]
        Auth[Auth Layer]
        MCP[MCP Protocol Handler]

        subgraph "Tools (17)"
            Whoami[whoami]
            ThemeTools[Theme Tools]
            ComponentTools[Component Tools]
            TemplateTools[Template Tools]
            ScreenTools[Screen Generation]
            ProtoTools[Prototyping Tools]
        end

        subgraph "Prompts (2)"
            P1[getting-started]
            P2[screen-workflow]
        end
    end

    subgraph "External"
        FraminguiAPI[framingui.com/api/mcp/verify]
        Credentials[~/.framingui/credentials.json]
        ThemeFiles[.moai/themes/generated/]
        ComponentFiles[.moai/components/]
        TemplateFiles[.moai/templates/]
    end

    User -->|Natural Language| AI
    AI -->|JSON-RPC 2.0 stdio| MCP
    MCP --> Auth
    Auth -->|verify API key| FraminguiAPI
    Auth -->|load credentials| Credentials
    Auth --> Whoami
    MCP --> ThemeTools
    MCP --> ComponentTools
    MCP --> TemplateTools
    MCP --> ScreenTools
    MCP --> ProtoTools
    ThemeTools --> ThemeFiles
    ComponentTools --> ComponentFiles
    TemplateTools --> TemplateFiles

    CLI -->|login| Auth
    CLI -->|no subcommand| MCP
```

### Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant CLI as framingui-mcp CLI
    participant Browser
    participant API as framingui.com
    participant Creds as ~/.framingui/credentials.json
    participant MCP as MCP Server
    participant AI as AI Assistant

    Note over User,AI: One-time Login
    User->>CLI: framingui-mcp login
    CLI->>CLI: Start localhost callback server
    CLI->>Browser: Open framingui.com/mcp/auth
    Browser->>API: OAuth flow
    API-->>Browser: Redirect to localhost/callback?key=...&email=...
    Browser->>CLI: Callback with API key
    CLI->>Creds: Save credentials
    CLI-->>User: "Authenticated as user@example.com"

    Note over User,AI: Every MCP Session
    AI->>MCP: Start (stdio)
    MCP->>Creds: Load credentials
    MCP->>API: Verify API key
    API-->>MCP: { valid: true, user, licenses, themes }
    MCP->>MCP: Cache auth data

    AI->>MCP: list-themes (or any tool)
    MCP->>MCP: requireAuth() ✓
    MCP-->>AI: Tool response
```

---

## Module Structure

### Directory Structure

```
packages/mcp-server/
├── src/
│   ├── index.ts              # MCP server entry point (stdio)
│   │   - Tool/Prompt registration
│   │   - CallTool handler with auth guards
│   │
│   ├── cli/                  # CLI command router
│   │   ├── index.ts          # Subcommand router (login/logout/status/init/default→MCP)
│   │   ├── login.ts          # Browser OAuth flow
│   │   ├── logout.ts         # Clear saved credentials
│   │   ├── status.ts         # Show auth status
│   │   ├── init.ts           # One-line project setup
│   │   ├── credentials.ts    # ~/.framingui/credentials.json management
│   │   ├── guide-template.ts # FRAMINGUI-GUIDE.md generator
│   │   └── agent-md-templates.ts  # CLAUDE.md/AGENTS.md templates
│   │
│   ├── auth/                 # Authentication layer
│   │   ├── verify.ts         # API key verification (framingui.com)
│   │   ├── guard.ts          # requireAuth() guard
│   │   ├── state.ts          # Auth data + raw API key state
│   │   ├── cache.ts          # Verification cache (5-min TTL)
│   │   └── theme-access.ts   # Theme license check + master accounts
│   │
│   ├── tools/                # 17 MCP Tool implementations
│   │   ├── whoami.ts
│   │   ├── generate-blueprint.ts
│   │   ├── preview-theme.ts
│   │   ├── list-themes.ts
│   │   ├── export-screen.ts
│   │   ├── generate-screen.ts
│   │   ├── validate-screen.ts
│   │   ├── list-tokens.ts
│   │   ├── list-icon-libraries.ts
│   │   ├── preview-icon-library.ts
│   │   ├── list-components.ts
│   │   ├── preview-component.ts
│   │   ├── list-screen-templates.ts
│   │   ├── preview-screen-template.ts
│   │   ├── get-screen-generation-context.ts
│   │   ├── validate-screen-definition.ts
│   │   └── validate-environment.ts
│   │
│   ├── prompts/              # MCP Prompt implementations
│   │   ├── getting-started.ts
│   │   └── screen-workflow.ts
│   │
│   ├── schemas/              # Zod validation schemas
│   │   └── mcp-schemas.ts
│   │
│   └── utils/                # Utilities
│       ├── logger.ts
│       └── error-handler.ts
│
├── __tests__/                # Test suite
├── docs/                     # Documentation (this directory)
├── dist/                     # Build output
└── package.json
```

### Module Dependencies

```mermaid
graph TD
    CLI[cli/index.ts]
    Login[cli/login.ts]
    Init[cli/init.ts]
    Index[index.ts]

    Auth[auth/]
    Verify[auth/verify.ts]
    Guard[auth/guard.ts]
    State[auth/state.ts]
    ThemeAccess[auth/theme-access.ts]

    Tools[tools/]
    Schemas[schemas/]
    Utils[utils/]
    Prompts[prompts/]

    CLI -->|login| Login
    CLI -->|init| Init
    CLI -->|default| Index

    Index --> Tools
    Index --> Prompts
    Index --> Guard
    Index --> State
    Index --> Verify

    Tools --> Schemas
    Tools --> Auth
    Tools --> Utils

    Guard --> State
    Guard --> ThemeAccess
```

---

## Authentication Layer

### Components

| Module                 | Responsibility                                                         |
| ---------------------- | ---------------------------------------------------------------------- |
| `cli/login.ts`         | Browser OAuth flow: localhost callback server → save credentials       |
| `cli/credentials.ts`   | Read/write `~/.framingui/credentials.json`                             |
| `auth/verify.ts`       | `verifyApiKey()`: GET `framingui.com/api/mcp/verify` with Bearer token |
| `auth/guard.ts`        | `requireAuth()` — throws when the session is unauthenticated           |
| `auth/state.ts`        | In-memory auth state: verified auth data, cache, and raw API key       |
| `auth/cache.ts`        | API key verification cache (5-minute TTL)                              |
| `auth/theme-access.ts` | `PREMIUM_THEMES` list, `MASTER_EMAILS`, `isMasterAccount()`            |

### Auth Guard Flow

Every tool call in `CallToolRequestSchema` handler:

```
1. requireAuth()     → Throws AuthRequiredError if no valid credentials
2. Tool execution     → Optional `whoami` may inspect the session, but is not required
   (skipped for whoami tool itself)
3. Execute tool
```

### Master Accounts

Master accounts (defined in `auth/theme-access.ts`) have:

- Access to all 6 premium themes
- No license expiry
- `plan: 'master'` in whoami response

---

## Data Flow

### Production Workflow Data Flow

```mermaid
sequenceDiagram
    participant AI as AI Assistant
    participant MCP as MCP Server
    participant TS as Theme System
    participant CS as Component System
    participant VS as Validation System

    AI->>MCP: get-screen-generation-context(description)
    MCP->>CS: Load matching components
    MCP->>TS: Load template matches
    MCP-->>AI: Context (templates, components, schema, examples)

    AI->>AI: Write Screen Definition JSON

    AI->>MCP: validate-screen-definition(definition)
    MCP->>VS: Validate structure, tokens, components
    MCP-->>AI: { valid, errors, autoFixPatches }

    AI->>MCP: generate_screen(screenDefinition, outputFormat)
    MCP->>TS: Apply theme recipes
    MCP->>MCP: Generate React code + Tailwind classes
    MCP-->>AI: { code, dependencies }

    AI->>MCP: validate-environment(projectPath, requiredPackages)
    MCP->>MCP: Check package.json + tailwind.config
    MCP-->>AI: { installed, missing, installCommands, tailwind }
```

---

## Security

### Input Validation

All MCP tool inputs are validated with **Zod schemas** before processing:

- Theme IDs: `^[a-z0-9-]+$` pattern
- Descriptions: Length bounds (min/max)
- Component IDs: Lowercase with hyphens only
- Template IDs: `^[a-z]+\.[a-z-]+$` format

### Authentication Security

- **CSRF protection**: Random state parameter in OAuth flow
- **Local-only callback**: OAuth callback runs on `127.0.0.1` (not `0.0.0.0`)
- **5-minute timeout**: Login flow times out after 5 minutes
- **No API key in logs**: API keys are never logged

### Theme Access Control

- All 6 themes require a valid license
- Theme access checked on every theme-related operation
- Master accounts bypass license checks

---

**Next**: [Developer Guide](./05-developer-guide.md) — Contributing & testing

**Version**: 0.4.5 | **Last Updated**: 2026-02-16
