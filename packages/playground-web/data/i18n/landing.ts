/**
 * Landing Page i18n Content
 *
 * 랜딩 페이지의 모든 텍스트 콘텐츠를 영어/한국어/일본어로 관리
 */

import type { GlobalLocale } from '../../contexts/GlobalLanguageContext';

export interface LandingContent {
  nav: {
    brandName: string;
    pricing: string;
    docs: string;
    tryStudio: string;
    getStarted: string;
  };
  hero: {
    brandName: string;
    title: {
      part1: string;
      part2: string;
    };
    description: string;
    buttons: {
      tryStudio: string;
      getStarted: string;
      browseThemes: string;
      freeTrial: string;
    };
    noCreditCard: string;
  };
  mainImage: {
    alt: string;
    placeholder: string;
  };
  sections: {
    s1: { title: string; description: string };
    s2: { title: string; description: string };
    s3: { title: string; description: string };
    s4: { title: string; description: string };
  };
  section5: {
    badge: string;
    title: string;
    description: string;
    cta: string;
  };
  faq: {
    title: string;
    subtitle: string;
    items: {
      title: string;
      content: string;
    }[];
  };
}

const landingContent: Record<GlobalLocale, LandingContent> = {
  en: {
    nav: {
      brandName: 'framingui',
      pricing: 'Pricing',
      docs: 'Docs',
      tryStudio: 'Try Explore',
      getStarted: 'Start with Free Quota',
    },
    hero: {
      brandName: 'framingui',
      title: {
        part1: 'MCP Design System',
        part2: 'for AI Agents',
      },
      description:
        "Stop relying on prompt luck for UI. Install framingui's MCP design system, give your agent real components and themes, and ship production screens with visible quota instead of vague template unlocks.",
      buttons: {
        tryStudio: 'Try Explore Free',
        getStarted: 'Start with Free Quota',
        browseThemes: 'Explore Themes',
        freeTrial: 'Start with Free Quota',
      },
      noCreditCard: 'Free quota visible during transition',
    },
    mainImage: {
      alt: 'Main Dashboard Preview',
      placeholder: 'Main Dashboard Preview',
    },
    sections: {
      s1: {
        title: 'Core of the Design System: Tokens',
        description:
          'Complete architecture leveraging atomic colors, typography, spacing, and elevation. Every pixel mathematically aligned.',
      },
      s2: {
        title: 'Production Quality: Adaptive Layout',
        description:
          'Understands App and Web Shells. Tokens scale naturally to provide a perfectly responsive layout across all breakpoints.',
      },
      s3: {
        title: '30+ Built-in shadcn/ui Components',
        description:
          'Automatically applies the design system guide, rendering custom components perfectly tailored to your service identity.',
      },
      s4: {
        title: 'Adopt Immediately with MCP',
        description:
          'No canvas guessing required. Use MCP in your IDE, CLI, or agent runtime to discover components, validate screens, and track workflow usage.',
      },
    },
    section5: {
      badge: 'Quota Transition Access',
      title: 'Start Free, Upgrade by Usage',
      description:
        'Inspect shadow quota first, then move to included monthly tool units when your workflow is stable.',
      cta: 'View pricing',
    },
    faq: {
      title: 'Frequently Asked Questions',
      subtitle: 'Everything you need to know about framingui.',
      items: [
        {
          title: 'How does framingui work?',
          content:
            'Install the MCP server, authenticate once, inspect `whoami` for theme entitlements and shadow quota, then use the screen workflow to generate and validate production UI.',
        },
        {
          title: 'Is framingui free?',
          content:
            'framingui is moving to a quota-based MCP pricing model. During the transition, some workflows can start with free quota visibility before hard billing is enforced.',
        },
        {
          title: 'Can I use it for app development?',
          content:
            'Yes. framingui supports web React workflows and now includes a direct-write path for Expo and React Native through `@framingui/react-native`.',
        },
        {
          title: 'Can I apply it to an existing project?',
          content:
            'Yes! Run npx @framingui/mcp-server init in your project root. It auto-detects your framework, installs dependencies, and configures everything — without breaking your existing code.',
        },
        {
          title: 'Is there a Figma import feature?',
          content:
            "Not yet. Today's core workflow is MCP-first: component discovery, theme guidance, validation, and direct code output in your coding environment.",
        },
      ],
    },
  },
  ko: {
    nav: {
      brandName: 'framingui',
      pricing: '요금',
      docs: '문서',
      tryStudio: 'Explore 둘러보기',
      getStarted: '무료 quota로 시작',
    },
    hero: {
      brandName: 'framingui',
      title: {
        part1: 'AI 에이전트를 위한',
        part2: 'MCP 디자인 시스템',
      },
      description:
        'UI를 프롬프트 운에 맡기지 마세요. framingui MCP 디자인 시스템을 설치하면 에이전트가 실제 컴포넌트와 테마를 바탕으로 작업하고, quota도 눈에 보이는 상태에서 프로덕션 화면을 만들 수 있습니다.',
      buttons: {
        tryStudio: '무료로 Explore 시작',
        getStarted: '무료 quota로 시작',
        browseThemes: '테마 둘러보기',
        freeTrial: '무료 quota로 시작',
      },
      noCreditCard: '전환 기간 동안 shadow quota 표시',
    },
    mainImage: {
      alt: '메인 대시보드 미리보기',
      placeholder: '메인 대시보드 미리보기',
    },
    sections: {
      s1: {
        title: '디자인 시스템의 핵심, 토큰',
        description:
          '컬러, 타이포그래피, 간격을 토큰으로 체계화했습니다. OKLCH 기반 구조를 통해 에이전트가 기준을 정확히 적용합니다.',
      },
      s2: {
        title: '프로덕션 퀄리티를 만드는 레이아웃',
        description:
          'App/Web Shell 구조를 기준으로 반응형 레이아웃을 구성합니다. 모바일부터 데스크톱까지 토큰 스케일이 일관되게 연결됩니다.',
      },
      s3: {
        title: '30+ shadcn/ui 컴포넌트 기본 탑재',
        description:
          '디자인 시스템 가이드를 자동으로 반영해 서비스 톤에 맞는 UI를 구성합니다. 기본 컴포넌트로 시작해도 제품 수준의 결과를 만들 수 있습니다.',
      },
      s4: {
        title: 'MCP로 바로 투입',
        description:
          '캔버스에서 감으로 맞출 필요가 없습니다. IDE, CLI, OpenClaw에서 MCP로 컴포넌트를 찾고 화면을 검증하면서 사용량까지 확인할 수 있습니다.',
      },
    },
    section5: {
      badge: 'Quota 전환 안내',
      title: '무료로 시작하고 사용량에 맞춰 확장하세요.',
      description:
        '먼저 shadow quota로 실제 사용량을 확인한 뒤, 워크플로우가 안정되면 월간 tool unit 플랜으로 전환할 수 있습니다.',
      cta: '요금 보기',
    },
    faq: {
      title: '자주 묻는 질문',
      subtitle: 'framingui 시작 전에 자주 확인하는 내용입니다.',
      items: [
        {
          title: 'framingui는 어떻게 사용하나요?',
          content:
            'MCP 서버를 설치하고 로그인한 뒤 `whoami`로 테마 entitlement와 shadow quota를 확인합니다. 이후 screen workflow로 프로덕션 UI를 생성하고 검증합니다.',
        },
        {
          title: 'framingui는 무료인가요?',
          content:
            'framingui는 quota 기반 MCP 과금 모델로 전환 중입니다. 전환 기간에는 일부 워크플로우를 무료 quota 가시성과 함께 시작할 수 있습니다.',
        },
        {
          title: '앱 개발에 사용할 수 있나요?',
          content:
            '네. 현재는 web React 워크플로우를 지원하고, Expo/React Native를 위한 direct-write 경로도 `@framingui/react-native`로 제공하고 있습니다.',
        },
        {
          title: '기존 프로젝트에 적용할 수 있나요?',
          content:
            '가능합니다. 프로젝트 루트에서 npx @framingui/mcp-server init을 실행하면 프레임워크 인식, 패키지 설치, 설정을 자동으로 처리합니다. 기존 코드는 변경하지 않습니다.',
        },
        {
          title: 'Figma 가져오기 기능이 있나요?',
          content:
            '아직 제공하지 않습니다. 현재 핵심은 MCP 기반의 컴포넌트 discovery, theme guidance, validation, direct code output입니다.',
        },
      ],
    },
  },
};

export function getLandingContent(locale: GlobalLocale): LandingContent {
  return landingContent[locale];
}
