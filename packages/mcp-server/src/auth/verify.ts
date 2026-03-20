/**
 * API Key verification for Framingui MCP Server
 * SPEC-DEPLOY-001 Phase 4.1: MCP Server Authentication Layer
 */

import { info, error as logError } from '../utils/logger.js';
import { resolveFraminguiApiUrl } from '../utils/api-url.js';

export interface VerifyResponse {
  valid: boolean;
  user?: {
    id: string;
    email: string;
    plan: string;
  };
  licenses?: Array<{
    themeId: string;
    tier: string;
    type?: 'trial' | 'individual' | 'creator';
    isActive: boolean;
    expiresAt: string | null;
  }>;
  themes?: {
    licensed: string[];
    /** @deprecated free 테마 개념 제거됨 - 하위 호환용 */
    free?: string[];
  };
  quotaEntitlement?: {
    planId: string;
    status: string;
    includedUnits: number;
    currentPeriodStart: string | null;
    currentPeriodEnd: string | null;
    totalAllocatedUnits: number;
    topUpAllocatedUnits: number;
  } | null;
  error?: string;
}

/**
 * Verify API key with Framingui backend
 * @param apiKey - The API key to verify
 * @returns VerifyResponse with user data and licenses
 */
export async function verifyApiKey(apiKey: string): Promise<VerifyResponse> {
  const { apiUrl, reason } = resolveFraminguiApiUrl(process.env.FRAMINGUI_API_URL);
  if (reason) {
    info(reason);
  }
  const endpoint = `${apiUrl}/api/mcp/verify`;

  try {
    info(`Verifying API key with endpoint: ${endpoint}`);

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      logError(`API key verification failed: ${response.status} ${response.statusText}`);

      return {
        valid: false,
        error: `Verification failed: ${response.status} ${response.statusText} - ${errorText}`,
      };
    }

    const data = (await response.json()) as VerifyResponse;

    if (!data.valid) {
      logError(`API key is invalid: ${data.error || 'Unknown reason'}`);
      return {
        valid: false,
        error: data.error || 'API key is invalid',
      };
    }

    info(
      `API key verified successfully for user: ${data.user?.email || 'unknown'} (plan: ${data.user?.plan || 'unknown'})`
    );

    return data;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    logError(`API key verification error: ${errorMessage}`);

    return {
      valid: false,
      error: `Network error: ${errorMessage}`,
    };
  }
}

/**
 * Extract licensed theme IDs from verification response
 * @param verifyResponse - Verification response from verifyApiKey
 * @returns Array of licensed theme IDs
 */
export function extractThemeAccess(verifyResponse: VerifyResponse): string[] {
  if (!verifyResponse.valid || !verifyResponse.themes) {
    return [];
  }

  return verifyResponse.themes.licensed || [];
}

/**
 * Check if a theme is accessible for the current authentication state
 * @param themeId - Theme ID to check
 * @param verifyResponse - Verification response (null for unauthenticated)
 * @returns true if theme is in user's licenses
 */
export function isThemeAccessible(themeId: string, verifyResponse: VerifyResponse | null): boolean {
  // 인증 필수
  if (!verifyResponse || !verifyResponse.valid) {
    return false;
  }

  // 라이선스 보유 테마만 접근 가능
  const licensed = extractThemeAccess(verifyResponse);
  return licensed.includes(themeId);
}
