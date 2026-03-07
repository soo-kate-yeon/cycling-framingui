# Developer Guide

Guide for developing and contributing to Framingui MCP Server.

## Table of Contents

1. [Development Setup](#development-setup)
2. [Code Structure](#code-structure)
3. [Testing](#testing)
4. [Contributing](#contributing)
5. [Coding Standards](#coding-standards)
6. [Release Process](#release-process)

---

## Development Setup

### Prerequisites

- **Node.js**: 20.0.0+
- **pnpm**: 8.0.0+
- **TypeScript**: 5.7.0+ (auto-installed)

### Clone & Build

```bash
git clone https://github.com/soo-kate-yeon/framingui.git
cd framingui

# Install all workspace dependencies
pnpm install

# Navigate to MCP server
cd packages/mcp-server

# Build
pnpm build
```

### Run

```bash
# Development (auto-rebuild with tsx watch)
pnpm dev

# Production
pnpm start
```

### Test with MCP Inspector

```bash
pnpm inspect
# Opens browser at http://localhost:6274
```

### Environment Variables

| Variable            | Required | Default                 | Description                                                |
| ------------------- | -------- | ----------------------- | ---------------------------------------------------------- |
| `FRAMINGUI_API_KEY` | Yes\*    | —                       | API key for authentication. \*Or use `framingui-mcp login` |
| `FRAMINGUI_API_URL` | No       | `https://framingui.com` | API endpoint (use `http://localhost:3000` for local dev)   |

---

## Code Structure

```
packages/mcp-server/
├── src/
│   ├── index.ts           # MCP server: tool/prompt registration, auth checks
│   ├── cli/               # CLI: login, logout, status, init
│   ├── auth/              # Auth: verify, guard, state, cache, theme-access
│   ├── tools/             # 17 MCP tool implementations
│   ├── prompts/           # 2 MCP prompt implementations
│   ├── schemas/           # Zod validation schemas
│   └── utils/             # Logger, error handler
├── __tests__/             # Vitest test suite
├── docs/                  # Documentation
├── dist/                  # Build output
└── package.json           # v0.4.5
```

### Module Responsibilities

| Module     | Role                                                                  |
| ---------- | --------------------------------------------------------------------- |
| `index.ts` | MCP server entry: registers 17 tools + 2 prompts, applies auth checks |
| `cli/`     | CLI subcommand router: `login` (OAuth), `logout`, `status`, `init`    |
| `auth/`    | Auth layer: API key verification, auth gating, license resolution     |
| `tools/`   | Tool logic: each file exports one tool handler                        |
| `prompts/` | MCP prompts: `getting-started`, `screen-workflow`                     |
| `schemas/` | Zod schemas for input validation                                      |

---

## Testing

### Run Tests

```bash
# All tests
pnpm test

# Watch mode
pnpm test -- --watch

# Single file
pnpm test __tests__/tools/whoami.test.ts
```

### Test Structure

Tests use **Vitest** and follow the AAA pattern (Arrange-Act-Assert):

```typescript
import { describe, it, expect } from 'vitest';

describe('whoamiTool', () => {
  it('should return user plan and licensed themes', async () => {
    // Arrange
    setupMockAuth({ plan: 'pro', themes: ['classic-magazine'] });

    // Act
    const result = await whoamiTool();

    // Assert
    expect(result.success).toBe(true);
    expect(result.plan).toBe('pro');
  });

  it('should reject when no auth data present', async () => {
    clearAuth();
    const result = await whoamiTool();
    expect(result.success).toBe(false);
  });
});
```

### Coverage Target

- **Overall**: ≥ 85%
- **Core modules** (`tools/`, `auth/`): ≥ 90%

---

## Contributing

### Workflow

1. Pick an issue or create one
2. Create a branch: `feature/SPEC-MCP-002-your-feature`
3. Write tests first (TDD)
4. Implement
5. Run `pnpm test` and `pnpm build`
6. Submit PR

### Commit Message Format

```
<type>(<scope>): <subject>

[SPEC-MCP-002]

<body>
```

**Types**: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`

**Scopes**: `mcp-server`, `tools`, `auth`, `cli`

---

## Coding Standards

### TypeScript Rules

- **No `any`**: Use explicit types
- **Explicit return types**: All exported functions
- **Immutability**: Prefer `const`, `map()`, `filter()` over mutation
- **Function size**: ≤ 30 lines recommended

### Error Handling

```typescript
// Use specific error types
throw new AuthRequiredError(); // not: throw new Error('auth required')
throw new ValidationError(message);
```

---

## Release Process

### Checklist

1. `pnpm test` — all tests pass
2. `pnpm build` — clean build
3. Update version in `package.json`
4. Update `CHANGELOG.md`
5. `npm publish` with OTP
6. Git tag: `git tag v0.x.x && git push --tags`

### Versioning

Follows [SemVer](https://semver.org/):

- **MAJOR**: Breaking changes (auth flow, tool schema changes)
- **MINOR**: New tools, features (backward compatible)
- **PATCH**: Bug fixes

---

**Next**: [Integration Guide](./06-integration-guide.md) — MCP client configuration

**Version**: 0.4.5 | **Last Updated**: 2026-02-16
