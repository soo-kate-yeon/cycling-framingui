import { describe, expect, it } from 'vitest';
import { getPricingContent } from '@/data/i18n/pricing';

describe('pricing content', () => {
  it('describes FramingUI features in Korean without transition copy', () => {
    const content = getPricingContent('ko');
    const firstFaqItem = content.faq.items[0];

    expect(content.capabilities.title).toContain('FramingUI');
    expect(content.hero.title).toBe('FramingUI 가격 정책');
    expect(content.plans.free.features[0]).toContain('MCP 도구');
    expect(content.plans.developer.features).toContain('screen generation context');
    expect(firstFaqItem?.title ?? '').toContain('FramingUI');
  });
});
