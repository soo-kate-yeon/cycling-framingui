#!/usr/bin/env node
import { fileURLToPath } from 'node:url';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { info, error as logError } from './utils/logger.js';
import { verifyApiKey } from './auth/verify.js';
import { setAuthData, setRawApiKey } from './auth/state.js';
import { AuthRequiredError, requireAuth } from './auth/guard.js';
import { loadCredentials } from './cli/credentials.js';
import { generateBlueprintTool } from './tools/generate-blueprint.js';
import { previewThemeTool } from './tools/preview-theme.js';
import { listThemesTool } from './tools/list-themes.js';
import { exportScreenTool } from './tools/export-screen.js';
import { generateScreenTool } from './tools/generate-screen.js';

import { validateScreenTool } from './tools/validate-screen.js';
import { listTokensTool } from './tools/list-tokens.js';
import { listIconLibrariesTool } from './tools/list-icon-libraries.js';
import { previewIconLibraryTool } from './tools/preview-icon-library.js';
import { listComponentsTool } from './tools/list-components.js';
import { previewComponentTool } from './tools/preview-component.js';
import { listScreenTemplatesTool } from './tools/list-screen-templates.js';
import { previewScreenTemplateTool } from './tools/preview-screen-template.js';
import { getScreenGenerationContextTool } from './tools/get-screen-generation-context.js';
import { validateScreenDefinitionTool } from './tools/validate-screen-definition.js';
import { validateEnvironmentTool } from './tools/validate-environment.js';
import { whoamiTool } from './tools/whoami.js';
import { readPackageJson } from './utils/package-json-reader.js';
import { getPromptDefinition, listPromptDefinitions } from './prompts/prompt-catalog.js';
import {
  WhoamiInputSchema,
  GenerateBlueprintInputSchema,
  PreviewThemeInputSchema,
  ListThemesInputSchema,
  ExportScreenInputSchema,
  ValidateScreenInputSchema,
  ListTokensInputSchema,
  ListIconLibrariesInputSchema,
  PreviewIconLibraryInputSchema,
  ListComponentsInputSchema,
  PreviewComponentInputSchema,
  ListScreenTemplatesInputSchema,
  PreviewScreenTemplateInputSchema,
  GetScreenGenerationContextInputSchema,
  ValidateScreenDefinitionInputSchema,
  GenerateScreenInputSchema,
  ValidateEnvironmentInputSchema,
} from './schemas/mcp-schemas.js';

const packageJsonResult = readPackageJson(
  fileURLToPath(new URL('../package.json', import.meta.url))
);
const serverVersion = packageJsonResult.success
  ? packageJsonResult.packageJson?.version || '0.6.5'
  : '0.6.5';

const server = new Server(
  {
    name: 'framingui-mcp-server',
    version: serverVersion,
  },
  {
    capabilities: {
      tools: {},
      prompts: {},
    },
  }
);

// ============================================================================
// MCP Prompts: ListPromptsRequestSchema Handler
// ============================================================================

server.setRequestHandler(ListPromptsRequestSchema, async () => {
  info('ListPrompts request received');

  return {
    prompts: listPromptDefinitions(),
  };
});

// ============================================================================
// MCP Prompts: GetPromptRequestSchema Handler
// ============================================================================

server.setRequestHandler(GetPromptRequestSchema, async request => {
  const { name, arguments: args } = request.params;

  info(`GetPrompt request: ${name}`);

  const promptDefinition = getPromptDefinition(name);

  if (!promptDefinition) {
    throw new Error(`Unknown prompt: ${name}`);
  }

  return promptDefinition.getPrompt((args ?? {}) as Record<string, string>);
});

// ============================================================================
// Task #9: ListToolsRequestSchema Handler
// ============================================================================

