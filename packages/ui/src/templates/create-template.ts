/**
 * Template composition helper
 * [TAG-Q-001] 템플릿 catalog 정의와 UI 렌더러를 결합하는 단일 진입점
 */

import { loadTemplateDefinition } from '@framingui/core/template-catalog';
import type { ScreenTemplateDefinition } from '@framingui/core/template-catalog';
import type { ComponentType } from 'react';
import type { ScreenTemplate, ScreenTemplateProps, SectionTemplate } from './types';

const PRIMARY_SECTION_SLOTS = new Set(['main', 'primaryContent']);

const NoopSectionComponent: ComponentType<any> = () => null;

function toSectionTemplates(
  template: ScreenTemplateDefinition,
  Component: ComponentType<ScreenTemplateProps>
): SectionTemplate[] {
  return template.skeleton.sections.map(section => ({
    id: section.id,
    name: section.name,
    slot: section.slot,
    required: section.required,
    Component: PRIMARY_SECTION_SLOTS.has(section.slot) ? Component : NoopSectionComponent,
  }));
}

export function createTemplateFromCatalog(
  templateId: string,
  Component: ComponentType<ScreenTemplateProps>
): ScreenTemplate {
  const definition = loadTemplateDefinition(templateId);
  if (!definition) {
    throw new Error(`Unknown template definition: ${templateId}`);
  }

  return {
    id: definition.id,
    name: definition.name,
    category: definition.category,
    description: definition.description,
    skeleton: {
      shell: definition.skeleton.shell,
      page: definition.skeleton.page,
      sections: toSectionTemplates(definition, Component),
    },
    layout: {
      type: definition.layout.type,
      responsive: definition.layout.responsive,
    },
    customizable: definition.customizable,
    requiredComponents: definition.requiredComponents,
    Component,
    version: definition.version,
    created: definition.created,
    updated: definition.updated,
    tags: definition.tags,
  };
}
