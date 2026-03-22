/**
 * Google Analytics 4 Component
 *
 * Usage: Add <GoogleAnalytics /> in layout.tsx
 * Required env: NEXT_PUBLIC_GA_MEASUREMENT_ID
 *
 * FIX: SPA 라우트 변경 시 page_view 전송 추가 (2026-03-22)
 * - usePathname으로 라우트 변경 감지
 * - 변경마다 gtag config 재전송 → 바운스율 정상화
 */

'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/**
 * 라우트 변경 감지 및 page_view 전송
 */
function RouteChangeTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname || !window.gtag || !GA_MEASUREMENT_ID) {
      return;
    }

    const url = pathname + (searchParams?.toString() ? '?' + searchParams.toString() : '');

    // GA4에 page_view 전송
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }, [pathname, searchParams]);

  return null;
}

export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
      {/* Suspense 필수: useSearchParams는 Suspense boundary 필요 */}
      <Suspense fallback={null}>
        <RouteChangeTracker />
      </Suspense>
    </>
  );
}

/**
 * GA4 이벤트 트래킹 헬퍼
 *
 * @example
 * trackEvent('cta_click', { button_name: 'free_trial', location: 'hero' })
 */
export function trackEvent(
  eventName: string,
  parameters?: Record<string, string | number | boolean>
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
}

// TypeScript 타입 확장
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js',
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void;
    dataLayer: unknown[];
  }
}
