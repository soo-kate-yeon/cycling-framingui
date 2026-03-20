/**
 * MCP Tool Input/Output Schemas with Zod validation
 * SPEC-MCP-002: U-002 Input Schema Validation
 */

import { z } from 'zod';

// ============================================================================
// Whoami Tool Schemas
// ============================================================================

/**
 * Whoami Input Schema
 * 입력 파라미터 없음
 */
export const WhoamiInputSchema = z.object({});

export type WhoamiInput = z.infer<typeof WhoamiInputSchema>;

/**
 * Whoami Output Schema
 * 유저 tier, 라이선스 정보, MCP 지원 기간 반환
 */
export const WhoamiOutputSchema = z.object({
  success: z.boolean(),
  plan: z.enum(['free', 'pro', 'enterprise', 'master']).optional(),
  isMaster: z.boolean().optional(),
  licensedThemes: z.array(z.string()).optional(),
  totalThemes: z.number().optional(),
  mcpSupport: z
    .object({
      expiresAt: z.string().nullable(),
      renewable: z.boolean(),
    })
    .optional(),
  // Transition access fields
  has_transition_access: z.boolean().optional(),
  access_expires_at: z.string().nullable().optional(),
  access_days_left: z.number().nullable().optional(),
  // Legacy trial aliases kept for compatibility
  is_trial: z.boolean().optional(),
  trial_expires_at: z.string().nullable().optional(),
  trial_days_left: z.number().nullable().optional(),
  quota: z
    .object({
      enabled: z.boolean(),
      billingPhase: z.literal('shadow'),
      unitModel: z.literal('weighted_tool_units'),
      monthlyIncludedUnits: z.number().nullable(),
      usedUnits: z.number(),
      remainingUnits: z.number().nullable(),
      usagePercent: z.number().nullable(),
      warningThresholds: z.array(z.number()),
      warningsTriggered: z.array(z.number()),
      currentPeriodStart: z.string(),
      currentPeriodEnd: z.string(),
    })
    .optional(),
  paid_quota_entitlement: z
    .object({
      planId: z.string(),
      status: z.string(),
      includedUnits: z.number(),
      currentPeriodStart: z.string().nullable(),
      currentPeriodEnd: z.string().nullable(),
      totalAllocatedUnits: z.number(),
      topUpAllocatedUnits: z.number(),
    })
    .nullable()
    .optional(),
  message: z.string().optional(),
  error: z.string().optional(),
});

export type WhoamiOutput = z.infer<typeof WhoamiOutputSchema>;

// ============================================================================
// Generate Blueprint Tool Schemas
// ============================================================================

/**
 * Layout types from @framingui/core LAYOUTS
 */
export const LayoutTypeSchema = z.enum([
  'single-column',
  'two-column',
  'sidebar-left',
  'sidebar-right',
  'dashboard',
  'landing',
]);

/**
 * ComponentNode schema - recursive structure from @framingui/core
 */
const ComponentNodeSchema: z.ZodType<{
  type: string;
  props?: Record<string, unknown>;
  children?: (unknown | string)[];
  slot?: string;
}> = z.lazy(() =>
  z.object({
    type: z.string(),
    props: z.record(z.string(), z.unknown()).optional(),
    children: z.array(z.union([ComponentNodeSchema, z.string()])).optional(),
    slot: z.string().optional(),
  })
);

/**
 * Theme ID validation - alphanumeric with hyphens only (security: prevent path traversal)
 * SPEC: UW-002 No Theme ID Injection
 */
export const ThemeIdSchema = z
  .string()
  .regex(/^[a-z0-9-]+$/, 'Theme ID must contain only lowercase letters, numbers, and hyphens');

/**
 * Generate Blueprint Input Schema
 * SPEC: E-001 Blueprint Generation Request
 * SPEC-ICON-001: Added iconLibrary parameter
 */
export const GenerateBlueprintInputSchema = z.object({
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must not exceed 500 characters'),
  layout: LayoutTypeSchema,
  themeId: ThemeIdSchema,
  iconLibrary: z
    .string()
    .regex(
      /^[a-z0-9-]+$/,
      'Icon library ID must contain only lowercase letters, numbers, and hyphens'
    )
    .optional(),
  componentHints: z.array(z.string()).optional(),
});

export type GenerateBlueprintInput = z.infer<typeof GenerateBlueprintInputSchema>;

/**
 * Template Recommendation Schema
 * SPEC-MCP-004 Phase 3: Blueprint Generator Enhancement
 */
export const TemplateRecommendationSchema = z.object({
  templateId: z.string(),
  templateName: z.string(),
  category: z.string(),
  confidence: z.number(), // 0-100
  matchedKeywords: z.array(z.string()),
  layoutRecommendation: z.object({
    shell: z.string(),
    page: z.string(),
    description: z.string(),
  }),
});

export type TemplateRecommendation = z.infer<typeof TemplateRecommendationSchema>;

/**
 * Generate Blueprint Output Schema (MCP JSON-RPC format - no previewUrl)
 * SPEC-ICON-001: Added iconLibrary field
 * SPEC-MCP-004: Added templateRecommendations field
 */