server.setRequestHandler(ListToolsRequestSchema, async () => {
  info('ListTools request received');

  return {
    tools: [
      {
        name: 'whoami',
        description:
          'Inspect the current authenticated session, license status, and accessible themes.\n\n' +
          'Call this after login or when debugging theme access. It is recommended, but no longer a required first step.\n\n' +
          'RETURNS:\n' +
          '- plan: Your subscription tier (free/pro/enterprise/master)\n' +
          '- isMaster: Whether this is a master account with full access\n' +
          '- licensedThemes: Array of theme IDs you can access\n' +
          '- totalThemes: Total number of available themes\n' +
          '- mcpSupport: MCP tool support period and renewal status\n\n' +
          'IMPORTANT:\n' +
          '- Only themes listed in licensedThemes are accessible to you\n' +
          '- Do not attempt to use themes outside your license\n' +
          '- MCP tool support is included for 1 year from purchase; renewal available after expiry',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
      {
        name: 'generate-blueprint',
        description:
          'Generate a UI blueprint from natural language description.\n\n' +
          'WHEN TO CALL:\n' +
          '- For rapid prototyping and design exploration\n' +
          '- When user wants a quick visual structure without full Screen Definition\n' +
          '- As an alternative lightweight workflow to get-screen-generation-context\n\n' +
          'NOTE: For production-ready code, use the main workflow:\n' +
          'get-screen-generation-context → validate-screen-definition → write code directly\n\n' +
          'RETURNS: Simplified blueprint object with layout structure and component suggestions',
        inputSchema: {
          type: 'object',
          properties: {
            description: {
              type: 'string',
              description: 'Natural language description of the screen (10-500 characters)',
              minLength: 10,
              maxLength: 500,
            },
            layout: {
              type: 'string',
              description: 'Layout type for the screen',
              enum: [
                'single-column',
                'two-column',
                'sidebar-left',
                'sidebar-right',
                'dashboard',
                'landing',
              ],
            },
            themeId: {
              type: 'string',
              description: 'Theme ID (lowercase alphanumeric with hyphens)',
              pattern: '^[a-z0-9-]+$',
            },
            componentHints: {
              type: 'array',
              description: 'Optional component type hints',
              items: { type: 'string' },
            },
            iconLibrary: {
              type: 'string',
              description: 'Icon library ID (e.g., lucide, heroicons, feather)',
              pattern: '^[a-z0-9-]+$',
            },
          },
          required: ['description', 'layout', 'themeId'],
        },
      },
      {
        name: 'list-icon-libraries',
        description:
          'List all icon libraries accessible to the current hosted catalog.\n\n' +
          'WHEN TO CALL:\n' +
          '- When user asks which icon libraries are available\n' +
          '- Before calling preview-icon-library to select a library\n' +
          '- When deciding which iconLibrary parameter to use in generate-blueprint\n\n' +
          'RETURNS: Array of icon library IDs (e.g., lucide, heroicons, feather) with metadata',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
      {
        name: 'preview-icon-library',
        description:
          'Preview an icon library and retrieve its configuration including package names and icon samples.\n\n' +
          'WHEN TO CALL:\n' +
          '- After list-icon-libraries to inspect a specific library\n' +
          '- When user wants to know available icons in a library\n' +
          '- To get the NPM package name for an icon library\n' +
          '- Before using icons in a Screen Definition\n\n' +
          'RETURNS: Library configuration, package name, icon samples, and usage instructions',
        inputSchema: {
          type: 'object',
          properties: {
            libraryId: {
              type: 'string',
              description: 'Icon library ID to preview (e.g., lucide, heroicons, feather)',
              pattern: '^[a-z0-9-]+$',
            },
          },
          required: ['libraryId'],
        },
      },
      {
        name: 'list-themes',
        description:
          'List the themes accessible to the current authenticated session.\n\n' +
          'WHEN TO CALL:\n' +
          '- When user asks which themes are available\n' +
          '- Before calling preview-theme to select a theme\n' +
          '- When deciding which themeId parameter to use in generate-blueprint or get-screen-generation-context\n' +
          '- Works directly after authentication; no prior whoami call is required\n\n' +
          'RETURNS: Array of theme IDs with names and descriptions',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
      {
        name: 'preview-theme',
        description:
          'Preview a theme and retrieve its full v2.1 theme data including design tokens.\n\n' +
          'WHEN TO CALL:\n' +
          '- After list-themes to inspect a specific theme\n' +
          '- When user wants to see color palettes, typography, or spacing tokens\n' +
          '- To understand theme structure before using in generate-blueprint or get-screen-generation-context\n' +
          '- When user asks about theme customization options\n' +
          '- When includeCSS=true, also returns pre-generated CSS variables via themeToCSS()\n' +
          '- Works directly after authentication; no prior whoami call is required\n\n' +
          'RETURNS: Complete theme data including colors, typography, spacing, and component tokens. ' +
          'Optionally includes CSS variables string when includeCSS is true.',
        inputSchema: {
          type: 'object',
          properties: {
            themeId: {
              type: 'string',
              description: 'Theme ID to preview (lowercase alphanumeric with hyphens)',
              pattern: '^[a-z0-9-]+$',
            },
            includeCSS: {
              type: 'boolean',
              description:
                'When true, includes pre-generated CSS variables string in the response. ' +
                'Uses themeToCSS() from @framingui/ui to convert theme tokens to CSS custom properties. ' +
                'Default: false',
            },
          },
          required: ['themeId'],
        },
      },
      {
        name: 'export-screen',
        description:
          'Export a blueprint to JSX, TSX, or Vue code.\n\n' +
          'WHEN TO CALL:\n' +
          '- After generate-blueprint to convert blueprint to code\n' +
          '- When user wants code in JSX/TSX/Vue format\n' +
          '- For lightweight prototyping without full Screen Definition workflow\n\n' +
          'NOTE: For production-ready code with full validation, use:\n' +
          'get-screen-generation-context → validate-screen-definition → write code directly\n\n' +
          'RETURNS: Exported code in requested format',
        inputSchema: {
          type: 'object',
          properties: {
            blueprint: {
              type: 'object',
              description: 'Blueprint object to export',
            },
            format: {
              type: 'string',
              description: 'Export format',
              enum: ['jsx', 'tsx', 'vue'],
            },
          },
          required: ['blueprint', 'format'],
        },
      },
      {
        name: 'validate_screen',
        description:
          'Validate JSON screen definition with helpful feedback.\n\n' +
          'WHEN TO CALL:\n' +
          '- To validate a screen definition structure\n' +
          '- Before writing React code based on this definition\n\n' +
          'NOTE: For the recommended workflow, use validate-screen-definition (Step 2/3) instead,\n' +
          'which provides more detailed validation, suggestions, and improvement recommendations.\n\n' +
          'RETURNS: Validation result with errors and warnings',
        inputSchema: {
          type: 'object',
          properties: {
            screenDefinition: {
              type: 'object',
              description: 'JSON screen definition to validate',
            },
            strictMode: {
              type: 'boolean',
              description: 'Enable strict validation (default: false)',
            },
          },
          required: ['screenDefinition'],
        },
      },
      {
        name: 'list_tokens',
        description:
          'List available layout tokens from SPEC-LAYOUT-001.\n\n' +
          'WHEN TO CALL:\n' +
          '- When user asks about available shell, page, or section tokens\n' +
          '- Before creating a Screen Definition to see valid token options\n' +
          '- When validation errors mention unknown tokens\n' +
          '- To explore layout options for different screen types\n\n' +
          'RETURNS: Array of layout tokens with descriptions and usage contexts',
        inputSchema: {
          type: 'object',
          properties: {
            tokenType: {
              type: 'string',
              description: 'Filter by token type',
              enum: ['shell', 'page', 'section', 'all'],
            },
            filter: {
              type: 'string',
              description: 'Optional pattern filter (case-insensitive substring match)',
            },
          },
        },
      },
      {
        name: 'list-components',
        description:
          'List all available UI components from @framingui/ui with metadata.\n\n' +
          'WHEN TO CALL:\n' +
          '- When user asks which components are available\n' +
          '- Before calling preview-component to select a component\n' +
          '- To discover components for a specific category (core, complex, advanced)\n' +
          '- When planning a Screen Definition structure\n\n' +
          'RETURNS: Array of component IDs with categories, descriptions, and metadata',
        inputSchema: {
          type: 'object',
          properties: {
            category: {
              type: 'string',
              description: 'Filter by component category',
              enum: ['core', 'complex', 'advanced', 'all'],
            },
            search: {
              type: 'string',
              description: 'Search components by keyword',
            },
          },
        },
      },
      {
        name: 'preview-component',
        description:
          'Preview a component with detailed props, variants, and usage examples.\n\n' +
          'WHEN TO CALL:\n' +
          '- After list-components to inspect a specific component\n' +
          '- When user wants to know component props, variants, or usage\n' +
          '- Before using a component in a Screen Definition\n' +
          '- To understand component dependencies and requirements\n\n' +
          'RETURNS: Component details including props, variants, usage examples, and dependencies',
        inputSchema: {
          type: 'object',
          properties: {
            componentId: {
              type: 'string',
              description: 'Component ID to preview (e.g., button, card, dialog)',
              pattern: '^[a-z-]+$',
            },
            includeExamples: {
              type: 'boolean',
              description: 'Include usage examples (default: true)',
            },
            includeDependencies: {
              type: 'boolean',
              description: 'Include dependency information (default: true)',
            },
          },
          required: ['componentId'],
        },
      },
      {
        name: 'list-screen-templates',
        description:
          'List all available screen templates from Template Registry.\n\n' +
          'WHEN TO CALL:\n' +
          '- When user asks about available screen templates\n' +
          '- Before calling preview-screen-template to select a template\n' +
          '- To discover templates for specific categories (auth, dashboard, form, marketing, feedback)\n' +
          '- When user wants to start from a template instead of building from scratch\n\n' +
          'RETURNS: Array of template IDs with categories, descriptions, and preview information',
        inputSchema: {
          type: 'object',
          properties: {
            category: {
              type: 'string',
              description: 'Filter by template category',
              enum: ['auth', 'dashboard', 'form', 'marketing', 'feedback', 'all'],
            },
            search: {
              type: 'string',
              description: 'Search templates by keyword',
            },
          },
        },
      },
      {
        name: 'preview-screen-template',
        description:
          'Preview a screen template with skeleton, layout, and customization boundaries.\n\n' +
          'WHEN TO CALL:\n' +
          '- After list-screen-templates to inspect a specific template\n' +
          '- When user wants to see template structure and customization options\n' +
          '- Before using a template as base for a Screen Definition\n' +
          '- To understand template layout tokens and component structure\n\n' +
          'RETURNS: Template details including skeleton, layout tokens, customization boundaries, and usage guide',
        inputSchema: {
          type: 'object',
          properties: {
            templateId: {
              type: 'string',
              description: 'Template ID to preview (format: category.name, e.g., auth.login)',
              pattern: '^[a-z]+\\.[a-z-]+$',
            },
            includeLayoutTokens: {
              type: 'boolean',
              description: 'Include responsive layout tokens (default: true)',
            },
          },
          required: ['templateId'],
        },
      },
      {
        name: 'get-screen-generation-context',
        description:
          '[WORKFLOW STEP 1/3] Get complete context for AI agents to generate screen definitions from natural language.\n\n' +
          'THIS IS THE FIRST STEP in the screen generation workflow:\n' +
          "1. Call THIS TOOL with user's description (Step 1/3)\n" +
          '2. Write Screen Definition JSON, then validate with validate-screen-definition (Step 2/3)\n' +
          '3. Call validate-environment if path known (Step 3/3)\n\n' +
          'IMPORTANT: After validation passes, the AI agent writes React code DIRECTLY\n' +
          'using the components and props provided in the context response.\n\n' +
          'WHEN TO CALL:\n' +
          '- When user requests a new screen/page/component\n' +
          '- Before attempting to generate a Screen Definition JSON\n' +
          '- When you need to know available components, templates, or layout tokens\n\n' +
          'RETURNS:\n' +
          '- Template matches based on description\n' +
          '- Available components with usage examples\n' +
          '- JSON schema for Screen Definition\n' +
          '- Example definitions for reference\n' +
          '- Theme recipes and contextual hints',
        inputSchema: {
          type: 'object',
          properties: {
            description: {
              type: 'string',
              description:
                'Natural language description of the screen to generate (5-1000 characters)',
              minLength: 5,
              maxLength: 1000,
            },
            themeId: {
              type: 'string',
              description: 'Optional theme ID for recipe information',
              pattern: '^[a-z0-9-]+$',
            },
            includeExamples: {
              type: 'boolean',
              description: 'Include example screen definitions (default: true)',
            },
          },
          required: ['description'],
        },
      },
      {
        name: 'validate-screen-definition',
        description:
          '[WORKFLOW STEP 2/3] Validate a screen definition JSON with detailed error messages, suggestions, auto-fix patches, and improvement recommendations.\n\n' +
          'WHEN TO CALL:\n' +
          '- After creating a Screen Definition JSON (from Step 1 context)\n' +
          '- Before writing React code\n' +
          '- When user reports validation errors in generated code\n' +
          '- To get improvement suggestions for an existing definition\n\n' +
          'RETURNS:\n' +
          '- valid: boolean indicating if definition is valid\n' +
          '- errors: Array of validation errors with suggestions and autoFix patches\n' +
          '- warnings: Array of potential issues\n' +
          '- suggestions: Improvement recommendations with autoFix patches\n' +
          '- autoFixPatches: Aggregated JSON Patch operations to fix all issues\n\n' +
          'NEXT STEP:\n' +
          '- If valid: true, write React code directly using components from Step 1 context\n' +
          '- If valid: false, apply autoFixPatches or manually fix errors and re-validate',
        inputSchema: {
          type: 'object',
          properties: {
            definition: {
              type: 'object',
              description: 'Screen definition object to validate',
            },
            strict: {
              type: 'boolean',
              description:
                'Enable strict validation (default: true). In strict mode, unknown tokens/components are errors; otherwise they are warnings.',
            },
          },
          required: ['definition'],
        },
      },
      {
        name: 'generate_screen',
        description:
          '[WORKFLOW STEP 3/4] Generate production-ready React code with theme applied from validated Screen Definition.\n\n' +
          'REQUIRED WORKFLOW:\n' +
          '1. Call get-screen-generation-context (Step 1/4)\n' +
          '2. Call validate-screen-definition (Step 2/4)\n' +
          '3. Call THIS TOOL (Step 3/4) - Theme engine applies styling\n' +
          '4. Call validate-environment if path known (Step 4/4)\n\n' +
          'WHY THIS TOOL IS ESSENTIAL:\n' +
          '- Applies theme recipes to components (minimal-workspace, classic-magazine, etc.)\n' +
          '- Converts Screen Definition → Production-ready code with correct Tailwind classes\n' +
          '- Without this tool, theme styling will not be applied!\n\n' +
          'AFTER RECEIVING RESPONSE:\n' +
          '- ALWAYS check the "dependencies" field in the response\n' +
          '- If dependencies.external is non-empty:\n' +
          '  * User provided package.json path? → Call validate-environment (Step 4/4)\n' +
          '  * Path unknown? → Show dependencies.installCommands to user\n' +
          '- Display the list of required packages to user before delivering code\n' +
          '- validate-environment also checks Tailwind CSS config\n\n' +
          'CRITICAL:\n' +
          '- This workflow prevents "Module not found" errors at runtime\n' +
          '- Tailwind validation prevents invisible/unstyled @framingui/ui components\n' +
          '- Never deliver code without informing user about dependencies',
        inputSchema: {
          type: 'object',
          properties: {
            screenDefinition: {
              type: 'object',
              description: 'JSON screen definition with id, shell, page, sections',
            },
            outputFormat: {
              type: 'string',
              description: 'Code output format',
              enum: ['css-in-js', 'tailwind', 'react'],
            },
            options: {
              type: 'object',
              description: 'Optional generation options',
              properties: {
                cssFramework: {
                  type: 'string',
                  enum: ['styled-components', 'emotion'],
                },
                typescript: { type: 'boolean' },
                prettier: { type: 'boolean' },
              },
            },
          },
          required: ['screenDefinition', 'outputFormat'],
        },
      },
      {
        name: 'validate-environment',
        description:
          '[WORKFLOW STEP 3/3 - Optional] Validate user environment: NPM packages + Tailwind CSS configuration for @framingui/ui.\n\n' +
          'WHEN TO CALL:\n' +
          '- After writing React code, to verify required packages are installed\n' +
          '- When user wants to check if their project has required packages\n' +
          '- Before running generated code to ensure all dependencies are available\n' +
          '- To verify Tailwind CSS is configured correctly for @framingui/ui components\n\n' +
          'RETURNS:\n' +
          '- installed: Packages already in package.json with versions\n' +
          '- missing: Packages that need to be installed\n' +
          '- installCommands: Ready-to-use install commands for npm/yarn/pnpm/bun\n' +
          '- tailwind: Tailwind CSS config validation (content paths, animate plugin)\n\n' +
          'TAILWIND VALIDATION (checkTailwind=true by default):\n' +
          '- Checks if tailwind.config.{ts,js,mjs,cjs} exists\n' +
          '- Verifies @framingui/ui content paths are included (prevents missing styles)\n' +
          '- Verifies tailwindcss-animate plugin is configured (required for Dialog, Popover animations)\n' +
          '- Returns actionable issues[] and fixes[] for each problem found\n\n' +
          'EXAMPLE WORKFLOW:\n' +
          '1. get-screen-generation-context → get component info and context\n' +
          '2. validate-screen-definition → validate Screen Definition JSON\n' +
          '3. Write React code using components from context\n' +
          '4. Call THIS TOOL with projectPath + requiredPackages\n' +
          '5. Show user missing packages, install commands, AND any Tailwind config issues',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: {
              type: 'string',
              description: 'Path to package.json or project root directory',
            },
            requiredPackages: {
              type: 'array',
              description:
                'Array of package names to validate (e.g., ["framer-motion", "@radix-ui/react-slot"])',
              items: { type: 'string' },
            },
            checkTailwind: {
              type: 'boolean',
              description:
                'Also validate Tailwind CSS configuration for @framingui/ui compatibility (default: true)',
            },
          },
          required: ['projectPath', 'requiredPackages'],
        },
      },
    ],
  };
});

// ============================================================================
// Task #10: CallToolRequestSchema Handler
// ============================================================================

server.setRequestHandler(CallToolRequestSchema, async request => {
  const { name, arguments: args } = request.params;

  info(`CallTool request: ${name}`);

  // 모든 도구 호출 전에 인증 가드 실행
  try {
    requireAuth();
  } catch (e) {
    if (e instanceof AuthRequiredError) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: false,
              code: 'AUTH_REQUIRED',
              error: 'Authentication required to use FramingUI MCP tools.',
              nextAction:
                'Run `framingui-mcp login` or set FRAMINGUI_API_KEY, then retry the same tool call.',
              signupUrl:
                'https://framingui.com/auth/signup?utm_source=mcp&utm_medium=cli&utm_campaign=auth_prompt',
              retryable: true,
            }),
          },
        ],
        isError: true,
      };
    }
    // 예상치 못한 예외는 로깅 후 에러 반환 (silent swallow 방지)
    logError(`Unexpected error in requireAuth: ${e}`);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: false,
            code: 'AUTH_CHECK_FAILED',
            error: 'Authentication check failed unexpectedly.',
            detail: e instanceof Error ? e.message : String(e),
            retryable: true,
          }),
        },
      ],
      isError: true,
    };
  }

  try {
    switch (name) {
      case 'whoami': {
        WhoamiInputSchema.parse(args);
        const result = await whoamiTool();

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'generate-blueprint': {
        // Validate input
        const validatedInput = GenerateBlueprintInputSchema.parse(args);
        const result = await generateBlueprintTool(validatedInput);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'list-icon-libraries': {
        // Validate input (no required fields)
        ListIconLibrariesInputSchema.parse(args);
        const result = await listIconLibrariesTool();

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'preview-icon-library': {
        // Validate input
        const validatedInput = PreviewIconLibraryInputSchema.parse(args);
        const result = await previewIconLibraryTool(validatedInput);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'list-themes': {
        // Validate input (no required fields)
        ListThemesInputSchema.parse(args);
        const result = await listThemesTool();

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'preview-theme': {
        // Validate input
        const validatedInput = PreviewThemeInputSchema.parse(args);
        const result = await previewThemeTool(validatedInput);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'export-screen': {
        // Validate input
        const validatedInput = ExportScreenInputSchema.parse(args);
        const result = await exportScreenTool(validatedInput);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'validate_screen': {
        // Validate input
        const validatedInput = ValidateScreenInputSchema.parse(args);
        const result = await validateScreenTool(validatedInput);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'list_tokens': {
        // Validate input
        const validatedInput = ListTokensInputSchema.parse(args);
        const result = await listTokensTool(validatedInput);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'list-components': {
        // Validate input
        const validatedInput = ListComponentsInputSchema.parse(args);
        const result = await listComponentsTool(validatedInput);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'preview-component': {
        // Validate input
        const validatedInput = PreviewComponentInputSchema.parse(args);
        const result = await previewComponentTool(validatedInput);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'list-screen-templates': {
        // Validate input
        const validatedInput = ListScreenTemplatesInputSchema.parse(args);
        const result = await listScreenTemplatesTool(validatedInput);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'preview-screen-template': {
        // Validate input
        const validatedInput = PreviewScreenTemplateInputSchema.parse(args);
        const result = await previewScreenTemplateTool(validatedInput);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get-screen-generation-context': {
        // Validate input
        const validatedInput = GetScreenGenerationContextInputSchema.parse(args);
        const result = await getScreenGenerationContextTool(validatedInput);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'validate-screen-definition': {
        // Validate input
        const validatedInput = ValidateScreenDefinitionInputSchema.parse(args);
        const result = await validateScreenDefinitionTool(validatedInput);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'generate_screen': {
        // Validate input
        const validatedInput = GenerateScreenInputSchema.parse(args);
        const result = await generateScreenTool(validatedInput);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'validate-environment': {
        // Validate input
        const validatedInput = ValidateEnvironmentInputSchema.parse(args);
        const result = await validateEnvironmentTool(validatedInput);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    logError(`Tool execution error: ${error}`);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              success: false,
              error: error instanceof Error ? error.message : String(error),
            },
            null,
            2
          ),
        },
      ],
      isError: true,
    };
  }
});

// ============================================================================
// Server Initialization
// ============================================================================

info(`Starting Framingui MCP Server v${serverVersion}...`);

// ============================================================================
// Authentication: Credential Chain
// 1. 환경변수 FRAMINGUI_API_KEY
// 2. ~/.framingui/credentials.json (CLI login 방식)
// 3. 둘 다 없으면: 인증 없이 시작 (도구 호출 시 에러)
// ============================================================================

// 크레덴셜 체인으로 API Key 결정
let apiKey = process.env.FRAMINGUI_API_KEY;
let apiKeySource = 'FRAMINGUI_API_KEY env';

if (!apiKey) {
  const creds = loadCredentials();
  if (creds) {
    apiKey = creds.api_key;
    apiKeySource = '~/.framingui/credentials.json';
    // 크레덴셜 파일의 API URL도 적용
    if (creds.api_url && !process.env.FRAMINGUI_API_URL) {
      process.env.FRAMINGUI_API_URL = creds.api_url;
    }
  }
}

if (apiKey) {
  info(`API key detected from ${apiKeySource}, verifying...`);

  try {
    const authResult = await verifyApiKey(apiKey);

    if (authResult.valid) {
      setAuthData(authResult);
      setRawApiKey(apiKey);
      info(
        `Authentication successful - User: ${authResult.user?.email || 'unknown'}, Plan: ${authResult.user?.plan || 'unknown'}`
      );

      const licensedCount = authResult.themes?.licensed?.length || 0;
      info(`Theme access: ${licensedCount} licensed themes`);
    } else {
      logError(`Authentication failed: ${authResult.error || 'Unknown error'}`);
      logError('All tool calls will require re-authentication.');
      setAuthData(null);
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    logError(`Failed to verify API key: ${errorMessage}`);
    logError('All tool calls will require re-authentication.');
    setAuthData(null);
  }
} else {
  info('No API key found. Run `framingui-mcp login` or set FRAMINGUI_API_KEY to authenticate.');
  setAuthData(null);
}

// ============================================================================
// Connect Server
// ============================================================================

// Connect via stdio
try {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  info('Framingui MCP Server connected via stdio transport');
} catch (err) {
  const errorMessage = err instanceof Error ? err.message : String(err);
  logError(`Failed to connect to stdio transport: ${errorMessage}`);
  process.exit(1);
}

info(
  '17 MCP tools registered: whoami, generate-blueprint, list-themes, preview-theme, list-icon-libraries, preview-icon-library, export-screen, validate_screen, list_tokens, list-components, preview-component, list-screen-templates, preview-screen-template, get-screen-generation-context, validate-screen-definition, generate_screen, validate-environment'
);
