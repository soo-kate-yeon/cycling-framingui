/**
 * Validate Screen Definition MCP Tool
 * SPEC-MCP-004 Phase 3.5: Validates screen definitions with helpful feedback
 */

import { fetchComponent } from '../api/data-client.js';
import type {
  ValidateScreenDefinitionInput,
  ValidateScreenDefinitionOutput,
  ValidationError,
  ValidationWarning,
  ImprovementSuggestion,
  JsonPatchOperation,
} from '../schemas/mcp-schemas.js';
import { ScreenDefinitionSchema } from '../schemas/mcp-schemas.js';
import { extractErrorMessage } from '../utils/error-handler.js';
import {
  getScreenComponentTypes,
  isSupportedScreenComponentType,
} from './screen-component-contract.js';

const _componentPropsCache: Map<string, any> = new Map();

async function getPropsData(componentId: string): Promise<any | null> {
  if (_componentPropsCache.has(componentId)) {
    return _componentPropsCache.get(componentId);
  }
  const result = await fetchComponent(componentId.toLowerCase());
  if (result.ok) {
    const detail = result.data;
    const propsData = {
      props: detail.props ?? [],
      variants: detail.variants,
      subComponents: detail.subComponents,
      dependencies: detail.dependencies,
      examples: detail.examples,
      accessibility: detail.accessibility,
    };
    _componentPropsCache.set(componentId, propsData);
    return propsData;
  }
  return null;
}

/**
 * Valid shell tokens from SPEC-LAYOUT-001 and SPEC-LAYOUT-004
 */
const VALID_SHELLS = [
  // Web shells
  'shell.web.app',
  'shell.web.dashboard',
  'shell.web.auth',
  'shell.web.marketing',
  'shell.web.minimal',
  // Mobile shells (SPEC-LAYOUT-004)
  'shell.mobile.app',
  'shell.mobile.fullscreen',
  'shell.mobile.modal',
  'shell.mobile.tab',
  'shell.mobile.drawer',
  'shell.mobile.detail',
];

/**
 * Valid page tokens from SPEC-LAYOUT-001
 */
const VALID_PAGES = ['page.dashboard', 'page.detail', 'page.wizard', 'page.resource', 'page.empty'];

/**
 * Valid section patterns from SPEC-LAYOUT-001
 */
const VALID_SECTION_PATTERNS = [
  'section.container',
  'section.centered',
  'section.grid-2',
  'section.grid-3',
  'section.grid-4',
  'section.split-50-50',
  'section.split-60-40',
  'section.split-70-30',
  'section.hero',
  'section.feature',
];

/**
 * Valid slot names
 */
const VALID_SLOTS = ['header', 'main', 'sidebar', 'footer'];

/**
 * Get similar values for suggestions (Levenshtein distance based)
 */
function getSimilarValues(value: string, validValues: string[]): string[] {
  const similar: { value: string; distance: number }[] = [];

  for (const valid of validValues) {
    const distance = levenshteinDistance(value.toLowerCase(), valid.toLowerCase());
    if (distance <= 3) {
      similar.push({ value: valid, distance });
    }
  }

  return similar
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3)
    .map(s => s.value);
}

/**
 * Simple Levenshtein distance implementation
 */
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0]![j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const cost = b.charAt(i - 1) === a.charAt(j - 1) ? 0 : 1;
      matrix[i]![j] = Math.min(
        (matrix[i - 1]?.[j] ?? 0) + 1,
        (matrix[i]?.[j - 1] ?? 0) + 1,
        (matrix[i - 1]?.[j - 1] ?? 0) + cost
      );
    }
  }

  return matrix[b.length]?.[a.length] ?? 0;
}

/**
 * Validate shell token
 */