export const GenerateBlueprintOutputSchema = z.object({
  success: z.boolean(),
  blueprint: z.optional(
    z.object({
      id: z.string(),
      name: z.string(),
      themeId: z.string(),
      iconLibrary: z.string(), // SPEC-ICON-001: Icon library used
      layout: LayoutTypeSchema,
      components: z.array(ComponentNodeSchema), // ComponentNode[] from @framingui/core
      timestamp: z.number(),
    })
  ),
  // SPEC-MCP-004 Phase 3: Template recommendations based on description analysis
  templateRecommendations: z.array(TemplateRecommendationSchema).optional(),
  error: z.string().optional(),
});

export type GenerateBlueprintOutput = z.infer<typeof GenerateBlueprintOutputSchema>;

// ============================================================================
// List Themes Tool Schemas (v2.1)
// ============================================================================

/**
 * List Themes Input Schema
 * No input required - lists all available themes
 */
export const ListThemesInputSchema = z.object({});

export type ListThemesInput = z.infer<typeof ListThemesInputSchema>;

/**
 * Theme metadata schema for v2.1 themes
 */
export const ThemeMetaSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  brandTone: z.string(),
  schemaVersion: z.string(),
});

export type ThemeMeta = z.infer<typeof ThemeMetaSchema>;

/**
 * List Themes Output Schema
 */
export const ListThemesOutputSchema = z.object({
  success: z.boolean(),
  themes: z.array(ThemeMetaSchema).optional(),
  count: z.number().optional(),
  error: z.string().optional(),
});

export type ListThemesOutput = z.infer<typeof ListThemesOutputSchema>;

// ============================================================================
// Preview Theme Tool Schemas (v2.1 Updated)
// ============================================================================

/**
 * Preview Theme Input Schema
 * SPEC: E-002 Theme Preview Request
 */
export const PreviewThemeInputSchema = z.object({
  themeId: ThemeIdSchema,
  includeCSS: z.boolean().optional().default(false),
});

export type PreviewThemeInput = z.infer<typeof PreviewThemeInputSchema>;

/**
 * Preview Theme Output Schema (v2.1 - includes full theme data)
 */
export const PreviewThemeOutputSchema = z.object({
  success: z.boolean(),
  theme: z.optional(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string().optional(),
      brandTone: z.string(),
      schemaVersion: z.string(),
      designDNA: z
        .object({
          moodKeywords: z.array(z.string()),
          targetEmotion: z.string(),
          visualAtmosphere: z.string(),
        })
        .optional(),
      tokens: z.object({
        atomic: z.unknown(),
        semantic: z.unknown(),
        component: z.unknown().optional(),
        recipes: z.unknown().optional(),
      }),
      stateLayer: z.unknown().optional(),
      motion: z.unknown().optional(),
      elevation: z.unknown().optional(),
      typography: z.unknown().optional(),
    })
  ),
  css: z.string().optional(),
  error: z.string().optional(),
});

export type PreviewThemeOutput = z.infer<typeof PreviewThemeOutputSchema>;

// ============================================================================
// Export Screen Tool Schemas
// ============================================================================

/**
 * Export format types
 * SPEC: S-004 Export Format Compatibility
 */
export const ExportFormatSchema = z.enum(['jsx', 'tsx', 'vue']);

export type ExportFormat = z.infer<typeof ExportFormatSchema>;

/**
 * Export Screen Input Schema (MCP JSON-RPC format - accepts blueprint object)
 * SPEC: E-003 Screen Export Request
 */
export const ExportScreenInputSchema = z.object({
  blueprint: z.unknown(), // Blueprint from @framingui/core (accept any object for flexibility)
  format: ExportFormatSchema,
});

export type ExportScreenInput = z.infer<typeof ExportScreenInputSchema>;

/**
 * Export Screen Output Schema (MCP JSON-RPC format - no filePath)
 */
export const ExportScreenOutputSchema = z.object({
  success: z.boolean(),
  code: z.string().optional(),
  error: z.string().optional(),
});

// ============================================================================
// Hybrid Export Tool Schemas (SPEC-COMPONENT-001-D)
// ============================================================================

/**
 * Export component resolution tier
 * - tier1: Copy from @framingui/ui (fast, deterministic)
 * - tier2: Generate with LLM (flexible, customizable)
 * - auto: Automatically choose based on component availability
 */
export const ExportTierSchema = z.enum(['tier1', 'tier2', 'auto']);

export type ExportTier = z.infer<typeof ExportTierSchema>;

/**
 * Hybrid Export Input Schema
 * SPEC-COMPONENT-001-D: Hybrid Export System
 */
export const HybridExportInputSchema = z.object({
  /** Blueprint or component name */
  blueprint: z.unknown().optional(),
  /** Single component name for direct export */
  componentName: z.string().optional(),
  /** Component description (for Tier 2 LLM generation) */
  componentDescription: z.string().optional(),
  /** Output format */
  format: ExportFormatSchema,
  /** Include CSS Variables */
  includeCSS: z.boolean().optional().default(false),
  /** Resolution tier preference */
  tier: ExportTierSchema.optional().default('auto'),
  /** Theme ID for CSS generation */
  themeId: ThemeIdSchema.optional(),
});

// z.input을 사용하여 optional 필드가 실제로 optional로 인식되도록 함
export type HybridExportInput = z.input<typeof HybridExportInputSchema>;

/**
 * Component resolution result
 */
