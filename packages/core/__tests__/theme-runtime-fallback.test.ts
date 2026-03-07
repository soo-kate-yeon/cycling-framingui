import { afterEach, describe, expect, it, vi } from 'vitest';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

describe('theme runtime fallback', () => {
  afterEach(() => {
    vi.resetModules();
    vi.doUnmock('../src/generated-data-dir.js');
  });

  it('falls back to bundled themes when generated theme directories are unavailable', async () => {
    vi.doMock('../src/generated-data-dir.js', () => ({
      getGeneratedDataDir: () => null,
    }));

    const { listThemesV2, loadThemeV2, themeExistsV2 } = await import('../src/theme-v2.js');

    const themes = listThemesV2();
    expect(themes.length).toBeGreaterThan(0);
    expect(themes.some(theme => theme.id === 'pebble')).toBe(true);
    expect(loadThemeV2('pebble')?.id).toBe('pebble');
    expect(themeExistsV2('pebble')).toBe(true);
  });

  it('prefers filesystem themes over bundled fallback when available', async () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'framingui-theme-'));
    try {
      const themesDir = join(tempRoot, '.moai', 'themes', 'generated');
      mkdirSync(themesDir, { recursive: true });

      writeFileSync(
        join(themesDir, 'pebble.json'),
        JSON.stringify({
          id: 'pebble',
          name: 'Custom Pebble',
          description: 'Filesystem override',
          schemaVersion: '2.1',
          brandTone: 'minimal',
          tokens: {
            atomic: {
              color: {},
              spacing: {},
              radius: {},
            },
            semantic: {},
          },
          stateLayer: {},
          motion: {},
          elevation: {},
          border: {},
          typography: {},
          density: {},
        })
      );

      vi.doMock('../src/generated-data-dir.js', () => ({
        getGeneratedDataDir: () => themesDir,
      }));

      const { loadThemeV2, listThemesV2 } = await import('../src/theme-v2.js');

      expect(loadThemeV2('pebble')?.name).toBe('Custom Pebble');
      expect(listThemesV2().find(theme => theme.id === 'pebble')?.name).toBe('Custom Pebble');
    } finally {
      rmSync(tempRoot, { recursive: true, force: true });
    }
  });
});
