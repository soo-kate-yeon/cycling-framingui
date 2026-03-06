# Tekton Documentation

Welcome to the Tekton documentation! This guide will help you find the information you need.

## AI-friendly summary

- Tekton docs are organized into guides, API reference, architecture, and package-level documentation.
- Start from `docs/guides/getting-started.md`, then move to `docs/api/README.md` for exact function-level details.
- Package docs under `docs/packages/` describe the `@framingui/*` ecosystem and dependency flow.
- Architecture docs explain the 3-layer design system pipeline and performance constraints.
- Use this page as the routing hub before diving into specialized docs.

## Quick Links

- **[Getting Started](./guides/getting-started.md)** - Installation and basic usage
- **[API Reference](./api/README.md)** - Complete API documentation
- **[Release Learning Checklist](./deployment/release-learning-checklist.md)** - Deployment and package release guardrails learned from recent failures
- **[Contributing](../CONTRIBUTING.md)** - Development guidelines and workflow

---

## Documentation Structure

### User Guides

**For Users and Developers**

- **[Getting Started Guide](./guides/getting-started.md)** - Complete walkthrough
  - Installation instructions
  - Basic usage examples
  - Color palette generation
  - Component themes
  - Export formats
  - Dark mode setup
  - WCAG compliance validation
  - Advanced topics

### API Documentation

**Technical Reference**

- **[API Reference](./api/README.md)** - Complete API documentation
  - Schemas module (Zod validation)
  - Color conversion module (OKLCH ↔ RGB ↔ Hex)
  - Scale generation module (10-step palettes)
  - Token generator module (core functionality)
  - Component themes module (8 UI components)
  - WCAG validator module (accessibility)
  - Usage patterns and integration examples

### Development Guides

**For Contributors**

- **[Contributing Guide](../CONTRIBUTING.md)** - Development workflow
  - Development setup
  - SPEC-First development workflow (EARS format)
  - TDD workflow (RED-GREEN-REFACTOR)
  - Quality gates and standards
  - Pull request guidelines
  - Security reporting
  - Code of conduct

### Project Documentation

**Specifications and Status**

- **[SPEC-PHASEAB-001](../.moai/specs/SPEC-PHASEAB-001/spec.md)** - Phase A requirements
  - A1: Theme Definition System
  - A2: Token Generator (current phase)
  - A3: Component Contracts

- **[Implementation Status](../.moai/specs/SPEC-PHASEAB-001/implementation-status.md)** - Current progress
  - Phase completion tracking
  - Quality verification results
  - Gap analysis
  - Acceptance criteria status
  - Next steps and recommendations

---

## Learning Path

### New to Tekton?

1. **Start Here**: [Getting Started Guide](./guides/getting-started.md)
   - Learn OKLCH basics
   - Generate your first token
   - Export to your preferred format

2. **Explore Features**: [API Reference](./api/README.md)
   - Browse available functions
   - See usage examples
   - Understand integration patterns

3. **Contribute**: [Contributing Guide](../CONTRIBUTING.md)
   - Set up development environment
   - Learn SPEC-First workflow
   - Follow TDD practices

### Looking for Specific Information?

**Installation**:

- [Getting Started - Installation](./guides/getting-started.md#installation)

**Color Conversion**:

- [API Reference - Color Conversion Module](./api/README.md#color-conversion-module)

**Component Themes**:

- [Getting Started - Component Themes](./guides/getting-started.md#using-component-themes)
- [API Reference - Component Themes Module](./api/README.md#component-themes-module)

**Accessibility / WCAG**:

- [Getting Started - WCAG Compliance](./guides/getting-started.md#wcag-compliance-validation)
- [API Reference - WCAG Validator Module](./api/README.md#wcag-validator-module)

**Dark Mode**:

- [Getting Started - Dark Mode Setup](./guides/getting-started.md#dark-mode-setup)

**Export Formats**:

- [Getting Started - Exporting Tokens](./guides/getting-started.md#exporting-tokens)

**Contributing**:

- [CONTRIBUTING.md](../CONTRIBUTING.md)

**Project Status**:

- [README - Project Status](../README.md#project-status)
- [Implementation Status](../.moai/specs/SPEC-PHASEAB-001/implementation-status.md)

---

## What is Tekton?

Tekton is an **OKLCH-based design token generator** with built-in **WCAG AA compliance** validation.

### Key Features

- **OKLCH Color Space**: Perceptually uniform color generation
- **10-Step Scales**: Tailwind-compatible color scales
- **Component Themes**: Pre-configured tokens for 8 UI components
- **Multi-Format Export**: CSS, JSON, JavaScript, TypeScript
- **Dark Mode**: Automatic dark theme generation
- **WCAG Validation**: Built-in accessibility checking
- **Type Safety**: Full TypeScript support
- **Deterministic**: Same input always produces same output

### Why OKLCH?

Traditional color spaces (HSL, RGB) don't represent how humans perceive color. OKLCH is based on human perception research, providing:

1. **Perceptual Uniformity**: L=0.5 looks equally bright across all hues
2. **Predictable Scaling**: Adjusting lightness by 0.1 creates consistent visual steps
3. **Chroma Independence**: Changing saturation doesn't shift hue
4. **Future-Proof**: Supports P3 and Rec.2020 wide-gamut displays

**Learn More**: [README - Why OKLCH?](../README.md#why-oklch)

---

## Quick Start

```typescript
import { generateToken, oklchToHex } from 'tekton';

// Define a primary color
const primaryColor = { l: 0.5, c: 0.15, h: 220 }; // Blue

// Generate token with 10-step scale
const token = generateToken('primary', primaryColor);

console.log('Base Color:', oklchToHex(token.value));
// "#0066CC"

console.log('Lightest Shade:', oklchToHex(token.scale['50']));
// "#EFF6FF"

console.log('Darkest Shade:', oklchToHex(token.scale['950']));
// "#0A2540"
```

**Full Tutorial**: [Getting Started Guide](./guides/getting-started.md)

---

## Support

- **Issues**: [GitHub Issues](https://github.com/your-org/tekton/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/tekton/discussions)
- **API Questions**: [API Reference](./api/README.md)
- **Development Help**: [Contributing Guide](../CONTRIBUTING.md)

---

## License

MIT © 2026

---

**Documentation Version**: 1.0.0 (Synchronized 2026-01-11)
