# Changelog

All notable changes to @tekton/core will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.2] - 2026-03-06

### Fixed

- Fixed theme discovery in deployed environments where `process.cwd()` does not contain `.moai/`.
- Restored `listThemes()` and `loadTheme()` behavior for hosted MCP API routes that were returning zero licensed themes.
- Applied the same fallback resolution to icon library loading so deployed builds do not depend on workspace-local generated data.

### Changed

- Added bundled generated theme and icon-library JSON data to the `@framingui/core` build output.
- Theme and icon loaders now resolve data in this order:
  1. consumer project `.moai/.../generated`
  2. monorepo root `.moai/.../generated`
  3. package-bundled `dist/bundled/.../generated`

### Testing

- Added a regression test covering `listThemes()` and `loadTheme()` when the current working directory has no `.moai` directory.

## [0.2.0] - 2026-01-25

### Added - 3-Layer Token System (SPEC-COMPONENT-001-A)

#### Type Definitions (`tokens.ts` - 189 LOC)

- **AtomicTokens** interface for Layer 1 (raw design values)
  - Color palettes with shades
  - Spacing scale
  - Border radius values
  - Typography definitions
  - Shadow definitions
  - Optional transition definitions
- **SemanticTokens** interface for Layer 2 (meaning-based mappings)
  - Background colors (page, surface, elevated, muted, inverse)
  - Foreground colors (primary, secondary, muted, inverse, accent)
  - Border colors (default, muted, focus, error)
  - Surface colors (primary, secondary, tertiary, inverse)
- **ComponentTokens** interface for Layer 3 (component-specific bindings)
  - Button component tokens with variants (primary, secondary, etc.)
  - Input component tokens with states (focus, error, disabled)
  - Card component tokens
  - Extensible structure for additional components
- **ThemeWithTokens** interface extending base Theme
  - 3-layer token structure
  - Optional dark mode token overrides

#### Token Resolution Engine (`token-resolver.ts` - 146 LOC)

- **resolveToken()** function
  - Dot-notation reference resolution (e.g., `'atomic.color.blue.500'`)
  - Multi-level reference chain resolution
  - Direct value pass-through support
  - Circular reference detection
  - Performance: < 1ms per token resolution
- **resolveWithFallback()** function
  - Component → Semantic → Atomic fallback chain
  - Graceful degradation for missing tokens
  - Comprehensive error messages

#### Runtime Validation (`token-validation.ts` - 176 LOC)

- **Zod schema validation** for all token layers
  - AtomicTokensSchema for Layer 1 validation
  - SemanticTokensSchema for Layer 2 validation
  - ComponentTokensSchema for Layer 3 validation (extensible)
  - Dark mode token schemas (partial overrides)
- **validateTheme()** function
  - Complete theme structure validation
  - Detailed error reporting with path information
  - Type-safe validation results

#### CSS Variables Generator (`css-generator.ts` - 273 LOC)

- **generateThemeCSS()** function
  - Automatic CSS Variables generation from tokens
  - `:root` selector for light mode
  - `.dark` selector for dark mode overrides
  - Consistent naming convention:
    - Atomic: `--color-{palette}-{shade}`, `--spacing-{size}`
    - Semantic: `--{category}-{name}`
    - Component: `--{component}-{variant}-{property}`
  - Nested token flattening for component tokens
  - Performance: ~5ms for complete theme generation
- **generateComponentCSS()** internal helper
  - Component token structure processing
  - Variant detection and handling
  - Recursive nested token flattening

### Testing

Added comprehensive test coverage for token system:

- **132 tests total** (up from 21 tests)
- **96.37% code coverage** (up from 83%)
- **1,588 lines of test code** across 4 test files:
  - `tokens.test.ts` - Token type definitions and structure
  - `token-resolver.test.ts` - 35 tests for resolution logic
  - `token-validation.test.ts` - 32 tests for Zod validation
  - `css-generator.test.ts` - 37 tests for CSS generation

