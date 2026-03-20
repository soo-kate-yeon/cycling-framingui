/**
 * Pricing Page i18n Content
 *
 * 가격 페이지의 모든 텍스트 콘텐츠를 영어/한국어로 관리
 */

import type { GlobalLocale } from '../../contexts/GlobalLanguageContext';

export interface PricingContent {
  nav: {
    brandName: string;
    getStarted: string;
  };
  capabilities: {
    badge: string;
    title: string;
    description: string;
    cards: {
      title: string;
      description: string;
    }[];
  };
  quota: {
    title: string;
    description: string;
  };
  hero: {
    title: string;
  };
  plans: {
    free: {
      name: string;
      description: string;
      priceLabel: string;
      priceSub: string;
      cta: string;
      features: string[];
    };
    developer: {
      name: string;
      description: string;
      priceLabel: string;
      priceSub: string;
      cta: string;
      badge: string;
      features: string[];
      renewalNotice: string;
    };
    team: {
      name: string;
      description: string;
      priceLabel: string;
      priceSub: string;
      cta: string;
      badge: string;
      features: string[];
      renewalNotice: string;
    };
  };
  comparison: {
    title: string;
    tableHeaders: {
      feature: string;
      free: string;
      developer: string;
    };
    features: {
      includedUnits: string;
      discoveryTools: string;
      workflowGuidance: string;
      environmentChecks: string;
      usageVisibility: string;
      topUps: string;
      support: string;
    };
    values: {
      free: {
        includedUnits: string;
        discoveryTools: string;
        workflowGuidance: string;
        environmentChecks: string;
        usageVisibility: string;
        topUps: string;
        support: string;
      };
      developer: {
        includedUnits: string;
        discoveryTools: string;
        workflowGuidance: string;
        environmentChecks: string;
        usageVisibility: string;
        topUps: string;
        support: string;
      };
    };
  };
  faq: {
    title: string;
    subtitle: string;
    items: {
      title: string;
      content: string;
    }[];
  };
  ui: {
    paymentNotReady: string;
    priceConfigMissing: string;
  };
}