export const ComponentResolutionSchema = z.object({
  componentName: z.string(),
  code: z.string(),
  source: z.enum(['tier1-ui', 'tier1-example', 'tier2-llm', 'tier2-mock']),
});

export type ComponentResolution = z.infer<typeof ComponentResolutionSchema>;

/**
 * Hybrid Export Output Schema
 * SPEC-COMPONENT-001-D: Hybrid Export System
 */
export const HybridExportOutputSchema = z.object({
  success: z.boolean(),
  /** Screen/component code */
  code: z.string().optional(),
  /** CSS Variables (if includeCSS was true) */
  css: z.string().optional(),
  /** Component resolution details */
  components: z.array(ComponentResolutionSchema).optional(),
  /** Tier used for resolution */
  tierUsed: ExportTierSchema.optional(),
  error: z.string().optional(),
});

export type HybridExportOutput = z.infer<typeof HybridExportOutputSchema>;

export type ExportScreenOutput = z.infer<typeof ExportScreenOutputSchema>;

// ============================================================================
// Common Error Response Schema
// ============================================================================

/**
 * Standardized error response format
 * SPEC: U-004 Error Response Consistency
 */
export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

// ============================================================================
// Dependencies Schema (used by dependency-extractor)
// ============================================================================

/**
 * Dependencies structure for generated code
 * SPEC-MCP-005: Automatic dependency extraction and environment validation
 */
export const DependenciesSchema = z.object({
  external: z.array(z.string()).describe('External NPM packages required by generated code'),
  internal: z.array(z.string()).describe('Internal @framingui packages'),
  installCommands: z.object({
    npm: z.string(),
    yarn: z.string(),
    pnpm: z.string(),
    bun: z.string(),
  }),
  compatibility: z
    .object({
      react: z.string().optional(),
      node: z.string().optional(),
    })
    .optional(),
  notes: z.array(z.string()).optional(),
});

export type Dependencies = z.infer<typeof DependenciesSchema>;

/**
 * Generate Screen Output Schema
 */
export const GenerateScreenOutputSchema = z.object({
  success: z.boolean(),
  code: z.string().optional(),
  cssVariables: z.string().optional(),
  dependencies: DependenciesSchema.optional(),
  errors: z.array(z.string()).optional(),
  error: z.string().optional(),
});

export type GenerateScreenOutput = z.infer<typeof GenerateScreenOutputSchema>;

// ============================================================================
// Validate Screen Tool Schemas (SPEC-LAYOUT-002 Phase 4)
// ============================================================================

/**
 * Validate Screen Input Schema
 */
export const ValidateScreenInputSchema = z.object({
  screenDefinition: z.unknown(), // Accept any object for validation
  strictMode: z.boolean().optional().default(false),
});

export type ValidateScreenInput = z.infer<typeof ValidateScreenInputSchema>;

/**
 * Validation suggestion
 */
export const ValidationSuggestionSchema = z.object({
  field: z.string(),
  message: z.string(),
  suggestion: z.string().optional(),
});

export type ValidationSuggestion = z.infer<typeof ValidationSuggestionSchema>;

/**
 * Validate Screen Output Schema
 */
export const ValidateScreenOutputSchema = z.object({
  success: z.boolean(),
  valid: z.boolean().optional(),
  errors: z.array(z.string()).optional(),
  warnings: z.array(z.string()).optional(),
  suggestions: z.array(ValidationSuggestionSchema).optional(),
  error: z.string().optional(),
});

export type ValidateScreenOutput = z.infer<typeof ValidateScreenOutputSchema>;

// ============================================================================
// List Tokens Tool Schemas (SPEC-LAYOUT-002 Phase 4)
// ============================================================================

/**
 * Token type filter
 */
export const TokenTypeSchema = z.enum(['shell', 'page', 'section', 'all']);

export type TokenType = z.infer<typeof TokenTypeSchema>;

/**
 * List Tokens Input Schema
 */
export const ListTokensInputSchema = z.object({
  tokenType: TokenTypeSchema.optional().default('all'),
  filter: z.string().optional(),
});

export type ListTokensInput = z.infer<typeof ListTokensInputSchema>;

/**
 * Token metadata
 */
export const TokenMetadataSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  platform: z.string().optional(),
  purpose: z.string().optional(),
  type: z.string().optional(),
});

export type TokenMetadata = z.infer<typeof TokenMetadataSchema>;

/**
 * List Tokens Output Schema
 */
export const ListTokensOutputSchema = z.object({
  success: z.boolean(),
  shells: z.array(TokenMetadataSchema).optional(),
  pages: z.array(TokenMetadataSchema).optional(),
  sections: z.array(TokenMetadataSchema).optional(),
  metadata: z
    .object({
      total: z.number(),
      filtered: z.number().optional(),
    })
    .optional(),
  error: z.string().optional(),
});

export type ListTokensOutput = z.infer<typeof ListTokensOutputSchema>;

// ============================================================================
// Icon Library Tool Schemas (SPEC-ICON-001)
// ============================================================================

/**
 * Icon Library ID validation - alphanumeric with hyphens only
 * SPEC-ICON-001: UW-001 No Icon Library ID Injection
 */
export const IconLibraryIdSchema = z
  .string()
  .regex(
    /^[a-z0-9-]+$/,
    'Icon library ID must contain only lowercase letters, numbers, and hyphens'
  );

