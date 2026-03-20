import { describe, expect, it } from 'vitest';
import { toPaddlePriceTier } from '@/lib/paddle/config';

describe('paddle config label mapping', () => {
  it('accepts quota-era legacy access labels while preserving old aliases', () => {
    expect(toPaddlePriceTier('Legacy Single Access')).toBe('single');
    expect(toPaddlePriceTier('Legacy Double Access')).toBe('double');
    expect(toPaddlePriceTier('Legacy All Access')).toBe('creator');
    expect(toPaddlePriceTier('Creator Pass')).toBe('creator');
    expect(toPaddlePriceTier('Unknown')).toBeNull();
  });
});
