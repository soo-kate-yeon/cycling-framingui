/**
 * Google Analytics 4 이벤트 헬퍼 함수
 *
 * 타입 안전한 이벤트 트래킹을 위한 유틸리티 함수들
 *
 * WHY: 일관된 이벤트 명명과 타입 안전성 보장
 * IMPACT: 런타임 에러 방지 및 개발자 경험 향상
 */

/**
 * 이벤트 타입 정의
 */
export type AnalyticsEvent =
  | 'page_view'
  | 'cta_click'
  | 'blog_cta_click'
  | 'template_select'
  | 'template_view'
  | 'pricing_view'
  | 'pricing_purchase_clicked'
  | 'pricing_manage_clicked'
  | 'transition_access_signup_click'
  | 'funnel_transition_access_started'
  // Legacy aliases kept for compatibility with historical dashboards.
  | 'free_trial_signup_click'
  | 'funnel_home_entered'
  | 'funnel_docs_or_explore_entered'
  | 'funnel_primary_cta_clicked'
  | 'funnel_free_trial_started';

/**
 * GA4가 초기화되었는지 확인
 */
export const isGAInitialized = (): boolean => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
};

/**
 * GA4 이벤트 전송
 */
const trackGA = (eventName: string, properties?: Record<string, unknown>): void => {
  if (!isGAInitialized()) {
    return;
  }
  window.gtag('event', eventName, properties);
};

/**
 * CTA 클릭 이벤트 속성
 */
export interface CtaClickProps {
  button_name: string;
  location: string;
}

export interface FunnelSectionEnterProps {
  section: 'docs' | 'explore';
  path: string;
}

export interface FunnelPrimaryCtaClickProps {
  cta_id: string;
  cta_label: string;
  location: string;
  destination?: string;
  cta_variant?: 'primary' | 'secondary' | 'beta' | 'free-start';
}

export interface TransitionAccessStartedProps {
  entry_point: string;
  is_authenticated: boolean;
}

export type FunnelFreeTrialStartedProps = TransitionAccessStartedProps;

export interface PricingPurchaseProps {
  tier: string;
  price: number;
  is_featured: boolean;
}

export interface TemplateSelectProps {
  template_name: string;
}

export interface TemplateViewProps {
  template_id: string;
  template_name: string;
  location: 'landing' | 'explore';
}

export interface BlogCtaClickProps {
  blog_slug: string;
  cta_type: 'inline' | 'sidebar' | 'footer';
  destination: string;
}

/**
 * 페이지 뷰 이벤트 트래킹
 */
export const trackPageView = (): void => {
  trackGA('page_view', {
    page_location: window.location.href,
    page_path: window.location.pathname,
  });
};

/**
 * CTA 클릭 이벤트 트래킹
 */
export const trackCtaClick = (props: CtaClickProps): void => {
  trackGA('cta_click', {
    button_name: props.button_name,
    location: props.location,
  });
};

/**
 * 템플릿 선택 이벤트 트래킹
 */
export const trackTemplateSelect = (props: TemplateSelectProps): void => {
  trackGA('template_select', {
    template_name: props.template_name,
  });
};

/**
 * 템플릿 상세 모달 열기 이벤트 트래킹
 */
export const trackTemplateView = (props: TemplateViewProps): void => {
  trackGA('template_view', {
    template_id: props.template_id,
    template_name: props.template_name,
    location: props.location,
  });
};

/**
 * 블로그 CTA 클릭 이벤트 트래킹
 */
export const trackBlogCtaClick = (props: BlogCtaClickProps): void => {
  trackGA('blog_cta_click', {
    blog_slug: props.blog_slug,
    cta_type: props.cta_type,
    destination: props.destination,
  });
};

/**
 * 가격 페이지 뷰 이벤트 트래킹
 */
export const trackPricingView = (): void => {
  trackGA('pricing_view');
};

/**
 * Transition access signup click tracking.
 */
export const trackTransitionAccessSignupClick = (): void => {
  trackGA('transition_access_signup_click');
};

/**
 * Legacy alias retained for existing call sites.
 */
export const trackBetaSignupClick = (): void => {
  trackTransitionAccessSignupClick();
};

/**
 * 커스텀 이벤트 트래킹
 */
export const trackEvent = (eventName: string, properties?: Record<string, unknown>): void => {
  trackGA(eventName, properties);
};

export const trackFunnelHomeEntered = (): void => {
  trackGA('funnel_home_entered', {
    page_path: '/',
  });
};

export const trackFunnelSectionEntered = (props: FunnelSectionEnterProps): void => {
  trackGA('funnel_docs_or_explore_entered', {
    section: props.section,
    page_path: props.path,
  });
};

export const trackFunnelPrimaryCtaClick = (props: FunnelPrimaryCtaClickProps): void => {
  trackGA('funnel_primary_cta_clicked', {
    cta_id: props.cta_id,
    cta_label: props.cta_label,
    location: props.location,
    destination: props.destination,
    cta_variant: props.cta_variant,
  });
};

export const trackFunnelTransitionAccessStarted = (props: TransitionAccessStartedProps): void => {
  trackGA('funnel_transition_access_started', {
    entry_point: props.entry_point,
    is_authenticated: props.is_authenticated,
  });
};

/**
 * Legacy alias retained for existing call sites.
 */
export const trackFunnelFreeTrialStarted = (props: FunnelFreeTrialStartedProps): void => {
  trackFunnelTransitionAccessStarted(props);
};

export const trackPricingPurchaseClick = (props: PricingPurchaseProps): void => {
  trackGA('pricing_purchase_clicked', {
    tier: props.tier,
    price: props.price,
    is_featured: props.is_featured,
  });
};

export const trackPricingManageClick = (props: { tier: string }): void => {
  trackGA('pricing_manage_clicked', {
    tier: props.tier,
  });
};

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