/**
 * List Icon Libraries Input Schema
 * No input required - lists all available icon libraries
 */
export const ListIconLibrariesInputSchema = z.object({});

export type ListIconLibrariesInput = z.infer<typeof ListIconLibrariesInputSchema>;

/**
 * Icon library metadata schema
 */
export const IconLibraryMetaSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  version: z.string(),
  license: z.string(),
  totalIcons: z.number(),
  categories: z.array(z.string()),
});

export type IconLibraryMeta = z.infer<typeof IconLibraryMetaSchema>;

/**
 * List Icon Libraries Output Schema
 */
export const ListIconLibrariesOutputSchema = z.object({
  success: z.boolean(),
  libraries: z.array(IconLibraryMetaSchema).optional(),
  count: z.number().optional(),
  error: z.string().optional(),
});

export type ListIconLibrariesOutput = z.infer<typeof ListIconLibrariesOutputSchema>;

/**
 * Preview Icon Library Input Schema
 */
export const PreviewIconLibraryInputSchema = z.object({
  libraryId: IconLibraryIdSchema,
});

export type PreviewIconLibraryInput = z.infer<typeof PreviewIconLibraryInputSchema>;

/**
 * Icon size mapping schema
 */
export const IconSizeMappingSchema = z.object({
  xs: z.number().optional(),
  sm: z.number(),
  md: z.number(),
  lg: z.number(),
  xl: z.number().optional(),
});

/**
 * Framework config schema
 */
export const IconFrameworkConfigSchema = z.object({
  packageName: z.string(),
  importStatement: z.string(),
  componentPattern: z.string(),
  variants: z.record(z.string()).optional(),
});

/**
 * Preview Icon Library Output Schema
 */
export const PreviewIconLibraryOutputSchema = z.object({
  success: z.boolean(),
  library: z.optional(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      version: z.string(),
      license: z.string(),
      website: z.string(),
      totalIcons: z.number(),
      categories: z.array(z.string()),
      sizeMapping: IconSizeMappingSchema,
      frameworks: z.object({
        react: IconFrameworkConfigSchema,
        vue: IconFrameworkConfigSchema,
      }),
      defaultVariant: z.string().optional(),
      iconSample: z.array(z.string()).optional(),
    })
  ),
  error: z.string().optional(),
});

export type PreviewIconLibraryOutput = z.infer<typeof PreviewIconLibraryOutputSchema>;

// ============================================================================
// Component Discovery Tool Schemas (SPEC-MCP-003)
// ============================================================================

/**
 * Component category types
 * SPEC-MCP-003: Component tier system
 */
export const ComponentCategorySchema = z.enum(['core', 'complex', 'advanced']);

export type ComponentCategory = z.infer<typeof ComponentCategorySchema>;

export const PlatformTargetSchema = z.enum(['web', 'react-native']);

export type PlatformTarget = z.infer<typeof PlatformTargetSchema>;

export const ProjectRuntimeSchema = z.enum(['web', 'expo', 'react-native']);

export type ProjectRuntime = z.infer<typeof ProjectRuntimeSchema>;

export const PackageManagerSchema = z.enum(['npm', 'pnpm', 'yarn', 'bun', 'unknown']);

export type PackageManager = z.infer<typeof PackageManagerSchema>;

export const ProjectEnvironmentSchema = z.object({
  platform: PlatformTargetSchema.optional(),
  runtime: ProjectRuntimeSchema,
  projectType: ProjectRuntimeSchema,
  packageManager: PackageManagerSchema.optional(),
});

export type ProjectEnvironment = z.infer<typeof ProjectEnvironmentSchema>;

export const ProjectContextRecommendationSchema = z.object({
  workflow: z.enum(['web-screen-definition', 'react-native-direct-write']),
  reason: z.string(),
});

export type ProjectContextRecommendation = z.infer<typeof ProjectContextRecommendationSchema>;

export const DetectProjectContextInputSchema = z.object({
  projectPath: z.string().describe('Path to package.json or project root'),
  setAsDefault: z
    .boolean()
    .optional()
    .default(true)
    .describe('Store the detected project context as the active session default'),
});

export type DetectProjectContextInput = z.infer<typeof DetectProjectContextInputSchema>;

export const DetectProjectContextOutputSchema = z.object({
  success: z.boolean(),
  projectPath: z.string().optional(),
  packageJsonPath: z.string().optional(),
  platform: PlatformTargetSchema.optional(),
  environment: ProjectEnvironmentSchema.optional(),
  recommendations: z.array(ProjectContextRecommendationSchema).optional(),
  sessionDefaultApplied: z.boolean().optional(),
  error: z.string().optional(),
});

export type DetectProjectContextOutput = z.infer<typeof DetectProjectContextOutputSchema>;

/**
 * List Components Input Schema
 * SPEC-MCP-003: [TAG-MCP003-006]
 */
export const ListComponentsInputSchema = z.object({
  category: z.enum(['core', 'complex', 'advanced', 'all']).optional().default('all'),
  search: z.string().optional(),
  platform: PlatformTargetSchema.optional(),
});

export type ListComponentsInput = z.infer<typeof ListComponentsInputSchema>;

/**
 * Component metadata schema
 */
