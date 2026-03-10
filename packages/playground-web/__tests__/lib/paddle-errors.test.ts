import { describe, expect, it } from 'vitest';
import type { PaddleEventData } from '@paddle/paddle-js';
import { getPaddleCheckoutErrorMessage } from '@/lib/paddle/errors';

describe('getPaddleCheckoutErrorMessage', () => {
  it('maps missing default checkout url errors to an actionable message', () => {
    const event: PaddleEventData = {
      name: 'checkout.error' as PaddleEventData['name'],
      code: 'validation',
      detail: 'transaction_default_checkout_url_not_set',
      type: 'api_error',
      documentation_url: 'https://developer.paddle.com/api-reference',
    };

    expect(getPaddleCheckoutErrorMessage(event)).toContain('default payment link/checkout URL');
  });

  it('ignores unrelated checkout errors', () => {
    const event: PaddleEventData = {
      name: 'checkout.error' as PaddleEventData['name'],
      code: 'validation',
      detail: 'some_other_error',
      type: 'api_error',
      documentation_url: 'https://developer.paddle.com/api-reference',
    };

    expect(getPaddleCheckoutErrorMessage(event)).toBeNull();
  });
});
