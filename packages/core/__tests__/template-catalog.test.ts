import { describe, expect, it } from 'vitest';
import {
  listTemplateDefinitions,
  listTemplateDefinitionsByCategory,
  loadTemplateDefinition,
  searchTemplateDefinitions,
} from '../src/catalog/templates/index.js';

describe('template catalog', () => {
  it('lists the bundled template definitions', () => {
    const templates = listTemplateDefinitions();

    expect(templates).toHaveLength(13);
    expect(templates.some(template => template.id === 'dashboard.overview')).toBe(true);
  });

  it('filters by category', () => {
    const authTemplates = listTemplateDefinitionsByCategory('auth');

    expect(authTemplates).toHaveLength(4);
    expect(authTemplates.every(template => template.category === 'auth')).toBe(true);
  });

  it('searches by keyword across ids, names, descriptions, and tags', () => {
    const templates = searchTemplateDefinitions('analytics');

    expect(templates).toHaveLength(1);
    expect(templates[0]?.id).toBe('dashboard.overview');
  });

  it('loads a single template by id', () => {
    const template = loadTemplateDefinition('core.profile');

    expect(template?.name).toBe('Profile');
    expect(template?.layout.type).toBe('centered');
  });
});
