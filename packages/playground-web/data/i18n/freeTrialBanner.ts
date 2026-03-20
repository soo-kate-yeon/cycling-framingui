import type { BlogLocale } from '../../lib/blog';

export interface FreeTrialBannerContent {
  label: string;
  cta: string;
}

export const freeTrialBannerContent: Record<BlogLocale, FreeTrialBannerContent> = {
  en: {
    label: 'Inspect themes, workflow, and shadow quota before you upgrade',
    cta: 'View plans',
  },
  ko: {
    label: '업그레이드 전에 테마, workflow, shadow quota를 먼저 확인하세요',
    cta: '플랜 보기',
  },
};

export function getFreeTrialBannerContent(locale: BlogLocale): FreeTrialBannerContent {
  return freeTrialBannerContent[locale] || freeTrialBannerContent.en;
}
