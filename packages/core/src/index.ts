/**
 * @framingui/core
 * Minimal design system pipeline: Theme -> Blueprint -> Screen
 *
 * 80% LOC reduction from original codebase
 * No external dependencies (Babel, Prettier removed)
 */

// Types (non-theme)
export type {
  OKLCHColor,
  Blueprint,
  ComponentNode,
  LayoutType,
  RenderResult,
  RenderOptions,
  ThemeLegacy,
  ThemeMetaLegacy,
} from './types.js';

// Theme v2.1 (Primary API)
export {
  // Functions
  loadTheme,
  listThemes,
  themeExists,
  oklchToCSS,
  loadThemeV2,
  listThemesV2,
  themeExistsV2,
  oklchToCSSV2,
  resolveTokenRef,
  // Type aliases (for convenience)
  type Theme,
  type ThemeMeta,
  type OKLCHColor as OKLCHColorV2,
  // v2.1 specific types
  type ThemeV2,
  type ThemeMetaV2,
  type DesignDNA,
  type AtomicTokensV2,
  type SemanticTokensV2,
  type ComponentTokensV2,
  type StateLayerTokens,
  type MotionTokens,
  type ElevationTokens,
  type BorderTokens,
  type TypographyTokens,
  type DensityTokens,
  type EffectsTokens,
  type AIContext,
  type DarkModeOverrides,
  // CSS Variable Mapping
  CSS_VARIABLE_MAP,
  getWhiteColor,
  type CSSVariableName,
  // Deprecated (kept for backward compatibility)
  isBuiltinTheme,
  generateCSSVariables,
  BUILTIN_THEMES,
  type BuiltinThemeId,
} from './theme.js';

// Blueprint
export {
  createBlueprint,
  validateBlueprint,
  isValidComponent,
  getLayoutSlots,
  LAYOUTS,
  COMPONENT_CATALOG,
  type LayoutSlot,
  type ValidationResult,
  type CreateBlueprintInput,
} from './blueprint.js';

// Render
export { render, renderWithTheme, renderSingleComponent, renderComponents } from './render.js';

// Token System (SPEC-COMPONENT-001-A) - Enabled for SPEC-COMPONENT-001-D
export { resolveToken, resolveWithFallback, type TokenReference } from './token-resolver.js';
export {
  validateTheme,
  ThemeWithTokensSchema,
  type ValidationResult as TokenValidationResult,
} from './token-validation.js';
export { generateThemeCSS } from './css-generator.js';
export type { AtomicTokens, SemanticTokens, ComponentTokens, ThemeWithTokens } from './tokens.js';

// Component Schemas (SPEC-COMPONENT-001-B)
export type {
  PropDefinition,
  ComponentSchema,
  A11yRequirements,
  TokenBindings,
} from './component-schemas.js';
export {
  PRIMITIVE_COMPONENTS,
  COMPOSED_COMPONENTS,
  ALL_COMPONENTS,
  getComponentSchema,
} from './component-schemas.js';
export {
  validateComponentSchema,
  validateAllSchemas,
  validateProp,
  validateA11y,
  validateTokenBindings,
  getValidationSummary,
  assertValidSchema,
  assertAllSchemasValid,
  PropDefinitionSchema,
  A11yRequirementsSchema,
  TokenBindingsSchema,
  ComponentSchemaZod,
  type ValidationResult as SchemaValidationResult,
} from './schema-validation.js';

// Catalog-backed template definitions
export {
  SCREEN_TEMPLATE_DEFINITIONS,
  listTemplateDefinitions,
  listTemplateDefinitionsByCategory,
  searchTemplateDefinitions,
  loadTemplateDefinition,
} from './catalog/templates/index.js';
export type {
  ScreenTemplateDefinition,
  TemplateCategory,
  TemplateLayoutType,
  TemplateResponsiveBreakpoint,
  TemplateResponsiveLayout,
  TemplateSectionDefinition,
  TemplateLayoutDefinition,
  TemplateCustomizableDefinition,
} from './catalog/templates/index.js';

// Layout Tokens (SPEC-LAYOUT-001)
// Note: TokenReference is already exported from token-resolver.ts
export type {
  ResponsiveToken,
  ResponsiveConfig,
  ShellRegion,
  ShellRegionPosition,
  ShellConfig,
  ShellToken,
  SectionSlot,
  PagePurpose,
  PageConfig,
  PageLayoutToken,
  SectionCSS,
  SectionType,
  SectionPatternToken,
  // Mobile Shell Types (SPEC-LAYOUT-004)
  MobileShellToken,
  SafeAreaConfig,
  SafeAreaDefaults,
  SafeAreaEdges,
  StatusBarConfig,
  NavigationBarConfig,
  SystemUIConfig,
  KeyboardConfig,
  KeyboardAnimationConfig,
  BottomTabConfig,
  BottomTabItemConfig,
  TouchTargetConfig,
  HitSlopConfig,
} from './layout-tokens/types.js';

