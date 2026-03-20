/**
 * Get Screen Generation Context MCP Tool
 * SPEC-MCP-004 Phase 3.5: Provides complete context for AI agents to generate screen definitions
 * [SPEC-MCP-007] API 기반 데이터 소스로 마이그레이션
 */

import {
  fetchTheme,
  fetchComponent,
  fetchScreenExamples,
  fetchTemplate,
  type ScreenExample as ApiScreenExample,
} from '../api/data-client.js';
import { getScreenComponentTypes } from './screen-component-contract.js';
import type {
  GetScreenGenerationContextInput,
  GetScreenGenerationContextOutput,
  ContextTemplateMatch,
  ContextComponentInfo,
  ThemeRecipeInfo,
  ScreenExample,
  WorkflowGuide,
  DefinitionStarter,
} from '../schemas/mcp-schemas.js';
import { matchTemplates } from '../data/template-matcher.js';
import { getAllRecipes } from '../data/recipe-resolver.js';
import { generateHints } from '../data/hint-generator.js';
import {
  recommendReactNativeRuntimeComponents,
  toReactNativeContextComponent,
} from '../data/react-native-runtime-catalog.js';
import { resolvePlatformTarget } from '../project-context-resolution.js';
import { extractErrorMessage } from '../utils/error-handler.js';

type GetScreenGenerationContextToolInput = Pick<GetScreenGenerationContextInput, 'description'> &
  Partial<Omit<GetScreenGenerationContextInput, 'description'>>;

const TEMPLATE_CONFIDENCE_THRESHOLD = 20;
const DEFAULT_COMPONENT_CANDIDATES = ['Card', 'Heading', 'Text', 'Button', 'Badge', 'Separator'];
const CATEGORY_COMPONENT_HINTS: Record<string, string[]> = {
  auth: ['Form', 'Input', 'Button', 'Heading', 'Text', 'Link'],
  dashboard: ['Card', 'Heading', 'Text', 'Badge', 'Table', 'Button'],
  form: ['Form', 'Input', 'Button', 'Heading', 'Text', 'Checkbox'],
  feedback: ['Card', 'Heading', 'Text', 'Badge', 'Button'],
  marketing: ['Heading', 'Text', 'Card', 'Button', 'Image', 'Badge'],
  core: ['Card', 'Heading', 'Text', 'Button', 'Badge'],
};

function shouldIncludeTemplateMatch(match: {
  category: string;
  confidence: number;
  matchedKeywords: string[];
}): boolean {
  if (match.confidence >= TEMPLATE_CONFIDENCE_THRESHOLD) {
    return true;
  }

  if (
    ['auth', 'dashboard', 'feedback'].includes(match.category) &&
    match.matchedKeywords.length > 0
  ) {
    return true;
  }

  return false;
}

/**
 * Screen Definition JSON Schema for reference
 */
const SCREEN_DEFINITION_SCHEMA = {
  type: 'object',
  required: ['id', 'shell', 'page', 'sections'],
  properties: {
    id: {
      type: 'string',
      pattern: '^[a-z0-9-]+$',
      description: 'Unique screen identifier (lowercase alphanumeric with hyphens)',
    },
    name: {
      type: 'string',
      description: 'Human-readable screen name',
    },
    description: {
      type: 'string',
      description: 'Screen description for documentation',
    },
    shell: {
      type: 'string',
      pattern: '^shell\\.[a-z]+\\.[a-z-]+$',
      description: 'Shell token (e.g., shell.web.dashboard, shell.web.auth)',
    },
    page: {
      type: 'string',
      pattern: '^page\\.[a-z-]+$',
      description: 'Page token (e.g., page.dashboard, page.wizard)',
    },
    themeId: {
      type: 'string',
      pattern: '^[a-z0-9-]+$',
      description: 'Theme ID for styling (optional)',
    },
    sections: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'pattern', 'components'],
        properties: {
          id: {
            type: 'string',
            description: 'Section identifier',
          },
          pattern: {
            type: 'string',
            pattern: '^section\\.[a-z0-9-]+$',
            description: 'Section pattern (e.g., section.container, section.grid-4)',
          },
          slot: {
            type: 'string',
            enum: ['header', 'main', 'sidebar', 'footer'],
            description: 'Layout slot to place this section',
          },
          components: {
            type: 'array',
            items: {
              type: 'object',
              required: ['type'],
              properties: {
                type: {
                  type: 'string',
                  description: 'Component type from component catalog',
                },
                props: {
                  type: 'object',
                  description: 'Component props',
                },
                children: {
                  oneOf: [{ type: 'string' }, { type: 'array' }],
                  description: 'Child content or nested components',
                },
              },
            },
          },
        },
      },
    },
    metadata: {
      type: 'object',
      properties: {
        version: { type: 'string' },
        author: { type: 'string' },
        created: { type: 'string' },
        updated: { type: 'string' },
      },
    },
  },
};