Test coverage by module:

- Token Types: 100%
- Token Resolution: 98.5%
- Token Validation: 97.2%
- CSS Generation: 95.8%
- Core Pipeline: 83% (unchanged)

Performance benchmarks:

- Token resolution: < 1ms (avg 0.3ms)
- Multi-level resolution: < 1ms
- CSS generation: ~5ms for complete theme
- Validation: < 10ms for full theme

### Documentation

Updated comprehensive documentation:

- **README.md** enhanced with:
  - 3-Layer Token System overview and examples
  - Token resolution patterns and usage
  - Dark mode implementation guide
  - CSS Variables naming convention
  - Migration guide from 0.1.0
  - Complete API reference for token functions
  - Performance benchmarks
  - Test coverage metrics
- Added code examples for:
  - Basic token usage
  - Multi-level token resolution
  - Fallback chain patterns
  - Dark mode configuration
  - Runtime validation

### Architecture

New Token System structure (784 LOC):

```
Token System (784 LOC)
├── tokens.ts           (189 LOC) - 3-layer token type definitions
├── token-resolver.ts   (146 LOC) - Token resolution & fallback logic
├── token-validation.ts (176 LOC) - Zod schema validation
└── css-generator.ts    (273 LOC) - CSS Variables generation
```

Total package size: **1,526 LOC** (up from 742 LOC)

- Core Pipeline: 742 LOC
- Token System: 784 LOC
- Overall reduction from original: **98.3%** (from 89,993 LOC)

### Dependencies

- Added: `zod@^3.25.76` for runtime validation

### Features Implemented (SPEC-COMPONENT-001-A)

- ✅ **U-002**: 3-Layer Token Architecture (Atomic → Semantic → Component)
- ✅ **U-003**: CSS Variables Generation with consistent naming
- ✅ **S-002**: Token Fallback Chain (Component → Semantic → Atomic)
- ✅ **S-003**: Theme Validation using Zod schemas
- ✅ **S-004**: Dark Mode Support with token overrides
- ✅ **P-001**: Token resolution performance < 1ms
- ✅ **P-002**: Type safety with TypeScript strict mode
- ✅ **P-003**: Comprehensive test coverage (96.37%)

### Breaking Changes

None - the token system is fully backward compatible with 0.1.0.

Old theme system (`loadTheme`, `generateCSSVariables`) continues to work as before.

---

## [0.1.0] - 2026-01-24

### Added

- Initial release of @tekton/core
- **Theme Module**: Load themes from JSON, generate CSS variables
- **Blueprint Module**: Create and validate screen blueprints
- **Render Module**: Template-based JSX generation

### Architecture

- **742 LOC** total (99.2% reduction from original 89,993 LOC)
- **Zero external dependencies** for code generation
- Template-based rendering instead of Babel AST

### Files Created

| File           | LOC | Purpose                         |
| -------------- | --- | ------------------------------- |
| `types.ts`     | 94  | Core type definitions           |
| `theme.ts`     | 131 | Theme loading & CSS generation  |
| `blueprint.ts` | 169 | Blueprint creation & validation |
| `render.ts`    | 297 | JSX template generation         |
| `index.ts`     | 51  | Public API exports              |

### Removed (from original codebase)

- 13 packages (headless-components, cli, studio-mcp, studio-web, etc.)
- Babel AST infrastructure (@babel/types, @babel/generator)
- Prettier dependency
- Slot registries (GlobalSlotRegistry, LocalSlotRegistry)
- Semantic scoring engine
- Safety protocols (ThresholdChecker, HallucinationChecker, etc.)
- MCP server infrastructure
- Configuration management layers
- Storage abstraction layers

### Testing

- 21 tests passing
- 83% code coverage
- Full pipeline integration test (Theme → Blueprint → Render)

---

## Version History

- **0.2.0** (2026-01-25): Added 3-Layer Token System with 784 LOC
- **0.1.0** (2026-01-24): Initial minimal pipeline with 742 LOC
