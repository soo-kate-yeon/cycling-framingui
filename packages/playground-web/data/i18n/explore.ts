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
      title: 'Pick 2 Templates',
      description: 'Choose 2 templates for your Double Package.',
    },
    topBanner: {
      eyebrow: 'Explore · Design System',
      message: 'Start your 3-day free trial',
      cta: 'Start free trial',
      dismissAriaLabel: 'Dismiss free trial banner',
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
      oneTimePrice: 'one-time',
      liveDemo: 'Live Demo',
      getTwoTemplates: 'Get 2 templates at $99',
      savePercent: 'Save 16%',
      getUnlimitedAccess: 'Get unlimited access: $149/yearly',
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
      title: '템플릿 2개를 선택합니다',
      description: '더블 패키지에 포함할 템플릿 2개를 선택합니다.',
    },
    topBanner: {
      eyebrow: 'Explore · 디자인 시스템',
      message: '3일 무료체험을 시작합니다',
      cta: '무료체험 시작',
      dismissAriaLabel: '무료체험 배너 닫기',
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
      oneTimePrice: '1회 결제',
      liveDemo: '라이브 데모',
      getTwoTemplates: '$99에 템플릿 2개 구매',
      savePercent: '16% 할인',
      getUnlimitedAccess: '$149 연구독으로 모든 템플릿 무제한 이용',
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
  ja: {
    header: {
      subtitle: 'framingui/explore',
      title: 'テーマを選択',
      description:
        'Agentic Styling エンジンを有効にするデザインシステムを選択します。すべてのテーマは MCP ナレッジベースから直接読み込みます。',
    },
    selectionHeader: {
      subtitle: 'framingui/explore',
      title: 'テンプレートを2つ選択',
      description: 'Double Package に含めるテンプレートを2つ選択します。',
    },
    topBanner: {
      eyebrow: 'Explore · デザインシステム',
      message: '3日間の無料トライアルを開始',
      cta: '無料トライアル開始',
      dismissAriaLabel: '無料トライアルバナーを閉じる',
    },
    gallery: {
      noTemplates: 'テンプレートが見つかりません。',
    },
    templateCard: {
      liveDemo: 'ライブデモ',
      expandTextAria: '説明を開く',
      collapseTextAria: '説明を閉じる',
    },
    templateModal: {
      closeModalAria: 'モーダルを閉じる',
      oneTimePrice: '買い切り',
      liveDemo: 'ライブデモ',
      getTwoTemplates: '$99 でテンプレートを2つ購入',
      savePercent: '16% 割引',
      getUnlimitedAccess: '$149 年間プランで全テンプレートが使い放題',
      bestOffer: 'おすすめ',
      features: '主な機能',
      recommendedToUseFor: 'おすすめ用途',
      previousImageAria: '前の画像',
      nextImageAria: '次の画像',
      slideAriaPrefix: 'スライドへ移動',
    },
    templateLanding: {
      loadingTemplate: 'テンプレートを読み込んでいます...',
      preview: 'プレビュー',
      guide: 'ガイド',
      features: '主な機能',
      recommendedToUseFor: 'おすすめ用途',
      howToUse: '使い方',
      readyToStart: '準備はできましたか？',
      finalCtaDescriptionSuffix: 'を使って、今すぐ次のプロジェクトを始めましょう。',
    },
  },
};

export function getExploreContent(locale: GlobalLocale): ExploreI18nContent {
  return content[locale];
}

export function getTemplatePriceLabel(locale: GlobalLocale, price: number): string {
  if (locale === 'ko') {
    return `$${price} / 1회 결제`;
  }
  if (locale === 'ja') {
    return `$${price} / 買い切り`;
  }
  return `$${price} / one-time`;
}

export function getTemplateBuyLabel(locale: GlobalLocale, price: number): string {
  if (locale === 'ko') {
    return `$${price}에 구매`;
  }
  if (locale === 'ja') {
    return `$${price}で購入`;
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
  if (locale === 'ja') {
    return `${templateName}${suffix}`;
  }
  return `${suffix} ${templateName}.`;
}