function validateShell(
  shell: string,
  path: string
): { errors: ValidationError[]; warnings: ValidationWarning[] } {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  if (!shell.startsWith('shell.')) {
    errors.push({
      path,
      code: 'INVALID_SHELL_FORMAT',
      message: 'Shell token must start with "shell."',
      expected: 'shell.{platform}.{name}',
      received: shell,
      suggestion: `Use format: shell.web.app or shell.mobile.app`,
    });
    return { errors, warnings };
  }

  if (!VALID_SHELLS.includes(shell)) {
    const similar = getSimilarValues(shell, VALID_SHELLS);
    errors.push({
      path,
      code: 'UNKNOWN_SHELL',
      message: `Unknown shell token: "${shell}"`,
      expected: VALID_SHELLS.slice(0, 5).join(', ') + '...',
      received: shell,
      suggestion:
        similar.length > 0
          ? `Did you mean: ${similar.join(', ')}?`
          : `Valid shells: ${VALID_SHELLS.join(', ')}`,
      autoFix:
        similar.length > 0
          ? [{ op: 'replace' as const, path: `/${path}`, value: similar[0] }]
          : undefined,
    });
  }

  return { errors, warnings };
}

/**
 * Validate page token
 */
function validatePage(
  page: string,
  path: string
): { errors: ValidationError[]; warnings: ValidationWarning[] } {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  if (!page.startsWith('page.')) {
    errors.push({
      path,
      code: 'INVALID_PAGE_FORMAT',
      message: 'Page token must start with "page."',
      expected: 'page.{name}',
      received: page,
      suggestion: 'Use format: page.dashboard, page.detail, etc.',
    });
    return { errors, warnings };
  }

  if (!VALID_PAGES.includes(page)) {
    const similar = getSimilarValues(page, VALID_PAGES);
    errors.push({
      path,
      code: 'UNKNOWN_PAGE',
      message: `Unknown page token: "${page}"`,
      expected: VALID_PAGES.join(', '),
      received: page,
      suggestion:
        similar.length > 0
          ? `Did you mean: ${similar.join(', ')}?`
          : `Valid pages: ${VALID_PAGES.join(', ')}`,
      autoFix:
        similar.length > 0
          ? [{ op: 'replace' as const, path: `/${path}`, value: similar[0] }]
          : undefined,
    });
  }

  return { errors, warnings };
}

/**
 * Validate section pattern
 */
function validateSectionPattern(
  pattern: string,
  path: string,
  strict: boolean
): { errors: ValidationError[]; warnings: ValidationWarning[] } {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  if (!pattern.startsWith('section.')) {
    errors.push({
      path,
      code: 'INVALID_SECTION_FORMAT',
      message: 'Section pattern must start with "section."',
      expected: 'section.{name}',
      received: pattern,
      suggestion: 'Use format: section.container, section.grid-4, etc.',
    });
    return { errors, warnings };
  }

  if (!VALID_SECTION_PATTERNS.includes(pattern)) {
    if (strict) {
      const similar = getSimilarValues(pattern, VALID_SECTION_PATTERNS);
      errors.push({
        path,
        code: 'UNKNOWN_SECTION_PATTERN',
        message: `Unknown section pattern: "${pattern}"`,
        expected: VALID_SECTION_PATTERNS.slice(0, 5).join(', ') + '...',
        received: pattern,
        suggestion:
          similar.length > 0
            ? `Did you mean: ${similar.join(', ')}?`
            : `Valid patterns: ${VALID_SECTION_PATTERNS.join(', ')}`,
      });
    } else {
      warnings.push({
        path,
        code: 'CUSTOM_SECTION_PATTERN',
        message: `Custom section pattern "${pattern}" - ensure it's defined in your layout system`,
        recommendation: `Consider using standard patterns: ${VALID_SECTION_PATTERNS.slice(0, 5).join(', ')}`,
      });
    }
  }

  return { errors, warnings };
}

/**
 * Validate component type against the shared screen contract catalog
 */
