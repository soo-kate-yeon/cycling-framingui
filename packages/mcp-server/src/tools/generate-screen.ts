/**
 * Generate Screen MCP Tool
 * SPEC-LAYOUT-002 Phase 4: Generate production code from JSON screen definition
 */

import type { ScreenDefinition } from '@framingui/core';
import type { GenerateScreenInput, GenerateScreenOutput } from '../schemas/mcp-schemas.js';
import { extractErrorMessage } from '../utils/error-handler.js';
import { extractDependencies } from '../utils/dependency-extractor.js';
import {
  findUnsupportedScreenComponentTypes,
  getScreenComponentTypes,
} from './screen-component-contract.js';
import { applyRecipeToNode } from '../data/recipe-resolver.js';

type ScreenDefinitionDraft = {
  themeId?: string;
  sections?: Array<{
    components?: unknown[];
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
};

function isScreenDefinitionDraft(value: unknown): value is ScreenDefinitionDraft {
  return typeof value === 'object' && value !== null;
}

async function applyThemeRecipesToScreenDefinition(
  screenDefinition: GenerateScreenInput['screenDefinition']
): Promise<GenerateScreenInput['screenDefinition']> {
  if (!isScreenDefinitionDraft(screenDefinition)) {
    return screenDefinition;
  }

  if (!screenDefinition.themeId || !Array.isArray(screenDefinition.sections)) {
    return screenDefinition;
  }

  const sections = await Promise.all(
    screenDefinition.sections.map(async section => {
      if (!Array.isArray(section.components) || section.components.length === 0) {
        return section;
      }

      const components = await Promise.all(
        section.components.map(component =>
          applyRecipeToNode(component as never, screenDefinition.themeId!)
        )
      );

      return {
        ...section,
        components,
      };
    })
  );

  return {
    ...screenDefinition,
    sections,
  } as GenerateScreenInput['screenDefinition'];
}

/**
 * Generate production-ready code from JSON screen definition
 *
 * @param input - Screen definition and generation options
 * @returns Generated code with CSS variables and validation errors
 */
export async function generateScreenTool(
  input: GenerateScreenInput
): Promise<GenerateScreenOutput> {
  try {
    const { outputFormat, options } = input;
    const screenDefinition = await applyThemeRecipesToScreenDefinition(input.screenDefinition);

    const unsupportedTypes = findUnsupportedScreenComponentTypes(screenDefinition);
    if (unsupportedTypes.length > 0) {
      return {
        success: false,
        errors: unsupportedTypes.map(
          type =>
            `Unsupported screen component "${type}". Supported types: ${getScreenComponentTypes().join(', ')}`
        ),
        error: 'Screen definition validation failed',
      };
    }

    // Step 1: Validate screen definition
    const { validateScreenDefinition } = await import('@framingui/core');
    const validation = validateScreenDefinition(screenDefinition);

    if (!validation.valid) {
      return {
        success: false,
        errors: validation.errors || ['Invalid screen definition'],
        error: 'Screen definition validation failed',
      };
    }

    // Step 2: Resolve screen with layout and components
    const { resolveScreen } = await import('@framingui/core');
    const resolvedScreen = await resolveScreen(screenDefinition as ScreenDefinition);

    // Step 3: Prepare generator options
    const generatorOptions = {
      format: (options?.typescript !== false ? 'typescript' : 'javascript') as
        | 'typescript'
        | 'javascript',
      prettier: options?.prettier ?? false,
    };

    // Step 4: Generate code based on output format
    let code: string;
    const cssVariables: string | undefined = undefined;

    switch (outputFormat) {
      case 'css-in-js': {
        const { generateStyledComponents } = await import('@framingui/core');
        const cssFramework =
          (options?.cssFramework as 'styled-components' | 'emotion') || 'styled-components';
        const result = generateStyledComponents(resolvedScreen, cssFramework, generatorOptions);
        code = result.code;
        break;
      }

      case 'tailwind': {
        const { generateTailwindClasses } = await import('@framingui/core');
        const result = generateTailwindClasses(resolvedScreen, generatorOptions);
        code = result.code;
        break;
      }

      case 'react': {
        const { generateReactComponent } = await import('@framingui/core');
        const result = generateReactComponent(resolvedScreen, generatorOptions);
        code = result.code;
        break;
      }

      default:
        return {
          success: false,
          error: `Unsupported output format: ${outputFormat}`,
        };
    }

    // Note: CSS variables generation is optional and depends on theme resolution
    // For now, we return the generated code without separate CSS variables
    // Future enhancement: Extract CSS variables from resolved screen

    // Extract dependencies from generated code
    const dependencies = extractDependencies(code);

    return {
      success: true,
      code,
      cssVariables,
      dependencies,
    };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error),
    };
  }
}