/**
 * API에서 컴포넌트 정보 조회
 */
function componentNameToId(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase();
}

function fallbackComponentInfo(componentName: string): ContextComponentInfo {
  return {
    id: componentNameToId(componentName),
    name: componentName,
    category: 'core',
    description: `${componentName} component from the shared screen-generation contract`,
    importStatement: `import { ${componentName} } from '@framingui/ui';`,
    props: [],
    variants: undefined,
  };
}

async function getComponentInfo(componentIds: string[]): Promise<ContextComponentInfo[]> {
  const components: ContextComponentInfo[] = [];

  for (const name of componentIds) {
    const result = await fetchComponent(componentNameToId(name));
    if (result.ok) {
      const component = result.data;
      components.push({
        id: component.id,
        name: component.name,
        category: component.category as 'core' | 'complex' | 'advanced',
        description: component.description,
        importStatement:
          component.importStatement ?? `import { ${component.name} } from '@framingui/ui';`,
        props: component.props ?? [],
        variants: component.variants,
      });
      continue;
    }

    components.push(fallbackComponentInfo(name));
  }

  return components;
}

/**
 * Extract component types from template skeleton
 */
function extractComponentTypes(template: {
  category?: string;
  requiredComponents?: string[];
}): string[] {
  const types = new Set<string>();

  // Add required components from template
  if (template.requiredComponents) {
    for (const comp of template.requiredComponents) {
      types.add(comp.toLowerCase());
    }
  }

  // Add common components based on category
  const categoryComponents: Record<string, string[]> = {
    auth: ['card', 'input', 'button', 'text', 'heading', 'link'],
    dashboard: ['card', 'heading', 'text', 'badge', 'avatar', 'table'],
    form: ['form', 'input', 'button', 'text', 'heading', 'select'],
    feedback: ['card', 'text', 'heading', 'button', 'icon'],
    marketing: ['heading', 'text', 'button', 'image', 'card'],
  };

  const category = template.category;
  if (category && categoryComponents[category]) {
    for (const comp of categoryComponents[category]) {
      types.add(comp);
    }
  }

  return Array.from(types);
}

function getRecommendedComponentTypes(options: {
  bestMatch?: ContextTemplateMatch;
  themeRecipes?: ThemeRecipeInfo[];
}): string[] {
  const componentTypes = new Set<string>();

  for (const componentType of DEFAULT_COMPONENT_CANDIDATES) {
    componentTypes.add(componentType);
  }

  if (options.bestMatch?.requiredComponents) {
    for (const componentType of options.bestMatch.requiredComponents) {
      componentTypes.add(componentType);
    }
  }

  if (options.bestMatch?.category && CATEGORY_COMPONENT_HINTS[options.bestMatch.category]) {
    for (const componentType of CATEGORY_COMPONENT_HINTS[options.bestMatch.category]!) {
      componentTypes.add(componentType);
    }
  }

  if (options.themeRecipes) {
    for (const recipe of options.themeRecipes) {
      if (recipe.componentType) {
        const normalized =
          recipe.componentType.charAt(0).toUpperCase() + recipe.componentType.slice(1);
        componentTypes.add(normalized);
      }
    }
  }

  const supported = new Set(getScreenComponentTypes());
  return Array.from(componentTypes).filter(componentType => supported.has(componentType));
}

