import { describe, expect, it } from 'vitest';
import {
  buildLegacyTemplateCheckoutData,
  buildQuotaPlanCheckoutData,
  buildQuotaTopUpCheckoutData,
  parsePaddleCustomData,
} from '@/lib/paddle/contracts';

describe('paddle contracts', () => {
  it('builds legacy template checkout custom data', () => {
    expect(
      buildLegacyTemplateCheckoutData({
        userId: 'user-1',
        tier: 'single',
        themeId: 'pebble',
      })
    ).toEqual({
      user_id: 'user-1',
      purchase_kind: 'legacy_template',
      billing_model: 'template_license',
      tier: 'single',
      theme_id: 'pebble',
    });
  });

  it('builds quota plan checkout custom data', () => {
    expect(
      buildQuotaPlanCheckoutData({
        userId: 'user-1',
        planId: 'developer',
      })
    ).toEqual({
      user_id: 'user-1',
      purchase_kind: 'plan',
      billing_model: 'quota',
      plan_id: 'developer',
    });
  });

  it('builds quota top-up custom data', () => {
    expect(
      buildQuotaTopUpCheckoutData({
        userId: 'user-1',
        topUpUnits: 1000,
      })
    ).toEqual({
      user_id: 'user-1',
      purchase_kind: 'top_up',
      billing_model: 'quota',
      top_up_units: 1000,
    });
  });

  it('parses quota custom data and infers model semantics', () => {
    expect(
      parsePaddleCustomData({
        user_id: 'user-1',
        purchase_kind: 'plan',
        billing_model: 'quota',
        plan_id: 'team',
      })
    ).toEqual({
      user_id: 'user-1',
      purchase_kind: 'plan',
      billing_model: 'quota',
      plan_id: 'team',
    });
  });
});
