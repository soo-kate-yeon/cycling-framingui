/**
 * TAG: TAG-STUDIO-001-E006 (Pricing Display)
 * TAG: TAG-STUDIO-001-S001 (License Management)
 * TAG: TAG-STUDIO-001-U003 (Internationalization Support)
 *
 * Tests for PricingCardI18n component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { PricingCardI18n } from '../PricingCard.i18n';

const messages = {
  studio: {
    landing: {
      pricing: {
        free: {
          tier: 'Free',
          features: [
            'Explore MCP tools',
            'Preview components and themes',
            'Check usage visibility',
          ],
        },
        viewPlan: 'View Plan',
        manageAccess: 'Manage Access',
      },
    },
  },
};

const messagesKo = {
  studio: {
    landing: {
      pricing: {
        free: {
          tier: '무료',
          features: ['MCP 도구 살펴보기', '컴포넌트와 테마 미리보기', '사용량 가시성 확인'],
        },
        viewPlan: '플랜 보기',
        manageAccess: '접근 관리',
      },
    },
  },
};

function renderWithIntl(ui: React.ReactElement, locale = 'en') {
  return render(
    <NextIntlClientProvider locale={locale} messages={locale === 'ko' ? messagesKo : messages}>
      {ui}
    </NextIntlClientProvider>
  );
}

describe('PricingCardI18n', () => {
  describe('English translations', () => {
    it('should render tier name and price in English', () => {
      renderWithIntl(<PricingCardI18n tier="Free" price={0} />);

      expect(screen.getByText('Free')).toBeInTheDocument();
      expect(screen.getByText('$0')).toBeInTheDocument();
    });

    it('should render features in English', () => {
      renderWithIntl(<PricingCardI18n tier="Free" price={0} />);

      expect(screen.getByText('Explore MCP tools')).toBeInTheDocument();
      expect(screen.getByText('Preview components and themes')).toBeInTheDocument();
      expect(screen.getByText('Check usage visibility')).toBeInTheDocument();
    });

    it('should show "View Plan" button in English when no license', () => {
      renderWithIntl(<PricingCardI18n tier="Free" price={0} hasLicense={false} />);

      expect(screen.getByText('View Plan')).toBeInTheDocument();
    });

    it('should show "Manage Access" button in English when has license', () => {
      renderWithIntl(<PricingCardI18n tier="Free" price={0} hasLicense={true} />);

      expect(screen.getByText('Manage Access')).toBeInTheDocument();
    });
  });

  describe('Korean translations', () => {
    it('should render tier name and features in Korean', () => {
      renderWithIntl(<PricingCardI18n tier="Free" price={0} />, 'ko');

      expect(screen.getByText('무료')).toBeInTheDocument();
      expect(screen.getByText('MCP 도구 살펴보기')).toBeInTheDocument();
    });

    it('should show "플랜 보기" button in Korean', () => {
      renderWithIntl(<PricingCardI18n tier="Free" price={0} hasLicense={false} />, 'ko');

      expect(screen.getByText('플랜 보기')).toBeInTheDocument();
    });

    it('should show "접근 관리" button in Korean', () => {
      renderWithIntl(<PricingCardI18n tier="Free" price={0} hasLicense={true} />, 'ko');

      expect(screen.getByText('접근 관리')).toBeInTheDocument();
    });
  });

  describe('Interactivity', () => {
    it('should call onPurchase when buy button is clicked', async () => {
      const user = userEvent.setup();
      const onPurchase = vi.fn();
      renderWithIntl(<PricingCardI18n tier="Free" price={0} onPurchase={onPurchase} />);

      await user.click(screen.getByText('View Plan'));
      expect(onPurchase).toHaveBeenCalledWith('Free');
    });

    it('should call onManage when manage button is clicked', async () => {
      const user = userEvent.setup();
      const onManage = vi.fn();
      renderWithIntl(
        <PricingCardI18n tier="Free" price={0} hasLicense={true} onManage={onManage} />
      );

      await user.click(screen.getByText('Manage Access'));
      expect(onManage).toHaveBeenCalledOnce();
    });
  });
});
