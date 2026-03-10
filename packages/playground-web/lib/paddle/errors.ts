import type { PaddleEventData } from '@paddle/paddle-js';

export function getPaddleCheckoutErrorMessage(event: PaddleEventData): string | null {
  if (event.name !== 'checkout.error') {
    return null;
  }

  if (event.code === 'validation' && event.detail === 'transaction_default_checkout_url_not_set') {
    return [
      'Payments are temporarily unavailable.',
      'Paddle production is missing a default payment link/checkout URL in the dashboard.',
      'Set it in Paddle, then retry checkout.',
    ].join(' ');
  }

  return null;
}
