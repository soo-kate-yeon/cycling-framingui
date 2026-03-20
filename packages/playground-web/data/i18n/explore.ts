import type { GlobalLocale } from '../../contexts/GlobalLanguageContext';

interface ExploreI18nContent {
  header: {
    subtitle: string;
    title: string;
    description: string;
  };
  selectionHeader: {
    subtitle: string;
    title: string;
    description: string;
  };
  topBanner: {
    eyebrow: string;
    message: string;
    cta: string;
    dismissAriaLabel: string;
  };
  gallery: {
    noTemplates: string;
  };
  templateCard: {
    liveDemo: string;
    expandTextAria: string;
    collapseTextAria: string;
  };
  templateModal: {
    closeModalAria: string;
    trialCtaPrefix: string;
    oneTimePrice: string;
    liveDemo: string;
    getTwoTemplates: string;
    savePercent: string;
    getUnlimitedAccess: string;
    bestOffer: string;
    features: string;
    recommendedToUseFor: string;
    previousImageAria: string;
    nextImageAria: string;
    slideAriaPrefix: string;
  };
  templateLanding: {
    loadingTemplate: string;
    preview: string;
    guide: string;
    features: string;
    recommendedToUseFor: string;
    howToUse: string;
    readyToStart: string;
    finalCtaDescriptionSuffix: string;
  };
}

const content: Record<GlobalLocale, ExploreI18nContent> = {
  en: {
    header: {
      subtitle: 'framingui/explore',
      title: 'Select Theme',
      description:
        'Choose a design system to activate the Agentic Styling engine. Every theme is loaded directly from the MCP knowledge base.',
    },
    selectionHeader: {
      subtitle: 'framingui/explore',
      title: 'Compare Theme Options',
      description:
        'Review the available themes before choosing your quota plan or legacy access path.',
    },
    topBanner: {
      eyebrow: 'Explore · Design System',
      message: 'Inspect shadow quota before you upgrade',
      cta: 'View pricing',
      dismissAriaLabel: 'Dismiss quota transition banner',
    },
    gallery: {
      noTemplates: 'No templates found',
    },
    templateCard: {
      liveDemo: 'Live Demo',
      expandTextAria: 'Expand text',
      collapseTextAria: 'Collapse text',
    },
    templateModal: {
      closeModalAria: 'Close modal',
      trialCtaPrefix: '3-day unlimited trial, then',
      oneTimePrice: 'one-time',
      liveDemo: 'Live Demo',
      getTwoTemplates: 'Get 2 templates at $79',
      savePercent: 'Save 19%',
      getUnlimitedAccess: 'Get unlimited access: $119/year',
      bestOffer: 'Best Offer',
      features: 'Features',
      recommendedToUseFor: 'Recommended to use for',
      previousImageAria: 'Previous image',
      nextImageAria: 'Next image',
      slideAriaPrefix: 'Go to slide',
    },
    templateLanding: {
      loadingTemplate: 'Loading template...',
      preview: 'Preview',
      guide: 'Documentation',
      features: 'Features',
      recommendedToUseFor: 'Recommended to use for',
      howToUse: 'How to use',
      readyToStart: 'Ready to start?',
      finalCtaDescriptionSuffix: 'Purchase now and start building your next project with',
    },
  },
  ko: {
    header: {
      subtitle: 'framingui/explore',
      title: '테마를 선택합니다',
      description:
        '에이전틱 스타일링 엔진을 활성화할 디자인 시스템을 선택합니다. 모든 테마는 MCP 지식 베이스에서 직접 불러옵니다.',
    },
    selectionHeader: {
      subtitle: 'framingui/explore',
      title: '테마 옵션을 비교합니다',
      description:
        'quota 플랜 또는 레거시 접근 방식을 선택하기 전에 사용 가능한 테마를 비교합니다.',
    },
    topBanner: {
      eyebrow: 'Explore · 디자인 시스템',
      message: '업그레이드 전에 shadow quota를 먼저 확인하세요',
      cta: '요금 보기',
      dismissAriaLabel: 'quota 전환 배너 닫기',
    },
    gallery: {
      noTemplates: '템플릿을 찾을 수 없습니다.',
    },
    templateCard: {
      liveDemo: '라이브 데모',
      expandTextAria: '설명 펼치기',
      collapseTextAria: '설명 접기',
    },
    templateModal: {
      closeModalAria: '모달 닫기',
      trialCtaPrefix: '3일 무제한 체험후',
      oneTimePrice: '1회결제',
      liveDemo: '라이브 데모',
      getTwoTemplates: '₩110,000에 템플릿 2개 구매',
      savePercent: '19% 할인',
      getUnlimitedAccess: '₩160,000 연구독으로 모든 템플릿 무제한 이용',
      bestOffer: '최고 혜택',
      features: '주요 기능',
      recommendedToUseFor: '추천 대상',
      previousImageAria: '이전 이미지',
      nextImageAria: '다음 이미지',
      slideAriaPrefix: '슬라이드로 이동',
    },
    templateLanding: {
      loadingTemplate: '템플릿을 불러오는 중입니다...',
      preview: '데모 보기',
      guide: '가이드',
      features: '주요 기능',
      recommendedToUseFor: '추천 대상',
      howToUse: '적용 방법',
      readyToStart: '바로 시작하시겠습니까?',
      finalCtaDescriptionSuffix: '지금 구매하고 다음 프로젝트를 시작합니다:',
    },
  },
};

export function getExploreContent(locale: GlobalLocale): ExploreI18nContent {
  return content[locale];
}

// USD → KRW 고정 환율 (업데이트 시 여기만 수정)
const USD_TO_KRW = 1400;

export function toKRW(usdPrice: number): string {
  const krw = Math.round((usdPrice * USD_TO_KRW) / 1000) * 1000;
  return `₩${krw.toLocaleString('ko-KR')}`;
}

export function getTemplatePriceLabel(locale: GlobalLocale, price: number): string {
  if (locale === 'ko') {
    return `${toKRW(price)} / 1회 결제`;
  }
  return `$${price} / one-time`;
}

export function getTemplateBuyLabel(locale: GlobalLocale, price: number): string {
  if (locale === 'ko') {
    return `${toKRW(price)}에 구매`;
  }
  return `Buy for $${price}`;
}

export function getTemplateFinalCtaDescription(
  locale: GlobalLocale,
  templateName: string,
  suffix: string
): string {
  if (locale === 'ko') {
    return `${templateName}${suffix}`;
  }
  return `${suffix} ${templateName}.`;
}
