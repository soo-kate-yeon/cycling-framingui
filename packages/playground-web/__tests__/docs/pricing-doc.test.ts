import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('pricing documentation', () => {
  it('describes quota plans as the default catalog instead of legacy template SKUs', () => {
    const pricingDoc = readFileSync(resolve(process.cwd(), '../../docs/pricing.md'), 'utf8');

    expect(pricingDoc).toContain('Free Quota');
    expect(pricingDoc).toContain('Developer');
    expect(pricingDoc).toContain('weighted tool units');
    expect(pricingDoc).toContain('shadow billing');

    expect(pricingDoc).not.toContain('Single Template');
    expect(pricingDoc).not.toContain('Double Package');
    expect(pricingDoc).not.toContain('Creator Pass');
    expect(pricingDoc).not.toContain('| **Team** |');
  });
});