async function validateComponentType(
  type: string,
  path: string,
  strict: boolean
): Promise<{ errors: ValidationError[]; warnings: ValidationWarning[] }> {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  const catalog = getScreenComponentTypes();
  const typeLower = type.toLowerCase();
  const matchingType = catalog.find(componentType => componentType.toLowerCase() === typeLower);

  if (!isSupportedScreenComponentType(matchingType ?? type)) {
    const similar = getSimilarValues(type, catalog);

    if (strict) {
      errors.push({
        path,
        code: 'UNKNOWN_COMPONENT',
        message: `Unknown screen component type: "${type}"`,
        expected: `One of: ${catalog.join(', ')}`,
        received: type,
        suggestion:
          similar.length > 0
            ? `Did you mean: ${similar.join(', ')}?`
            : 'Use the shared screen-generation component contract',
      });
    } else {
      warnings.push({
        path,
        code: 'CUSTOM_COMPONENT',
        message: `Component "${type}" is outside the shared screen-generation contract`,
        recommendation:
          similar.length > 0
            ? `Did you mean: ${similar.join(', ')}?`
            : `Supported screen components: ${catalog.join(', ')}`,
      });
    }
  } else {
    const correctCase = matchingType;
    if (correctCase && correctCase !== type) {
      warnings.push({
        path,
        code: 'COMPONENT_CASE',
        message: `Component type "${type}" has incorrect casing`,
        recommendation: `Use "${correctCase}" instead`,
      });
    }
  }

  return { errors, warnings };
}

/**
 * Validate component props against known prop definitions (async - API 기반)
 * [SPEC-MCP-007:W-004] 하드코딩된 props 데이터 제거
 */
async function validateComponentProps(
  component: any,
  path: string
): Promise<{ errors: ValidationError[]; warnings: ValidationWarning[] }> {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  if (!component.type) {
    return { errors, warnings };
  }

  // props 데이터가 없는 컴포넌트는 스킵 (하위 호환성)
  const propsData = await getPropsData(component.type.toLowerCase());
  if (!propsData) {
    return { errors, warnings };
  }

  const componentProps = component.props || {};

  // 1. 필수 props 존재 여부 검증
  for (const propDef of propsData.props) {
    if (propDef.required && !(propDef.name in componentProps)) {
      errors.push({
        path: `${path}.props.${propDef.name}`,
        code: 'MISSING_REQUIRED_PROP',
        message: `Required prop "${propDef.name}" is missing on ${component.type}`,
        expected: propDef.type,
        suggestion: propDef.defaultValue
          ? `Add "${propDef.name}" prop (default: ${propDef.defaultValue})`
          : `Add "${propDef.name}" prop of type ${propDef.type}`,
        autoFix: propDef.defaultValue
          ? [
              {
                op: 'add' as const,
                path: `/${path.replace(/\./g, '/')}/props/${propDef.name}`,
                value: propDef.defaultValue,
              },
            ]
          : undefined,
      });
    }
  }

  // 2. variant 값 유효성 검증
  if (propsData.variants && propsData.variants.length > 0) {
    // variant prop 그룹별로 체크
    const variantGroups = new Map<string, string[]>();
    for (const v of propsData.variants) {
      if (!variantGroups.has(v.name)) {
        variantGroups.set(v.name, []);
      }
      variantGroups.get(v.name)!.push(v.value);
    }

    for (const [variantName, validValues] of variantGroups) {
      const propValue = componentProps[variantName];
      if (propValue !== undefined && typeof propValue === 'string') {
        if (!validValues.includes(propValue)) {
          warnings.push({
            path: `${path}.props.${variantName}`,
            code: 'INVALID_VARIANT',
            message: `Invalid ${variantName} value "${propValue}" on ${component.type}`,
            recommendation: `Valid values: ${validValues.join(', ')}`,
          });
        }
      }
    }
  }

  return { errors, warnings };
}

/**
 * Validate slot value
 */