export const ComponentMetaSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: ComponentCategorySchema,
  description: z.string(),
  variantsCount: z.number(),
  hasSubComponents: z.boolean(),
  tier: z.number(),
  platforms: z.array(PlatformTargetSchema).optional(),
  platformSupport: z
    .object({
      reactNative: z
        .object({
          supported: z.boolean(),
          recommended: z.boolean(),
          status: z.enum(['full', 'partial', 'avoid']),
        })
        .optional(),
    })
    .optional(),
});

export type ComponentMeta = z.infer<typeof ComponentMetaSchema>;

/**
 * List Components Output Schema
 */
export const ListComponentsOutputSchema = z.object({
  success: z.boolean(),
  components: z.array(ComponentMetaSchema).optional(),
  count: z.number().optional(),
  categories: z
    .object({
      core: z.number(),
      complex: z.number(),
      advanced: z.number(),
    })
    .optional(),
  error: z.string().optional(),
});

export type ListComponentsOutput = z.infer<typeof ListComponentsOutputSchema>;

/**
 * Preview Component Input Schema
 * SPEC-MCP-003: [TAG-MCP003-007]
 */
export const PreviewComponentInputSchema = z.object({
  componentId: z.string().regex(/^[a-z-]+$/, 'Component ID must be lowercase with hyphens'),
  includeExamples: z.boolean().optional(),
  includeDependencies: z.boolean().optional(),
  platform: PlatformTargetSchema.optional(),
});

export type PreviewComponentInput = z.infer<typeof PreviewComponentInputSchema>;

/**
 * Prop definition schema
 */
export const PropDefinitionSchema = z.object({
  name: z.string(),
  type: z.string(),
  required: z.boolean(),
  defaultValue: z.string().optional(),
  description: z.string().optional(),
});

export type PropDefinition = z.infer<typeof PropDefinitionSchema>;

/**
 * Variant schema
 */
export const VariantSchema = z.object({
  name: z.string(),
  value: z.string(),
  description: z.string().optional(),
});

export type Variant = z.infer<typeof VariantSchema>;

/**
 * Usage example schema
 */
export const UsageExampleSchema = z.object({
  title: z.string(),
  code: z.string(),
  description: z.string().optional(),
});

export type UsageExample = z.infer<typeof UsageExampleSchema>;

/**
 * Preview Component Output Schema
 */
export const PreviewComponentOutputSchema = z.object({
  success: z.boolean(),
  component: z
    .object({
      id: z.string(),
      name: z.string(),
      category: ComponentCategorySchema,
      description: z.string(),
      tier: z.number(),
      props: z.array(PropDefinitionSchema),
      variants: z.array(VariantSchema).optional(),
      subComponents: z.array(z.string()).optional(),
      importStatement: z.string(),
      dependencies: z
        .object({
          internal: z.array(z.string()),
          external: z.array(z.string()),
        })
        .optional(),
      examples: z.array(UsageExampleSchema).optional(),
      accessibility: z.string().optional(),
      platformSupport: z
        .object({
          target: PlatformTargetSchema,
          supported: z.boolean(),
          recommended: z.boolean(),
          status: z.enum(['full', 'partial', 'avoid']),
          notes: z.array(z.string()),
          recommendedImports: z.array(z.string()),
          recommendedPackages: z.array(z.string()),
        })
        .optional(),
    })
    .optional(),
  error: z.string().optional(),
});

export type PreviewComponentOutput = z.infer<typeof PreviewComponentOutputSchema>;

// ============================================================================
// Screen Template Discovery Tool Schemas (SPEC-MCP-003)
// ============================================================================

/**
 * Template category types
 */
export const TemplateCategorySchema = z.enum([
  'auth',
  'dashboard',
  'form',
  'marketing',
  'feedback',
]);

export type TemplateCategory = z.infer<typeof TemplateCategorySchema>;

/**
 * List Screen Templates Input Schema
 * SPEC-MCP-003: [TAG-MCP003-008]
 */
export const ListScreenTemplatesInputSchema = z.object({
  category: z
    .enum(['auth', 'dashboard', 'form', 'marketing', 'feedback', 'all'])
    .optional()
    .default('all'),
  search: z.string().optional(),
});

export type ListScreenTemplatesInput = z.infer<typeof ListScreenTemplatesInputSchema>;

/**
 * Template layout type schema
 */
export const TemplateLayoutTypeSchema = z.enum(['centered', 'sidebar', 'full']);

export type TemplateLayoutType = z.infer<typeof TemplateLayoutTypeSchema>;

/**
 * Template metadata schema
 */
export const TemplateMetaSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: TemplateCategorySchema,
  description: z.string(),
  requiredComponentsCount: z.number(),
  layoutType: TemplateLayoutTypeSchema,
  version: z.string(),
  tags: z.array(z.string()).optional(),
});

export type TemplateMeta = z.infer<typeof TemplateMetaSchema>;

/**
 * List Screen Templates Output Schema
 */
export const ListScreenTemplatesOutputSchema = z.object({
  success: z.boolean(),
  templates: z.array(TemplateMetaSchema).optional(),
  count: z.number().optional(),
  categories: z
    .object({
      auth: z.number(),
      dashboard: z.number(),
      form: z.number(),
      marketing: z.number(),
      feedback: z.number(),
    })
    .optional(),
  error: z.string().optional(),
});

