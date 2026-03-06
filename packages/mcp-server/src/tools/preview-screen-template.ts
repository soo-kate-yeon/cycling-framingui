/**
 * Preview Screen Template MCP Tool (SPEC-MCP-003)
 * [TAG-MCP003-009] Preview template with detailed structure
 * [SPEC-MCP-007:E-002] API 기반 데이터 소스로 마이그레이션
 *
 * Returns detailed template information including:
 * - Skeleton structure (non-customizable)
 * - Layout configuration (responsive breakpoints)
 * - Customization boundaries (what AI can modify)
 * - Required components
 * - Example props
 */

import { fetchTemplate, fetchTemplateList } from '../api/data-client.js';
import { formatToolError } from '../api/api-result.js';
import type {
  PreviewScreenTemplateInput,
  PreviewScreenTemplateOutput,
  TemplateCategory,
  TemplateLayoutType,
} from '../schemas/mcp-schemas.js';
import { extractErrorMessage } from '../utils/error-handler.js';

/**
 * Preview a screen template with detailed structure
 * [TAG-MCP003-013] Template not found error handling
 */
export async function previewScreenTemplateTool(
  input: PreviewScreenTemplateInput
): Promise<PreviewScreenTemplateOutput> {
  try {
    // Set default value for optional parameter
    const includeLayoutTokens = input.includeLayoutTokens ?? true;

    const templateResult = await fetchTemplate(input.templateId);

    if (!templateResult.ok) {
      // NOT_FOUND인 경우 사용 가능한 템플릿 목록 제공
      if (templateResult.error.code === 'NOT_FOUND') {
        const listResult = await fetchTemplateList();
        if (listResult.ok) {
          const availableTemplates = listResult.data.map((t: any) => t.id);
          return {
            success: false,
            error: `Template not found: ${input.templateId}. Available templates: ${availableTemplates.join(', ')}`,
          };
        }
      }
      return { success: false, error: formatToolError(templateResult.error) };
    }

    const template = templateResult.data;

    // Build skeleton structure
    const skeleton = {
      shell: template.skeleton.shell,
      page: template.skeleton.page,
      sections: template.skeleton.sections.map((s: any) => ({
        id: s.id,
        name: s.name,
        slot: s.slot,
        required: s.required,
      })),
    };

    // Build layout configuration
    const layout = {
      type: template.layout.type as TemplateLayoutType,
      responsive:
        includeLayoutTokens && template.layout.responsive
          ? {
              mobile: {
                padding: template.layout.responsive.mobile.padding,
                gap: template.layout.responsive.mobile.gap,
                columns: template.layout.responsive.mobile.columns,
              },
              tablet: {
                padding: template.layout.responsive.tablet.padding,
                gap: template.layout.responsive.tablet.gap,
                columns: template.layout.responsive.tablet.columns,
              },
              desktop: {
                padding: template.layout.responsive.desktop.padding,
                gap: template.layout.responsive.desktop.gap,
                columns: template.layout.responsive.desktop.columns,
              },
            }
          : undefined,
    };

    // Build customization boundaries
    const customizable = {
      texts: template.customizable.texts,
      optional: template.customizable.optional,
      slots: template.customizable.slots,
    };

    // Build import statement
    const importStatement = `import { ${template.name}Template } from '@framingui/ui/templates';`;

    return {
      success: true,
      template: {
        id: template.id,
        name: template.name,
        category: template.category as TemplateCategory,
        description: template.description,
        version: template.version,
        skeleton,
        layout,
        customizable,
        requiredComponents: template.requiredComponents,
        importStatement,
        created: template.created,
        updated: template.updated,
        tags: template.tags,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error),
    };
  }
}
