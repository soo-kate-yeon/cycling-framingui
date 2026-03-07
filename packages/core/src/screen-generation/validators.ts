/**
 * @framingui/core - Screen Definition Validation
 * Zod-based runtime validation for screen definitions
 * [SPEC-LAYOUT-002] [PHASE-1]
 */

import { z } from 'zod';
import type { ValidationResult } from '../schema-validation.js';
import type {
  ScreenDefinition,
  ComponentDefinition,
  ComponentType,
  ValidationContext,
} from './types.js';
import { SCREEN_COMPONENT_TYPES } from './types.js';

// ============================================================================
// Component Type Validation
// ============================================================================

/**
 * Component type enum - 20 component types
 */
const COMPONENT_TYPES: ComponentType[] = [...SCREEN_COMPONENT_TYPES];

// ============================================================================
// Token ID Pattern Validation
// ============================================================================

/**
 * Shell token ID pattern: shell.{platform}.{name}
 * Examples: shell.web.dashboard, shell.mobile.app
 */
const SHELL_TOKEN_PATTERN = /^shell\.[a-z]+\.[a-z-]+$/;

/**
 * Page token ID pattern: page.{name}
 * Examples: page.dashboard, page.settings
 */
const PAGE_TOKEN_PATTERN = /^page\.[a-z-]+$/;

/**
 * Section token ID pattern: section.{name} or section.{name}-{number}
 * Examples: section.grid-4, section.hero, section.split
 */
const SECTION_TOKEN_PATTERN = /^section\.[a-z]+([-][a-z0-9]+)*$/;

/**
 * Screen ID pattern: kebab-case
 * Examples: user-dashboard, settings-page
 */
const SCREEN_ID_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

// ============================================================================
// Zod Schemas
// ============================================================================

/**
 * ResponsiveOverrides Zod Schema
 */
export const ResponsiveOverridesSchema = z
  .object({
    sm: z.record(z.unknown()).optional(),
    md: z.record(z.unknown()).optional(),
    lg: z.record(z.unknown()).optional(),
    xl: z.record(z.unknown()).optional(),
    '2xl': z.record(z.unknown()).optional(),
  })
  .strict();

/**
 * ComponentDefinition Zod Schema
 * Supports nested children (recursive)
 */
export const ComponentDefinitionSchema: z.ZodType<ComponentDefinition> = z.lazy(() =>
  z.object({
    type: z.enum(COMPONENT_TYPES as [ComponentType, ...ComponentType[]], {
      errorMap: () => ({
        message: `Component type must be one of: ${COMPONENT_TYPES.join(', ')}`,
      }),
    }),
    props: z.record(z.unknown(), {
      errorMap: () => ({ message: 'Component props must be a valid object' }),
    }),
    children: z.array(z.union([ComponentDefinitionSchema, z.string()])).optional(),
    slot: z.string().optional(),
  })
);

/**
 * SectionDefinition Zod Schema
 */
export const SectionDefinitionSchema = z.object({
  id: z.string().min(1, 'Section ID is required and cannot be empty'),
  pattern: z
    .string()
    .regex(
      SECTION_TOKEN_PATTERN,
      'Section pattern must match: section.{name} or section.{name}-{number} (e.g., "section.grid-4")'
    ),
  components: z.array(ComponentDefinitionSchema).min(1, 'Section must have at least one component'),
  responsive: ResponsiveOverridesSchema.optional(),
});

/**
 * ScreenMeta Zod Schema
 */
export const ScreenMetaSchema = z.object({
  author: z.string().optional(),
  createdAt: z
    .string()
    .datetime({ message: 'createdAt must be a valid ISO 8601 date-time string' })
    .optional(),
  version: z
    .string()
    .regex(/^\d+\.\d+\.\d+$/, 'version must follow semantic versioning (e.g., "1.0.0")')
    .optional(),
  tags: z.array(z.string()).optional(),
});

/**
 * ScreenDefinition Zod Schema
 */
export const ScreenDefinitionSchema = z.object({
  id: z
    .string()
    .regex(SCREEN_ID_PATTERN, 'Screen ID must be kebab-case (lowercase letters, numbers, hyphens)'),
  name: z.string().min(1, 'Screen name is required and cannot be empty'),
  description: z.string().optional(),
  shell: z
    .string()
    .regex(
      SHELL_TOKEN_PATTERN,
      'Shell token must match pattern: shell.{platform}.{name} (e.g., "shell.web.dashboard")'
    ),
  page: z
    .string()
    .regex(
      PAGE_TOKEN_PATTERN,
      'Page token must match pattern: page.{name} (e.g., "page.dashboard")'
    ),
  themeId: z.string().default('default'),
  sections: z
    .array(SectionDefinitionSchema)
    .min(1, 'Screen must have at least one section definition'),
  meta: ScreenMetaSchema.optional(),
});

// ============================================================================
// Validation Functions
// ============================================================================

/**
 * Validate a ComponentDefinition
 * @param component - Component definition to validate
 * @returns Validation result with helpful error messages
 */
export function validateComponent(component: unknown): ValidationResult {
  try {
    ComponentDefinitionSchema.parse(component);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => {
        const path = err.path.length > 0 ? `${err.path.join('.')}: ` : '';
        return `${path}${err.message}`;
      });
      return { valid: false, errors };
    }
    return { valid: false, errors: ['Unknown validation error'] };
  }
}