// Shell Token Definitions (SPEC-LAYOUT-001 - PHASE-3)
export {
  SHELL_WEB_APP,
  SHELL_WEB_MARKETING,
  SHELL_WEB_AUTH,
  SHELL_WEB_DASHBOARD,
  SHELL_WEB_ADMIN,
  SHELL_WEB_MINIMAL,
  getShellToken,
  getAllShellTokens,
  getShellsByPlatform,
} from './layout-tokens/shells.js';

// Page Layout Token Definitions (SPEC-LAYOUT-001 - PHASE-4)
export {
  PAGE_JOB,
  PAGE_RESOURCE,
  PAGE_DASHBOARD,
  PAGE_SETTINGS,
  PAGE_DETAIL,
  PAGE_EMPTY,
  PAGE_WIZARD,
  PAGE_ONBOARDING,
  getPageLayoutToken,
  getAllPageLayoutTokens,
  getPagesByPurpose,
  getPageSections,
} from './layout-tokens/pages.js';

// Section Pattern Token Definitions (SPEC-LAYOUT-001 - PHASE-5)
export {
  SECTION_GRID_2,
  SECTION_GRID_3,
  SECTION_GRID_4,
  SECTION_GRID_AUTO,
  SECTION_SPLIT_30_70,
  SECTION_SPLIT_50_50,
  SECTION_SPLIT_70_30,
  SECTION_STACK_START,
  SECTION_STACK_CENTER,
  SECTION_STACK_END,
  SECTION_SIDEBAR_LEFT,
  SECTION_SIDEBAR_RIGHT,
  SECTION_CONTAINER,
  getSectionPatternToken,
  getAllSectionPatternTokens,
  getSectionsByType,
  getSectionCSS,
} from './layout-tokens/sections.js';

// Responsive Token Definitions (SPEC-LAYOUT-001 - PHASE-6)
export {
  BREAKPOINT_SM,
  BREAKPOINT_MD,
  BREAKPOINT_LG,
  BREAKPOINT_XL,
  BREAKPOINT_2XL,
  BREAKPOINT_VALUES,
  getResponsiveToken,
  getAllResponsiveTokens,
  getBreakpointValue,
  getBreakpointMediaQuery,
  sortBreakpointsBySize,
} from './layout-tokens/responsive.js';

// Mobile Shell Token Definitions (SPEC-LAYOUT-004 - MILESTONE-2)
export {
  SHELL_MOBILE_APP,
  SHELL_MOBILE_FULLSCREEN,
  SHELL_MOBILE_MODAL,
  SHELL_MOBILE_TAB,
  SHELL_MOBILE_DRAWER,
  SHELL_MOBILE_DETAIL,
  getMobileShellToken,
  getAllMobileShellTokens,
  getMobileShellsByOS,
} from './layout-tokens/mobile-shells.js';

// Safe Area Utilities (SPEC-LAYOUT-004 - MILESTONE-3)
export type { SafeAreaInsets, DeviceType } from './layout-tokens/safe-area.js';
export {
  detectDeviceType,
  getSafeAreaTop,
  getSafeAreaBottom,
  getSafeAreaInsets,
  applySafeAreaToLayout,
  useSafeArea,
} from './layout-tokens/safe-area.js';

// Keyboard Utilities (SPEC-LAYOUT-004 - MILESTONE-4)
export type {
  KeyboardState,
  KeyboardEventType,
  KeyboardEventListener,
  KeyboardAwareLayout,
} from './layout-tokens/keyboard.js';
export {
  getKeyboardHeight,
  applyKeyboardAvoidance,
  useKeyboardAvoidance,
  addKeyboardListener,
  getKeyboardAnimationDuration,
  getKeyboardAwareBottomSpacing,
  getDefaultKeyboardAnimation,
  isKeyboardVisible,
  getKeyboardProgressMode,
} from './layout-tokens/keyboard.js';

// Touch Target Utilities (SPEC-LAYOUT-004 - MILESTONE-5)
export type { AccessibilityGuideline, TouchTargetElement } from './layout-tokens/touch-target.js';
export {
  validateTouchTarget,
  applyMinTouchTarget,
  getHitSlop,
  getMinTouchTargetForScale,
  isAccessibleTouchTarget,
  warnIfBelowMinimum,
} from './layout-tokens/touch-target.js';

