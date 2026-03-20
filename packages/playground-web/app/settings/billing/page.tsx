/**
 * Billing Settings Page
 * SPEC-DEPLOY-001 Phase 3: 라이선스 및 결제 관리
 *
 * WHY: 사용자가 보유한 라이선스와 구독 상태를 확인하고 관리
 * IMPACT: 결제 투명성 및 사용자 셀프서비스 제공
 */

'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { QuotaSummary, QuotaUsageSummary, UserLicense } from '@/lib/db/types';
import { getLegacyTransitionAllowance } from '@/lib/billing/legacy-transition-allowance';
import { formatLegacyTierLabel } from '@/lib/billing/legacy-tier-labels';
import { isPaymentsEnabled } from '@/lib/paddle/config';

export default function BillingPage() {
  const { user } = useAuth();
  const [licenses, setLicenses] = useState<UserLicense[]>([]);
  const [quota, setQuota] = useState<QuotaSummary | null>(null);
  const [usage, setUsage] = useState<QuotaUsageSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    async function fetchLicenses() {
      try {
        const [licensesRes, quotaRes, usageRes] = await Promise.all([
          fetch('/api/user/licenses'),
          fetch('/api/user/quota'),
          fetch('/api/user/usage'),
        ]);

        if (licensesRes.ok) {
          const data = await licensesRes.json();
          setLicenses(data.licenses ?? []);
        }

        if (quotaRes.ok) {
          const data = await quotaRes.json();
          setQuota(data.quota ?? null);
        }

        if (usageRes.ok) {
          const data = await usageRes.json();
          setUsage(data.usage ?? null);
        }
      } catch (err) {
        console.error('Billing data 조회 실패:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLicenses();
  }, [user]);

  const activeLicenses = licenses.filter((l) => l.is_active);
  const expiredLicenses = licenses.filter((l) => !l.is_active);
  const legacyTransitionAllowance =
    quota?.legacy_transition_allowance ?? getLegacyTransitionAllowance(activeLicenses);

  // 결제 기능 비활성화 시
  if (!isPaymentsEnabled()) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="mw-heading-3">Billing</h2>
          <p className="mw-text-secondary mt-2">
            View your subscription details and payment history
          </p>
        </div>
        <div className="mw-card">
          <div className="mw-card-header">
            <h3 className="mw-card-title">Subscription & Billing</h3>
            <p className="mw-card-description">Payment features are not currently enabled.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="mw-heading-3">Billing</h2>
          <p className="mw-text-secondary mt-2">Please sign in to view your billing information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mw-heading-3">Billing</h2>
        <p className="mw-text-secondary mt-2">
          View your subscription details, legacy licenses, and quota transition status
        </p>
      </div>

      <div className="mw-card border-amber-300 bg-amber-50/70">
        <div className="mw-card-header">
          <h3 className="mw-card-title">Quota Transition</h3>
          <p className="mw-card-description">
            FramingUI is transitioning from template-first billing to MCP quota plans. Shadow quota
            metering is being introduced before any enforced usage billing.
          </p>
        </div>
        <div className="mw-card-content">
          <ul className="space-y-2 text-sm text-neutral-700">
            <li>Weighted tool-unit metering is the future billing model.</li>
            <li>Legacy template licenses remain valid during the transition.</li>
            <li>
              Pricing and account controls will move to included quota plus top-up or overage.
            </li>
          </ul>
        </div>
      </div>

      <div className="mw-card">
        <div className="mw-card-header">
          <h3 className="mw-card-title">Quota Overview</h3>
          <p className="mw-card-description">
            Your current paid-plan entitlement and recorded quota allocations
          </p>
        </div>
        <div className="mw-card-content space-y-3">
          {isLoading ? (
            <p className="mw-text-secondary">Loading...</p>
          ) : quota?.entitlement ? (
            <>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">Plan</span>
                <span className="font-medium text-neutral-900">{quota.entitlement.plan_id}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">Status</span>
                <span className="font-medium text-neutral-900">{quota.entitlement.status}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">Included Units</span>
                <span className="font-medium text-neutral-900">
                  {quota.entitlement.included_units.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">Total Allocated Units</span>
                <span className="font-medium text-neutral-900">
                  {quota.total_allocated_units.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">Top-up Units</span>
                <span className="font-medium text-neutral-900">
                  {quota.top_up_allocated_units.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">Current Period</span>
                <span className="font-medium text-neutral-900">
                  {formatPeriodRange(
                    quota.entitlement.current_period_start,
                    quota.entitlement.current_period_end
                  )}
                </span>
              </div>
            </>
          ) : (
            <p className="mw-text-secondary">No paid quota entitlement recorded yet.</p>
          )}
        </div>
      </div>

      {legacyTransitionAllowance ? (
        <div className="mw-card border-emerald-300 bg-emerald-50/70">
          <div className="mw-card-header">
            <h3 className="mw-card-title">Legacy Migration Allowance</h3>
            <p className="mw-card-description">{legacyTransitionAllowance.description}</p>
          </div>
          <div className="mw-card-content">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-500">Allowance Units</span>
              <span className="font-medium text-neutral-900">
                {legacyTransitionAllowance.units.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mw-card">
        <div className="mw-card-header">
          <h3 className="mw-card-title">Usage Breakdown</h3>
          <p className="mw-card-description">Current-period MCP usage grouped by tool class</p>
        </div>
        <div className="mw-card-content space-y-3">
          {isLoading ? (
            <p className="mw-text-secondary">Loading...</p>
          ) : usage && usage.total_calls > 0 ? (
            <>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">Total Used Units</span>
                <span className="font-medium text-neutral-900">
                  {usage.total_used_units.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">Total Calls</span>
                <span className="font-medium text-neutral-900">
                  {usage.total_calls.toLocaleString()}
                </span>
              </div>
              <div className="space-y-2">
                {usage.by_tool_class.map((entry) => (
                  <div
                    key={entry.tool_class}
                    className="flex items-center justify-between rounded border border-neutral-200 px-3 py-2 text-sm"
                  >
                    <span className="text-neutral-700">
                      {formatToolClassLabel(entry.tool_class)}
                    </span>
                    <span className="font-medium text-neutral-900">
                      {entry.used_units.toLocaleString()} units / {entry.calls} calls
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="mw-text-secondary">No current-period MCP usage recorded yet.</p>
          )}
        </div>
      </div>

      {/* 활성 라이선스 */}
      <div className="mw-card">
        <div className="mw-card-header">
          <h3 className="mw-card-title">Active Legacy Licenses</h3>
          <p className="mw-card-description">
            Your currently active template-era licenses and subscriptions
          </p>
        </div>
        <div className="mw-card-content">
          {isLoading ? (
            <p className="mw-text-secondary">Loading...</p>
          ) : activeLicenses.length === 0 ? (
            <div className="text-center py-8">
              <p className="mw-text-secondary mb-4">No active legacy licenses yet.</p>
              <a
                href="/#pricing"
                className="inline-block px-6 py-2 text-sm font-bold uppercase tracking-wider text-white bg-neutral-900 hover:bg-neutral-800 transition-colors rounded"
              >
                View Pricing
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {activeLicenses.map((license) => (
                <LicenseRow key={license.id} license={license} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 만료/비활성 라이선스 */}
      {expiredLicenses.length > 0 && (
        <div className="mw-card">
          <div className="mw-card-header">
            <h3 className="mw-card-title">Expired / Inactive Legacy Licenses</h3>
          </div>
          <div className="mw-card-content">
            <div className="space-y-4">
              {expiredLicenses.map((license) => (
                <LicenseRow key={license.id} license={license} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatPeriodRange(start: string | null, end: string | null): string {
  if (!start || !end) {
    return 'Not set';
  }

  return `${new Date(start).toLocaleDateString()} - ${new Date(end).toLocaleDateString()}`;
}

function formatToolClassLabel(toolClass: string): string {
  switch (toolClass) {
    case 'discovery':
      return 'Discovery';
    case 'context':
      return 'Context';
    case 'generation':
      return 'Generation';
    case 'guarded':
      return 'Guarded Validation';
    case 'execution':
      return 'Execution';
    case 'account':
      return 'Account';
    default:
      return toolClass;
  }
}

function LicenseRow({ license }: { license: UserLicense }) {
  const purchasedAt = new Date(license.purchased_at).toLocaleDateString();
  const expiresAt = license.expires_at
    ? new Date(license.expires_at).toLocaleDateString()
    : 'Lifetime';

  return (
    <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <span className="font-medium text-neutral-900">{license.theme_id}</span>
          <span className="px-2 py-0.5 text-xs font-bold uppercase tracking-wider bg-neutral-100 text-neutral-600 rounded">
            {formatLegacyTierLabel(license.tier)}
          </span>
          {license.is_active ? (
            <span className="px-2 py-0.5 text-xs font-bold uppercase tracking-wider bg-green-100 text-green-700 rounded">
              Active
            </span>
          ) : (
            <span className="px-2 py-0.5 text-xs font-bold uppercase tracking-wider bg-red-100 text-red-700 rounded">
              Inactive
            </span>
          )}
        </div>
        <div className="mt-1 text-sm text-neutral-500">
          Purchased: {purchasedAt} | Expires: {expiresAt}
        </div>
      </div>
    </div>
  );
}
