/**
 * Database Types
 * SPEC-AUTH-001: Supabase 인증 통합
 *
 * [TAG-AUTH-001-U003] 사용자 데이터는 PostgreSQL 데이터베이스에 저장되어야 한다
 *
 * WHY: 데이터베이스 스키마와 일치하는 TypeScript 타입 정의
 * IMPACT: 타입 안전성 보장 및 개발자 경험 향상
 */

/**
 * 라이선스 등급
 */
export type LicenseTier = 'single' | 'double' | 'creator';

/**
 * 사용자 라이선스 레코드
 */
export interface UserLicense {
  id: string;
  user_id: string;
  theme_id: string;
  tier: LicenseTier;
  paddle_subscription_id: string | null;
  purchased_at: string;
  expires_at: string | null;
  is_active: boolean;
}

/**
 * 라이선스 생성 데이터
 */
export interface CreateLicenseData {
  user_id: string;
  theme_id: string;
  tier: LicenseTier;
  paddle_subscription_id?: string | null;
  expires_at?: string | null;
}

/**
 * 라이선스 업데이트 데이터
 */
export interface UpdateLicenseData {
  tier?: LicenseTier;
  paddle_subscription_id?: string | null;
  expires_at?: string | null;
  is_active?: boolean;
}

export type QuotaAllocationType = 'plan' | 'top_up' | 'migration' | 'adjustment';

export interface QuotaAllocation {
  id: string;
  user_id: string;
  allocation_type: QuotaAllocationType;
  units: number;
  source: string;
  billing_period_start: string | null;
  billing_period_end: string | null;
  paddle_transaction_id: string | null;
  paddle_subscription_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface CreateQuotaAllocationData {
  user_id: string;
  allocation_type: QuotaAllocationType;
  units: number;
  source: string;
  billing_period_start?: string | null;
  billing_period_end?: string | null;
  paddle_transaction_id?: string | null;
  paddle_subscription_id?: string | null;
  metadata?: Record<string, unknown> | null;
}

export type QuotaEntitlementStatus = 'active' | 'inactive' | 'canceled' | 'past_due';

export interface QuotaEntitlement {
  id: string;
  user_id: string;
  plan_id: 'developer' | 'team' | 'enterprise';
  status: QuotaEntitlementStatus;
  included_units: number;
  current_period_start: string | null;
  current_period_end: string | null;
  paddle_subscription_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpsertQuotaEntitlementData {
  user_id: string;
  plan_id: 'developer' | 'team' | 'enterprise';
  status: QuotaEntitlementStatus;
  included_units: number;
  current_period_start?: string | null;
  current_period_end?: string | null;
  paddle_subscription_id?: string | null;
}

export interface QuotaSummary {
  entitlement: QuotaEntitlement | null;
  total_allocated_units: number;
  plan_allocated_units: number;
  top_up_allocated_units: number;
  latest_allocation_at: string | null;
  legacy_transition_allowance: {
    source: 'creator_all_access';
    units: number;
    description: string;
  } | null;
}

export type QuotaUsageToolClass =
  | 'account'
  | 'discovery'
  | 'context'
  | 'generation'
  | 'guarded'
  | 'execution';

export type QuotaUsageOutcome =
  | 'success'
  | 'tool_error'
  | 'validation_error'
  | 'auth_error'
  | 'runtime_error';

export interface QuotaUsageEvent {
  id: string;
  user_id: string;
  tool_name: string;
  tool_class: QuotaUsageToolClass;
  units: number;
  outcome: QuotaUsageOutcome;
  created_at: string;
}

export interface CreateQuotaUsageEventData {
  user_id: string;
  tool_name: string;
  tool_class: QuotaUsageToolClass;
  units: number;
  outcome: QuotaUsageOutcome;
  created_at?: string;
}

export interface QuotaUsageClassBreakdown {
  tool_class: QuotaUsageToolClass;
  used_units: number;
  calls: number;
}

export interface QuotaUsageSummary {
  total_used_units: number;
  total_calls: number;
  by_tool_class: QuotaUsageClassBreakdown[];
  latest_event_at: string | null;
}

export interface BillingAccount {
  id: string;
  user_id: string;
  paddle_customer_id: string;
  created_at: string;
  updated_at: string;
}

export interface UpsertBillingAccountData {
  user_id: string;
  paddle_customer_id: string;
}

export interface BillingSubscription {
  id: string;
  user_id: string;
  paddle_subscription_id: string;
  plan_id: 'developer' | 'team' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due';
  current_period_start: string | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpsertBillingSubscriptionData {
  user_id: string;
  paddle_subscription_id: string;
  plan_id: 'developer' | 'team' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due';
  current_period_start?: string | null;
  current_period_end?: string | null;
}

/**
 * 무료 스크린 템플릿 레코드
 */
export interface FreeScreenTemplate {
  id: string;
  template_id: string;
  name: string;
  description: string | null;
  is_free: boolean;
  created_at: string;
}

/**
 * 사용자 프로필 데이터 (auth.users 확장)
 */
export interface UserProfile {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

/**
 * 사용자 업데이트 데이터
 */
export interface UpdateUserData {
  email?: string;
  // 향후 확장 가능한 필드들
  metadata?: Record<string, unknown>;
}

/**
 * API Key 레코드
 * SPEC-DEPLOY-001: MCP 서버 인증을 위한 API Key
 */
export interface ApiKey {
  id: string;
  user_id: string;
  key_hash: string;
  key_prefix: string;
  name: string;
  last_used_at: string | null;
  expires_at: string | null;
  revoked_at: string | null;
  created_at: string;
}

/**
 * API Key 생성 데이터
 */
export interface CreateApiKeyData {
  user_id: string;
  name: string;
  key_hash: string;
  key_prefix: string;
}

/**
 * API Key 응답 (평문 키 포함 - 생성 시에만 반환)
 */
export interface ApiKeyWithPlaintext {
  id: string;
  key: string; // 평문 키 (한 번만 반환)
  name: string;
  created_at: string;
}

/**
 * API Key 목록 항목 (평문 키 없음)
 */
export interface ApiKeyListItem {
  id: string;
  key_prefix: string;
  name: string;
  last_used_at: string | null;
  created_at: string;
}

/**
 * 데이터베이스 에러 타입
 */
export interface DatabaseError {
  message: string;
  code?: string;
  details?: string;
}
