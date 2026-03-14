import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { mockFetchThemeList, mockFetchTheme } = vi.hoisted(() => ({
  mockFetchThemeList: vi.fn(),
  mockFetchTheme: vi.fn(),
}));

vi.mock('../../src/api/data-client.js', () => ({
  fetchThemeList: mockFetchThemeList,
  fetchTheme: mockFetchTheme,
}));

import { clearAuthData, setAuthData, setRawApiKey } from '../../src/auth/state.js';
import { listThemesTool } from '../../src/tools/list-themes.js';
import { previewThemeTool } from '../../src/tools/preview-theme.js';
import { whoamiTool } from '../../src/tools/whoami.js';

const AUTH_FIXTURE = {
  valid: true,
  user: {
    id: 'theme-user',
    email: 'theme-user@example.com',
    plan: 'pro',
  },
  themes: {
    licensed: ['pebble'],
  },
  licenses: [
    {
      themeId: 'pebble',
      tier: 'pro',
      type: 'individual' as const,
      isActive: true,
      expiresAt: '2026-12-31T00:00:00.000Z',
    },
  ],
};

describe('Phase 2: theme authority consistency', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearAuthData();
    setAuthData(AUTH_FIXTURE);
    setRawApiKey('test-api-key');
  });

  afterEach(() => {
    clearAuthData();
  });

  it('fails list-themes explicitly when licensed themes exist but the fetched list is empty', async () => {
    mockFetchThemeList.mockResolvedValueOnce({
      ok: true,
      data: [],
    });

    const whoami = await whoamiTool();
    const listThemes = await listThemesTool();

    expect(whoami.success).toBe(true);
    expect(whoami.licensedThemes).toContain('pebble');

    expect(listThemes.success).toBe(false);
    expect(listThemes.error).toContain('THEME_AUTHORITY_INCONSISTENT');
    expect(listThemes.error).toContain('pebble');
  });

  it('rewrites preview-theme forbidden into an entitlement inconsistency error for licensed themes', async () => {
    mockFetchTheme.mockResolvedValueOnce({
      ok: false,
      error: {
        code: 'FORBIDDEN',
        message: 'Theme "pebble" is not included in your license.',
      },
    });

    const whoami = await whoamiTool();
    const preview = await previewThemeTool({ themeId: 'pebble' });

    expect(whoami.success).toBe(true);
    expect(whoami.licensedThemes).toContain('pebble');

    expect(preview.success).toBe(false);
    expect(preview.error).toContain('THEME_AUTHORITY_INCONSISTENT');
    expect(preview.error).toContain('Requested theme: "pebble"');
  });
});
