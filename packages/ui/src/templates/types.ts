/**
 * @framingui/ui - Screen Template Types
 * SPEC-UI-001 Phase 3: Screen Template System Foundation
 *
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 * [TAG-UI002-001] ScreenTemplate interface 정의 및 타입 준수
 * [TAG-UI002-002] Tekton 레이아웃 토큰 사용 (CSS 변수)
 * [TAG-UI002-003] AI 커스터마이징 경계 정의
 * [TAG-UI002-004] 필수 컴포넌트 검증 시스템
 * [TAG-UI002-005] 반응형 브레이크포인트 지원
 * [TAG-UI002-006] WCAG 2.1 AA 준수 기반 타입 설계
 *
 * WHY: 타입 정의가 템플릿 시스템의 타입 안전성을 보장
 * IMPACT: 타입 정의 누락 시 런타임 오류 발생
 */

import type { ComponentType, ReactNode } from 'react';

/**
 * Screen categories for template organization
 */
export type ScreenCategory =
  | 'auth' // Login, Signup, Forgot Password, Verification
  | 'dashboard' // Dashboard Overview, Analytics
  | 'form' // Settings, Profile
  | 'marketing' // Landing Page
  | 'feedback'; // Loading, Error, Empty State, Success

/**
 * Template layout types
 */
export type TemplateLayout =
  | 'centered' // Auth screens, feedback screens
  | 'sidebar' // Dashboard, Settings
  | 'full'; // Landing page

/**
 * Responsive breakpoints
 */
export interface ResponsiveBreakpoints {
  mobile: number; // < 768px
  tablet: number; // 768px - 1024px
  desktop: number; // >= 1024px
}

/**
 * Layout configuration per breakpoint
 */
export interface ResponsiveLayout {
  mobile: {
    padding: string; // var(--layout-padding-mobile)
    gap: string; // var(--layout-gap-mobile)
    columns: number; // 4
  };
  tablet: {
    padding: string; // var(--layout-padding-tablet)
    gap: string; // var(--layout-gap-tablet)
    columns: number; // 8
  };
  desktop: {
    padding: string; // var(--layout-padding-desktop)
    gap: string; // var(--layout-gap-desktop)
    columns: number; // 12
  };
}

/**
 * Template layout configuration
 */
export interface TemplateLayoutConfig {
  type: TemplateLayout;
  responsive: ResponsiveLayout;
}

/**
 * Section template for composing screens
 */
export interface SectionTemplate {
  id: string;
  name: string;
  slot: string; // 'header', 'sidebar', 'main', 'footer'
  required: boolean;
  Component: ComponentType<any>;
}

/**
 * Customization boundaries for AI
 */
export interface CustomizationBoundaries {
  texts: string[]; // AI can modify these text keys
  optional: string[]; // AI can add/remove these optional features
  slots: string[]; // AI can inject content into these slots
}

/**
 * Template skeleton (non-customizable structure)
 */
export interface TemplateSkeleton {
  shell: string; // 'centered-card', 'sidebar-layout', 'full-page'
  page: string; // Page wrapper configuration
  sections: SectionTemplate[];
}

/**
 * Screen Template Props
 */
export interface ScreenTemplateProps {
  children?: ReactNode;
  className?: string;
  slots?: Record<string, ReactNode>;
  texts?: Record<string, string>;
  options?: Record<string, string | boolean | number>;
}

/**
 * Main Screen Template interface
 */
export interface ScreenTemplate {
  id: string;
  name: string;
  category: ScreenCategory;
  description: string;

  // Structure
  skeleton: TemplateSkeleton;
  layout: TemplateLayoutConfig;

  // Customization
  customizable: CustomizationBoundaries;
  requiredComponents: string[];

  // Component
  Component: ComponentType<ScreenTemplateProps>;

  // Metadata
  version: string;
  created: string;
  updated: string;
  tags?: string[];
}

/**
 * Template Registry Entry
 */
export interface TemplateRegistryEntry {
  template: ScreenTemplate;
  metadata: {
    usageCount: number;
    lastUsed?: string;
  };
}

/**
 * Default responsive layout configuration
 */
export const DEFAULT_RESPONSIVE_LAYOUT: ResponsiveLayout = {
  mobile: {
    padding: 'var(--layout-padding-mobile)', // 16px
    gap: 'var(--layout-gap-mobile)', // 16px
    columns: 4,
  },
  tablet: {
    padding: 'var(--layout-padding-tablet)', // 32px
    gap: 'var(--layout-gap-tablet)', // 24px
    columns: 8,
  },
  desktop: {
    padding: 'var(--layout-padding-desktop)', // 64px
    gap: 'var(--layout-gap-desktop)', // 32px
    columns: 12,
  },
};

/**
 * Default breakpoints
 */
export const DEFAULT_BREAKPOINTS: ResponsiveBreakpoints = {
  mobile: 768,
  tablet: 1024,
  desktop: 1024,
};
