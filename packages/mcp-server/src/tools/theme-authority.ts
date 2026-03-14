import type { ApiError } from '../api/api-result.js';
import { getAuthData } from '../auth/state.js';
import { isMasterAccount, PREMIUM_THEMES } from '../auth/theme-access.js';

export function getLicensedThemeIds(): string[] {
  const authData = getAuthData();

  if (!authData?.valid) {
    return [];
  }

  const email = authData.user?.email ?? '';
  if (email && isMasterAccount(email)) {
    return [...PREMIUM_THEMES];
  }

  return authData.themes?.licensed ?? [];
}

export function formatThemeAuthorityInconsistencyError(options: {
  licensedThemeIds: string[];
  requestedThemeId?: string;
}): string {
  const { licensedThemeIds, requestedThemeId } = options;
  const licensedSummary = licensedThemeIds.length > 0 ? licensedThemeIds.join(', ') : 'none';
  const requestedSummary = requestedThemeId ? ` Requested theme: "${requestedThemeId}".` : '';

  return [
    '[THEME_AUTHORITY_INCONSISTENT] Session licensing and theme data are out of sync.',
    `Licensed themes from current auth state: ${licensedSummary}.${requestedSummary}`,
    'Retry once. If the mismatch persists, refresh authentication or resync the upstream entitlement cache.',
  ].join(' ');
}

export function shouldFailThemeListForAuthorityMismatch(themeCount: number): boolean {
  const licensedThemeIds = getLicensedThemeIds();
  return licensedThemeIds.length > 0 && themeCount === 0;
}

export function shouldRewriteThemePreviewError(themeId: string, error: ApiError): boolean {
  const licensedThemeIds = getLicensedThemeIds();
  const isLicensedLocally = licensedThemeIds.includes(themeId);

  if (!isLicensedLocally) {
    return false;
  }

  return error.code === 'FORBIDDEN';
}
