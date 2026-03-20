import { listThemes } from '@framingui/core';
import { TRANSITION_ACCESS_THEME_ID, CREATOR_ALL_ACCESS_THEME_ID } from '@/lib/access/constants';

export const TRIAL_ALL_ACCESS_THEME_ID = TRANSITION_ACCESS_THEME_ID;
export { CREATOR_ALL_ACCESS_THEME_ID };

const LEGACY_PLACEHOLDER_THEME_IDS = new Set(['default']);
const EXPLICIT_ALL_ACCESS_THEME_IDS = new Set<string>([
  TRANSITION_ACCESS_THEME_ID,
  CREATOR_ALL_ACCESS_THEME_ID,
]);

export interface StoredUserLicense {
  id: string;
  user_id: string;
  theme_id: string;
  tier: string;
  type: 'trial' | 'individual' | 'creator';
  is_active: boolean;
  expires_at: string | null;
}

export interface NormalizedUserLicense extends StoredUserLicense {
  resolvedThemeIds: string[];
  normalization: 'canonical' | 'all-access' | 'legacy-placeholder' | 'comma-separated' | 'unknown';
}

export interface NormalizedThemeEntitlements {
  licensedThemes: string[];
  licenses: NormalizedUserLicense[];
  warnings: string[];
}

type WarningLogger = {
  warn(message?: unknown, ...optionalParams: unknown[]): void;
};

function getCanonicalThemeIds(): string[] {
  return listThemes().map((theme) => theme.id);
}

function toCanonicalOrder(themeIds: string[], canonicalThemeIds: string[]): string[] {
  const allowed = new Set(themeIds);
  return canonicalThemeIds.filter((themeId) => allowed.has(themeId));
}

function resolveLicenseThemeIds(
  license: StoredUserLicense,
  canonicalThemeIds: string[]
): Pick<NormalizedUserLicense, 'resolvedThemeIds' | 'normalization'> & { warning?: string } {
  const canonicalThemeSet = new Set(canonicalThemeIds);
  const rawThemeId = license.theme_id.trim();

  if (!rawThemeId) {
    return {
      resolvedThemeIds: [],
      normalization: 'unknown',
      warning: 'unknown-theme-id:<empty>',
    };
  }

  if (canonicalThemeSet.has(rawThemeId)) {
    return {
      resolvedThemeIds: [rawThemeId],
      normalization: 'canonical',
    };
  }

  if (EXPLICIT_ALL_ACCESS_THEME_IDS.has(rawThemeId)) {
    return {
      resolvedThemeIds: canonicalThemeIds,
      normalization: 'all-access',
    };
  }

  if (LEGACY_PLACEHOLDER_THEME_IDS.has(rawThemeId)) {
    return {
      resolvedThemeIds: canonicalThemeIds,
      normalization: 'legacy-placeholder',
      warning: `legacy-placeholder:${rawThemeId}`,
    };
  }

  if (rawThemeId.includes(',')) {
    const expandedIds = rawThemeId
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)
      .filter((value) => canonicalThemeSet.has(value));

    if (expandedIds.length > 0) {
      return {
        resolvedThemeIds: toCanonicalOrder(expandedIds, canonicalThemeIds),
        normalization: 'comma-separated',
      };
    }
  }

  return {
    resolvedThemeIds: [],
    normalization: 'unknown',
    warning: `unknown-theme-id:${rawThemeId}`,
  };
}

export function normalizeLicensedThemes(
  licenses: StoredUserLicense[],
  options?: { logger?: WarningLogger }
): NormalizedThemeEntitlements {
  const canonicalThemeIds = getCanonicalThemeIds();
  const warnings: string[] = [];

  const normalizedLicenses = licenses.map((license) => {
    const resolved = resolveLicenseThemeIds(license, canonicalThemeIds);
    if (resolved.warning) {
      warnings.push(resolved.warning);
    }

    return {
      ...license,
      resolvedThemeIds: resolved.resolvedThemeIds,
      normalization: resolved.normalization,
    };
  });

  const licensedSet = new Set<string>();
  for (const license of normalizedLicenses) {
    for (const themeId of license.resolvedThemeIds) {
      licensedSet.add(themeId);
    }
  }

  if (warnings.length > 0) {
    options?.logger?.warn?.(
      `[MCP Theme Entitlements] Normalized legacy or invalid license ids: ${warnings.join(', ')}`
    );
  }

  return {
    licensedThemes: canonicalThemeIds.filter((themeId) => licensedSet.has(themeId)),
    licenses: normalizedLicenses,
    warnings,
  };
}