export type ListScreenTemplatesOutput = z.infer<typeof ListScreenTemplatesOutputSchema>;

/**
 * Preview Screen Template Input Schema
 * SPEC-MCP-003: [TAG-MCP003-009]
 */
export const PreviewScreenTemplateInputSchema = z.object({
  templateId: z.string().regex(/^[a-z]+\.[a-z-]+$/, 'Template ID must be in format category.name'),
  includeLayoutTokens: z.boolean().optional(),
});

export type PreviewScreenTemplateInput = z.infer<typeof PreviewScreenTemplateInputSchema>;

/**
 * Skeleton schema
 */
export const SkeletonSchema = z.object({
  shell: z.string(),
  page: z.string(),
  sections: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      slot: z.string(),
      required: z.boolean(),
    })
  ),
});

export type Skeleton = z.infer<typeof SkeletonSchema>;

/**
 * Customization schema
 */
export const CustomizationSchema = z.object({
  texts: z.array(z.string()),
  optional: z.array(z.string()),
  slots: z.array(z.string()),
});

export type Customization = z.infer<typeof CustomizationSchema>;

/**
 * Responsive layout schema
 */
export const ResponsiveLayoutSchema = z.object({
  mobile: z.object({
    padding: z.string(),
    gap: z.string(),
    columns: z.number(),
  }),
  tablet: z.object({
    padding: z.string(),
    gap: z.string(),
    columns: z.number(),
  }),
  desktop: z.object({
    padding: z.string(),
    gap: z.string(),
    columns: z.number(),
  }),
});

export type ResponsiveLayout = z.infer<typeof ResponsiveLayoutSchema>;

/**
 * Preview Screen Template Output Schema
 */
export const PreviewScreenTemplateOutputSchema = z.object({
  success: z.boolean(),
  template: z
    .object({
      id: z.string(),
      name: z.string(),
      category: TemplateCategorySchema,
      description: z.string(),
      version: z.string(),
      skeleton: SkeletonSchema,
      layout: z.object({
        type: TemplateLayoutTypeSchema,
        responsive: ResponsiveLayoutSchema.optional(),
      }),
      customizable: CustomizationSchema,
      requiredComponents: z.array(z.string()),
      importStatement: z.string(),
      exampleProps: z
        .object({
          texts: z.record(z.string()).optional(),
          options: z.record(z.boolean()).optional(),
          slots: z.array(z.string()).optional(),
        })
        .optional(),
      created: z.string(),
      updated: z.string(),
      tags: z.array(z.string()).optional(),
    })
    .optional(),
  error: z.string().optional(),
});

export type PreviewScreenTemplateOutput = z.infer<typeof PreviewScreenTemplateOutputSchema>;

// ============================================================================
// Get Screen Generation Context Tool Schemas (SPEC-MCP-004 Phase 3.5)
// ============================================================================

/**
 * Get Screen Generation Context Input Schema
 * SPEC-MCP-004 Phase 3.5: Provides coding agents with complete context for screen generation
 */
export const GetScreenGenerationContextInputSchema = z.object({
  description: z
    .string()
    .min(5, 'Description must be at least 5 characters')
    .max(1000, 'Description must not exceed 1000 characters'),
  themeId: ThemeIdSchema.optional(),
  includeExamples: z.boolean().optional().default(true),
  compact: z.boolean().optional().default(false),
  platform: PlatformTargetSchema.optional(),
});

export type GetScreenGenerationContextInput = z.infer<typeof GetScreenGenerationContextInputSchema>;

/**
 * Template match result for generation context
 */
export const ContextTemplateMatchSchema = z.object({
  templateId: z.string(),
  templateName: z.string(),
  category: z.string(),
  confidence: z.number(),
  matchedKeywords: z.array(z.string()),
  skeleton: SkeletonSchema.optional(),
  requiredComponents: z.array(z.string()).optional(),
});

export type ContextTemplateMatch = z.infer<typeof ContextTemplateMatchSchema>;

/**
 * Component info for generation context
 */
export const ContextComponentInfoSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: ComponentCategorySchema,
  description: z.string(),
  importStatement: z.string(),
  props: z.array(PropDefinitionSchema),
  variants: z.array(VariantSchema).optional(),
  platformSupport: z
    .object({
      target: PlatformTargetSchema,
      supported: z.boolean(),
      recommended: z.boolean(),
      status: z.enum(['full', 'partial', 'avoid']),
      notes: z.array(z.string()),
      recommendedImports: z.array(z.string()),
      recommendedPackages: z.array(z.string()),
    })
    .optional(),
});

export type ContextComponentInfo = z.infer<typeof ContextComponentInfoSchema>;

/**
 * Screen definition schema for validation and examples
 */
export const ScreenDefinitionSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, 'Screen ID must be lowercase alphanumeric with hyphens'),
  name: z.string().optional(),
  description: z.string().optional(),
  shell: z
    .string()
    .regex(/^shell\.[a-z]+\.[a-z-]+$/, 'Shell token must be in format shell.platform.name'),
  page: z.string().regex(/^page\.[a-z-]+$/, 'Page token must be in format page.name'),
  themeId: ThemeIdSchema.optional(),
  sections: z.array(
    z.object({
      id: z.string(),
      pattern: z
        .string()
        .regex(/^section\.[a-z0-9-]+$/, 'Section pattern must be in format section.name'),
      slot: z.string().optional(),
      components: z.array(
        z.object({
          type: z.string(),
          props: z.record(z.unknown()).optional(),
          children: z.union([z.string(), z.array(z.unknown())]).optional(),
        })
      ),
    })
  ),
  metadata: z
    .object({
      version: z.string().optional(),
      author: z.string().optional(),
      created: z.string().optional(),
      updated: z.string().optional(),
    })
    .optional(),
});

