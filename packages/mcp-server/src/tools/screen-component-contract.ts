import { SCREEN_COMPONENT_TYPES } from '../../../core/src/screen-generation/types.js';

type ScreenComponentNode = {
  type?: string;
  children?: Array<ScreenComponentNode | string>;
};

const SCREEN_COMPONENT_TYPE_SET = new Set<string>(SCREEN_COMPONENT_TYPES);

export function getScreenComponentTypes(): string[] {
  return [...SCREEN_COMPONENT_TYPES];
}

export function isSupportedScreenComponentType(type: string): boolean {
  return SCREEN_COMPONENT_TYPE_SET.has(type);
}

export function findUnsupportedScreenComponentTypes(screenDefinition: unknown): string[] {
  const unsupported = new Set<string>();

  const visit = (value: unknown): void => {
    if (!value || typeof value !== 'object') {
      return;
    }

    const node = value as ScreenComponentNode;
    if (typeof node.type === 'string' && !isSupportedScreenComponentType(node.type)) {
      unsupported.add(node.type);
    }

    if (Array.isArray(node.children)) {
      for (const child of node.children) {
        if (typeof child !== 'string') {
          visit(child);
        }
      }
    }
  };

  if (
    screenDefinition &&
    typeof screenDefinition === 'object' &&
    Array.isArray((screenDefinition as { sections?: unknown[] }).sections)
  ) {
    for (const section of (screenDefinition as { sections: Array<{ components?: unknown[] }> })
      .sections) {
      if (!Array.isArray(section.components)) {
        continue;
      }

      for (const component of section.components) {
        visit(component);
      }
    }
  }

  return [...unsupported];
}