/**
 * Get theme recipe info
 */
async function getThemeRecipeInfo(themeId: string): Promise<ThemeRecipeInfo[]> {
  const recipes: ThemeRecipeInfo[] = [];

  try {
    const allRecipes = await getAllRecipes(themeId);

    // Group recipes by component type
    const grouped: Record<string, { variants: string[]; defaultClassName?: string }> = {};

    for (const [path, className] of Object.entries(allRecipes)) {
      // Parse path: recipes.card.glass -> card, glass
      const parts = path.replace('recipes.', '').split('.');
      if (parts.length >= 1) {
        const componentType = parts[0] || 'unknown';
        const variant = parts[1] || 'default';

        if (!grouped[componentType]) {
          grouped[componentType] = { variants: [] };
        }

        if (variant === 'default' || variant === 'base') {
          grouped[componentType].defaultClassName = className;
        } else {
          grouped[componentType].variants.push(variant);
        }
      }
    }

    // Convert to array
    for (const [componentType, data] of Object.entries(grouped)) {
      recipes.push({
        componentType,
        variants: data.variants,
        defaultClassName: data.defaultClassName,
      });
    }
  } catch {
    // Theme not found or no recipes
  }

  return recipes;
}

function inferShell(category?: string): string {
  switch (category) {
    case 'auth':
      return 'shell.web.auth';
    case 'dashboard':
      return 'shell.web.dashboard';
    default:
      return 'shell.web.marketing';
  }
}

function inferPage(category?: string): string {
  switch (category) {
    case 'auth':
      return 'page.auth';
    case 'dashboard':
      return 'page.dashboard';
    case 'form':
      return 'page.form';
    default:
      return 'page.marketing';
  }
}

function buildReactNativeWorkflow(): WorkflowGuide {
  return {
    title: 'React Native Direct-Write Workflow',
    description:
      'Follow these steps to write Expo or React Native screens directly with @framingui/react-native.',
    steps: [
      {
        step: 1,
        action: 'Review Runtime Components',
        description:
          'Review the native runtime components in this response and choose the smallest reusable surface that matches the screen.',
      },
      {
        step: 2,
        action: 'Validate Native Environment',
        tool: 'validate-environment',
        description:
          'Check that the target app has react, react-native, and @framingui/react-native installed.',
        example:
          '{ "projectPath": "/path/to/app", "platform": "react-native", "requiredPackages": ["react", "react-native", "@framingui/react-native"] }',
      },
      {
        step: 3,
        action: 'Write React Native Code',
        description:
          'Write Expo or React Native code directly, compose from @framingui/react-native exports, and keep custom styles inside StyleSheet.create.',
      },
      {
        step: 4,
        action: 'Audit for Drift',
        tool: 'validate-environment',
        description:
          'Run validate-environment again with sourceFiles to catch web-only imports, className usage, raw colors, and raw spacing drift.',
        example:
          '{ "projectPath": "/path/to/app", "platform": "react-native", "sourceFiles": ["/path/to/screen.tsx"], "requiredPackages": ["react", "react-native", "@framingui/react-native"] }',
      },
    ],
    notes: [
      'Prefer @framingui/react-native exports over app-local wrappers for common screens.',
      'Use StyleSheet.create for screen-specific layout, not className or Tailwind.',
      'Reach for Screen, Section, Card, FormSection, ListItem, and SegmentedControl before inventing local shells.',
      'Use validate-environment source audits before handoff to catch web-only drift.',
    ],
  };
}

function buildDefinitionStarter(options: {
  description: string;
  themeId?: string;
  bestMatch?: ContextTemplateMatch;
  componentTypes: string[];
}): DefinitionStarter {
  const id =
    options.description
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .split(/\s+/)
      .slice(0, 4)
      .join('-') || 'generated-screen';

  return {
    id,
    shell: inferShell(options.bestMatch?.category),
    page: inferPage(options.bestMatch?.category),
    themeId: options.themeId,
    sections: [
      {
        id: 'main',
        pattern: 'section.container',
        components: options.componentTypes.slice(0, 3).map(type => ({
          type,
          props: {},
        })),
      },
    ],
  };
}

