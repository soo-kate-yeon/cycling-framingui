/**
 * whoami 도구 - 유저 tier/라이선스 정보 반환
 *
 * 반환 정보:
 * - plan: 유저 구독 플랜 (free/pro/enterprise/master)
 * - isMaster: 마스터 계정 여부
 * - licensedThemes: 접근 가능한 테마 ID 목록
 * - mcpSupport: MCP 도구 지원 기간 정보
 */

import type { WhoamiOutput } from '../schemas/mcp-schemas.js';
import { getAuthData, setAuthData } from '../auth/state.js';
import { isMasterAccount, PREMIUM_THEMES } from '../auth/theme-access.js';
import { addMcpUtmParams } from '../utils/url-utils.js';

/**
 * whoami 도구 구현
 * 인증된 유저의 tier/라이선스 스냅샷을 반환
 */
export async function whoamiTool(): Promise<WhoamiOutput> {
  const authData = getAuthData();

  if (!authData || !authData.valid) {
    return {
      success: false,
      error:
        '🔐 Authentication required to use FramingUI MCP tools.\n\n🎁 Start your FREE 3-day trial (no credit card):\n   → https://framingui.com/auth/signup?utm_source=mcp&utm_medium=cli&utm_campaign=auth_prompt\n\nAlready have an account? Run `framingui-mcp login`',
    };
  }

  const email = authData.user?.email || '';
  const isMaster = isMasterAccount(email);

  // 마스터 계정: 모든 테마 접근 가능
  const licensedThemes = isMaster ? [...PREMIUM_THEMES] : authData.themes?.licensed || [];

  // 마스터 계정이면 인증 캐시를 갱신하여 이후 도구들이 최신 상태 참조
  if (isMaster) {
    setAuthData({
      ...authData,
      user: { ...authData.user!, plan: 'master' },
      themes: { ...authData.themes, licensed: [...PREMIUM_THEMES] },
    });
  }

  // MCP 지원 기간 계산 (라이선스 중 가장 늦은 만료일 기준)
  let latestExpiry: string | null = null;
  if (isMaster) {
    latestExpiry = null; // 마스터는 만료 없음
  } else if (authData.licenses && authData.licenses.length > 0) {
    const activeLicenses = authData.licenses.filter(l => l.isActive);
    const expiryDates = activeLicenses
      .map(l => l.expiresAt)
      .filter((d): d is string => d !== null)
      .sort()
      .reverse();
    latestExpiry = expiryDates[0] || null;
  }

  // Trial 라이선스 확인
  let isTrial = false;
  let trialExpiresAt: string | null = null;
  let trialDaysLeft: number | null = null;
  let trialMessage: string | null = null;

  if (authData.licenses && authData.licenses.length > 0) {
    const trialLicense = authData.licenses.find(l => l.type === 'trial');
    if (trialLicense) {
      isTrial = true;
      trialExpiresAt = trialLicense.expiresAt || null;

      if (trialExpiresAt) {
        const now = new Date();
        const expiryDate = new Date(trialExpiresAt);
        const diffMs = expiryDate.getTime() - now.getTime();
        trialDaysLeft = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

        if (trialDaysLeft > 0) {
          trialMessage = `You have ${trialDaysLeft} day${trialDaysLeft !== 1 ? 's' : ''} left in your free trial.`;
        } else {
          const pricingUrl = addMcpUtmParams('https://framingui.com/pricing', 'whoami');
          trialMessage = `Your free trial has expired. Upgrade to continue using premium themes: ${pricingUrl}`;
        }
      }
    }
  }

  return {
    success: true,
    plan: isMaster ? 'master' : (authData.user?.plan as 'free' | 'pro' | 'enterprise') || 'free',
    isMaster,
    licensedThemes,
    totalThemes: PREMIUM_THEMES.length,
    mcpSupport: {
      expiresAt: latestExpiry,
      renewable: true,
    },
    // Trial 정보
    is_trial: isTrial,
    trial_expires_at: trialExpiresAt,
    trial_days_left: trialDaysLeft,
    ...(trialMessage && { message: trialMessage }),
  };
}
