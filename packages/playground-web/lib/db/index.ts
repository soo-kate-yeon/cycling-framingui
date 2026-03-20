/**
 * Database Module Exports
 * SPEC-AUTH-001: Supabase 인증 통합
 *
 * WHY: 데이터베이스 관련 모든 함수와 타입을 한 곳에서 import 가능하도록 함
 * IMPACT: 코드 가독성 및 유지보수성 향상
 */

// Types
export type {
  LicenseTier,
  UserLicense,
  CreateLicenseData,
  UpdateLicenseData,
  QuotaAllocationType,
  QuotaAllocation,
  CreateQuotaAllocationData,
  QuotaEntitlementStatus,
  QuotaEntitlement,
  UpsertQuotaEntitlementData,
  QuotaSummary,
  QuotaUsageToolClass,
  QuotaUsageOutcome,
  QuotaUsageEvent,
  CreateQuotaUsageEventData,
  QuotaUsageClassBreakdown,
  QuotaUsageSummary,
  BillingAccount,
  UpsertBillingAccountData,
  BillingSubscription,
  UpsertBillingSubscriptionData,
  FreeScreenTemplate,
  UserProfile,
  UpdateUserData,
  DatabaseError,
  ApiKey,
  CreateApiKeyData,
  ApiKeyWithPlaintext,
  ApiKeyListItem,
} from './types';

// User operations
export { createOrUpdateUser, getUserById, updateUser, getCurrentUser } from './users';

// License operations
export {
  getUserLicenses,
  createLicense,
  checkLicense,
  updateLicense,
  getActiveLicenseCount,
  deactivateExpiredLicenses,
} from './licenses';

// Quota allocation operations
export { createQuotaAllocation } from './quota-allocations';
export { upsertQuotaEntitlement } from './quota-entitlements';
export { getUserQuotaSummary } from './quota-summary';
export { createQuotaUsageEvent, getUserUsageSummary } from './quota-usage-events';
export { upsertBillingAccount } from './billing-accounts';
export { upsertBillingSubscription } from './billing-subscriptions';

// Template operations
export {
  getFreeTemplates,
  getTemplateById,
  isFreeTemplate,
  checkMultipleTemplates,
  canAccessTemplate,
  getFreeTemplateCount,
} from './templates';

// API Key operations (SPEC-DEPLOY-001)
export {
  createApiKey,
  getApiKeysByUserId,
  revokeApiKey,
  generateApiKey,
  verifyApiKey,
} from './api-keys';