/**
 * Get Screen Generation Context tool implementation
 * Provides complete context for coding agents to generate screen definitions
 */
export async function getScreenGenerationContextTool(
  input: GetScreenGenerationContextToolInput
): Promise<GetScreenGenerationContextOutput> {
  try {
    const { platform: targetPlatform } = resolvePlatformTarget(input.platform);

    // 1. Match templates based on description
    const templateMatches = matchTemplates(input.description, 3);
    let bestMatch: ContextTemplateMatch | undefined;
    let componentTypes: string[] = [];

    if (templateMatches.length > 0) {
      const match = templateMatches[0];
      if (match && shouldIncludeTemplateMatch(match)) {
        if (targetPlatform === 'react-native') {
          bestMatch = {
            templateId: match.templateId,
            templateName: match.templateName,
            category: match.category,
            confidence: match.confidence,
            matchedKeywords: match.matchedKeywords,
            skeleton: undefined,
            requiredComponents: undefined,
          };
        } else {
          // API를 통해 템플릿 상세 정보 조회 [SPEC-MCP-007:E-002]
          const templateResult = await fetchTemplate(match.templateId);
          const templateData = templateResult.ok ? templateResult.data : null;

          bestMatch = {
            templateId: match.templateId,
            templateName: match.templateName,
            category: match.category,
            confidence: match.confidence,
            matchedKeywords: match.matchedKeywords,
            skeleton: templateData?.skeleton,
            requiredComponents: templateData?.requiredComponents,
          };

          // Extract component types from template
          if (templateData) {
            componentTypes = extractComponentTypes(templateData);
          }
        }
      }
    }

    // 2. Get examples if requested
    let examples: ScreenExample[] | undefined;
    if (
      targetPlatform !== 'react-native' &&
      input.includeExamples !== false &&
      input.compact !== true
    ) {
      // API를 통해 스크린 예제 조회 [SPEC-MCP-007:E-007]
      const examplesResult = await fetchScreenExamples();
      const allExamples = examplesResult.ok ? examplesResult.data : [];
      // 설명과 관련된 예제 필터링 (간단한 키워드 매칭)
      const lowerDesc = input.description.toLowerCase();
      const scored = allExamples.map((ex: ApiScreenExample) => {
        let score = 0;
        const exWords = [
          ...ex.name.toLowerCase().split(' '),
          ...ex.description.toLowerCase().split(' '),
        ];
        for (const word of exWords) {
          if (word.length > 3 && lowerDesc.includes(word)) {
            score++;
          }
        }
        return { ex, score };
      });
      const filtered = scored
        .filter(s => s.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 2)
        .map(s => s.ex);
      examples = filtered.length > 0 ? filtered : undefined;
    }

    // 3. Get theme recipes if theme specified
    let themeRecipes: ThemeRecipeInfo[] | undefined;
    if (input.themeId) {
      const themeResult = await fetchTheme(input.themeId);
      if (themeResult.ok) {
        themeRecipes = await getThemeRecipeInfo(input.themeId);
      }
    }

    // 4. Native direct-write path does not depend on web component API data
    const hints = generateHints(input.description, input.themeId);

    const platformHints =
      targetPlatform === 'react-native'
        ? [
            {
              category: 'best-practice' as const,
              priority: 'high' as const,
              message:
                'Write React Native code directly using @framingui/react-native where that runtime surface exists, then host app primitives or local abstractions for the rest.',
            },
            {
              category: 'styling' as const,
              priority: 'high' as const,
              message:
                'Use StyleSheet plus @framingui/react-native helpers or host app style helpers with token-backed values. Avoid raw hex, spacing, and radius literals.',
            },
            {
              category: 'layout' as const,
              priority: 'medium' as const,
              message:
                'Account for SafeArea and keyboard avoidance in screen containers when composing native layouts.',
            },
          ]
        : [];
    const combinedHints = [...platformHints, ...hints];

    if (targetPlatform === 'react-native') {
      const nativeComponents = recommendReactNativeRuntimeComponents(
        input.description,
        bestMatch?.category
      )
        .map(componentId => toReactNativeContextComponent(componentId))
        .filter((component): component is ContextComponentInfo => component !== null);

      return {
        success: true,
        targetPlatform,
        templateMatch: bestMatch,
        components: nativeComponents,
        schema: undefined,
        examples: undefined,
        themeRecipes: undefined,
        hints: combinedHints.length > 0 ? combinedHints : undefined,
        workflow: input.compact === true ? undefined : buildReactNativeWorkflow(),
        directWrite: {
          runtime: 'react-native',
          entryStrategy:
            'Write the screen directly in Expo Router routes or host app screen modules, using @framingui/react-native where the runtime surface exists.',
          stylingStrategy:
            'Use StyleSheet plus @framingui/react-native helpers or host app token-backed helpers.',
          validationStrategy:
            'Run validate-environment with platform=react-native and sourceFiles before handoff.',
        },
      };
    }

    // 4. Get component information from shared contract + template + recipes
    const recommendedComponentTypes = getRecommendedComponentTypes({
      bestMatch,
      themeRecipes,
    });
    componentTypes =
      componentTypes.length > 0
        ? Array.from(new Set([...recommendedComponentTypes, ...componentTypes]))
        : recommendedComponentTypes;
    const components = await getComponentInfo(componentTypes);
    const definitionStarter = buildDefinitionStarter({
      description: input.description,
      themeId: input.themeId,
      bestMatch,
      componentTypes,
    });

    // 5. Generate contextual hints

    // 6. Generate workflow guide
    const workflow: WorkflowGuide = {
      title: 'Screen Generation Workflow',
      description: 'Follow these steps to generate a screen from natural language description',
      steps: [
        {
          step: 1,
          action: 'Review Context',
          description:
            'Review the templateMatch, components (with inline props/variants), schema, examples, and hints provided in this response',
        },
        {
          step: 2,
          action: 'Generate Screen Definition',
          description:
            'Create a JSON Screen Definition following the schema structure. Use templateMatch.skeleton as a starting point if available.',
          example: JSON.stringify(
            {
              id: 'my-screen',
              shell: 'shell.web.app',
              page: 'page.dashboard',
              themeId: input.themeId || 'your-theme-id',
              sections: [{ id: 'main', pattern: 'section.container', components: [] }],
            },
            null,
            2
          ),
        },
        {
          step: 3,
          action: 'Validate Definition',
          tool: 'validate-screen-definition',
          description:
            'Call validate-screen-definition with your generated definition to check for errors. Apply autoFixPatches if provided.',
          example: '{ "definition": <your-screen-definition>, "strict": true }',
        },
        {
          step: 4,
          action: 'Fix Validation Errors',
          description:
            'If validation fails, apply autoFixPatches or manually fix errors and re-validate',
        },
        {
          step: 5,
          action: 'Write React Code',
          description:
            'Write production-ready React code DIRECTLY using the components and props from this context. Use the import statements provided in the components field.',
        },
        {
          step: 6,
          action: 'Save File',
          description: 'Write the code to the target file path (e.g., app/page.tsx)',
        },
      ],
      notes: [
        'Use components from the "components" field - they include inline props and variants',
        'Apply theme recipes by setting variant props on components',
        'Write React code directly using the components and context provided',
        'Check hints for layout and component recommendations',
        'Use validate-environment to verify project dependencies before delivering code',
      ],
    };

    return {
      success: true,
      targetPlatform,
      templateMatch: bestMatch,
      components: components.length > 0 ? components : undefined,
      definitionStarter,
      schema:
        input.compact === true
          ? undefined
          : {
              screenDefinition: SCREEN_DEFINITION_SCHEMA,
              description:
                'JSON Schema for Screen Definition - use this structure to create valid screen definitions',
            },
      examples: examples && examples.length > 0 ? examples : undefined,
      themeRecipes: themeRecipes && themeRecipes.length > 0 ? themeRecipes : undefined,
      hints: combinedHints.length > 0 ? combinedHints : undefined,
      workflow: input.compact === true ? undefined : workflow,
    };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error),
    };
  }
}
