/**
 * @framingui/core - Screen Generation Module
 * Declarative screen definition system with layout tokens
 * [SPEC-LAYOUT-002] [PHASE-1] [PHASE-2] [PHASE-3]
 *
 * @module screen-generation
 */

// ============================================================================
// Type Definitions
// ============================================================================

export type {
  ComponentType,
  ComponentDefinition,
  ResponsiveOverrides,
  SectionDefinition,
  ScreenMeta,
  ScreenDefinition,
  ValidationContext,
} from './types.js';

export { SCREEN_COMPONENT_TYPES, isComponentDefinition, isScreenDefinition } from './types.js';

// ============================================================================
// Validation Schemas and Functions
// ============================================================================

export {
  // Zod Schemas
  ResponsiveOverridesSchema,
  ComponentDefinitionSchema,
  SectionDefinitionSchema,
  ScreenMetaSchema,
  ScreenDefinitionSchema,
  // Validation Functions
  validateComponent,
  validateSection,
  validateScreenDefinition,
  assertValidScreenDefinition,
  validateScreenDefinitions,
  // Utility Functions
  isValidShellToken,
  isValidPageToken,
  isValidSectionToken,
  getUsedComponentTypes,
} from './validators.js';

// ============================================================================
// Re-export ValidationResult from schema-validation
// ============================================================================

export type { ValidationResult } from '../schema-validation.js';

// ============================================================================
// Screen Resolver Pipeline [PHASE-2]
// ============================================================================

export {
  // Token Resolver
  type TokenBindingContext,
  type ResolvedTokenBindings,
  resolveBinding,
  resolveBindings,
  substituteTemplateVariables,
  tokenRefToCSSVar,
  isValidTokenBinding,
  extractTemplateVariables,
  clearBindingCache,
  // Layout Resolver
  type LayoutContext,
  resolveShell,
  resolvePage,
  resolveSection,
  parseLayoutType,
  // Component Resolver
  type ResolvedComponent,
  type ComponentContext,
  resolveComponent,
  resolveChildren,
  isValidComponentDefinition,
  extractComponentTypes,
  clearComponentCache,
  // Screen Resolver (Main)
  type ResolvedScreen,
  type ResolvedSection,
  type ComponentTree,
  type ComponentTreeNode,
  resolveScreen,
  isValidResolvedScreen,
  getScreenStats,
  clearScreenCache,
} from './resolver/index.js';

// ============================================================================
// Output Generators [PHASE-3]
// ============================================================================

export {
  // Types
  type CSSFramework,
  type OutputFormat,
  type ComponentStyle,
  type GeneratorOptions,
  type GeneratorResult,
  type GeneratedFile,
  type CSSVariableMap,
  type TailwindClassMap,
  type StyledThemeConfig,
  type ComponentGenerationContext,
  defaultGeneratorOptions,
  // Utilities
  camelCase,
  pascalCase,
  kebabCase,
  formatCode,
  indent,
  escapeJSX,
  needsJSXExpression,
  propValueToJSX,
  generateImports,
  cssVarToToken,
  extractPropertyFromCSSVar,
  isValidIdentifier,
  sanitizeIdentifier,
  // CSS-in-JS Generator
  type CSSInJSFormat,
  convertCSSVarsToTheme,
  generateComponentStyles,
  generateStyledComponents,
  // Tailwind Generator
  tokenToTailwindClass,
  generateComponentClasses,
  generateTailwindConfig,
  generateTailwindClasses,
  // React Generator
  generateComponentInterface,
  generateComponentJSX,
  generateComponentTree,
  generateReactComponent,
} from './generators/index.js';
