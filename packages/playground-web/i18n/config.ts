/**
 * i18n configuration for next-intl
 * Note: Middleware removed for Next.js 16 compatibility
 */

export const locales = ['en', 'ko'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ko: '한국어',
};
