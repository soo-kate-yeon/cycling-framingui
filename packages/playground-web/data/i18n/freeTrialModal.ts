/**
 * FreeTrialModal i18n Content
 *
 * 무료 체험 모달의 모든 텍스트 콘텐츠를 영어/한국어/일본어로 관리
 */

import type { GlobalLocale } from '../../contexts/GlobalLanguageContext';

export interface FreeTrialModalContent {
  title: {
    part1: string;
    part2: string;
  };
  subtitle: {
    line1: string;
    line2: string;
  };
  noCreditCard: string; // "No credit card required" / "카드 등록 없이 시작" / "クレジットカード不要"
  buttons: {
    startTrial: string;
    startFree: string;
    loggingIn: string;
    creatingTrial: string;
  };
  errors: {
    trialAlreadyExists: string;
    loginRequired: string;
    trialCreationFailed: string;
    networkError: string;
  };
  infoText: {
    alreadyLoggedIn: string;
    dismissForever: string;
  };
}

const freeTrialModalContent: Record<GlobalLocale, FreeTrialModalContent> = {
  en: {
    title: {
      part1: 'Start with',
      part2: 'free quota visibility',
    },
    subtitle: {
      line1:
        'Sign in to inspect your theme entitlements and start the MCP onboarding flow with shadow quota visibility.',
      line2: 'You can explore the workflow before paid quota enforcement begins.',
    },
    noCreditCard: 'No credit card required during shadow mode',
    buttons: {
      startTrial: 'Continue with Free Quota',
      startFree: 'Start with Free Quota',
      loggingIn: 'Logging in...',
      creatingTrial: 'Preparing access...',
    },
    errors: {
      trialAlreadyExists: 'You have already used the trial',
      loginRequired: 'Login required',
      trialCreationFailed: 'An error occurred while creating the trial',
      networkError: 'A network error occurred',
    },
    infoText: {
      alreadyLoggedIn: 'You are already logged in',
      dismissForever: "Don't show again",
    },
  },
  ko: {
    title: {
      part1: '로그인하고',
      part2: '무료 quota 가시성으로 시작하세요',
    },
    subtitle: {
      line1:
        '로그인하면 theme entitlement를 확인하고 shadow quota가 보이는 상태로 MCP 온보딩을 시작할 수 있습니다.',
      line2: '유료 quota가 강제되기 전에 workflow를 먼저 살펴볼 수 있습니다.',
    },
    noCreditCard: 'shadow mode 동안 카드 등록 없이 시작',
    buttons: {
      startTrial: '무료 quota로 계속하기',
      startFree: '무료 quota로 시작하기',
      loggingIn: '로그인 중...',
      creatingTrial: '접근 준비 중...',
    },
    errors: {
      trialAlreadyExists: '이미 체험을 사용했습니다',
      loginRequired: '로그인이 필요합니다',
      trialCreationFailed: '체험 생성 중 오류가 발생했습니다',
      networkError: '네트워크 오류가 발생했습니다',
    },
    infoText: {
      alreadyLoggedIn: '이미 로그인되어 있습니다',
      dismissForever: '다시 보지 않기',
    },
  },
};

export function getFreeTrialModalContent(locale: GlobalLocale): FreeTrialModalContent {
  return freeTrialModalContent[locale];
}