// Layout Token Validation (SPEC-LAYOUT-001 - PHASE-2 & SPEC-LAYOUT-004 - MILESTONE-6)
export {
  validateShellToken,
  validatePageLayoutToken,
  validateSectionPatternToken,
  validateTokenReference,
  validateMobileShellToken,
  validateLLMShellInput,
  validateLLMPageInput,
  validateLLMSectionInput,
  detectCircularRefs,
  validateLayoutHierarchy,
  safeValidate,
  ShellTokenSchema,
  PageLayoutTokenSchema,
  SectionPatternTokenSchema,
  TokenReferenceSchema,
  ShellRegionSchema,
  ShellRegionPositionSchema,
  ShellConfigSchema,
  PagePurposeSchema,
  SectionSlotSchema,
  PageConfigSchema,
  SectionTypeSchema,
  SectionCSSSchema,
  ResponsiveTokenSchema,
  LLMShellInputSchema,
  LLMPageInputSchema,
  LLMSectionInputSchema,
  // Mobile Shell Validation Schemas (SPEC-LAYOUT-004 - MILESTONE-6)
  MobileShellTokenSchema,
  SafeAreaConfigSchema,
  SafeAreaDefaultsSchema,
  SafeAreaEdgesSchema,
  StatusBarConfigSchema,
  NavigationBarConfigSchema,
  SystemUIConfigSchema,
  KeyboardConfigSchema,
  KeyboardAnimationConfigSchema,
  BottomTabConfigSchema,
  BottomTabItemConfigSchema,
  TouchTargetConfigSchema,
  HitSlopConfigSchema,
  type ValidationResult as LayoutValidationResult,
  type LayoutTokenCollection,
} from './layout-validation.js';

// Layout Resolver (SPEC-LAYOUT-001 - PHASE-7)
export {
  resolveLayout,
  clearLayoutCache,
  mergeResponsiveConfig,
  type ResolvedLayout,
} from './layout-resolver.js';

// Layout CSS Generator (SPEC-LAYOUT-001 - PHASE-8)
export {
  generateLayoutCSS,
  generateAllLayoutCSS,
  generateCSSVariables as generateLayoutCSSVariables,
  generateShellClasses,
  generatePageClasses,
  generateSectionClasses,
  generateMediaQueries,
  formatCSS,
  validateCSS,
  type LayoutToken,
  type CSSGenerationOptions,
} from './layout-css-generator.js';

// Screen Generation (SPEC-LAYOUT-002 - PHASE-1 to PHASE-4)
export {
  // Types
  type ComponentType,
  type ComponentDefinition,
  type ResponsiveOverrides,
  type SectionDefinition,
  type ScreenMeta,
  type ScreenDefinition,
  type ValidationContext,
  SCREEN_COMPONENT_TYPES,
  isComponentDefinition,
  isScreenDefinition,
  // Validation
  ResponsiveOverridesSchema,
  ComponentDefinitionSchema,
  SectionDefinitionSchema,
  ScreenMetaSchema,
  ScreenDefinitionSchema,
  validateComponent,
  validateSection,
  validateScreenDefinition,
  assertValidScreenDefinition,
  validateScreenDefinitions,
  isValidShellToken,
  isValidPageToken,
  isValidSectionToken,
  getUsedComponentTypes,
  // Resolver
  type TokenBindingContext,
  type ResolvedTokenBindings,
  resolveBinding,
  resolveBindings,
  substituteTemplateVariables,
  tokenRefToCSSVar,
  isValidTokenBinding,
  extractTemplateVariables,
  clearBindingCache,
  type LayoutContext,
  resolveShell,
  resolvePage,
  resolveSection,
  parseLayoutType,
  type ResolvedComponent,
  type ComponentContext,
  resolveComponent,
  resolveChildren,
  isValidComponentDefinition,
  extractComponentTypes,
  clearComponentCache,
  type ResolvedScreen,
  type ResolvedSection,
  type ComponentTree,
  type ComponentTreeNode,
  resolveScreen,
  isValidResolvedScreen,
  getScreenStats,
  clearScreenCache,
  // Generators
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
  type CSSInJSFormat,
  convertCSSVarsToTheme,
  generateComponentStyles,
  generateStyledComponents,
  tokenToTailwindClass,
  generateComponentClasses,
  generateTailwindConfig,
  generateTailwindClasses,
  generateComponentInterface,
  generateComponentJSX,
  generateComponentTree,
  generateReactComponent,
} from './screen-generation/index.js';

// Icon Library (SPEC-ICON-001)
export {
  loadIconLibrary,
  listIconLibraries,
  iconLibraryExists,
  findIcon,
  getIconsByCategory,
  searchIconsByTag,
  generateImportStatement,
  getPackageName,
  type IconLibrary,
  type IconLibraryMeta,
  type IconSizeMapping,
  type IconFrameworkConfig,
  type IconDefinition,
} from './icon-library.js';