export type ScreenDefinition = z.infer<typeof ScreenDefinitionSchema>;

/**
 * Example screen definition with description
 */
export const ScreenExampleSchema = z.object({
  name: z.string(),
  description: z.string(),
  definition: ScreenDefinitionSchema,
});

export type ScreenExample = z.infer<typeof ScreenExampleSchema>;

/**
 * Theme recipe info for generation context
 */
export const ThemeRecipeInfoSchema = z.object({
  componentType: z.string(),
  variants: z.array(z.string()),
  defaultClassName: z.string().optional(),
});

export type ThemeRecipeInfo = z.infer<typeof ThemeRecipeInfoSchema>;

/**
 * Generation hint for coding agents
 */
export const GenerationHintSchema = z.object({
  category: z.enum(['layout', 'component', 'styling', 'accessibility', 'best-practice']),
  priority: z.enum(['high', 'medium', 'low']),
  message: z.string(),
  example: z.string().optional(),
});

export type GenerationHint = z.infer<typeof GenerationHintSchema>;

/**
 * Workflow Step Schema
 * SPEC-MCP-004 Phase 5: E2E workflow guide for agents
 */
export const WorkflowStepSchema = z.object({
  step: z.number(),
  action: z.string(),
  tool: z.string().optional(),
  description: z.string(),
  example: z.string().optional(),
});

export type WorkflowStep = z.infer<typeof WorkflowStepSchema>;

/**
 * Workflow Guide Schema
 * Provides step-by-step guidance for agents to generate screens
 */
export const WorkflowGuideSchema = z.object({
  title: z.string(),
  description: z.string(),
  steps: z.array(WorkflowStepSchema),
  notes: z.array(z.string()).optional(),
});

export type WorkflowGuide = z.infer<typeof WorkflowGuideSchema>;

export const DefinitionStarterSchema = z.object({
  id: z.string(),
  shell: z.string(),
  page: z.string(),
  themeId: z.string().optional(),
  sections: z.array(
    z.object({
      id: z.string(),
      pattern: z.string(),
      components: z.array(
        z.object({
          type: z.string(),
          props: z.record(z.unknown()).optional(),
        })
      ),
    })
  ),
});

export type DefinitionStarter = z.infer<typeof DefinitionStarterSchema>;

/**
 * Get Screen Generation Context Output Schema
 */
export const GetScreenGenerationContextOutputSchema = z.object({
  success: z.boolean(),
  targetPlatform: PlatformTargetSchema.optional(),
  templateMatch: ContextTemplateMatchSchema.optional(),
  components: z.array(ContextComponentInfoSchema).optional(),
  definitionStarter: DefinitionStarterSchema.optional(),
  schema: z
    .object({
      screenDefinition: z.unknown(), // JSON Schema representation
      description: z.string(),
    })
    .optional(),
  examples: z.array(ScreenExampleSchema).optional(),
  themeRecipes: z.array(ThemeRecipeInfoSchema).optional(),
  hints: z.array(GenerationHintSchema).optional(),
  workflow: WorkflowGuideSchema.optional(),
  directWrite: z
    .object({
      runtime: z.string(),
      entryStrategy: z.string(),
      stylingStrategy: z.string(),
      validationStrategy: z.string(),
    })
    .optional(),
  error: z.string().optional(),
});

export type GetScreenGenerationContextOutput = z.infer<
  typeof GetScreenGenerationContextOutputSchema
>;

// ============================================================================
// Generate Screen Tool Schemas (SPEC-LAYOUT-002 Phase 4)
// ============================================================================

/**
 * Output format for code generation
 */
export const OutputFormatSchema = z.enum(['css-in-js', 'tailwind', 'react']);

export type OutputFormat = z.infer<typeof OutputFormatSchema>;

/**
 * CSS Framework options for CSS-in-JS format
 */
export const CSSFrameworkSchema = z.enum(['styled-components', 'emotion']);

export type CSSFramework = z.infer<typeof CSSFrameworkSchema>;

/**
 * Generation options for generate_screen tool
 */
export const GenerationOptionsSchema = z.object({
  cssFramework: CSSFrameworkSchema.optional(),
  typescript: z.boolean().optional().default(true),
  prettier: z.boolean().optional().default(false),
});

export type GenerationOptions = z.infer<typeof GenerationOptionsSchema>;

/**
 * Generate Screen Input Schema
 * SPEC-LAYOUT-002: Generate production code from screen definition
 */
export const GenerateScreenInputSchema = z.object({
  screenDefinition: z.unknown(), // Accept any object - will be validated by @framingui/core
  outputFormat: OutputFormatSchema,
  options: GenerationOptionsSchema.optional(),
});

export type GenerateScreenInput = z.infer<typeof GenerateScreenInputSchema>;