/**
 * Validate a SectionDefinition
 * @param section - Section definition to validate
 * @returns Validation result with helpful error messages
 */
export function validateSection(section: unknown): ValidationResult {
  try {
    SectionDefinitionSchema.parse(section);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => {
        const path = err.path.length > 0 ? `${err.path.join('.')}: ` : '';
        return `${path}${err.message}`;
      });
      return { valid: false, errors };
    }
    return { valid: false, errors: ['Unknown validation error'] };
  }
}

/**
 * Validate a ScreenDefinition
 * @param screen - Screen definition to validate
 * @param context - Optional validation context for additional checks
 * @returns Validation result with helpful error messages
 */
export function validateScreenDefinition(
  screen: unknown,
  context?: ValidationContext
): ValidationResult {
  const warnings: string[] = [];

  // Basic schema validation
  try {
    ScreenDefinitionSchema.parse(screen);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => {
        const path = err.path.length > 0 ? `${err.path.join('.')}: ` : '';
        return `${path}${err.message}`;
      });
      return { valid: false, errors };
    }
    return { valid: false, errors: ['Unknown validation error'] };
  }

  // Type assertion after validation
  const validScreen = screen as ScreenDefinition;

  // Context-based validation (if context provided)
  if (context) {
    // Check shell token availability
    if (context.availableShells && !context.availableShells.includes(validScreen.shell)) {
      warnings.push(`Shell token "${validScreen.shell}" not found in available shells`);
    }

    // Check page token availability
    if (context.availablePages && !context.availablePages.includes(validScreen.page)) {
      warnings.push(`Page token "${validScreen.page}" not found in available pages`);
    }

    // Check section pattern availability
    if (context.availableSections) {
      validScreen.sections.forEach(section => {
        if (!context.availableSections!.includes(section.pattern)) {
          warnings.push(
            `Section pattern "${section.pattern}" in section "${section.id}" not found in available sections`
          );
        }
      });
    }

    // Check theme ID availability
    if (
      context.availableThemes &&
      validScreen.themeId &&
      !context.availableThemes.includes(validScreen.themeId)
    ) {
      warnings.push(`Theme ID "${validScreen.themeId}" not found in available themes`);
    }

    // Strict mode: treat warnings as errors
    if (context.strict && warnings.length > 0) {
      return { valid: false, errors: warnings };
    }
  }

  // Check for duplicate section IDs
  const sectionIds = validScreen.sections.map(s => s.id);
  const duplicateSectionIds = sectionIds.filter((id, index) => sectionIds.indexOf(id) !== index);
  if (duplicateSectionIds.length > 0) {
    warnings.push(`Duplicate section IDs found: ${[...new Set(duplicateSectionIds)].join(', ')}`);
  }

  return {
    valid: true,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

/**
 * Assert that a screen definition is valid (throws on invalid)
 * @param screen - Screen definition to validate
 * @param context - Optional validation context
 * @throws Error if validation fails
 */
export function assertValidScreenDefinition(
  screen: unknown,
  context?: ValidationContext
): asserts screen is ScreenDefinition {
  const result = validateScreenDefinition(screen, context);
  if (!result.valid) {
    throw new Error(`Invalid screen definition: ${result.errors?.join(', ')}`);
  }
}

/**
 * Validate multiple screen definitions
 * @param screens - Array of screen definitions to validate
 * @param context - Optional validation context
 * @returns Validation summary
 */
export function validateScreenDefinitions(
  screens: unknown[],
  context?: ValidationContext
): {
  totalScreens: number;
  validScreens: number;
  invalidScreens: number;
  validationResults: Array<{
    id: string;
    valid: boolean;
    errors?: string[];
    warnings?: string[];
  }>;
} {
  const results = screens.map((screen, index) => {
    const result = validateScreenDefinition(screen, context);
    const id =
      typeof screen === 'object' && screen !== null && 'id' in screen
        ? String((screen as { id: string }).id)
        : `screen-${index}`;
    return { id, ...result };
  });

  const validScreens = results.filter(r => r.valid).length;
  const invalidScreens = results.filter(r => !r.valid).length;

  return {
    totalScreens: screens.length,
    validScreens,
    invalidScreens,
    validationResults: results,
  };
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Check if a token ID matches the shell pattern
 */
export function isValidShellToken(tokenId: string): boolean {
  return SHELL_TOKEN_PATTERN.test(tokenId);
}

/**
 * Check if a token ID matches the page pattern
 */
export function isValidPageToken(tokenId: string): boolean {
  return PAGE_TOKEN_PATTERN.test(tokenId);
}

/**
 * Check if a token ID matches the section pattern
 */
export function isValidSectionToken(tokenId: string): boolean {
  return SECTION_TOKEN_PATTERN.test(tokenId);
}

/**
 * Get all component types used in a screen definition
 */
export function getUsedComponentTypes(screen: ScreenDefinition): Set<ComponentType> {
  const types = new Set<ComponentType>();

  function collectTypes(component: ComponentDefinition) {
    types.add(component.type);
    if (component.children) {
      component.children.forEach(child => {
        if (typeof child !== 'string') {
          collectTypes(child);
        }
      });
    }
  }

  screen.sections.forEach(section => {
    section.components.forEach(collectTypes);
  });

  return types;
}