function validateSlot(
  slot: string,
  path: string
): { errors: ValidationError[]; warnings: ValidationWarning[] } {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  if (!VALID_SLOTS.includes(slot)) {
    const similar = getSimilarValues(slot, VALID_SLOTS);
    errors.push({
      path,
      code: 'INVALID_SLOT',
      message: `Invalid slot value: "${slot}"`,
      expected: VALID_SLOTS.join(', '),
      received: slot,
      suggestion:
        similar.length > 0
          ? `Did you mean: ${similar.join(', ')}?`
          : `Valid slots: ${VALID_SLOTS.join(', ')}`,
    });
  }

  return { errors, warnings };
}

/**
 * Generate improvement suggestions
 */
function generateSuggestions(definition: any): ImprovementSuggestion[] {
  const suggestions: ImprovementSuggestion[] = [];

  // Handle null/undefined definition
  if (!definition || typeof definition !== 'object') {
    return suggestions;
  }

  // Check for missing name/description
  if (!definition.name) {
    const autoFixName = definition.id
      ? definition.id.replace(/[-_]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
      : undefined;
    suggestions.push({
      category: 'maintainability',
      message: 'Consider adding a human-readable name for better documentation',
      affectedPath: 'name',
      suggestedChange: 'Add a descriptive name property',
      autoFix: autoFixName
        ? [{ op: 'add' as const, path: '/name', value: autoFixName }]
        : undefined,
    });
  }

  if (!definition.description) {
    suggestions.push({
      category: 'maintainability',
      message: 'Consider adding a description for documentation purposes',
      affectedPath: 'description',
      suggestedChange: 'Add a brief description of the screen purpose',
    });
  }

  // Check for missing themeId
  if (!definition.themeId) {
    suggestions.push({
      category: 'consistency',
      message: 'Consider specifying a themeId for consistent styling',
      affectedPath: 'themeId',
      suggestedChange: 'Add themeId to enable theme recipe application',
    });
  }

  // Check sections
  if (definition.sections && Array.isArray(definition.sections)) {
    // Check for empty sections
    for (let i = 0; i < definition.sections.length; i++) {
      const section = definition.sections[i];
      if (!section.components || section.components.length === 0) {
        suggestions.push({
          category: 'maintainability',
          message: `Section "${section.id || i}" has no components`,
          affectedPath: `sections[${i}].components`,
          suggestedChange: 'Add components or remove empty section',
        });
      }

      // Check for missing slot
      if (!section.slot) {
        suggestions.push({
          category: 'consistency',
          message: `Section "${section.id || i}" has no slot assigned`,
          affectedPath: `sections[${i}].slot`,
          suggestedChange:
            'Assign to a slot (header, main, sidebar, footer) for proper layout positioning',
        });
      }

      // Check components for accessibility
      if (section.components && Array.isArray(section.components)) {
        for (let j = 0; j < section.components.length; j++) {
          const component = section.components[j];

          // Check images for alt text
          if (
            (component.type === 'Image' || component.type === 'Avatar') &&
            (!component.props || !component.props.alt)
          ) {
            suggestions.push({
              category: 'accessibility',
              message: `${component.type} component is missing alt text`,
              affectedPath: `sections[${i}].components[${j}].props.alt`,
              suggestedChange: 'Add descriptive alt text for screen readers',
            });
          }

          // Check inputs for labels
          if (
            component.type === 'Input' &&
            component.props &&
            !component.props.label &&
            !component.props['aria-label']
          ) {
            suggestions.push({
              category: 'accessibility',
              message: 'Input component is missing a label',
              affectedPath: `sections[${i}].components[${j}].props.label`,
              suggestedChange: 'Add a label prop or aria-label for accessibility',
            });
          }
        }
      }
    }

    // Check for no main slot
    const hasMainSlot = definition.sections.some((s: any) => s.slot === 'main' || !s.slot);
    if (!hasMainSlot) {
      suggestions.push({
        category: 'consistency',
        message: 'No section assigned to main slot',
        affectedPath: 'sections',
        suggestedChange: 'Assign at least one section to the main slot',
      });
    }
  }

  return suggestions;
}

/**
 * Validate Screen Definition tool implementation
 */
export async function validateScreenDefinitionTool(
  input: ValidateScreenDefinitionInput
): Promise<ValidateScreenDefinitionOutput> {
  try {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const strict = input.strict !== false; // Default to strict

    const definition = input.definition as any;

    // 1. Validate with Zod schema first
    const zodResult = ScreenDefinitionSchema.safeParse(definition);

    if (!zodResult.success) {
      for (const issue of zodResult.error.issues) {
        errors.push({
          path: issue.path.join('.'),
          code: issue.code,
          message: issue.message,
          suggestion: getZodSuggestion(issue),
        });
      }
    }

    // 2. Additional semantic validation (only if basic structure is valid)
    if (definition && typeof definition === 'object') {
      // Validate shell
      if (definition.shell) {
        const shellResult = validateShell(definition.shell, 'shell');
        errors.push(...shellResult.errors);
        warnings.push(...shellResult.warnings);
      }

      // Validate page
      if (definition.page) {
        const pageResult = validatePage(definition.page, 'page');
        errors.push(...pageResult.errors);
        warnings.push(...pageResult.warnings);
      }

      // Validate sections
      if (definition.sections && Array.isArray(definition.sections)) {
        for (let i = 0; i < definition.sections.length; i++) {
          const section = definition.sections[i];

          // Validate pattern
          if (section.pattern) {
            const patternResult = validateSectionPattern(
              section.pattern,
              `sections[${i}].pattern`,
              strict
            );
            errors.push(...patternResult.errors);
            warnings.push(...patternResult.warnings);
          }

          // Validate slot
          if (section.slot) {
            const slotResult = validateSlot(section.slot, `sections[${i}].slot`);
            errors.push(...slotResult.errors);
            warnings.push(...slotResult.warnings);
          }

          // Validate components
          if (section.components && Array.isArray(section.components)) {
            for (let j = 0; j < section.components.length; j++) {
              const component = section.components[j];
              if (component.type) {
                const typeResult = await validateComponentType(
                  component.type,
                  `sections[${i}].components[${j}].type`,
                  strict
                );
                errors.push(...typeResult.errors);
                warnings.push(...typeResult.warnings);

                // Props 검증 (타입이 유효한 경우에만)
                if (typeResult.errors.length === 0) {
                  const propsResult = await validateComponentProps(
                    component,
                    `sections[${i}].components[${j}]`
                  );
                  errors.push(...propsResult.errors);
                  warnings.push(...propsResult.warnings);
                }
              }
            }
          }
        }
      }
    }

    // 3. Generate improvement suggestions
    const suggestions = generateSuggestions(definition);

    // 4. Aggregate all auto-fix patches
    const allPatches: JsonPatchOperation[] = [];
    for (const err of errors) {
      if (err.autoFix) {
        allPatches.push(...err.autoFix);
      }
    }
    for (const sug of suggestions) {
      if (sug.autoFix) {
        allPatches.push(...sug.autoFix);
      }
    }

    const isValid = errors.length === 0;

    return {
      success: true,
      valid: isValid,
      errors: errors.length > 0 ? errors : undefined,
      warnings: warnings.length > 0 ? warnings : undefined,
      suggestions: suggestions.length > 0 ? suggestions : undefined,
      autoFixPatches: allPatches.length > 0 ? allPatches : undefined,
    };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error),
    };
  }
}

/**
 * Get suggestion for Zod validation issue
 */
function getZodSuggestion(issue: any): string {
  switch (issue.code) {
    case 'invalid_type':
      return `Expected ${issue.expected}, but received ${issue.received}`;
    case 'invalid_string':
      if (issue.validation === 'regex') {
        return 'Check the format - see the pattern in error message';
      }
      return 'Provide a valid string value';
    case 'too_small':
      return `Minimum ${issue.minimum} ${issue.type} required`;
    case 'too_big':
      return `Maximum ${issue.maximum} ${issue.type} allowed`;
    case 'invalid_enum_value':
      return `Valid values: ${issue.options.join(', ')}`;
    default:
      return 'Check the value format and try again';
  }
}