// Note: DependenciesSchema and GenerateScreenOutputSchema are defined later in this file
// (see lines 1113-1145) to avoid circular dependencies

// ============================================================================
// Validate Screen Definition Tool Schemas (SPEC-MCP-004 Phase 3.5)
// ============================================================================

/**
 * Validate Screen Definition Input Schema
 * SPEC-MCP-004 Phase 3.5: Validates screen definitions with helpful feedback
 */
export const ValidateScreenDefinitionInputSchema = z.object({
  definition: z.unknown(), // Accept any object for validation
  strict: z.boolean().optional().default(true),
});

export type ValidateScreenDefinitionInput = z.infer<typeof ValidateScreenDefinitionInputSchema>;

/**
 * JSON Patch Operation Schema (RFC 6902 subset)
 * Auto-fix 패치를 위한 스키마
 */
export const JsonPatchOperationSchema = z.object({
  op: z.enum(['replace', 'add', 'remove']),
  path: z.string(),
  value: z.unknown().optional(),
});

export type JsonPatchOperation = z.infer<typeof JsonPatchOperationSchema>;

/**
 * Validation error with path and suggestion
 */
export const ValidationErrorSchema = z.object({
  path: z.string(),
  code: z.string(),
  message: z.string(),
  expected: z.string().optional(),
  received: z.string().optional(),
  suggestion: z.string().optional(),
  autoFix: z.array(JsonPatchOperationSchema).optional(),
});

export type ValidationError = z.infer<typeof ValidationErrorSchema>;

/**
 * Validation warning (non-blocking)
 */
export const ValidationWarningSchema = z.object({
  path: z.string(),
  code: z.string(),
  message: z.string(),
  recommendation: z.string().optional(),
});

export type ValidationWarning = z.infer<typeof ValidationWarningSchema>;

/**
 * Improvement suggestion
 */
export const ImprovementSuggestionSchema = z.object({
  category: z.enum(['accessibility', 'performance', 'maintainability', 'consistency']),
  message: z.string(),
  affectedPath: z.string().optional(),
  suggestedChange: z.string().optional(),
  autoFix: z.array(JsonPatchOperationSchema).optional(),
});

export type ImprovementSuggestion = z.infer<typeof ImprovementSuggestionSchema>;

/**
 * Validate Screen Definition Output Schema
 */
export const ValidateScreenDefinitionOutputSchema = z.object({
  success: z.boolean(),
  valid: z.boolean().optional(),
  errors: z.array(ValidationErrorSchema).optional(),
  warnings: z.array(ValidationWarningSchema).optional(),
  suggestions: z.array(ImprovementSuggestionSchema).optional(),
  autoFixPatches: z.array(JsonPatchOperationSchema).optional(),
  error: z.string().optional(),
});

export type ValidateScreenDefinitionOutput = z.infer<typeof ValidateScreenDefinitionOutputSchema>;

// ============================================================================
// Validate Environment Tool Schemas (SPEC-MCP-005 Phase 2)
// ============================================================================

/**
 * Validate Environment Input Schema
 * SPEC-MCP-005 Phase 2: Check user's environment for missing dependencies
 */
export const ValidateEnvironmentInputSchema = z.object({
  projectPath: z.string().describe('Path to package.json or project root'),
  requiredPackages: z.array(z.string()).describe('Packages required by the screen components'),
  platform: PlatformTargetSchema.optional(),
  checkTailwind: z
    .boolean()
    .optional()
    .default(true)
    .describe('Also validate Tailwind CSS configuration for @framingui/ui compatibility'),
  sourceFiles: z
    .array(z.string())
    .optional()
    .describe('Optional source files to audit for raw style escapes or platform drift'),
});

export type ValidateEnvironmentInput = z.infer<typeof ValidateEnvironmentInputSchema>;

/**
 * Validate Environment Output Schema
 */
export const ValidateEnvironmentOutputSchema = z.object({
  success: z.boolean(),
  installed: z.record(z.string()).optional().describe('Packages already installed with versions'),
  missing: z.array(z.string()).optional().describe('Packages that need to be installed'),
  platform: PlatformTargetSchema.optional(),
  environment: ProjectEnvironmentSchema.optional(),
  installCommands: z
    .object({
      npm: z.string(),
      yarn: z.string(),
      pnpm: z.string(),
      bun: z.string(),
    })
    .optional(),
  warnings: z.array(z.string()).optional().describe('Version conflicts or compatibility issues'),
  tailwind: z
    .object({
      configFound: z.boolean(),
      configPath: z.string().optional(),
      hasUiContentPath: z.boolean(),
      hasAnimatePlugin: z.boolean(),
      issues: z.array(z.string()),
      fixes: z.array(z.string()),
    })
    .optional()
    .describe('Tailwind CSS configuration validation for @framingui/ui compatibility'),
  sourceAudit: z
    .object({
      filesScanned: z.number(),
      issues: z.array(z.string()).optional(),
      fixes: z.array(z.string()).optional(),
      findings: z.array(
        z.object({
          filePath: z.string(),
          ruleId: z.string(),
          severity: z.enum(['warning', 'error']),
          message: z.string(),
          guidance: z.string(),
        })
      ),
    })
    .optional(),
  error: z.string().optional(),
});

export type ValidateEnvironmentOutput = z.infer<typeof ValidateEnvironmentOutputSchema>;
