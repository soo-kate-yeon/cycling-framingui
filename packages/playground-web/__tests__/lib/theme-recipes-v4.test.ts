import { describe, expect, it } from 'vitest';

import boldLineTheme from '@/lib/themes/bold-line.json';
import classicMagazineTheme from '@/lib/themes/classic-magazine.json';
import darkBoldnessTheme from '@/lib/themes/dark-boldness.json';
import editorialTechTheme from '@/lib/themes/editorial-tech.json';
import minimalWorkspaceTheme from '@/lib/themes/minimal-workspace.json';
import neutralWorkspaceTheme from '@/lib/themes/neutral-workspace.json';
import pebbleTheme from '@/lib/themes/pebble.json';
import squareMinimalismTheme from '@/lib/themes/square-minimalism.json';

function collectRecipeStrings(value: unknown): string[] {
  if (typeof value === 'string') {
    return [value];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => collectRecipeStrings(item));
  }

  if (value && typeof value === 'object') {
    return Object.values(value).flatMap((item) => collectRecipeStrings(item));
  }

  return [];
}

const themes = [
  boldLineTheme,
  classicMagazineTheme,
  darkBoldnessTheme,
  editorialTechTheme,
  minimalWorkspaceTheme,
  neutralWorkspaceTheme,
  pebbleTheme,
  squareMinimalismTheme,
];

describe('theme recipes stay v4-safe', () => {
  it('avoid legacy palette utility classes that depend on Tailwind palette registration', () => {
    const legacyPaletteClass =
      /\b(?:bg|text|border|ring|shadow|placeholder):?[^\s]*-(?:brand|neutral)-\d/;

    themes.forEach((theme) => {
      const recipeStrings = collectRecipeStrings(theme.tokens.recipes);

      recipeStrings.forEach((recipe) => {
        expect(recipe, `${theme.id}: ${recipe}`).not.toMatch(legacyPaletteClass);
      });
    });
  });

  it('avoid references to variables that are not emitted by the runtime theme loader', () => {
    const unsupportedVariables = [
      'var(--bg-brand-subtle)',
      'var(--bg-brand-default)',
      'var(--bg-canvas-950',
    ];

    themes.forEach((theme) => {
      const recipeStrings = collectRecipeStrings(theme.tokens.recipes);

      recipeStrings.forEach((recipe) => {
        unsupportedVariables.forEach((variableRef) => {
          expect(recipe, `${theme.id}: ${recipe}`).not.toContain(variableRef);
        });
      });
    });
  });

  it('keeps editorial-tech containers rectilinear without forcing square modal corners', () => {
    const modalRecipe = editorialTechTheme.tokens.recipes.modal;
    const cardRecipe = editorialTechTheme.tokens.recipes.card;
    const inputRecipe = editorialTechTheme.tokens.recipes.input;

    expect(modalRecipe.content).toContain('rounded-2xl');
    expect(modalRecipe.content).not.toContain('rounded-none');

    expect(cardRecipe.imageWrapper).toContain('rounded-2xl');
    expect(inputRecipe.default).toContain('rounded-xl');
    expect(editorialTechTheme.tokens.recipes.button.primary).toContain('rounded-full');
    expect(editorialTechTheme.tokens.recipes.tab.list).toContain('rounded-full');
  });
});