const pricingContent: Record<'en' | 'ko', PricingContent> = {
  en: {
    nav: {
      brandName: 'framingui',
      getStarted: 'Explore Free',
    },
    capabilities: {
      badge: 'What You Get',
      title: 'FramingUI supports the full UI workflow',
      description:
        'From discovery to preview to validation, FramingUI gives coding agents a clearer contract for building production UI.',
      cards: [
        {
          title: 'Discover components and templates',
          description:
            'Browse component, theme, and screen-template catalogs before you generate anything.',
        },
        {
          title: 'Preview themes and generation context',
          description:
            'Inspect theme recipes, component contracts, and screen-generation context before writing code.',
        },
        {
          title: 'Validate before integration',
          description:
            'Use screen-definition and environment checks to catch dependency, styling, and workflow issues early.',
        },
      ],
    },
    quota: {
      title: 'Plans',
      description:
        'Start with the product and workflow first. Move to monthly usage when FramingUI becomes part of your regular shipping loop.',
    },
    hero: {
      title: 'FramingUI Pricing Plan',
    },
    plans: {
      free: {
        name: 'Free Quota',
        description: 'A starter plan for learning the product and understanding the workflow.',
        priceLabel: '$0',
        priceSub: 'shadow visibility',
        cta: 'Start Free',
        features: [
          'Explore MCP tools and package surfaces',
          'Preview components, templates, and themes',
          'Inspect quota visibility in `whoami`',
          'Start with guided onboarding',
        ],
      },
      developer: {
        name: 'Developer',
        description: 'For solo developers using FramingUI regularly to ship real product UI.',
        priceLabel: '$39',
        priceSub: '/month',
        cta: 'Subscribe to Developer',
        badge: 'Most Popular',
        features: [
          '2,000 weighted tool units / month',
          'Component, template, and theme discovery',
          'Screen-generation context and validated workflow',
          'Environment checks and code-audit guidance',
          'Email support (72h)',
          'Top-up support when usage spikes',
        ],
        renewalNotice:
          'Renews monthly until cancelled. Top-ups or overage may apply after included units.',
      },
      team: {
        name: 'Team',
        description: 'For product teams that need pooled quota, collaboration, and faster support.',
        priceLabel: '$149',
        priceSub: '/month',
        cta: 'Contact Team Plan',
        badge: 'Pooled Usage',
        features: [
          '10,000 weighted tool units / month',
          'Pooled team usage visibility',
          'Priority support queue',
          'Top-up path for launch weeks',
          'Transition help for legacy customers',
        ],
        renewalNotice:
          'Renews monthly until cancelled. Team rollout is staged and may require onboarding support.',
      },
    },
    comparison: {
      title: 'Compare plans by capability',
      tableHeaders: {
        feature: 'Feature',
        free: 'Free',
        developer: 'Developer',
      },
      features: {
        includedUnits: 'Included monthly usage',
        discoveryTools: 'Discovery tools',
        workflowGuidance: 'Generation workflow guidance',
        environmentChecks: 'Environment and integration checks',
        usageVisibility: 'Usage visibility',
        topUps: 'Top-ups available',
        support: 'Support response target',
      },
      values: {
        free: {
          includedUnits: 'Visibility only',
          discoveryTools: 'Browse and preview',
          workflowGuidance: 'Starter guidance',
          environmentChecks: 'Not included',
          usageVisibility: 'Shadow snapshot',
          topUps: 'Not available',
          support: 'Docs',
        },
        developer: {
          includedUnits: '2,000 / month',
          discoveryTools: 'Included',
          workflowGuidance: 'Included',
          environmentChecks: 'Included',
          usageVisibility: 'Billing + usage view',
          topUps: 'Available',
          support: '72h',
        },
      },
    },
    faq: {
      title: 'Frequently Asked Questions',
      subtitle: 'What the product supports, who each plan is for, and how usage is shown.',
      items: [
        {
          title: 'What does FramingUI actually help with?',
          content:
            'FramingUI helps agents discover components and templates, preview themes, inspect screen-generation context, and validate definitions and environments before integration.',
        },
        {
          title: 'How far can I get on the free plan?',
          content:
            'Free is for exploring the toolchain, previewing product surfaces, and understanding usage visibility. It is the right place to learn the workflow before you need recurring monthly capacity.',
        },
        {
          title: 'Who is the Developer plan for?',
          content:
            'Developer is for people using FramingUI as part of real UI delivery. It adds recurring monthly usage, the full validated workflow, and support when the tool becomes part of weekly product work.',
        },
        {
          title: 'Where do I check usage?',
          content:
            'Use `whoami` inside MCP for a quick snapshot, and the billing page for current entitlement, allocated units, and usage breakdown by tool class.',
        },
        {
          title: 'What do the validation steps cover?',
          content:
            'Validation covers screen-definition checks for generation workflows and environment checks for dependencies, style contracts, and integration issues before code lands in your app.',
        },
        {
          title: 'What happens if I need more usage?',
          content:
            'Developer includes monthly usage by default. When your workflow spikes, top-ups can add extra capacity without changing the rest of your setup.',
        },
      ],
    },
    ui: {
      paymentNotReady: 'Payment system is not ready. Please try again later.',
      priceConfigMissing: 'Price configuration missing. Please contact support.',
    },
  },
  ko: {
    nav: {
      brandName: 'framingui',
      getStarted: '무료로 둘러보기',
    },
    capabilities: {
      badge: '주요 기능',
      title: 'FramingUI가 지원하는 작업',
      description:
        '컴포넌트 탐색, 테마 프리뷰, 생성 전 컨텍스트 확인, 검증까지 한 흐름으로 이어집니다.',
      cards: [
        {
          title: '컴포넌트와 템플릿 탐색',
          description:
            '필요한 컴포넌트와 화면 템플릿을 먼저 찾아보고 바로 작업에 넣을 수 있습니다.',
        },
        {
          title: '테마 프리뷰와 생성 맥락',
          description: '테마 구성과 화면 생성에 필요한 맥락을 확인한 뒤 작성할 수 있습니다.',
        },
        {
          title: '정의 검증과 환경 점검',
          description: '정의와 환경을 미리 확인해 통합 단계에서 생기는 시행착오를 줄입니다.',
        },
      ],
    },
    quota: {
      title: '플랜 선택',
      description:
        '무료로 기능을 살펴보고, 실제 작업량이 늘면 월간 사용량 플랜으로 이어갈 수 있습니다.',
    },
    hero: {
      title: 'UI 작업에 필요한 기능을 한곳에서',
    },
    plans: {
      free: {
        name: '무료',
        description: '제품과 작업 흐름을 먼저 익히는 시작 플랜입니다.',
        priceLabel: '₩0',
        priceSub: '가시성',
        cta: '무료로 시작',
        features: [
          'MCP 도구 둘러보기',
          '컴포넌트와 테마 미리보기',
          '사용량 가시성 확인',
          '안내된 온보딩 경로',
        ],
      },
      developer: {
        name: 'Developer',
        description: 'FramingUI를 실제 UI 작업에 꾸준히 쓰는 개인 개발자에게 맞는 플랜입니다.',
        priceLabel: '₩55,000',
        priceSub: '/월',
        cta: 'Developer 구독',
        badge: '가장 많이 선택',
        features: [
          '월 2,000 weighted tool units',
          '컴포넌트·템플릿·테마 탐색',
          'screen generation context',
          '환경 검증',
          '이메일 지원 (72시간)',
          '필요할 때 top-up',
        ],
        renewalNotice:
          '매월 갱신됩니다. 포함량을 넘는 사용은 top-up 또는 초과 사용 정책이 적용될 수 있습니다.',
      },
      team: {
        name: 'Team',
        description: '공유 사용량과 협업 가시성이 필요한 제품 팀용 플랜입니다.',
        priceLabel: '₩210,000',
        priceSub: '/월',
        cta: 'Team 문의하기',
        badge: 'Pooled Usage',
        features: [
          '월 10,000 weighted tool units',
          '팀 단위 사용량 가시성',
          '우선 지원 큐',
          '런치 기간 추가 용량',
          '전환 지원',
        ],
        renewalNotice: '매월 갱신됩니다. Team 플랜은 별도 온보딩이 필요할 수 있습니다.',
      },
    },
    comparison: {
      title: '기능으로 비교',
      tableHeaders: {
        feature: '기능',
        free: '무료',
        developer: 'Developer',
      },
      features: {
        includedUnits: '월 포함 사용량',
        discoveryTools: '도구 탐색',
        workflowGuidance: '생성 전 안내',
        environmentChecks: '환경 검증',
        usageVisibility: '사용량 보기',
        topUps: '추가 용량',
        support: '지원 응답 목표',
      },
      values: {
        free: {
          includedUnits: '가시성만',
          discoveryTools: '둘러보기와 미리보기',
          workflowGuidance: '기본 안내',
          environmentChecks: '포함되지 않음',
          usageVisibility: '`whoami`와 Billing에서 확인',
          topUps: '불가',
          support: '문서',
        },
        developer: {
          includedUnits: '월 2,000',
          discoveryTools: '포함',
          workflowGuidance: '포함',
          environmentChecks: '포함',
          usageVisibility: 'Billing + usage view',
          topUps: '가능',
          support: '72시간',
        },
      },
    },
    faq: {
      title: '자주 묻는 질문',
      subtitle: '제품이 지원하는 기능, 플랜 차이, 사용량 확인 방법을 정리했습니다.',
      items: [
        {
          title: 'FramingUI는 어떤 기능을 제공하나요?',
          content:
            'FramingUI는 컴포넌트와 템플릿 탐색, 테마 프리뷰, screen generation context 확인, 화면 정의 검증, 환경 점검까지 실제 UI 작업 흐름을 지원합니다.',
        },
        {
          title: '무료 플랜으로 어디까지 해볼 수 있나요?',
          content:
            '무료 플랜에서는 제품 표면과 도구 흐름을 먼저 살펴보고, 컴포넌트·템플릿·테마를 미리 확인하면서 사용량 가시성을 볼 수 있습니다.',
        },
        {
          title: 'Developer 플랜은 어떤 작업에 맞나요?',
          content:
            'FramingUI를 실제 제품 작업에 반복적으로 쓰는 개발자에게 맞습니다. 월간 사용량, 검증 워크플로우, 환경 점검, 지원이 함께 제공됩니다.',
        },
        {
          title: '사용량은 어디서 확인하나요?',
          content:
            'MCP 안에서는 `whoami`로 빠르게 확인할 수 있고, Billing 화면에서는 entitlement, 할당량, tool class별 사용량을 볼 수 있습니다.',
        },
        {
          title: '검증 단계에서는 무엇을 확인하나요?',
          content:
            '스크린 정의 검증은 생성 결과의 구조를 확인하고, 환경 점검은 의존성, 스타일 계약, 통합 과정에서 생길 수 있는 문제를 미리 확인합니다.',
        },
        {
          title: '사용량이 더 필요하면 어떻게 되나요?',
          content:
            'Developer 플랜에는 월간 사용량이 포함되어 있고, 작업량이 일시적으로 늘어나면 top-up으로 추가 용량을 붙일 수 있습니다.',
        },
      ],
    },
    ui: {
      paymentNotReady: '결제 시스템을 아직 사용할 수 없습니다. 잠시 후 다시 시도해 주세요.',
      priceConfigMissing: '가격 설정을 찾을 수 없습니다. 지원팀에 문의해 주세요.',
    },
  },
};

export function getPricingContent(locale: GlobalLocale): PricingContent {
  return pricingContent[locale as 'en' | 'ko'] ?? pricingContent.en;
}
