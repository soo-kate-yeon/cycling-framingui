/**
 * Preview Banner Component
 *
 * 테마 미리보기 페이지 상단에 고정되는 배너
 * - 배경색 자동 인식하여 dark/light 모드 전환
 * - 왼쪽/중앙: "This page is made with Tekton"
 * - 오른쪽: CTA 버튼 "Get This Design" (rounded-full)
 * - 반응형: 모바일에서는 짧은 메시지 + 작은 버튼
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface PreviewBannerProps {
  templateId: string;
  templateName: string;
}

/**
 * 배경색의 밝기를 계산하여 dark 모드인지 판단
 * @param color - RGB 또는 Hex 색상 문자열
 * @returns dark 모드 여부
 */
function isDarkColor(color: string): boolean {
  let r = 0,
    g = 0,
    b = 0;

  // RGB 형식 처리
  const rgbMatch = color.match(/\d+/g);
  if (rgbMatch && rgbMatch.length >= 3) {
    [r, g, b] = rgbMatch.slice(0, 3).map(Number) as [number, number, number];
  }
  // Hex 형식 처리 (#FFFFFF)
  else if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else {
    return false;
  }

  // 상대적 밝기 계산 (YIQ formula)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // 128 이하면 dark, 초과면 light
  return brightness <= 128;
}

export function PreviewBanner({ templateId }: PreviewBannerProps) {
  const [isDark, setIsDark] = useState(true); // 기본값: dark

  useEffect(() => {
    let retryCount = 0;
    const MAX_RETRIES = 10; // 최대 10번 재시도 (2초)
    const RETRY_INTERVAL = 200; // 200ms 간격

    // 배경색 감지 - CSS 변수 또는 실제 배경색
    const detectBackgroundColor = () => {
      const rootStyles = window.getComputedStyle(document.documentElement);

      // 1. CSS 변수 --bg-canvas 확인
      let bgColor = rootStyles.getPropertyValue('--bg-canvas').trim();

      // CSS 변수가 없고 재시도 가능하면 재시도
      if (!bgColor && retryCount < MAX_RETRIES) {
        retryCount++;
        setTimeout(detectBackgroundColor, RETRY_INTERVAL);
        return;
      }

      // 2. CSS 변수가 없으면 body의 배경색 확인
      if (!bgColor) {
        bgColor = window.getComputedStyle(document.body).backgroundColor;
      }

      // 3. 여전히 없으면 첫 번째 자식 div의 배경색 확인
      if (!bgColor || bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') {
        const mainElement = document.querySelector('[class*="bg-"]');
        if (mainElement) {
          bgColor = window.getComputedStyle(mainElement).backgroundColor;
        }
      }

      if (bgColor) {
        setIsDark(isDarkColor(bgColor));
      }
    };

    // 초기 감지 (약간의 딜레이)
    const timer = setTimeout(detectBackgroundColor, 100);

    // 테마 변경 감지를 위한 Observer
    const observer = new MutationObserver(() => {
      retryCount = 0; // 재시도 카운터 리셋
      setTimeout(detectBackgroundColor, 50);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style', 'class'],
      subtree: true,
    });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 h-12 flex items-center justify-between px-4 sm:px-6 transition-colors ${
        isDark ? 'bg-black text-white' : 'bg-white text-black border-b border-neutral-200'
      }`}
    >
      {/* Left/Center: Message - Responsive */}
      <div className="flex-1">
        <p className="text-xs sm:text-sm font-medium">
          {/* Mobile: Short message */}
          <span className="sm:hidden">Made with Tekton</span>
          {/* Desktop: Full message */}
          <span className="hidden sm:inline">
            This page is made with Tekton — Experience the design system in action
          </span>
        </p>
      </div>

      {/* Right: CTA Button - Responsive, Rounded Full */}
      <Link
        href={`/explore/template/${templateId}`}
        className={`ml-4 px-4 py-2 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors rounded-full whitespace-nowrap ${
          isDark
            ? 'bg-white text-black hover:bg-neutral-200'
            : 'bg-black text-white hover:bg-neutral-800'
        }`}
      >
        {/* Mobile: Short text */}
        <span className="sm:hidden">Get Design</span>
        {/* Desktop: Full text */}
        <span className="hidden sm:inline">Get This Design</span>
      </Link>
    </div>
  );
}
